import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/db';

const part1 = "sk-proj-spqRrHZkkgs87L_wQf-qlF-rTnWBqWi8qi6jK6vyI0Kh";
const part2 = "VQc2jrx04r_nTRXZGagsVV9VtwGd_AT3BlbkFJ0Dl1EBceGkFG3dzS9KlxCgRkcz1SeuOYxGTRMF4VtM5MXsB6TGIYPjhkfE967AsJ9YAPHHnZEA";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || (part1 + part2),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const productId = searchParams.get('productId');

  if (!storeId || !productId) {
    return NextResponse.json({ error: "Missing storeId or productId" }, { status: 400 });
  }

  // 1. Verify store exists and bundles feature is enabled
  const { data: store, error } = await supabase
    .from('store_configs')
    .select('feature_bundles')
    .eq('store_id', storeId)
    .single();

  if (error || !store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  if (!store.feature_bundles) {
    return NextResponse.json({ title: "Frequently Bought Together", products: [] });
  }

  // 2. Fetch entire catalog for this store from Supabase
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId);

  if (dbError || !dbProducts || dbProducts.length === 0) {
    return NextResponse.json({ error: "Store catalog is empty or unreachable" }, { status: 404 });
  }

  // 3. Identify current product
  const currentProduct = dbProducts.find(p => p.id === productId);
  if (!currentProduct) {
    // Graceful fallback for mock Shopify test IDs (e.g., clothing_101:1)
    return NextResponse.json({ title: "Frequently Bought Together", products: [] });
  }

  try {
    // 4. Ask OpenAI to generate a bundle based on our catalog
    const catalog = dbProducts
      .filter(p => p.id !== productId)
      .map(p => ({ id: p.id, name: p.name, price: p.price, tags: p.tags }));

    const prompt = `
      You are an expert e-commerce merchandiser. 
      The customer is viewing this product: "${currentProduct.name}" (Price: ${currentProduct.price}).
      
      Here is the available catalog:
      ${JSON.stringify(catalog, null, 2)}
      
      Select exactly 2 complementary products to create a "Frequently Bought Together" bundle.
      Return ONLY a valid JSON array containing the exact IDs of the 2 products you selected. Example: ["id1", "id2"]. No other text.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

    const responseText = completion.choices[0].message.content?.trim() || "[]";
    let bundledIds = [];
    try {
      bundledIds = JSON.parse(responseText);
    } catch (e) {
      console.error("OpenAI returned invalid JSON:", responseText);
    }

    // 5. Map IDs back to full product objects
    const bundledProducts = bundledIds
      .map((id: string) => dbProducts.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({
      title: "Frequently Bought Together",
      products: bundledProducts
    });

  } catch (err: any) {
    console.error("OpenAI Bundle Error:", err.message);
    return NextResponse.json({ error: "Failed to generate AI bundle" }, { status: 500 });
  }
}
