# AI / Automation Scope — AdaptIQ

## Purpose
Make explicit what the AI (OpenAI `gpt-4o-mini`) is allowed to decide, how much autonomy it has, and what the blast radius is if it hallucinates or misbehaves.

## What Is Known

There are 5 LLM call sites, all server-side, all synchronous within a single request/response cycle (no agentic loop, no tool-calling, no multi-step planning):

| Route | What the model decides | Output shape | Guardrail in code |
|---|---|---|---|
| `/api/recommendations` | Which 2 catalog products are "similar" to the viewed product | Raw JSON array of product IDs | IDs not found in the DB catalog are silently dropped (`.filter(Boolean)`) |
| `/api/ai/bundles` | Which 2 products form a "frequently bought together" bundle | Raw JSON array of product IDs | Same |
| `/api/ai/search` | Which 1-3 catalog products semantically match a free-text query | Raw JSON array of product IDs | Same |
| `/api/ai/cart-upsell` | Which 2 products to cross-sell given the full cart contents | Raw JSON array of product IDs | Same, plus a non-AI fallback (first 2 unpurchased products) if the AI call/parse fails entirely |
| `/api/ai/adaptive` | Hero headline (≤6 words), subtext (≤15 words), and a hex color, based on visitor referrer/UA/UTM | JSON object via `response_format: json_object` | Hardcoded fallback copy if the call/parse fails |

In every case, the model's only real power is **choosing which existing catalog items to surface, or generating short marketing copy** — it never writes to the database, never calls Shopify's API, never sends anything on the merchant's behalf. The AI's output is always intersected with the app's own product catalog before being shown, except for the `adaptive` route's freeform copy/color, which is shown as-is with no validation.

## What Is Inferred
- Blast radius of a bad AI response is low-to-moderate: worst case is an irrelevant or nonsensical product recommendation, or a poorly-formatted/off-brand hero headline shown directly on a merchant's live storefront (the `adaptive` route has no content moderation or profanity/length re-check beyond what's requested in the prompt).
- The AI has no memory/context across requests — each call is a fresh, single-turn prompt with the current catalog and current viewer context. There's no fine-tuning, no vector search/embeddings, no RAG — "semantic search" here is literally "paste the whole catalog into the prompt and ask GPT to pick IDs," which won't scale past a catalog GPT-4o-mini can fit in context.

## Unknowns
- Catalog size limits — nothing caps how many products get stringified into the prompt (`JSON.stringify(catalog, ...)`), so a large catalog could blow past reasonable prompt sizes/cost, or get silently truncated by the model.
- Whether the `adaptive` route's freeform headline/subtext output has ever produced something off-brand or inappropriate in practice.

## Questions For The User
1. Is there a catalog-size ceiling above which "stuff the whole catalog into the prompt" needs to become real retrieval/embeddings?
2. Should the `adaptive` route's AI-generated copy go through any content filter/length re-validation before rendering, given it's the one AI output shown with zero relationship to the existing catalog?
3. Are there brand-voice or compliance constraints (e.g. no discount-language, no medical/financial claims) the prompts should encode explicitly?

## Test Or Verification Implications
- Every route's `JSON.parse` fallback path is a deterministic test target: feed a mocked non-JSON, malformed-JSON, and empty-array OpenAI response and assert the fallback behavior.
- A useful "AI as judge" style eval could check whether returned product IDs are ever *not* present in the original catalog sent to the model (a hallucination signal) — currently silently filtered, not logged/measured anywhere.
- Consider a lightweight golden-set eval for `/api/ai/adaptive` (does the headline stay under 6 words, is the hex color valid) since that output isn't cross-checked against anything else before rendering.
