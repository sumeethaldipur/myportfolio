/**
 * Retrieval-augmented path, for comparison against full-context prompting.
 *
 * The production answer is that at ~5k tokens against a 1M-token window,
 * retrieval is unnecessary — the model can simply see everything. This module
 * exists so that claim is measured rather than asserted: both strategies run
 * against the same questions and the numbers decide.
 *
 * Deliberately dependency-free. A vector database for ~30 chunks would be
 * theatre: the whole index is a few hundred kilobytes, so it lives in memory
 * and similarity is a dot product. Adding Pinecone here would be adding an
 * outage, not a capability.
 */

// NVIDIA's retrieval embedders are ASYMMETRIC: passages and queries go through
// different projections, selected by `input_type`. Embedding a query as a
// passage still returns a vector and still ranks results — it just ranks them
// worse, with nothing in the logs to say so.
//
// Being listed in the public catalog does NOT mean an account may call it:
// llama-3.2-nv-embedqa-1b-v1 returns 404 "not found in account" on this key,
// exactly as gemma-4 and deepseek-v4-flash did for chat. So the same pattern
// applies — try candidates in order, fall through on unavailable, remember the
// one that worked.
//
// To see which of these your key can actually reach:
//   NVIDIA_API_KEY=... ./check-models.sh
const EMBED_CANDIDATES = [
  "nvidia/nv-embedqa-mistral-7b-v2",
  "nvidia/embed-qa-4",
  "snowflake/arctic-embed-l",
  "nvidia/nemotron-3-embed-1b",
  "nvidia/llama-3.2-nv-embedqa-1b-v1",
];

// Statuses meaning "this model isn't usable", as opposed to a real fault.
const MODEL_UNAVAILABLE = new Set([403, 404, 410]);

const TOP_K = 4;

// Retrieval is a preamble to the real work — the answer still has to generate
// afterwards inside the same 60s function budget. These caps keep it a
// preamble instead of the whole invocation.
const PROBE_TIMEOUT_MS = 8000; // one candidate's chance to respond
const INDEX_BUDGET_MS = 25000; // building the index over all chunks
const QUERY_BUDGET_MS = 10000; // embedding a single question

let indexPromise = null;
let resolvedEmbedModel = null;
let embedClient = null;

// The embedding provider is decoupled from the chat provider on purpose.
// NVIDIA serves chat models on the free tier but grants no embedders, so
// dense retrieval has to source vectors elsewhere. Set EMBED_API_KEY (and
// optionally EMBED_BASE_URL / EMBED_MODEL) and this uses that instead.
//
// Defaults target Jina: free tier, no card, OpenAI-compatible /v1/embeddings.
const EMBED_BASE_URL = process.env.EMBED_BASE_URL || "https://api.jina.ai/v1";
const EMBED_API_KEY = process.env.EMBED_API_KEY || null;
const EMBED_MODEL =
  process.env.EMBED_MODEL || "jina-embeddings-v5-omni-small";

/**
 * Retrieval embedders are asymmetric — queries and passages go through
 * different projections — but providers spell the switch differently. Jina
 * uses `task`, NVIDIA uses `input_type`. Sending the wrong key is not an
 * error; it is silently ignored, and retrieval quality quietly drops.
 */
function asymmetryParams(baseUrl, inputType) {
  if (/jina\.ai/.test(baseUrl)) {
    return { task: inputType === "query" ? "retrieval.query" : "retrieval.passage" };
  }
  return { input_type: inputType, truncate: "END" };
}

/**
 * Jina's multimodal models (v5 "omni") take `input: [{ text: "..." }]`, while
 * classic text models take `input: ["..."]`. Sending the wrong shape is a hard
 * 400, and which one applies depends purely on the model name — so derive it
 * rather than assuming whichever the docs happened to show.
 */
function formatInputs(model, baseUrl, texts) {
  const multimodal = /jina\.ai/.test(baseUrl) && /(^|-)(v5|omni)/.test(model);
  return multimodal ? texts.map((text) => ({ text })) : texts;
}

function extraParams(model, baseUrl) {
  // Unit-length vectors make cosine similarity a plain dot product. Harmless
  // for providers that ignore it — cosine() normalises anyway.
  if (/jina\.ai/.test(baseUrl) && /(^|-)(v5|omni)/.test(model)) {
    return { normalized: true };
  }
  return {};
}

/** Thrown when no embedding model on the account can be reached at all. */
export class NoEmbeddingModelError extends Error {
  constructor(attempts) {
    super(
      "No embedding model available to this account. Tried: " +
        attempts.map((a) => `${a.model} (${a.status})`).join(", ")
    );
    this.name = "NoEmbeddingModelError";
    this.attempts = attempts;
  }
}

