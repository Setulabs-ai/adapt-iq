import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const mockStoreConfig: Record<string, any> = {
  "store_123": {
    storeName: "Demo Shopify Store",
    features: {
      recommendations: true,
      bundles: false,
      search: false
    },
    theme: {
      primaryColor: "#7c6dfa"
    }
  }
};

export const mockProducts = [
  {
    id: "9336993317079",
    name: "The Collection Snowboard: Liquid",
    price: "$749.95",
    image: "https://cdn.shopify.com/s/files/1/0885/8730/5239/files/Main_046c8230-07ea-4ff7-b12e-a320aa1961e9.jpg"
  },
  {
    id: "9336993284311",
    name: "The Collection Snowboard: Oxygen",
    price: "$749.95",
    image: "https://cdn.shopify.com/s/files/1/0885/8730/5239/files/Main_0a70f2af-a83d-4c3e-aab1-667dc9df9c4d.jpg"
  },
  {
    id: "9336993251543",
    name: "The 3p Fulfilled Snowboard",
    price: "$699.95",
    image: "https://cdn.shopify.com/s/files/1/0885/8730/5239/files/Main_970a2fdb-b1b5-442a-a92c-0e2ffb45d2e3.jpg"
  }
];

export const mockRecommendations: Record<string, string[]> = {
  "9336993317079": ["9336993284311", "9336993251543"], // Liquid recommends Oxygen & 3p
  "9336993284311": ["9336993317079", "9336993251543"], // Oxygen recommends Liquid & 3p
  "9336993251543": ["9336993317079", "9336993284311"]  // 3p recommends Liquid & Oxygen
};
