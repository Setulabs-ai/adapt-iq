import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase, mockProducts } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const query = searchParams.get('query');

  if (!storeId || !query) {
    return NextResponse.json({ error: "Missing storeId or query" }, { status: 400 });
  }

  // 1. Verify store exists and search feature is enabled
  const { data: store, error } = await supabase
    .from('store_configs')
    .select('feature_search')
    .eq('store_id', storeId)
    .single();

  if (error || !store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  if (!store.feature_search) {
    return NextResponse.json({ results: [] });
  }

  try {
    // 2. Ask OpenAI to perform semantic search across our catalog
    const catalog = Object.values(mockProducts).map(p => ({ id: p.id, name: p.name }));

    const prompt = `
      You are an AI Search Engine for an e-commerce store.
      The user searched for: "${query}".
      
      Here is the available catalog:
      ${JSON.stringify(catalog, null, 2)}
      
      Find the top 1 to 3 products that best match the user's intent. Even if they use slang, synonyms, or broad terms, find the most relevant items.
      Return ONLY a valid JSON array containing the exact IDs of the matching products. Example: ["id1", "id2"]. No other text.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.1,
    });

    const responseText = completion.choices[0].message.content?.trim() || "[]";
    let matchedIds = [];
    try {
      matchedIds = JSON.parse(responseText);
    } catch (e) {
      console.error("OpenAI returned invalid JSON:", responseText);
    }

    // 3. Map IDs back to full product objects
    const matchedProducts = matchedIds
      .map((id: string) => mockProducts[id])
      .filter(Boolean);

    return NextResponse.json({
      results: matchedProducts
    });

  } catch (err: any) {
    console.error("OpenAI Search Error:", err.message);
    return NextResponse.json({ error: "Failed to perform AI search" }, { status: 500 });
  }
}
