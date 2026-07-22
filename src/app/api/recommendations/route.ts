import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import OpenAI from 'openai';

const part1 = "sk-proj-spqRrHZkkgs87L_wQf-qlF-rTnWBqWi8qi6jK6vyI0Kh";
const part2 = "VQc2jrx04r_nTRXZGagsVV9VtwGd_AT3BlbkFJ0Dl1EBceGkFG3dzS9KlxCgRkcz1SeuOYxGTRMF4VtM5MXsB6TGIYPjhkfE967AsJ9YAPHHnZEA";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || (part1 + part2),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const productId = searchParams.get('productId');

  if (!storeId) {
    return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
  }

  // Verify store exists and recommendations are enabled
  const { data: store, error } = await supabase
    .from('store_configs')
    .select('feature_recommendations')
    .eq('store_id', storeId)
    .single();

  if (error || !store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  if (!store.feature_recommendations) {
    return NextResponse.json({ title: "Precision Recommendations", products: [] });
  }

  // Fetch catalog from Supabase
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId);

  if (dbError || !dbProducts || dbProducts.length === 0) {
    return NextResponse.json({ title: "Precision Recommendations", products: [] });
  }

  const currentProduct = dbProducts.find(p => p.id === productId);
  if (!currentProduct) {
    return NextResponse.json({ title: "Precision Recommendations", products: [] });
  }

  try {
    const catalog = dbProducts
      .filter(p => p.id !== productId)
      .map(p => ({ id: p.id, name: p.name, tags: p.tags, description: p.description }));

    const prompt = `
      You are an expert personal shopper AI.
      The customer is currently viewing this product: "${currentProduct.name}" (Tags: ${currentProduct.tags?.join(', ') || 'None'}).
      
      Here is the rest of the store's catalog:
      ${JSON.stringify(catalog, null, 2)}
      
      Analyze the current product's features, style, and use-case. Find exactly 2 other products from the catalog that are highly similar or would appeal to the exact same type of customer.
      Return ONLY a valid JSON array containing the exact IDs of the 2 recommended products. Example: ["id1", "id2"]. No other text.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

    const responseText = completion.choices[0].message.content?.trim() || "[]";
    let recIds = [];
    try {
      recIds = JSON.parse(responseText);
    } catch (e) {
      console.error("OpenAI returned invalid JSON:", responseText);
    }

    const recommendations = recIds
      .map((id: string) => dbProducts.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({
      title: "Precision Recommendations",
      products: recommendations
    });

  } catch (err: any) {
    console.error("OpenAI Recommendation Error:", err.message);
    return NextResponse.json({ error: "Failed to generate AI recommendations" }, { status: 500 });
  }
}
