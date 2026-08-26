# Portfolio chatbot — setup

The site stays on GitHub Pages. Pages can only serve static files, so it can't
hold an API key. The chat endpoint therefore lives on Vercel, and the browser
calls it cross-origin.

```
sumeethaldipur.github.io/myportfolio        (GitHub Pages — unchanged)
        │
        │  POST https://<your-project>.vercel.app/api/chat
        ▼
Vercel serverless function                   (NVIDIA_API_KEY lives here)
        │
        ▼
NVIDIA NIM  →  deepseek-ai/deepseek-v4-pro
```

Your API key is only ever an environment variable on Vercel. It is never in
the repo and never reaches the browser.

## What was added

| File | Purpose |
|---|---|
| `data/profile.md` | The bot's entire knowledge base. **This is the file you edit.** |
| `api/chat.js` | Serverless function: prompt, CORS, rate limit, streaming. |
| `package.json` | Declares the `openai` dependency (NIM is OpenAI-compatible). |
| `vercel.json` | Bundles `data/` with the function; 30s max duration. |
| `.nojekyll` | Stops GitHub Pages running Jekyll over the new folders. |
| `index.html` | Chat launcher + panel markup, before `</body>`. |
| `galaxy.css` | Chat styles, appended. Uses your existing theme tokens. |
| `galaxy.js` | Chat client, appended. Streams tokens as they arrive. |

---

## Step 1 — Get an NVIDIA NIM API key

1. Go to <https://build.nvidia.com/deepseek-ai/deepseek-v4-pro>.
2. Sign in (free NVIDIA developer account) and click **Get API Key**.
3. Copy it — it starts `nvapi-`. You only see it once.
4. Paste it *only* into Vercel's environment-variable field in Step 3. Never
   into a file, a commit, or a chat window.

NVIDIA grants free credits for personal use, which is why we're here — no
payment method required to start.

> **Still outstanding:** the OpenAI key you pasted into chat earlier should be
> revoked at <https://platform.openai.com/api-keys> even though we no longer use
> it. A leaked key is a liability whether or not your code calls it.

## Step 2 — Push this folder to GitHub

This folder isn't a git repo yet. If the Pages site already lives in a repo,
copy these files in and push. Otherwise:

```bash
git init && git add -A && git commit -m "Add portfolio chatbot"
```

Then add your remote and push to the branch GitHub Pages serves.

## Step 3 — Deploy the function to Vercel

1. <https://vercel.com/new> → sign in with GitHub → import the repo.
2. Framework preset: **Other**. Leave build settings empty — there's no build.
3. Before deploying, open **Environment Variables** and add:
   - Name: `NVIDIA_API_KEY`
   - Value: your `nvapi-…` key
   - Environments: tick **Production, Preview, and Development**
4. **Deploy.** You'll get a URL like `https://myportfolio-abc123.vercel.app`.

