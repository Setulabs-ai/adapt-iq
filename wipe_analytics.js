require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function wipeData() {
  const storeId = "adaptiq-demo-store.myshopify.com";
  console.log(`Wiping analytics data for ${storeId}...`);
  
  const { error } = await supabase
    .from('analytics')
    .delete()
    .eq('store_id', storeId);

  if (error) {
    console.error("Error wiping data:", error);
  } else {
    console.log("Data wiped successfully! The dashboard should now be at 0.");
  }
}

wipeData();
