import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const mockStoreConfig: Record<string, any> = {
  "store_123": {
    storeName: "Demo Shopify Store",
    features: {
      adaptive: true,
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
    image: "/img/product1.png"
  },
  {
    id: "9336993284311",
    name: "The Collection Snowboard: Oxygen",
    price: "$749.95",
    image: "/img/product2.png"
  },
  {
    id: "9336993251543",
    name: "The 3p Fulfilled Snowboard",
    price: "$699.95",
    image: "/img/product3.png"
  }
];

export const mockRecommendations: Record<string, string[]> = {
  "9336993317079": ["9336993284311", "9336993251543"], // Liquid recommends Oxygen & 3p
  "9336993284311": ["9336993317079", "9336993251543"], // Oxygen recommends Liquid & 3p
  "9336993251543": ["9336993317079", "9336993284311"]  // 3p recommends Liquid & Oxygen
};
