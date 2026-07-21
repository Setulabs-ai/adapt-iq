require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testUpsert() {
  const dummyProduct = {
    id: "test_product_999",
    store_id: "adaptiq-demo-store",
    name: "Test Product",
    price: "$9.99",
    image: null,
    description: "test",
    tags: ["test", "dummy"]
  };
  
  const { data, error } = await supabase.from('products').upsert([dummyProduct], { onConflict: 'id,store_id' });
  console.log("Upsert Error:", error);
  console.log("Upsert Data:", data);
}
testUpsert();
