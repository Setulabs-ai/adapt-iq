require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testBilling() {
  const shop = "adaptiq-demo-store.myshopify.com";
  const storeId = "adaptiq-demo-store";
  
  const { data: store, error } = await supabase
    .from('store_configs')
    .select('access_token')
    .eq('store_id', storeId)
    .single();

  if (error || !store) {
    console.log("Store not found or error:", error);
    return;
  }

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
        return_url: `https://adapt-iq.vercel.app/api/billing/callback?shop=${shop}`,
        trial_days: 7,
        test: true
      }
    })
  });

  console.log("Status:", chargeResponse.status);
  console.log("Body:", await chargeResponse.text());
}
testBilling();
