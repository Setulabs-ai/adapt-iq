# Release & Operations — AdaptIQ

## Purpose
Capture how this app actually ships and runs today, since there's no CI config or deploy runbook in the repo.

## What Is Known
- **Hosting**: Vercel (`adapt-iq-sable.vercel.app`), inferred from `shopify.app.adaptiq.toml` and `TECHNICAL_REPORT.md`'s explicit note that Shopify fetches `widget.js` directly from the production URL.
- **No CI config found** — no `.github/workflows`, no `vercel.json` build hooks beyond default Next.js/Vercel auto-detection.
- **No test suite found** — nothing to run in CI even if it existed (see `docs/test-strategy.md`).
- **Deploy = push to production branch**, per the implicit Vercel-Next.js default and confirmed by `TECHNICAL_REPORT.md`: "Local Testing: To test `widget.js` changes, you must build the Next.js app (`npx next build`) and ensure Vercel deploys the updated `public/widget.js`, as Shopify fetches it directly from the production URL." There is no mention of a staging/preview step in the actual release process.
- **`public/widget.js` is effectively always "in production"** for every installed merchant the moment a deploy lands — there's no versioned/pinned widget URL (the ScriptTag URL has a `?v={timestamp}` cache-buster set once at install time, not re-pinned per release).
- Two local one-off scripts exist for direct DB access: `test-db.js` (read a row), `alter_db.js` (attempt a raw `ALTER TABLE` via Supabase RPC) — these are ad hoc operational tools, not part of any tracked migration system.

## What Is Inferred
- Given the commit history is dominated by "fix cart upsell," "fix DOM ghost node," "fix widget syntax error" commits landing directly to the branch that gets deployed, the current operational pattern looks like **fix-forward on production** rather than test-in-staging-then-promote.
- No rollback procedure is documented; Vercel's own deployment history/instant-rollback feature is presumably the de facto rollback mechanism, but this isn't confirmed in-repo.

## Unknowns
- Whether there's a preview/staging Shopify dev store used to test `widget.js` changes before they hit the production URL that live merchants' ScriptTags point to.
- Whether Vercel deploy protection, required reviews, or branch protection rules exist (not visible from the repo).
- Monitoring/alerting — no error-tracking SDK (Sentry, etc.) found in `package.json`.

## Questions For The User
1. Is there a staging Shopify store/environment used before shipping `widget.js` changes to production, or does every merge effectively go live for all installed merchants immediately?
2. Is there any error monitoring (Sentry, Vercel's own logs, etc.) currently relied on, or just `console.log`/`console.error` statements read manually?
3. Should `test-db.js` / `alter_db.js` be formalized into a real migrations setup (e.g. Supabase CLI migrations) given schema changes are currently done ad hoc?

## Test Or Verification Implications
- Given "deploy = live for all merchants immediately," any test-plan work should prioritize catching `widget.js` regressions *before* merge — this is the highest-blast-radius surface in the app.
- A smoke-test step (does `/api/config`, `/api/recommendations` respond for a known demo `storeId`) run post-deploy would catch the class of bug `TECHNICAL_REPORT.md` describes (504s, JSON parse crashes) faster than manual QA.
