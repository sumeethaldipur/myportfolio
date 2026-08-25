# Portfolio chatbot — setup

The site stays on GitHub Pages. Pages can only serve static files, so it can't
hold an API key. The chat endpoint therefore lives on Vercel, and the browser
calls it cross-origin.

```
sumeethaldipur.github.io/myportfolio        (GitHub Pages — unchanged)
        │
        │  POST https://<your-project>.vercel.app/api/chat
        ▼
Vercel serverless function                   (OPENAI_API_KEY lives here)
        │
        ▼
OpenAI API (gpt-5.6-luna)
```

Your API key is only ever an environment variable on Vercel. It is never in
the repo and never reaches the browser.

## What was added

| File | Purpose |
|---|---|
| `data/profile.md` | The bot's entire knowledge base. **This is the file you edit.** |
| `api/chat.js` | Serverless function: prompt, CORS, rate limit, streaming. |
| `package.json` | Declares the `openai` dependency for Vercel. |
| `vercel.json` | Bundles `data/` with the function; 30s max duration. |
| `.nojekyll` | Stops GitHub Pages running Jekyll over the new folders. |
| `index.html` | Chat launcher + panel markup, before `</body>`. |
| `galaxy.css` | Chat styles, appended. Uses your existing theme tokens. |
| `galaxy.js` | Chat client, appended. Streams tokens as they arrive. |

---

## Step 1 — Get a fresh API key

Your previous key was pasted into a chat and must be treated as compromised.

1. Go to <https://platform.openai.com/api-keys>.
2. **Delete** the existing key — the console lists each key by its prefix and
   last-used date, so match it there.
3. **Create new secret key.** Copy it. You only see it once.
4. Paste it *only* into Vercel's environment-variable field in Step 3. Never
   into a file, a commit, or a chat window.

Also confirm you have credit at <https://platform.openai.com/settings/organization/billing>.
A new key with a $0 balance returns 429 on every request.

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
   - Name: `OPENAI_API_KEY`
   - Value: your new `sk-proj-…` key
4. **Deploy.** You'll get a URL like `https://myportfolio-abc123.vercel.app`.

Vercel installs the `openai` package itself — you don't need Node locally.
(You don't currently have `node` or `npm` on this machine, which is fine for
deploying; you'd only need them for `vercel dev`.)

## Step 4 — Point the site at your function

In [`galaxy.js`](galaxy.js), find `REPLACE-ME` near the bottom and swap in your
real Vercel URL:

```js
: "https://myportfolio-abc123.vercel.app/api/chat";
```

Then confirm your Pages origin is allowed in [`api/chat.js`](api/chat.js):

```js
const ALLOWED_ORIGINS = new Set([
  "https://sumeethaldipur.github.io",   // already set for you
]);
```

If you later move to a custom domain, add it to that list — a missing origin
is the most common cause of "it works locally but not live."

Commit and push. Pages redeploys the site, Vercel redeploys the function.

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

`gpt-5.6-luna` costs **$0.20 per million input tokens** and **$1.20 per million
output tokens**. Every request sends the whole profile (~2,500 tokens) as the
`instructions` field, which is byte-identical each time, so OpenAI's automatic
prompt caching discounts it after the first call.

A typical exchange costs well under a tenth of a cent. Realistically you will
spend more on the domain than on the bot — a few hundred conversations a month
is pocket change.

Set a spend cap anyway at
<https://platform.openai.com/settings/organization/limits>. It's the only hard
backstop if someone hammers the endpoint.

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
| "Couldn't reach the server" | `REPLACE-ME` still in `galaxy.js`. |
| CORS error in console | Your origin isn't in `ALLOWED_ORIGINS`. |
| "Knowledge base failed to load" | `includeFiles` missing from `vercel.json`. |
| 500 on every request | `OPENAI_API_KEY` not set in Vercel. |
| 429 on every request | No credit on the OpenAI account. |
| 401 in the Vercel logs | Key is wrong, or was revoked. |
| Bot invents things | Add the fact to `profile.md` — it only knows that file. |