/**
 * Split the profile on markdown headings.
 *
 * The file is already organised one concept per section — a role, a
 * recommendation, an answer in his own words — so headings are better chunk
 * boundaries than any fixed token window would be. A sliding window would cut
 * through the middle of a metric and strand "resubmissions fell from" in one
 * chunk and "32% to 18%" in another.
 */
export function buildChunks(markdown) {
  const lines = markdown.split("\n");
  const chunks = [];
  let heading = "Profile";
  let buffer = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body) chunks.push({ heading, text: `${heading}\n\n${body}` });
    buffer = [];
  };

  for (const line of lines) {
    if (/^#{2,3}\s+/.test(line)) {
      flush();
      heading = line.replace(/^#{2,3}\s+/, "").trim();
    } else {
      buffer.push(line);
    }
  }
  flush();
  return chunks;
}

async function callEmbed(client, model, inputs, inputType, timeout) {
  const res = await client.embeddings.create(
    {
      model,
      input: formatInputs(model, client.baseURL || "", inputs),
      ...asymmetryParams(client.baseURL || "", inputType),
      ...extraParams(model, client.baseURL || ""),
    },
    // BOTH matter. maxRetries alone still lets a hanging model block until the
    // whole function times out; timeout alone gets multiplied by the retries.
    { maxRetries: 0, timeout }
  );
  // The API does not guarantee ordering, so sort by index before use.
  return res.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

// A model that never answers is as unusable as one that 404s, and costs far
// more to discover. Treat a timeout as unavailable and move on.
function isUnusable(err) {
  return (
    MODEL_UNAVAILABLE.has(err?.status) ||
    err?.name === "APIConnectionTimeoutError" ||
    /timed? ?out/i.test(err?.message ?? "")
  );
}

function dedicatedClient(OpenAICtor) {
  if (!embedClient && EMBED_API_KEY) {
    embedClient = new OpenAICtor({ apiKey: EMBED_API_KEY, baseURL: EMBED_BASE_URL });
  }
  return embedClient;
}

async function embed(client, inputs, inputType, budgetMs) {
  // A configured provider is authoritative — no probing, no fallback list.
  const dedicated = dedicatedClient(client.constructor);
  if (dedicated) {
    resolvedEmbedModel = EMBED_MODEL;
    return callEmbed(dedicated, EMBED_MODEL, inputs, inputType, budgetMs);
  }

  // Once one works, stay on it — mixing embedders would put passages and
  // queries in different vector spaces and make similarity meaningless.
  if (resolvedEmbedModel) {
    return callEmbed(client, resolvedEmbedModel, inputs, inputType, budgetMs);
  }

  const startedAt = Date.now();
  const attempts = [];

  for (const model of EMBED_CANDIDATES) {
    const remaining = budgetMs - (Date.now() - startedAt);
    if (remaining < 2000) {
      attempts.push({ model, status: "skipped-no-budget" });
      break;
    }
    // No single probe may eat the whole allowance.
    const timeout = Math.min(PROBE_TIMEOUT_MS, remaining);
    try {
      const vectors = await callEmbed(client, model, inputs, inputType, timeout);
      resolvedEmbedModel = model;
      console.log(`Using embedding model: ${model}`);
      return vectors;
    } catch (err) {
      if (!isUnusable(err)) throw err;
      attempts.push({ model, status: err?.status ?? err?.name ?? "error" });
      console.warn(`Embedding model unusable (${attempts.at(-1).status}): ${model}`);
    }
  }
  throw new NoEmbeddingModelError(attempts);
}

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

/**
 * Build the index once per warm instance. Cold starts pay for it; this is a
 * real cost of the RAG path and is left visible rather than hidden.
 */
export function ensureIndex(client, knowledge) {
  if (!indexPromise) {
    indexPromise = (async () => {
      const chunks = buildChunks(knowledge);
      const vectors = await embed(
        client,
        chunks.map((c) => c.text),
        "passage",
        INDEX_BUDGET_MS
      );
      return chunks.map((c, i) => ({ ...c, vector: vectors[i] }));
    })().catch((err) => {
      indexPromise = null; // let a later request retry instead of failing forever
      throw err;
    });
  }
  return indexPromise;
}

export async function retrieve(client, knowledge, query, k = TOP_K) {
  const index = await ensureIndex(client, knowledge);
  const [queryVector] = await embed(client, [query], "query", QUERY_BUDGET_MS);

  return index
    .map((c) => ({ heading: c.heading, text: c.text, score: cosine(queryVector, c.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export { EMBED_CANDIDATES, TOP_K };
export function embedModelInUse() {
  return resolvedEmbedModel;
}
