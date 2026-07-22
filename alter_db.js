require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function alterDb() {
  const { error } = await supabase.rpc('execute_sql', { sql: 'ALTER TABLE store_configs ADD COLUMN IF NOT EXISTS feature_cart_upsells BOOLEAN DEFAULT true;' });
  
  if (error) {
    console.error("RPC failed, trying raw query...", error);
    // Note: Supabase JS client doesn't support raw DDL statements easily without an RPC function.
    // The user might need to run it in the Supabase SQL editor.
  } else {
    console.log("Column added successfully via RPC.");
  }
}
alterDb();
