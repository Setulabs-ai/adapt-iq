# Strategy — AdaptIQ

## Purpose
Give a PM/owner a single place to confirm (or correct) what this product is trying to make true, for whom, and what it deliberately isn't doing.

## What Is Known
- AdaptIQ is a Shopify app that adds AI-generated merchandising to a storefront: product recommendations, "frequently bought together" bundles, cart upsells, AI semantic search, and an "adaptive" hero section that rewrites headline/subtext/color based on visitor context (referrer, device, UTM params).
- Distribution model: merchant installs via Shopify OAuth (`/install` or `/login` → `/api/auth/shopify/install`), the app injects `public/widget.js` into their storefront via a Shopify ScriptTag, and the widget calls back to AdaptIQ's `/api/ai/*` and `/api/recommendations` endpoints at runtime.
- Monetization: a Shopify Recurring Application Charge, "AdaptIQ Pro Plan" at $19.99/mo with a 7-day trial (`src/app/api/billing/charge/route.ts`).
- There's a `docs/dashboard` merchant portal with Overview, Analytics, and Widget Settings pages, gated behind a JWT session cookie.
- Two config files exist for the same conceptual app: `shopify.app.toml` (generic/placeholder `application_url`, empty scopes) and `shopify.app.adaptiq.toml` (real Vercel URL `adapt-iq-sable.vercel.app`, real scopes `read_products,write_script_tags`). This suggests either an in-progress rename/reconfiguration or a stale leftover file.

## What Is Inferred
- Target customer is likely small-to-mid Shopify merchants who want "AI personalization" without building it themselves — the pricing ($19.99/mo) and single-tenant-per-store design fit a self-serve SMB app, not enterprise.
- Current phase is very likely **pre-launch or early testing**, not a mature production app with a real customer base — based on: the billing gate being explicitly commented out with the note "Bypassing billing gate for testing as requested," a hardcoded fallback OpenAI key clearly meant for convenience during dev, `test: true` on the Shopify recurring charge, and the recent commit history being dominated by widget DOM bug-fixing rather than growth/scale work.
- The most recent development effort (per `TECHNICAL_REPORT.md` and the last ~10 commits) went almost entirely into making the cart-upsell widget survive real-world Shopify theme quirks (Dawn vs. Impulse), suggesting the current priority is "make the core widget not break" over adding features.

## Unknowns
- Target success metrics (install count, CTR, revenue lift, retention) — the dashboard *displays* CTR and "Est. Revenue Lift" (`clicks * 3.5`, a hardcoded constant) but there's no evidence this formula was validated against real data.
- Whether this is meant to ship to the Shopify App Store, or stay a private/custom app for a specific client relationship.
- Non-goals: nothing in the repo states what AdaptIQ explicitly will *not* do (e.g., no inventory management, no email marketing, no multi-channel).
- Competitive framing — is there a specific competitor (Nosto, LimeSpot, Rebuy, etc.) this is positioned against?

## Questions For The User
1. Is AdaptIQ currently live with paying/installed merchants, or still in development/demo mode?
2. Which Shopify app config is authoritative — `shopify.app.toml` or `shopify.app.adaptiq.toml`? Can the other be deleted?
3. Was the revenue-lift formula (`clicks * 3.5`) a real business assumption, or a placeholder that should not be shown to merchants as-is?
4. What does "success" look like in 90 days — more installs, higher CTR, or something else?
5. Is Shopify App Store listing a goal? (This affects required security/compliance work, e.g. mandatory webhook HMAC verification, GDPR webhooks, billing API compliance.)

## Test Or Verification Implications
- Until success metrics are defined, test suites can only verify *correctness* (does the recommendation endpoint return valid product IDs) not *value* (did revenue actually lift). Keep those concerns separate in test design.
- The billing-gate bypass and the dual `.toml` files are both things a pre-launch checklist / release doc should explicitly call out before any real go-live (see `docs/release-and-operations.md`).
