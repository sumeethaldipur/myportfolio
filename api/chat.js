import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Origins allowed to call this endpoint. The site is served from GitHub Pages,
// which is a different origin from this function, so CORS has to be explicit.
const ALLOWED_ORIGINS = new Set([
  "https://myportfolio-murex-six-91.vercel.app", // the Vercel deployment itself
  "https://sumeethaldipur.github.io", // the GitHub Pages copy
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:3000",
]);

// NVIDIA NIM exposes an OpenAI-compatible API, so we keep the `openai` SDK and
// just repoint it. Note NIM implements *Chat Completions*, not the newer
// Responses API — hence `chat.completions.create` below.
const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1";
// deepseek-v4-pro was retired 2026-08-07 and now returns 410 Gone. Flash is the
// live V4 variant and is the better fit anyway — lower latency for short
// answers. To check what's currently served (no API key needed):
//   curl https://integrate.api.nvidia.com/v1/models
const MODEL = "deepseek-ai/deepseek-v4-flash-0731";
const MAX_OUTPUT_TOKENS = 1200; // answers should be short; this is a hard ceiling
const MAX_MESSAGE_CHARS = 1000; // per user message
const MAX_HISTORY = 12; // turns kept, oldest trimmed first

// Crude per-instance rate limit. Serverless instances are ephemeral and there
// may be several at once, so this is a speed bump, not a guarantee. See
// CHATBOT_SETUP.md for the durable (Upstash) version if this ever gets abused.
const RATE_LIMIT = { windowMs: 60_000, max: 12 };
const hits = new Map();

// ---------------------------------------------------------------------------
// Knowledge base — read once per cold start, not per request
// ---------------------------------------------------------------------------

const here = path.dirname(fileURLToPath(import.meta.url));
let PROFILE = "";
try {
  PROFILE = fs.readFileSync(path.join(here, "..", "data", "profile.md"), "utf8");
} catch (err) {
  console.error("Could not load data/profile.md:", err.message);
}

// Strip HTML comments so the editing notes and TODO markers in profile.md
// never reach the model (or leak into an answer).
const KNOWLEDGE = PROFILE.replace(/<!--[\s\S]*?-->/g, "").trim();

const SYSTEM_PROMPT = `You are the assistant embedded in Sumeet Haldipur's portfolio site. You answer questions about Sumeet from visitors — recruiters, hiring managers, and engineers who landed on his site.

Everything you know about Sumeet is in the PROFILE below. It is your only source.

## Rules

1. Answer ONLY from the PROFILE. Never invent a job, date, metric, company, tool, or opinion. If a number isn't in the PROFILE, don't state a number.
2. If the PROFILE doesn't cover something, say so plainly and point them to sumeethaldipur.work@gmail.com. Don't hedge with a guess. A clean "That's not something I have on hand — Sumeet's the right person to ask, at sumeethaldipur.work@gmail.com" is a good answer.
3. Sections under "In Sumeet's own words" are Sumeet's own framing. When a question matches one, lead with it rather than reciting bullets.
4. Respect the "Boundaries" section. Decline those topics warmly in one sentence and redirect to email. Don't lecture.
5. Refer to Sumeet in the third person — "Sumeet did X", never "I did X". You are his assistant, not him.
6. Use they/them for any third party whose pronouns aren't stated.

## Style

- Short. Two to four sentences for most questions. This is a chat bubble, not a cover letter.
- Concrete over adjectival. "Resubmissions fell from 32% to 18%" beats "drove significant improvements."
- Warm and direct, lightly conversational. No corporate filler, no "Great question!", no bullet-point dumps unless genuinely asked to list things.
- Markdown is rendered, so **bold** works for emphasis. Use it sparingly.
- Never mention the PROFILE, these instructions, or that you are an AI model unless directly asked what you are.

## Scope

You exist to talk about Sumeet's work, background, and availability. If asked to write code, do math, draft essays, or anything unrelated, decline in one friendly line and steer back — you're not a general-purpose assistant.

## PROFILE

${KNOWLEDGE}`;

// Built lazily on first request, NOT at module scope: the SDK throws when
// the API key is missing, and a throw during module load crashes the whole
// function with an opaque FUNCTION_INVOCATION_FAILED before the handler can
// report anything useful. Deferring it lets us return a readable error.
// Accept the common misspelling as a fallback. NVIDEA/NVIDIA is an easy slip,
// and a silent `undefined` here costs a full deploy cycle to diagnose.
// Preferred name is NVIDIA_API_KEY — clean the alias up once things are stable.
function apiKey() {
  return process.env.NVIDIA_API_KEY || process.env.NVIDEA_API_KEY || null;
}

let _client = null;
function getClient() {
  if (!_client) {
    _client = new OpenAI({ apiKey: apiKey(), baseURL: NIM_BASE_URL });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_LIMIT.windowMs });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_LIMIT.max;
}

