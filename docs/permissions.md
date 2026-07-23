# Permissions — AdaptIQ

## Purpose
Map who/what can view, change, or run protected actions, and flag where the code's actual behavior doesn't match what you'd assume from the route name.

## What Is Known

### Session / cookie layer
- `adaptiq_session` is a JWT (HS256, signed with `SHOPIFY_API_SECRET`, falling back to the literal string `'fallback_secret'` if that env var is unset) containing `{ storeId, shop }`, 30-day expiry, `httpOnly`, `sameSite: lax`, `secure` only in production (`src/app/api/auth/shopify/callback/route.ts`).
- `src/proxy.ts` (Next.js 16's middleware) protects `/dashboard/:path*` by requiring a valid cookie, redirecting to `/login` otherwise.
- `src/lib/auth.ts#getSessionStoreId()` is the server-side equivalent, used inside API routes.

### Route-by-route authorization audit

| Route | Requires session? | Trusts | Risk |
|---|---|---|---|
| `/api/stats` | **Yes** (`getSessionStoreId`) | Session-derived `storeId` | Correctly scoped |
| `/api/config` (GET, POST) | **No** | `storeId` from query/body | Any caller can read or overwrite any store's feature flags/theme by guessing/knowing a `storeId` |
| `/api/recommendations`, `/api/ai/search`, `/api/ai/bundles`, `/api/ai/cart-upsell`, `/api/ai/adaptive` | No (by design — public storefront widget) | `storeId` from query/body | Expected to be public, but there's no rate limiting, so any caller can burn a store's OpenAI budget by hammering these with arbitrary `storeId`s |
| `/api/track` | No (by design) | `storeId`, `event` from body | Same — unauthenticated analytics writes, spoofable |
| `/api/webhooks/shopify/products` | No auth; **no HMAC verification** | `storeId` query param + full request body | Anyone who knows a `storeId` can inject/overwrite arbitrary product data |
| `/api/auth/shopify/callback` | N/A (is the auth step) | `shop`, `code`, `host` query params from Shopify redirect | No `state`/nonce verification against the one generated at `/install` — CSRF exposure on the OAuth flow |
| `/api/billing/charge`, `/api/billing/callback` | No | `shop` query param | Anyone who knows a shop domain can trigger a billing charge creation against that store's saved access token |
| `/api/test-env` | No | — | Leaks whether `SHOPIFY_API_KEY` is set and its length/prefix; low sensitivity but shouldn't ship to production |

### Database access
- `src/lib/db.ts` creates a single Supabase client using `SUPABASE_SERVICE_ROLE_KEY` — the **service role bypasses Row Level Security entirely**. Every route effectively has full read/write access to every table for every store; the only isolation is whatever `.eq('store_id', ...)` filter each handler remembers to add. There is no database-level tenant isolation.

### Protected actions (things that mutate real-world state, not just DB rows)
- Creating a Shopify Recurring Application Charge (real billing) — `/api/billing/charge`.
- Deleting/creating Shopify ScriptTags on a merchant's live storefront — OAuth callback.
- Registering webhooks on a merchant's Shopify admin — OAuth callback.
- All are triggered by unauthenticated GET requests with only a `shop` string as the "credential."

## What Is Inferred
- The security model appears to assume `store_id` values are unguessable/secret, but they're derived directly and predictably from the shop's `.myshopify.com` domain (`shop.replace('.myshopify.com', '')`) — i.e., not a secret at all. Anyone who knows (or brute-forces) a merchant's shop name can call any of the unauthenticated routes as if they owned that store.

## Unknowns
- Whether Row Level Security policies exist on the Supabase tables independent of this app's code (can't verify from the repo — no migration/schema files present).
- Whether rate limiting exists at the Vercel/CDN layer outside this repo.

## Questions For The User
1. Is store-id-as-bearer-token an accepted trust model for now (testing phase), or does `/api/config`, `/api/webhooks/*`, and `/api/billing/*` need real authorization before more merchants install?
2. Are there Supabase RLS policies configured outside this codebase that provide a safety net the app code doesn't show?
3. Should `/api/test-env` be removed or gated before any production deploy?

## Test Or Verification Implications
- Authorization gaps are prime candidates for explicit negative tests: "store A's session/storeId cannot read or write store B's config/products/analytics."
- Webhook HMAC verification, once added, needs both a valid-signature and invalid-signature test case.
- OAuth `state` validation, once added, needs a test for the CSRF case (callback arrives with a `state` that doesn't match the one issued at `/install`).
