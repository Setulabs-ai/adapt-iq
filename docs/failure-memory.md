# Failure Memory — AdaptIQ

## Purpose
Distill known past failures (from `TECHNICAL_REPORT.md` and commit history) into a form that can seed regression tests and agent instructions, so the same bugs don't get reintroduced.

## What Is Known — Resolved Failures

| # | Failure | Root cause | Fix applied | Source |
|---|---|---|---|---|
| 1 | "Ghost node" DOM wipe | Shopify theme (Impulse) asynchronously wiped/re-rendered the cart drawer HTML while the widget awaited the AI backend response, orphaning the injected loader/products in a detached DOM node | Strict `!document.contains(insertNode)` check after `await fetch`; re-query and re-inject into the fresh container if the DOM was wiped mid-flight | `TECHNICAL_REPORT.md` #1; commit `66acd7f` |
| 2 | Hidden fallback cart injection | Widget injected into hidden fallback cart elements (e.g. the hidden `/cart` page footer that persists in the DOM even when the drawer is used) | `findVisible` helper using `el.offsetParent !== null` to only bind to the actually-visible cart drawer | `TECHNICAL_REPORT.md` #2; commit `6ab4893` |
| 3 | Vercel 504 timeout → JSON parse crash | OpenAI latency exceeded Vercel's serverless timeout (10s hobby tier); Vercel returned a 504 HTML page which `widget.js` tried to `JSON.parse` and crashed | Strict `res.ok` check on the frontend; on failure, log a warning and abort the render without breaking the rest of the UI | `TECHNICAL_REPORT.md` #3; commit `66acd7f` |
| 4 | Add-to-cart didn't refresh theme's cart UI | Widget's "Add to Cart" button call to `/cart/add.js` didn't trigger the theme's native slide-out cart refresh | Widget now manually dispatches `ajaxProduct:added` (Impulse) and `cart-updated` (Dawn) events with the raw payload after a successful add | `TECHNICAL_REPORT.md` #4; commit `c5d5882` |
| 5 | Cart-open detection missed some themes | Impulse keeps the cart drawer permanently in the DOM and only toggles an `is-open` class; the original `MutationObserver` wasn't watching for that | `MutationObserver` upgraded with `attributes: true, attributeFilter: ['class']`, plus a 100ms debounce to avoid API spam during large DOM replacements | `TECHNICAL_REPORT.md` #5; commit `8474647` |
| 6 | Widget syntax errors shipped to production | Not detailed beyond commit messages | Two separate commits (`5d5f70f`, `1bfc752`) titled "Fix widget.js syntax error" | commit log |
| 7 | Cart upsell infinite loop / UI bugs | Not detailed beyond commit messages | `cea1a45`, `89c2fe1` | commit log |

## What Is Inferred
- The recurring theme across nearly every fix is **race conditions between an async AI network call and a theme's own async DOM mutations** — this is the single highest-risk category for this codebase going forward, higher than the AI logic itself.
- At least two "syntax error" fixes reaching production (#6) suggests `widget.js` changes were shipped without a build/lint/test gate catching them first — consistent with `docs/release-and-operations.md`'s finding of no CI.

## Unknowns
- Whether any of these fixes have automated regression coverage today (answer: no test files exist in the repo — see `docs/test-strategy.md`), so nothing currently prevents any of these 7 failure modes from recurring.

## Questions For The User
1. Of the 7 known failure modes above, which are highest priority to convert into automated regression tests first?
2. Is there a private/staging Shopify dev store already set up with Dawn and Impulse themes installed, that a future test pass could reuse instead of provisioning new ones?

## Test Or Verification Implications
- Failures #1, #2, #5 all require a DOM-mutation-timing test harness (e.g. a headless browser test that simulates a theme wiping/toggling the cart drawer while a fetch is in-flight) — not simple unit tests.
- Failure #3 is straightforwardly testable: mock a non-2xx / non-JSON response from the AI endpoints and assert `widget.js` doesn't throw.
- Failure #6 (syntax errors shipping) argues for the simplest possible gate first: a lint/typecheck/build step in CI before anything more elaborate.
