import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase, mockProducts } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

  // 2. Identify current product
  const currentProduct = Object.values(mockProducts).find(p => p.id === productId);
  if (!currentProduct) {
    return NextResponse.json({ error: "Product not found in catalog" }, { status: 404 });
  }

  try {
    // 3. Ask OpenAI to generate a bundle based on our catalog
    const catalog = Object.values(mockProducts)
      .filter(p => p.id !== productId)
      .map(p => ({ id: p.id, name: p.name, price: p.price }));

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
      model: "gpt-3.5-turbo",
      temperature: 0.2,
    });

    const responseText = completion.choices[0].message.content?.trim() || "[]";
    let bundledIds = [];
    try {
      bundledIds = JSON.parse(responseText);
    } catch (e) {
      console.error("OpenAI returned invalid JSON:", responseText);
    }

    // 4. Map IDs back to full product objects
    const bundledProducts = bundledIds
      .map((id: string) => (mockProducts as any)[id])
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
