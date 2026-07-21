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

  // Count total page views
  const { count: views } = await supabase
    .from('analytics')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', storeId)
    .eq('event_type', 'page_view');

  // Count total recommendation clicks
  const { count: clicks } = await supabase
    .from('analytics')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', storeId)
    .eq('event_type', 'recommendation_click');

  // Fetch recent events
  const { data: recentEvents } = await supabase
    .from('analytics')
    .select('event_type, product_id, created_at')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .limit(3);

  const ctr = views ? ((clicks || 0) / views * 100).toFixed(1) + '%' : "0%";
  const revenueLift = "$" + ((clicks || 0) * 3.5).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return NextResponse.json({
    views: views || 0,
    clicks: clicks || 0,
    ctr,
    revenueLift,
    recentEvents: (recentEvents || []).map(e => ({
      event: e.event_type,
      product: e.product_id || 'Unknown',
      time: new Date(e.created_at).toLocaleTimeString()
    }))
  });
}
