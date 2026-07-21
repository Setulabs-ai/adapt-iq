import { NextResponse } from 'next/server';
import { mockStoreConfig } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  if (!storeId || !mockStoreConfig[storeId]) {
    return NextResponse.json({ error: "Store config not found" }, { status: 404 });
  }

  return NextResponse.json(mockStoreConfig[storeId]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const storeId = body.storeId;
    const updates = body.config;

    if (!mockStoreConfig[storeId]) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    mockStoreConfig[storeId] = {
      ...mockStoreConfig[storeId],
      ...updates,
      features: { ...mockStoreConfig[storeId].features, ...(updates.features || {}) },
      theme: { ...mockStoreConfig[storeId].theme, ...(updates.theme || {}) }
    };

    return NextResponse.json({ success: true, config: mockStoreConfig[storeId] });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
