# Integrations — AdaptIQ

## Purpose
List every external system this app depends on, how it authenticates, and what happens when each one fails or is unavailable.

## What Is Known

### Shopify Admin API / OAuth
- **Auth**: OAuth 2.0 authorization-code flow (`SHOPIFY_API_KEY`/`SHOPIFY_API_SECRET`). Scopes requested: `read_products,write_script_tags` (per `shopify.app.adaptiq.toml`; `shopify.app.toml` has empty scopes).
- **Used for**: exchanging install code for access token, listing/deleting/creating ScriptTags, bulk product fetch, webhook registration, recurring application charges.
- **API version pinned to `2026-04`** in code (`src/app/api/auth/shopify/callback/route.ts`, `src/app/api/billing/*`), but `shopify.app.toml`/`shopify.app.adaptiq.toml` declare webhook API versions `2026-10`/`2026-07` respectively — three different version strings across the repo.
- **Failure modes handled**: token exchange failure returns 400; ScriptTag/webhook/sync failures are caught and logged but don't block install (silent partial failure).
- **Failure modes NOT handled**: no retry/backoff on any Shopify API call; no `state` CSRF check on the OAuth callback (see `docs/permissions.md`).
- **Live-test caution**: hitting the real install/callback flow creates a real ScriptTag and a real webhook registration on whatever store you test against, and (if billing is re-enabled) a real Shopify charge.

### Shopify Webhooks (inbound)
- `products/update` → `/api/webhooks/shopify/products`. **No HMAC signature verification** — do not treat this endpoint as trusted in tests or production without adding verification first.

### OpenAI API
- **Auth**: `OPENAI_API_KEY` env var — except three routes (`adaptive`, `search`, `recommendations`... actually `adaptive`, `search`, `bundles`) also ship a **hardcoded fallback key committed to git** (see `docs/_artifact-index.md` and `docs/guardrails.md`). Treat this as an active incident, not just a doc note.
- **Model**: `gpt-4o-mini` everywhere, called with either free-text JSON-array prompts (recommendations/bundles/search/cart-upsell) or `response_format: { type: "json_object" }` (adaptive).
- **Failure modes handled**: try/catch around `JSON.parse` of the model's output in every route; `cart-upsell` additionally falls back to a naive "first 2 unpurchased products" recommendation if OpenAI or parsing fails entirely; `adaptive` falls back to hardcoded copy.
- **Failure modes NOT handled**: no timeout/retry policy visible; no schema validation beyond `JSON.parse` succeeding (a well-formed but semantically wrong response, e.g. IDs not in the catalog, is silently filtered out by `.filter(Boolean)` rather than flagged).
- **Live-test caution**: every call costs real OpenAI credits; these routes are also unauthenticated (see `docs/permissions.md`), so load-testing them is also a cost-testing exercise.

### Supabase (Postgres + client library)
- **Auth**: `SUPABASE_SERVICE_ROLE_KEY` (full bypass of RLS) via `@supabase/supabase-js`, plus `@supabase/ssr` in dependencies (not seen in use in the files reviewed — worth confirming it's not dead weight).
- **Used for**: all persistent state (`store_configs`, `products`, `subscriptions`, `analytics`).
- **Failure modes**: most routes check `error`/null data and return 404/500 or an empty result; none retry.

### Vercel (hosting/deploy)
- App is deployed to Vercel (`adapt-iq-sable.vercel.app` per `shopify.app.adaptiq.toml`).
- `public/widget.js` is fetched directly from the production URL by Shopify's ScriptTag — meaning **there is no staging/preview isolation for the storefront widget**; any change to `widget.js` that reaches the production branch is live on every installed merchant's storefront immediately, per `TECHNICAL_REPORT.md`'s own deployment note.
- Known past failure: Vercel serverless function timeouts (10s hobby tier) during slow OpenAI calls returned an HTML 504 page that broke `widget.js`'s JSON parsing (fixed per `TECHNICAL_REPORT.md`).

## Unknowns
- Whether a paid Vercel tier (longer function timeout) is in use now, or if the 10s hobby-tier ceiling is still a live constraint.
- Whether `@supabase/ssr` is used anywhere (e.g. for a future customer-facing auth flow) or should be removed.

## Questions For The User
1. Can the three different Shopify API version strings (`2026-04` in code, `2026-10`/`2026-07` in the two `.toml` files) be reconciled to one?
2. What Vercel plan/timeout is currently active in production?
3. Is `@supabase/ssr` planned for future use, or safe to drop?

## Test Or Verification Implications
- OpenAI and Shopify calls should be mocked in most tests; reserve real calls for a small number of explicitly-labeled "guarded live verification" tests, since both cost money and mutate real external state.
- The webhook HMAC gap and the OAuth state gap are both integration-level security tests, not unit tests — they need a fake/forged request path exercised end-to-end.
