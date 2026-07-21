import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getSessionStoreId } from '@/lib/auth';

export async function GET(request: Request) {
  const storeId = await getSessionStoreId();

  if (!storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const ctr = views ? ((clicks || 0) / views * 100).toFixed(1) : "0.0";
  const revenueLift = (clicks || 0) * 3.5;

  const chartData = [
    {
      date: 'Today',
      views: views || 0,
      clicks: clicks || 0,
    }
  ];

  const viewTrend = "+0.0%";
  const clickTrend = "+0.0%";
  const ctrTrend = "+0.0%";
  const revTrend = "+0.0%";

  return NextResponse.json({
    views: views || 0,
    clicks: clicks || 0,
    ctr: ctr + '%',
    revenueLift: "$" + revenueLift.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    trends: {
      views: viewTrend,
      clicks: clickTrend,
      ctr: ctrTrend,
      revenueLift: revTrend
    },
    chartData,
    recentEvents: (recentEvents || []).map(e => ({
      event: e.event_type,
      product: e.product_id || 'Unknown',
      time: new Date(e.created_at).toLocaleTimeString()
    }))
  });
}