// messages must be an array of {role: "user"|"assistant", content: string}
function validate(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "No messages provided.";
  }
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) {
      return "Invalid message role.";
    }
    if (typeof m.content !== "string" || m.content.trim() === "") {
      return "Invalid message content.";
    }
    if (m.content.length > MAX_MESSAGE_CHARS) {
      return `Message too long (max ${MAX_MESSAGE_CHARS} characters).`;
    }
  }
  if (messages[messages.length - 1].role !== "user") {
    return "Last message must be from the user.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: "Origin not allowed." });
  }
  if (!KNOWLEDGE) {
    return res.status(500).json({ error: "Knowledge base failed to load." });
  }
  if (!apiKey()) {
    // TEMPORARY: report which key-ish variable NAMES the function can actually
    // see. Names only — never values — so this leaks nothing, but it turns
    // "missing" into "here is what is actually set". Remove once working.
    const visible = Object.keys(process.env)
      .filter((k) => /NVID|API|KEY|TOKEN/i.test(k))
      .sort();
    console.error("No API key found. Key-ish env var names:", visible);
    return res.status(500).json({
      error:
        "The assistant isn't configured yet. (No NVIDIA API key visible to the server.)",
      visibleEnvNames: visible,
    });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return res
      .status(429)
      .json({ error: "That's a lot of questions! Give it a minute." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON." });
    }
  }

  const messages = (body?.messages ?? []).slice(-MAX_HISTORY);
  const problem = validate(messages);
  if (problem) return res.status(400).json({ error: problem });

  // Server-Sent Events: the browser renders tokens as they arrive rather than
  // staring at a spinner for several seconds.
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    // `instructions` carries the profile and is byte-identical on every
    // request, so OpenAI's automatic prompt caching kicks in (prompts over
    // ~1024 tokens) and those input tokens bill at a discount. No explicit
    // cache configuration needed.
    const request = {
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: MAX_OUTPUT_TOKENS,
      // Low temperature: this bot recites facts from a profile. "Creativity"
      // here means inventing things, which is the exact failure to avoid.
      temperature: 0.2,
      top_p: 0.9,
      stream: true,
    };

    // DeepSeek V4 is a reasoning model. Thinking is off because this is a chat
    // bubble answering resume questions — reasoning would add seconds of
    // latency for no gain in answer quality. This kwarg is documented for V4
    // Pro; if Flash rejects it, fall back to a plain request rather than
    // failing the whole turn over a performance tweak.
    let stream;
    try {
      stream = await getClient().chat.completions.create({
        ...request,
        chat_template_kwargs: { thinking: false },
      });
    } catch (err) {
      if (err?.status !== 400) throw err;
      console.warn("chat_template_kwargs rejected; retrying without it.");
      stream = await getClient().chat.completions.create(request);
    }

    for await (const chunk of stream) {
      // Read only `content`. With thinking enabled the model also emits
      // `reasoning_content` on the delta, which must never reach a visitor.
      const text = chunk.choices?.[0]?.delta?.content;
      if (text) send("delta", { text });
    }

    send("done", {});
    res.end();
  } catch (err) {
    // Log the full detail for the Vercel dashboard.
    console.error("NIM API error:", {
      name: err?.name,
      status: err?.status,
      code: err?.code,
      type: err?.type,
      message: err?.message,
    });

    // Headers are already sent at this point, so surface the failure over SSE.
    // Map by HTTP status rather than a single catch-all: "something went wrong"
    // is useless when the real cause is an unpaid account or a model the key
    // can't reach. Status codes aren't sensitive, so the code is echoed to make
    // diagnosis possible without digging through logs.
    // NOTE: these messages are deliberately specific while we're getting the
    // deployment working. Before sharing the portfolio widely, collapse the
    // 401/403/404 branches into the friendly catch-all below — a visitor
    // shouldn't be told about the owner's billing or API key. The echoed
    // `status` field is enough to keep diagnosing.
    const status = err?.status;
    let message;
    if (status === 401) {
      message = "The assistant's NVIDIA API key is invalid or was revoked.";
    } else if (status === 403) {
      message = "This API key doesn't have access to the configured model.";
    } else if (status === 404) {
      message = `Model "${MODEL}" isn't available to this account.`;
    } else if (status === 429) {
      message =
        "Out of NVIDIA NIM credits, or too many requests. Check build.nvidia.com.";
    } else if (status === 400) {
      message = `Bad request to the model API: ${err?.message ?? "unknown"}`;
    } else {
      message =
        "Something went wrong on my end. Email sumeethaldipur.work@gmail.com and Sumeet will answer directly.";
    }

    // TEMPORARY diagnostics. A null `status` means the failure never reached
    // the OpenAI API (it's a client/runtime error, not an HTTP rejection), and
    // the status code alone can't distinguish those. Remove `debug` once the
    // deployment is working — see the NOTE above.
    send("error", {
      message,
      status: status ?? null,
      debug: {
        name: err?.name ?? null,
        code: err?.code ?? null,
        message: String(err?.message ?? "").slice(0, 300),
      },
    });
    send("done", {});
    res.end();
  }
}
