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


