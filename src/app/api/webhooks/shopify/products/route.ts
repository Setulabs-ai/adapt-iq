import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
    }

    const body = await request.json();

    // Map Shopify product payload to our Supabase schema
    const productData = {
      id: String(body.id),
      store_id: storeId,
      name: body.title,
      price: body.variants && body.variants.length > 0 ? `$${body.variants[0].price}` : null,
      image: body.image?.src || null,
      description: body.body_html || null,
      tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []
    };

    const { error } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'id,store_id' });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to sync product" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product synced successfully" });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
