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

// gpt-5.6-luna is the cost-optimised model in the GPT-5.6 family
// ($0.20/$1.20 per million tokens) — ample for answering questions about a
// resume, and cheap enough that traffic spikes won't hurt.
const MODEL = "gpt-5.6-luna";
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
// OPENAI_API_KEY is missing, and a throw during module load crashes the whole
// function with an opaque FUNCTION_INVOCATION_FAILED before the handler can
// report anything useful. Deferring it lets us return a readable error.
let _client = null;
function getClient() {
  if (!_client) _client = new OpenAI(); // reads OPENAI_API_KEY from the environment
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
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set in this deployment.");
    return res.status(500).json({
      error:
        "The assistant isn't configured yet. (OPENAI_API_KEY missing on the server.)",
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
    const stream = getClient().responses.stream({
      model: MODEL,
      instructions: SYSTEM_PROMPT,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      max_output_tokens: MAX_OUTPUT_TOKENS,
      // Keep latency low — this is a chat bubble, not a research task.
      reasoning: { effort: "low" },
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta" && event.delta) {
        send("delta", { text: event.delta });
      }
    }

    send("done", {});
    res.end();
  } catch (err) {
    console.error("OpenAI API error:", err);
    // Headers are already sent at this point, so surface the failure over SSE.
    const message =
      err instanceof OpenAI.RateLimitError
        ? "Getting a lot of traffic right now — try again shortly."
        : "Something went wrong on my end. Email sumeethaldipur.work@gmail.com and Sumeet will answer directly.";
    send("error", { message });
    send("done", {});
    res.end();
  }
}