Vercel installs the `openai` package itself — you don't need Node locally.
NIM speaks the OpenAI wire format, so the same SDK works unchanged.
(You don't currently have `node` or `npm` on this machine, which is fine for
deploying; you'd only need them for `vercel dev`.)

## Step 4 — Point the site at your function

**Already done.** [`galaxy.js`](galaxy.js) holds your real Vercel URL, and
[`api/chat.js`](api/chat.js) allowlists both origins:

```js
const ALLOWED_ORIGINS = new Set([
  "https://myportfolio-murex-six-91.vercel.app",
  "https://sumeethaldipur.github.io",
]);
```

The client detects which origin it's running on: served from Vercel it calls
`/api/chat` same-origin (no CORS at all), served from GitHub Pages it uses the
full URL. If you later add a custom domain, add it to that Set — a missing
origin is the most common cause of "it works locally but not live."

## Step 5 — Fill in your voice

Open [`data/profile.md`](data/profile.md). The factual half is done — pulled
from `Sumeet-Haldipur-Resume.pdf`, your site, and your public LinkedIn. The
section **"In Sumeet's own words"** has `TODO` markers:

- Why you moved from computer engineering into product
- Why CMU / AI Product Management
- What you want from a Summer 2027 internship
- The work you're proudest of
- How you work with engineers
- A real failure
- What you do outside work

This is the highest-leverage thing you can do. Without it the bot recites your
resume; with it the bot sounds like you. Recruiters ask these exact questions.

Edit the file, push, and the bot updates — no code changes.

---

## Two things to be aware of

**1. `data/profile.md` is public.** GitHub Pages serves the whole repo, so
anyone can open `sumeethaldipur.github.io/myportfolio/data/profile.md`. Keep it
to things you'd put on your resume. No compensation numbers, no candid takes on
former employers. (Everything currently in it is already public.)

**2. One conflict I did not merge.** Your LinkedIn dates the CX Excellence
award to **March 2023** with "46% NPS increase and 32% lead consumption boost."
Your resume says **2024**, NPS **13→52**, leads consumed **+57%**. I used the
resume, since you asked me to. Worth reconciling the two so a recruiter
comparing them doesn't see a mismatch.

Also from LinkedIn and now in the profile — please confirm these are current:
AI Product Management specialization, Industry Connection Fellow, tutoring with
Dongri to Degree, and AIESEC (Jan–Jul 2021).

---

## Cost

`deepseek-ai/deepseek-v4-pro` runs on NVIDIA NIM's free developer tier, so
there's no per-token bill and no payment method to attach. That's the whole
reason for this setup.

The tradeoffs versus a paid API:

- **Rate limits are the constraint, not money.** Free-tier credits are finite
  and refresh periodically. A portfolio bot won't come close in normal use, but
  a burst of traffic can hit the ceiling — the endpoint returns 429 and the chat
  shows a friendly retry message.
- **No prompt caching.** The full profile (~2,500 tokens) is re-read on every
  request. Free, but it means latency scales with profile length — worth knowing
  before you make `profile.md` enormous.
- **Reasoning is switched off** (`chat_template_kwargs: {thinking: false}`).
  DeepSeek V4 Pro is a reasoning model; for resume Q&A the thinking pass adds
  seconds of latency without improving answers.

## Guardrails already in place

- **CORS allowlist** — only your origins can call the endpoint.
- **Rate limit** — 12 requests/minute per IP.
- **Length caps** — 1,000 chars per message, 12 turns of history, 1,200 output
  tokens.
- **Scoped prompt** — it answers about you and declines to be a general-purpose
  assistant, so nobody can use your key to write their code.
- **Grounding** — instructed to answer only from the profile and redirect to
  your email when it doesn't know.

The rate limit is per serverless instance and instances are ephemeral, so it's
a speed bump rather than a guarantee. If the bot ever gets abused, add
[Upstash Redis](https://vercel.com/integrations/upstash) for a durable counter.

## Testing locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. The UI, theming, and error states all work; the
chat itself will show an error because there's no local API. To run the
function too, install Node, then `npx vercel dev`.

## If something breaks

| Symptom | Cause |
|---|---|
| `FUNCTION_INVOCATION_FAILED` (500 even on OPTIONS) | The function crashed at import. Almost always `NVIDIA_API_KEY` missing — set it in Vercel and redeploy. |
| CORS error in console | Your origin isn't in `ALLOWED_ORIGINS`. |
| "Knowledge base failed to load" | `includeFiles` missing from `vercel.json`. |
| "The assistant isn't configured yet" | `NVIDIA_API_KEY` not set. Same fix, clearer message. |
| 429 on every request | NIM free-tier rate limit or credits exhausted. |
| 401 in the Vercel logs | `nvapi-` key is wrong, or was revoked. |
| 404 naming the model | Model ID changed on build.nvidia.com — check the page. |
| Bot invents things | Add the fact to `profile.md` — it only knows that file. |

### Reading the real error

Vercel's browser-facing 500 is deliberately vague. The actual stack trace is in
**your Vercel project → Logs**, with the runtime error that caused it. Check
there first — it will name the missing variable or bad import directly.

### A note on hosting

Your Vercel deployment serves the entire portfolio, not just the function. So
you now have the site at two URLs. Either is fine:

- **Use the Vercel URL as your portfolio** — simplest. Everything is one origin,
  CORS never applies, and there's one place to deploy.
- **Keep GitHub Pages as canonical** — the chat calls Vercel cross-origin. This
  already works; the Pages origin is in the allowlist.

`galaxy.js` detects which origin it's running on and picks the right path
automatically, so you don't have to choose now.
