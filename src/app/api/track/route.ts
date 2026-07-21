import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { storeId, event, data } = await request.json();
    console.log(`[TRACK API] Store: ${storeId} | Event: ${event} | Data:`, data);
    
    if (storeId && event) {
      // Insert into analytics table asynchronously
      await supabase.from('analytics').insert([
        {
          store_id: storeId,
          event_type: event,
          product_id: data?.productId || null
        }
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
