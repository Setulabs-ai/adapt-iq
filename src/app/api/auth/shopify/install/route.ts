import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
  }

  const clientId = process.env.SHOPIFY_API_KEY;
  const host = process.env.HOST || "http://localhost:3000";
  const scopes = "read_products,write_script_tags";
  const redirectUri = `${host}/api/auth/shopify/callback`;

  // --- DEV MODE BYPASS ---
  // If no Shopify API key is configured, bypass the actual OAuth redirect
  // and simulate a callback to allow testing the dashboard directly.
  if (!clientId || clientId === "mock_key") {
    console.log("[Shopify Auth] No SHOPIFY_API_KEY found. Simulating successful install.");
    const mockCode = "mock_auth_code_123";
    return NextResponse.redirect(`${host}/api/auth/shopify/callback?shop=${shop}&code=${mockCode}&host=mock_host_value`);
  }

  // --- PRODUCTION OAUTH FLOW ---
  // Generate a random nonce for security (state parameter)
  const nonce = Math.random().toString(36).substring(7);
  
  // Construct the Shopify authorization URL
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`;

  // Redirect the merchant to Shopify to grant permissions
  return NextResponse.redirect(installUrl);
}
