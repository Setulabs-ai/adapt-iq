# AdaptIQ Technical Status Report

## Current Status Overview
The AdaptIQ AI-powered Shopify App has been successfully developed and deployed. The most recent development sprint focused heavily on stabilizing the **AI Cart Upsell Widget**, particularly its integration with various Shopify theme architectures (Dawn, Impulse, etc.). 

All core AI features (Recommendations, Search, Bundles, and Cart Upsells) are functional and communicating correctly with the Next.js backend and the Supabase database.

## Key Architecture Updates
- **Frontend Injection (`widget.js`)**: The widget script is a vanilla JavaScript object that dynamically injects AI elements into the Shopify storefront.
- **Backend API (`/api/ai/*`)**: The Next.js API routes act as a proxy to OpenAI (`gpt-4o-mini`) and Supabase.
- **Theme Agnostic Design**: The widget attempts to be theme-agnostic by querying multiple generic DOM selectors (e.g., `.drawer__footer`, `#CartDrawer`, `cart-drawer`).

## Recent Bug Fixes & Edge Cases Resolved

The previous sprint resolved several critical race conditions and DOM injection issues specific to how modern Shopify themes (like Impulse) handle the AJAX cart drawer:

### 1. The "Ghost Node" DOM Wipe Issue
- **Issue**: The Shopify theme was asynchronously wiping and re-rendering the cart drawer HTML *while* the widget was waiting for the AI backend to return product recommendations. This destroyed the injected loader and caused the widget to populate products into a detached DOM node.
- **Fix**: Added a strict `!document.contains(insertNode)` check after the `await fetch`. If the DOM was wiped during the network call, the script re-queries the DOM and re-injects the widget into the fresh cart container.

### 2. Hidden Fallback Cart Injection
- **Issue**: The widget was accidentally injecting itself into hidden fallback cart elements (e.g., the hidden `/cart` page footer that stays in the DOM even when the drawer is used).
- **Fix**: Upgraded DOM selectors to use a `findVisible` helper (`el.offsetParent !== null`), ensuring the widget only ever binds to the actively visible cart drawer on the screen.

### 3. Vercel 504 Timeout Crashes
- **Issue**: If the OpenAI API experienced latency, Vercel's serverless functions would time out (10s on hobby tier) and return a 504 HTML page, causing a JSON parse crash in `widget.js`.
- **Fix**: Added a strict `res.ok` check on the frontend. If a 504 HTML response is returned, it catches it gracefully, logs a warning, and aborts the render without breaking the UI.

### 4. Shopify Cart Refresh Events (Add to Cart)
- **Issue**: Adding a product via the widget's "Add to Cart" button failed to trigger the theme's slide-out cart refresh.
- **Fix**: The widget now manually fetches the JSON response from Shopify's `/cart/add.js` and forcefully dispatches `ajaxProduct:added` (for Impulse) and `cart-updated` (for Dawn) events, passing the raw payload so the themes natively rerender their drawers.

### 5. Aggressive Cart Open Detection
- **Issue**: Some themes (Impulse) keep the cart drawer in the DOM permanently and just toggle an `is-open` CSS class. The `MutationObserver` was missing this.
- **Fix**: The `MutationObserver` was upgraded with `attributes: true, attributeFilter: ['class']` to aggressively track class changes (`drawer--is-open`, `is-open`, `active`, etc.). It also has a 100ms debounce to prevent slamming the API when the theme does massive DOM replacements.

## Developer Handoff Notes

For the next developer taking over:
1. **Testing Themes**: Always test `widget.js` against both Dawn (Web Components) and Impulse (jQuery/Vanilla DOM replacements), as they handle AJAX carts fundamentally differently.
2. **Logs**: Extensive diagnostic `console.log("[AdaptIQ] ...")` statements have been left in `widget.js` specifically inside `renderCartUpsells` to make future DOM injection debugging easier.
3. **Caching**: Cart upsells are cached using a signature of the cart items (`id:quantity`). This prevents redundant OpenAI calls. 
4. **Local Testing**: To test `widget.js` changes, you must build the Next.js app (`npx next build`) and ensure Vercel deploys the updated `public/widget.js`, as Shopify fetches it directly from the production URL.

*End of Report*
