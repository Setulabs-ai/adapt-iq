import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const productId = searchParams.get('productId');

  if (!storeId) {
    return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
  }

  // Verify store exists and recommendations are enabled
  const { data: store, error } = await supabase
    .from('store_configs')
    .select('feature_recommendations')
    .eq('store_id', storeId)
    .single();

  if (error || !store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  if (!store.feature_recommendations) {
    return NextResponse.json({ title: "Precision Recommendations", products: [] });
  }

  // Fetch catalog from Supabase
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId);

  if (dbError || !dbProducts || dbProducts.length === 0) {
    return NextResponse.json({ title: "Precision Recommendations", products: [] });
  }

  // Filter out current product and grab up to 2 items (Mocking real ML logic for Phase 11)
  const recommendations = dbProducts
    .filter(p => p.id !== productId)
    .slice(0, 2);

  return NextResponse.json({
    title: "Precision Recommendations",
    products: recommendations
  });
}
