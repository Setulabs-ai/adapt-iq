import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.SHOPIFY_API_KEY,
    keyLength: process.env.SHOPIFY_API_KEY?.length || 0,
    prefix: process.env.SHOPIFY_API_KEY?.substring(0, 4) || "none",
    host: process.env.HOST || "none"
  });
}
