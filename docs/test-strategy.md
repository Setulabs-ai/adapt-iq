# Test Strategy — AdaptIQ

## Purpose
State the current state of test coverage plainly (there isn't any), and lay out philosophy/commands for whoever writes the first tests.

## What Is Known
- **No test files exist anywhere in the repo** — no `*.test.*`, `*.spec.*`, `__tests__/`, no testing library in `package.json` (`jest`, `vitest`, `playwright`, `@testing-library/*` are all absent from `dependencies`/`devDependencies`).
- **No CI workflow exists** to run tests even if they were added (`docs/release-and-operations.md`).
- `package.json` only defines `dev`, `build`, `start`, `lint` scripts — `lint` runs ESLint (`eslint.config.mjs` present) but that's the only automated check today.
- `test-db.js` and `alter_db.js` at the repo root are **not tests** in the automated sense — they're manual one-off scripts a developer runs by hand against a real Supabase instance.

## What Is Inferred
- Given zero test infrastructure and a codebase with real money/security surface (billing, OpenAI cost, Shopify write scopes, plaintext access tokens), testing is currently 100% manual — consistent with the fix-forward, ship-to-production pattern noted in `docs/release-and-operations.md` and the two "syntax error" hotfixes in `docs/failure-memory.md`.

## Unknowns
- Whether any manual QA checklist exists outside the repo (e.g. in a doc tool, spreadsheet, or the developer's head).

## Questions For The User
1. Is there a preferred test runner/framework for this stack (Vitest is the more natural fit for a Next.js 16 + TypeScript app; Jest is the more common default)?
2. Should tests run against a real (but disposable) Supabase project, or should the Supabase client be mocked at the boundary?
3. Priority order — should the first tests target the AI-route JSON-parsing/fallback logic (cheap, deterministic, high existing bug rate — see `docs/failure-memory.md`), or the authorization gaps (`docs/permissions.md`, higher severity but requires more setup)?

## Test Or Verification Implications (recommended starting shape, not yet implemented)
- **Unit-level, deterministic**: the 5 AI route handlers' non-AI logic — feature-flag short-circuiting, `JSON.parse` failure fallback, ID-not-in-catalog filtering. These need OpenAI mocked and Supabase mocked/stubbed; no real network calls.
- **Integration-level, deterministic**: the config read/write round-trip (`/api/config` GET → POST → GET), the analytics counters in `/api/stats`.
- **Security-focused, deterministic**: the authorization gaps enumerated in `docs/permissions.md` and `docs/guardrails.md` — each is a clean assert-this-request-is-rejected test once the underlying fix lands.
- **Guarded live verification only** (not routine CI): real Shopify OAuth install flow, real Shopify billing charge creation, real OpenAI calls — all cost money or mutate a real merchant-like environment, so these belong in a manual/occasional verification pass, not every CI run.
- Recommend running the pack's `04 Use Cases And Test Suggestions` and `05 Deterministic Test Plan` prompts next, now that `docs/workflows.md`, `docs/permissions.md`, and `docs/failure-memory.md` give them concrete material to work from instead of starting from zero.
