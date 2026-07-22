import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  if (!storeId) {
    return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('store_configs')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Store config not found" }, { status: 404 });
  }

  // Map flat DB structure back to nested config object for the frontend
  const config = {
    storeName: data.store_name,
    features: {
      adaptive: data.feature_adaptive ?? true,
      recommendations: data.feature_recommendations,
      bundles: data.feature_bundles,
      search: data.feature_search
    },
    theme: {
      primaryColor: data.theme_primary_color
    },
    theme_config: data.theme_config || {
      primaryColor: "#7c6dfa",
      borderRadius: "16",
      layout: "grid"
    }
  };

  return NextResponse.json(config);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const storeId = body.storeId;
    const updates = body.config;

    if (!storeId) return NextResponse.json({ error: "Missing storeId" }, { status: 400 });

    // Build the update object based on what was passed
    const dbUpdates: any = {};
    if (updates.theme?.primaryColor) dbUpdates.theme_primary_color = updates.theme.primaryColor;
    if (updates.features?.recommendations !== undefined) dbUpdates.feature_recommendations = updates.features.recommendations;
    if (updates.features?.bundles !== undefined) dbUpdates.feature_bundles = updates.features.bundles;
    if (updates.features?.search !== undefined) dbUpdates.feature_search = updates.features.search;
    if (updates.theme_config) dbUpdates.theme_config = updates.theme_config;

    const { data, error } = await supabase
      .from('store_configs')
      .update(dbUpdates)
      .eq('store_id', storeId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to update store config" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
