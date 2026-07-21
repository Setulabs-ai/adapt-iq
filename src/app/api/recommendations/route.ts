import { NextResponse } from 'next/server';
import { mockStoreConfig, mockProducts, mockRecommendations } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const productId = searchParams.get('productId');

  if (!storeId || !mockStoreConfig[storeId]) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
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
