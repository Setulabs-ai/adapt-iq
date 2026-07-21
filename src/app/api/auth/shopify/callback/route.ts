import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  const code = searchParams.get('code');
  const host = searchParams.get('host');

  if (!shop || !code || !host) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const clientId = process.env.SHOPIFY_API_KEY;
  const clientSecret = process.env.SHOPIFY_API_SECRET;
  const appHost = process.env.HOST || "http://localhost:3000";

  let accessToken = "mock_access_token";

  // --- DEV MODE BYPASS ---
  if (!clientId || clientId === "mock_key") {
    console.log("[Shopify Auth] Dev Mode: Simulating access token exchange.");
  } else {
    // --- PRODUCTION OAUTH FLOW ---
    try {
      // Exchange the authorization code for a permanent access token
      const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      if (!tokenResponse.ok) {
        const errData = await tokenResponse.json();
        console.error("[Shopify Auth] Token exchange failed:", errData);
        return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

    } catch (err) {
      console.error("[Shopify Auth] Token exchange error:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  // Generate a unique store ID (in a real app, this might map to shopify shop ID)
  // For the demo, we will map this to our existing `store_123` so the dashboard works instantly
  const storeId = 'store_123'; 

  // Save the access token and shop domain to Supabase
  const { error: dbError } = await supabase
    .from('store_configs')
    .upsert({
      store_id: storeId,
      shop_domain: shop,
      access_token: accessToken,
      feature_adaptive: true,
      feature_recommendations: true,
      feature_bundles: true,
      feature_search: true
    }, { onConflict: 'store_id' });

  if (dbError) {
    console.error("[Shopify Auth] Failed to save config to DB:", dbError.message);
    // In dev mode we might ignore this if DB doesn't have the exact schema yet
  }

  // --- DYNAMIC SCRIPT INJECTOR ---
  // Register the widget.js to load on the merchant's storefront automatically
  if (accessToken !== "mock_access_token") {
    try {
      const scriptTagResponse = await fetch(`https://${shop}/admin/api/2024-01/script_tags.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          script_tag: {
            event: "onload",
            src: `${appHost}/widget.js`
          }
        })
      });

      if (!scriptTagResponse.ok) {
        console.error("[Shopify Auth] Failed to inject ScriptTag:", await scriptTagResponse.json());
      } else {
        console.log("[Shopify Auth] Successfully injected widget.js into", shop);
      }
    } catch (err) {
      console.error("[Shopify Auth] ScriptTag injection error:", err);
    }
  }

  // Redirect the merchant to the App Dashboard (via App Bridge in a real embedded app)
  // Since this is a standalone demo, we redirect to our local dashboard
  return NextResponse.redirect(`${appHost}/dashboard`);
}
