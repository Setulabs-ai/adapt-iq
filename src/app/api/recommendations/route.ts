import { NextResponse } from 'next/server';
import { supabase, mockProducts, mockRecommendations } from '@/lib/db';

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

  // Find product's recommended IDs
  const recIds = productId ? (mockRecommendations[productId] || []) : [];
  
  // Hydrate full products
  const recommendations = recIds.map(id => mockProducts.find(p => p.id === id)).filter(Boolean);

  return NextResponse.json({
    title: "Precision Recommendations",
    products: recommendations
  });
}
