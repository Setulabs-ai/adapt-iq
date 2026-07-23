# Data & Storage — AdaptIQ

## Purpose
Document where important state lives, since there is no schema/migration file in the repo — everything below is reconstructed from the columns each route actually reads and writes.

## What Is Known

No `schema.sql`, migrations folder, or ORM models exist in the repo. All table/column knowledge comes from Supabase JS calls (`.from('table').select/insert/update/upsert`) scattered across `src/app/api/**`.

### `store_configs` (one row per Shopify store)
Columns referenced in code:
- `store_id` (text, primary lookup key, derived from shop domain)
- `store_name`
- `access_token` (Shopify Admin API token — **stored in plaintext** per the upsert in the OAuth callback)
- `subscription_active` (boolean)
- `feature_recommendations`, `feature_bundles`, `feature_search`, `feature_cart_upsells`, `feature_adaptive` (booleans, individually nullable/defaulted at the API layer with `??`)
- `theme_primary_color`
- `theme_config` (jsonb — `{ primaryColor, borderRadius, layout }`)

`alter_db.js` shows `feature_cart_upsells` was added after the fact via a raw SQL `ALTER TABLE` RPC call — i.e., schema changes are being made ad hoc, not through tracked migrations.

### `products` (one row per Shopify product, per store)
Columns: `id` (Shopify product ID as string), `store_id`, `name`, `price` (string like `"$19.99"`, not numeric), `image`, `description`, `tags` (array), `handle`, `variant_id`. Composite uniqueness on `(id, store_id)` (used in `onConflict`).

### `subscriptions`
Columns: `store_id`, `charge_id`, `plan_name`, `status` (`pending` → `active`/`accepted`/etc.).

### `analytics`
Columns: `store_id`, `event_type` (e.g. `page_view`, `recommendation_click`), `product_id`, `created_at` (used for ordering/counting).

## What Is Inferred
- `access_token` being stored unencrypted in `store_configs` is a real-world Shopify token with write access (`write_script_tags`) to the merchant's storefront — a high-value secret sitting in a plain Postgres column.
- `price` stored as a formatted string (`"$19.99"`) rather than a numeric type will make any future price-based sorting/filtering/aggregation brittle.
- No table appears to track OpenAI usage/cost per store, despite billing being cost-sensitive (unauthenticated AI routes can be hit repeatedly).

## Unknowns
- Full column list and types for each table (only what's referenced in code is known — there may be additional columns, indexes, or constraints not visible here).
- Whether Supabase Row Level Security is configured (see `docs/permissions.md`).
- Retention policy for `analytics` — no cleanup/archival code found.

## Questions For The User
1. Can you export or share the actual Supabase schema (via `supabase db dump` or the dashboard) so this doc can be made authoritative instead of inferred?
2. Should `access_token` be encrypted at rest, or is Supabase's own encryption-at-rest considered sufficient?
3. Is there a plan to track OpenAI token/cost usage per store, given the routes are publicly callable?

## Test Or Verification Implications
- Any test touching `store_configs`/`products` should account for the `(id, store_id)` composite key — duplicate-row and cross-store-leak tests are natural here.
- Because there's no schema file, tests are the only living documentation of expected shape; consider adding a minimal schema/type file (e.g. generated Supabase types) as a follow-up artifact.
