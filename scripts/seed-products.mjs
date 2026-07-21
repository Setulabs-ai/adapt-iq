import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productsToInsert = [
  {
    id: "9336993317079",
    store_id: "store_123",
    name: "The Collection Snowboard: Liquid",
    price: "$749.95",
    image: "/img/product1.png",
    description: "Premium all-mountain snowboard.",
    tags: ["snowboard", "winter", "premium", "all-mountain"]
  },
  {
    id: "9336993284311",
    store_id: "store_123",
    name: "The Collection Snowboard: Oxygen",
    price: "$749.95",
    image: "/img/product2.png",
    description: "Lightweight powder snowboard.",
    tags: ["snowboard", "winter", "powder", "lightweight"]
  },
  {
    id: "9336993251543",
    store_id: "store_123",
    name: "The 3p Fulfilled Snowboard",
    price: "$699.95",
    image: "/img/product3.png",
    description: "Durable freestyle snowboard.",
    tags: ["snowboard", "winter", "freestyle", "durable"]
  }
];

async function seedProducts() {
  console.log("Seeding products to Supabase...");
  const { data, error } = await supabase
    .from('products')
    .upsert(productsToInsert, { onConflict: 'id,store_id' });

  if (error) {
    console.error("Failed to seed products:", error.message);
  } else {
    console.log("Successfully seeded", productsToInsert.length, "products!");
  }
}

seedProducts();
