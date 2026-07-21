import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  if (!storeId) {
    return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
  }

  // Verify store exists
  const { data: store, error } = await supabase
    .from('store_configs')
    .select('store_id')
    .eq('store_id', storeId)
    .single();

  if (error || !store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  return NextResponse.json({
    views: 12450,
    clicks: 3840,
    ctr: "30.8%",
    revenueLift: "$4,250",
    recentEvents: [
      { event: "recommendation_click", product: "The Collection Snowboard: Oxygen", time: "2 mins ago" },
      { event: "page_view", product: "The Collection Snowboard: Liquid", time: "5 mins ago" },
      { event: "recommendation_click", product: "The 3p Fulfilled Snowboard", time: "12 mins ago" }
    ]
  });
}
