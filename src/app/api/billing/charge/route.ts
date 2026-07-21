import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
  }

  const storeId = shop.replace('.myshopify.com', '');
  const appHost = process.env.HOST || "http://localhost:3000";
  const returnUrl = `${appHost}/api/billing/callback?shop=${shop}`;

  // 1. Get access token
  const { data: store, error } = await supabase
    .from('store_configs')
    .select('access_token, subscription_active')
    .eq('store_id', storeId)
    .single();

  if (error || !store || !store.access_token) {
    return NextResponse.json({ error: "Store configuration or access token not found" }, { status: 404 });
  }

  if (store.subscription_active) {
    return NextResponse.redirect(`${appHost}/dashboard`);
  }

  // 2. Create Recurring Application Charge on Shopify
  try {
    const chargeResponse = await fetch(`https://${shop}/admin/api/2026-04/recurring_application_charges.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': store.access_token,
      },
      body: JSON.stringify({
        recurring_application_charge: {
          name: "AdaptIQ Pro Plan",
          price: 19.99,
          return_url: returnUrl,
          trial_days: 7,
          test: true // We'll set this to true for testing purposes
        }
      })
    });

    if (!chargeResponse.ok) {
      console.error("[Shopify Billing] Failed to create charge:", await chargeResponse.text());
      return NextResponse.json({ error: "Failed to create Shopify charge" }, { status: 500 });
    }

    const { recurring_application_charge } = await chargeResponse.json();

    // Save pending subscription intent to database
    await supabase.from('subscriptions').insert({
      store_id: storeId,
      charge_id: String(recurring_application_charge.id),
      plan_name: "AdaptIQ Pro Plan",
      status: "pending"
    });

    // 3. Redirect merchant to Shopify approval screen
    return NextResponse.redirect(recurring_application_charge.confirmation_url);

  } catch (err: any) {
    console.error("[Shopify Billing] Error:", err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
