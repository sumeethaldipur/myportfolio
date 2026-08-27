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
const EMBED_MODEL = "nvidia/llama-3.2-nv-embedqa-1b-v1";
const TOP_K = 4;

let indexPromise = null;

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

async function embed(client, inputs, inputType) {
  const res = await client.embeddings.create({
    model: EMBED_MODEL,
    input: inputs,
    input_type: inputType, // "passage" when indexing, "query" when searching
    truncate: "END",
  });
  // The API does not guarantee ordering, so sort by index before use.
  return res.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
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
        "passage"
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
  const [queryVector] = await embed(client, [query], "query");

  return index
    .map((c) => ({ heading: c.heading, text: c.text, score: cosine(queryVector, c.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

export { EMBED_MODEL, TOP_K };
