import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { storeId, event, data } = await request.json();
    console.log(`[TRACK API] Store: ${storeId} | Event: ${event} | Data:`, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
