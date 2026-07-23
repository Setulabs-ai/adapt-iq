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

  // Embedded apps can be loaded inside Shopify Admin's iframe. accounts.shopify.com
  // refuses to be framed, so a normal HTTP redirect here can fail with
  // "accounts.shopify.com refused to connect" if this response is rendered inside
  // that iframe. Force a top-level navigation instead of a server redirect.
  const html = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      if (window.top === window.self) {
        window.location.href = ${JSON.stringify(installUrl)};
      } else {
        window.top.location.href = ${JSON.stringify(installUrl)};
      }
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
