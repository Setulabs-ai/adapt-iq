# Personas — AdaptIQ

## Purpose
Identify who interacts with the system and at what permission level, so workflows and guardrails can be reviewed per-persona instead of generically.

## What Is Known
From code paths (route handlers, cookie checks, and UI):

| Persona | Where they show up | Evidence |
|---|---|---|
| **Merchant (store owner/admin)** | Installs the app (`/install`, `/login`), authenticates via Shopify OAuth, lands in `/dashboard` gated by `adaptiq_session` JWT cookie (`src/proxy.ts`, `src/lib/auth.ts`) | `getSessionStoreId()` reads/verifies the cookie; dashboard shows "Merchant Portal" |
| **Shopper (storefront visitor)** | Never authenticates; interacts only through `public/widget.js` running in their browser on the merchant's storefront | Widget calls `/api/ai/*`, `/api/recommendations`, `/api/track` anonymously, keyed only by `storeId` in the URL |
| **Shopify platform (system actor)** | Sends OAuth callback, webhook `products/update`, and billing charge callback requests | `src/app/api/auth/shopify/callback/route.ts`, `src/app/api/webhooks/shopify/products/route.ts`, `src/app/api/billing/callback/route.ts` |
| **OpenAI (AI system actor)** | Called synchronously inside 4 API routes to make merchandising decisions (which products to recommend/bundle/upsell, what hero copy to show) | `openai.chat.completions.create(...)` in `adaptive`, `search`, `bundles`, `cart-upsell`, `recommendations` routes |
| **App developer/operator** | Runs `test-db.js`/`alter_db.js` scripts locally, deploys via Vercel, reads `/api/test-env` for debugging | Root-level scripts, `src/app/api/test-env/route.ts` |

## What Is Inferred
- There is no visible **customer support / internal admin** persona (no super-admin panel, no way to view/manage multiple merchants from one place) — this looks like a single-tenant-per-request design where each merchant only ever sees their own `store_id`.
- The Merchant persona currently has no distinct roles/permissions (owner vs. staff) — one JWT session per store, not per user. Whoever holds a valid `adaptiq_session` cookie has full dashboard access.

## Unknowns
- Whether multiple staff accounts per Shopify store are ever expected, or if "one merchant = one session" is permanent by design.
- Whether there's an internal AdaptIQ team persona who needs a cross-store admin view (e.g., to debug a specific merchant's config) — nothing in the repo supports this today.

## Questions For The User
1. Will merchant accounts ever need multiple human users (owner + staff) with different permissions, or is one login per store sufficient long-term?
2. Does the AdaptIQ team need an internal admin/support view across all installed stores, and if so, does one already exist outside this repo?

## Test Or Verification Implications
- Shopper-facing endpoints (`/api/ai/*`, `/api/recommendations`, `/api/track`) have **no authentication at all** — test coverage should include abuse/spam scenarios (e.g., hammering `/api/track` or `/api/ai/cart-upsell` for a `storeId` that isn't the caller's own store), since any persona (not just real shoppers) can call them with just a `storeId` string.
- Merchant-facing `/api/stats` correctly requires a session; `/api/config` (GET and POST) does **not** check the session at all and trusts `storeId` from the request — worth a dedicated authz test (see `docs/permissions.md`).
