# Retrieval: RAG vs full-context

Both strategies are implemented. Full-context is what ships. This is why.

## The setup

The knowledge base (`data/profile.md`) is ~4,900 tokens against a model context
window of ~128K. That is small enough that retrieval is a choice rather than a
necessity, so both approaches were built and measured instead of assumed.

- **Full context** — the entire profile in the system prompt, every request.
- **RAG** — profile split on markdown headings into 30 chunks, embedded with
  `jina-embeddings-v5-omni-small`, cosine similarity, top-4 into the prompt.

Both paths share **identical instructions**; only the knowledge section differs.
Otherwise the comparison would measure prompt wording rather than retrieval.

Selectable per request (`{"mode": "rag" | "full"}`) so both run against the same
deployment — comparing two deployments would confound the result.

## Results — 8 questions, same deployment, 2026-08-27

| | Full context | RAG |
|---|---|---|
| Fact recall | **11/12** | 10/12 |
| Median latency | 10.0s | **8.8s** |
| Avg prompt size | 24,077 chars | **8,185 chars** |

RAG matched full-context on 7 of 8 questions while sending a third of the
prompt: factual lookups, single-section questions and topical questions all
retrieved correctly.

## Where retrieval failed

**"What do you think about Sumeet as a PM?"** — RAG 0/2, full-context 1/2.

Retrieved: Aditya's recommendation, *"In Sumeet's own words"* (a bare section
header), Caroline's recommendation, Snehal's recommendation.

It then answered almost entirely from the shortest of the six recommendations,
citing no metrics and neither of the two roles that carry them. Full-context
produced the 43% completion-time cut, the 32%→18% resubmission drop, the match
rate improvements, and the colleague quotes.

The cause is structural, not a tuning problem:

1. **Judgment questions have no discriminating keywords.** Every meaningful
   term appears across most chunks, so ranking is close to arbitrary.
2. **They need breadth, not precision.** A good answer draws on six or more
   sections — a fifth of the corpus. Top-4 cannot span that, and raising k far
   enough to cover it is full-context with an extra network round trip.
3. **Slot waste.** One of the four went to a section header containing no facts.

RAG was also *slowest* on this question — 32.8s vs 10.0s — because retrieval
overhead lands hardest exactly where retrieval helps least.

## Decision

Ship full-context. Retrieval earns its place somewhere around 50K-100K tokens,
when the corpus genuinely does not fit or per-token cost at volume justifies
fetching a slice. At 4,900 tokens it trades accuracy on the highest-value
question a visitor asks for a saving that does not matter.

The RAG implementation stays in `api/_rag.js`: still callable per request, still
tested, and the basis for re-running this comparison if the profile grows past
the point where the tradeoff flips.

## Reproducing

```bash
# full context
curl -s -X POST "$API/api/chat" -H 'Content-Type: application/json' \
  -d '{"mode":"full","messages":[{"role":"user","content":"What do you think about Sumeet as a PM?"}]}'

# retrieval
curl -s -X POST "$API/api/chat" -H 'Content-Type: application/json' \
  -d '{"mode":"rag","messages":[{"role":"user","content":"What do you think about Sumeet as a PM?"}]}'
```

The `model` SSE event reports which strategy ran, the prompt size, and — in RAG
mode — which chunks were retrieved with their similarity scores.
