# Guardrails — AdaptIQ

## Purpose
List protected actions and where verification is currently missing, so future work (human or AI-agent) knows which boundaries are load-bearing today and which are silently absent.

## What Is Known — Confirmed Gaps (all found during this inventory, all pre-existing, none introduced by this pass)

1. **Hardcoded, committed OpenAI API key** in `src/app/api/ai/adaptive/route.ts`, `src/app/api/ai/search/route.ts`, `src/app/api/recommendations/route.ts`, split across two string constants as a fallback for a missing `OPENAI_API_KEY`. Present in git history, not just the working tree. **Action needed outside this doc: rotate the key.**
2. **No Shopify webhook HMAC verification** on `/api/webhooks/shopify/products` — the endpoint trusts any POST body as if it came from Shopify.
3. **No OAuth `state`/nonce validation** on `/api/auth/shopify/callback` — a `nonce` is generated at `/api/auth/shopify/install` but never checked against what comes back, so the flow is exposed to CSRF.
4. **No session/authorization check on `/api/config`** (GET and POST) — any caller who knows a `store_id` can read or overwrite that store's feature flags and theme.
5. **`access_token` stored in plaintext** in `store_configs` — a real Shopify Admin API credential with write access to the merchant's storefront.
6. **Billing gate commented out** in the OAuth callback ("Bypassing billing gate for testing as requested") — every install currently skips the subscription-required redirect.
7. **`/api/test-env`** leaks whether `SHOPIFY_API_KEY` is set, its length, and its prefix — low severity, but a debug endpoint that shouldn't be reachable in production.
8. **Dev-mode OAuth bypass** (`install`/`callback` routes): if `SHOPIFY_API_KEY` is unset or equals `"mock_key"`, the entire OAuth handshake is faked. This is useful for local dev but is a real risk if that env var is ever accidentally unset in a live deployment — it would silently start faking merchant installs.

None of these are being fixed in this pass — the task was documentation-only. They're recorded here so they aren't lost and so a future prompt (e.g. a security-hardening pass) can act on a known, prioritized list instead of rediscovering them.

## Protected Actions Inventory

| Action | Currently gated by | Sufficient? |
|---|---|---|
| Create Shopify ScriptTag on merchant storefront | Nothing beyond having a valid OAuth `code` | Yes, once state validation is added |
| Register/modify Shopify webhooks | Same | Yes, once state validation is added |
| Create a real Shopify billing charge | `shop` query param only | **No** — no session/ownership check |
| Read/write a store's feature config | `storeId` query param only | **No** |
| Ingest product data via webhook | `storeId` query param only, no signature | **No** |
| Call AI endpoints (cost money) | Nothing (public by design) | Acceptable if rate-limited elsewhere; unconfirmed |

## Unknowns
- Whether rate limiting or WAF rules exist at the Vercel/CDN layer outside this repo, which would partially mitigate the unauthenticated-AI-endpoint cost risk.

## Questions For The User
1. Which of the 8 gaps above should be treated as blocking before more merchants install, versus accepted risk during this testing phase?
2. Should an agent (AI coding assistant) be allowed to fix guardrail issues autonomously in a future task, or does each one need explicit sign-off given they touch auth/billing/webhooks?

## Test Or Verification Implications
- Each numbered gap above maps directly to a negative test case once fixed (e.g., "callback with mismatched state is rejected," "webhook without valid HMAC is rejected," "config write for store B fails when authenticated as store A").
- Recommend these become the seed list for the next `05 Deterministic Test Plan` pass rather than re-deriving them from scratch.
