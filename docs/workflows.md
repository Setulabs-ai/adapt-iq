# Workflows — AdaptIQ

## Purpose
Document the main sequences of steps that start with a user/system/event and end in a changed state, including happy and edge paths, for test design and review.

## What Is Known

### 1. App Install (Merchant)
**Happy path:**
1. Merchant visits `/install` or `/login`, enters shop domain.
2. Browser redirects to `/api/auth/shopify/install?shop=...`.
3. Route redirects to Shopify's OAuth consent screen (`https://{shop}/admin/oauth/authorize?...&state={nonce}`).
4. Shopify redirects back to `/api/auth/shopify/callback?shop=&code=&host=`.
5. Callback exchanges `code` for an access token, upserts `store_configs` (default features on), deletes old ScriptTags and injects a fresh `widget.js` ScriptTag with a cache-busting `?v=timestamp`, bulk-syncs the product catalog into Supabase `products`, registers a `products/update` webhook, signs a 30-day JWT into the `adaptiq_session` cookie, and redirects to `/dashboard`.

**Edge paths:**
- No `SHOPIFY_API_KEY` configured → **dev-mode bypass**: fakes a `mock_auth_code_123` and skips the real OAuth exchange entirely (`install/route.ts` line 19, `callback/route.ts` line 24). This path is easy to accidentally leave active in a real deployment if the env var is simply missing.
- Shopify token exchange fails → 400 returned, but no user-facing error page (raw JSON).
- `state` nonce is generated on install but **never validated on callback** — CSRF protection for the OAuth flow is effectively absent.
- Product sync or webhook registration fails → silently logged, install continues anyway (partial failure state where the store is "installed" but has no catalog).

### 2. Billing (Merchant)
**Happy path:**
1. `/api/billing/charge?shop=` creates a Shopify Recurring Application Charge (`test: true`, 7-day trial) and inserts a `pending` row into `subscriptions`.
2. Merchant approves on Shopify's confirmation page.
3. Shopify redirects to `/api/billing/callback?charge_id=&shop=`, which re-fetches the charge from Shopify to verify status, then flips `store_configs.subscription_active = true` and updates the `subscriptions` row.

**Edge paths:**
- Charge declined → redirect to `/dashboard?error=billing_declined`, no retry flow.
- **This entire flow is currently unreachable from the install path** — the redirect to `/api/billing/charge` in `callback/route.ts` is commented out ("Bypassing billing gate for testing as requested"). Only reachable if a merchant hits the URL directly.

### 3. Storefront Widget Render (Shopper)
**Happy path:**
1. `widget.js` loads on the storefront (injected via ScriptTag), detects page type (product page vs. cart drawer) and theme (Dawn/Impulse/generic) via DOM selectors.
2. Calls the relevant endpoint(s) — `/api/recommendations`, `/api/ai/bundles`, `/api/ai/search`, `/api/ai/cart-upsell`, `/api/ai/adaptive` — passing `storeId` and page/cart context.
3. Each route checks the store's feature flag in `store_configs`, pulls the store's `products` catalog from Supabase, prompts OpenAI for a small JSON array of product IDs (or a copy object for `adaptive`), maps IDs back to full product rows, returns them.
4. Widget renders cards into the DOM; `/api/track` fires on view/click events into the `analytics` table.

**Edge paths (all documented as previously-fixed bugs in `TECHNICAL_REPORT.md` — see `docs/failure-memory.md` for the fix history):**
- Cart drawer DOM gets wiped/re-rendered mid-`fetch` → ghost node injection.
- Widget binds to a hidden fallback cart element instead of the visible drawer.
- Vercel function times out (10s hobby tier) mid-OpenAI-call → 504 HTML response breaks widget's JSON parsing.
- Add-to-cart via widget doesn't trigger the theme's native cart refresh.
- OpenAI returns non-JSON or malformed JSON → each route wraps `JSON.parse` in try/catch and falls back to an empty/partial result (only `cart-upsell` has a deeper fallback that re-queries the DB for generic products).
- Store has feature flag off → route short-circuits and returns an empty result, cheaply (no OpenAI call).
- Product referenced by `productId` doesn't exist in the DB (e.g. mock Shopify test IDs) → graceful empty response, not an error.

### 4. Product Catalog Sync (System)
- **Bulk sync**: happens once, during OAuth callback (step 5 above), pulls up to 250 active products.
- **Incremental sync**: Shopify calls `/api/webhooks/shopify/products?storeId=` on `products/update`, which upserts a single product row.
- **Edge path**: webhook payload is trusted with **no HMAC signature verification** — anyone who knows/guesses a `storeId` can POST arbitrary product data into that store's catalog.

### 5. Merchant Config Edit (Dashboard)
- `/dashboard/settings` reads/writes `/api/config` (GET to load, POST to save) — toggles feature flags (`recommendations`, `bundles`, `search`, `cartUpsells`) and theme (`primaryColor`, `theme_config`).
- **Edge path**: `/api/config` does not check the session cookie at all; it trusts `storeId` in the query string/body. Any caller who knows a store's ID can read or overwrite that store's config.

## Unknowns
- What happens if a merchant uninstalls the app on Shopify's side — there's no `app/uninstalled` webhook handler in the repo, so `store_configs`/`products` rows would go stale indefinitely.
- Whether `/api/webhooks/shopify/products` has other topics registered beyond `products/update` (e.g. `products/delete`) — only one webhook registration call was found.

## Questions For The User
1. Is the missing OAuth `state` validation and missing webhook HMAC verification a known/accepted gap for the current testing phase, or should it be prioritized now?
2. Should `/api/config` require the session cookie (like `/api/stats` does) before this goes further?
3. Is there an uninstall/cleanup workflow planned, or should mandatory Shopify compliance webhooks (`app/uninstalled`, `customers/redact`, `shop/redact`) be added before an App Store submission?

## Test Or Verification Implications
- Every "edge path" above is a candidate test case; several (state/HMAC/session gaps) are candidates for **guarded live verification** rather than unit tests, since they involve real Shopify OAuth/webhook signing.
- The AI JSON-parsing steps (recommendations, bundles, search, cart-upsell, adaptive) are the highest-value places for deterministic tests since they're pure input→output transforms once the OpenAI call is mocked.
