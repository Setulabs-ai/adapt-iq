import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

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
        const errText = await tokenResponse.text();
        console.error("[Shopify Auth] Token exchange failed. Status:", tokenResponse.status, "Body:", errText);
        return NextResponse.json({ error: "Token exchange failed", details: errText }, { status: 400 });
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;

    } catch (err) {
      console.error("[Shopify Auth] Token exchange error:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  // Generate a unique store ID dynamically based on the shop domain
  const storeId = shop.replace('.myshopify.com', ''); 

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

    // --- BULK CATALOG SYNC & WEBHOOKS ---
    try {
      const productsResponse = await fetch(`https://${shop}/admin/api/2024-01/products.json?limit=250`, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const products = productsData.products.map((p: any) => ({
          id: String(p.id),
          store_id: storeId,
          name: p.title,
          price: p.variants && p.variants.length > 0 ? `$${p.variants[0].price}` : null,
          image: p.image?.src || null,
          description: p.body_html || null,
          tags: p.tags ? p.tags.split(',').map((t: string) => t.trim()) : []
        }));
        
        if (products.length > 0) {
          const { error: syncError } = await supabase.from('products').upsert(products, { onConflict: 'id,store_id' });
          if (syncError) console.error("[Shopify Auth] Bulk sync error:", syncError);
          else console.log(`[Shopify Auth] Synced ${products.length} products for ${storeId}`);
        }
      }
      
      // Register Webhook for future updates
      await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify({
          webhook: {
            topic: "products/update",
            address: `${appHost}/api/webhooks/shopify/products?storeId=${storeId}`,
            format: "json"
          }
        })
      });
    } catch (err) {
      console.error("[Shopify Auth] Sync/Webhook error:", err);
    }
  }

  // --- SECURE SESSION COOKIE ---
  const secretKey = new TextEncoder().encode(process.env.SHOPIFY_API_SECRET || 'fallback_secret');
  const token = await new SignJWT({ storeId, shop })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set('adaptiq_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  });

  // Redirect the merchant to the App Dashboard
  return NextResponse.redirect(`${appHost}/dashboard`);
}
