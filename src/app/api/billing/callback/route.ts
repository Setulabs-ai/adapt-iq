import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chargeId = searchParams.get('charge_id');
  const shop = searchParams.get('shop');

  if (!chargeId || !shop) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const storeId = shop.replace('.myshopify.com', '');
  const appHost = process.env.HOST || "http://localhost:3000";

  // 1. Get access token
  const { data: store, error: storeError } = await supabase
    .from('store_configs')
    .select('access_token')
    .eq('store_id', storeId)
    .single();

  if (storeError || !store || !store.access_token) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  try {
    // 2. Fetch the charge from Shopify to verify its status
    const chargeResponse = await fetch(`https://${shop}/admin/api/2026-04/recurring_application_charges/${chargeId}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': store.access_token,
      }
    });

    if (!chargeResponse.ok) {
      console.error("[Shopify Billing] Failed to verify charge:", await chargeResponse.text());
      return NextResponse.redirect(`${appHost}/dashboard?error=billing_verification_failed`);
    }

    const { recurring_application_charge } = await chargeResponse.json();

    // 3. Update the database if the charge was approved or active
    if (recurring_application_charge.status === "active" || recurring_application_charge.status === "accepted") {
      // Activate the subscription in store_configs
      await supabase
        .from('store_configs')
        .update({ subscription_active: true })
        .eq('store_id', storeId);

      // Update subscriptions table
      await supabase
        .from('subscriptions')
        .update({ status: recurring_application_charge.status })
        .eq('charge_id', chargeId);

      // Redirect to dashboard on success
      return NextResponse.redirect(`${appHost}/dashboard?billing=success`);
    } else {
      // If declined, redirect to dashboard with an error or back to charge route
      return NextResponse.redirect(`${appHost}/dashboard?error=billing_declined`);
    }
  } catch (err: any) {
    console.error("[Shopify Billing] Callback Error:", err.message);
    return NextResponse.redirect(`${appHost}/dashboard?error=billing_error`);
  }
}
