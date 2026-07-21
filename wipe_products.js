require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function wipeProducts() {
  const storeId = "adaptiq-demo-store";
  console.log(`Wiping products data for ${storeId}...`);
  
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('store_id', storeId)
    .select();

  if (error) {
    console.error("Error wiping data:", error);
  } else {
    console.log(`Products wiped successfully! Deleted ${data?.length || 0} rows.`);
  }
}

wipeProducts();
