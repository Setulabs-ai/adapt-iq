import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const body = await request.json();
    const cartItems = body.items || [];

    if (!storeId || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing storeId or empty cart" }, { status: 400 });
    }

    // Check if feature is enabled
    const { data: config } = await supabase
      .from('store_configs')
      .select('feature_cart_upsells')
      .eq('store_id', storeId)
      .single();

    if (!config || config.feature_cart_upsells === false) {
      return NextResponse.json({ products: [], title: "" });
    }

    // Fetch catalog
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId);

    if (error || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    const cartProductIds = cartItems.map((item: any) => item.product_id?.toString());
    const cartHandles = cartItems.map((item: any) => item.handle?.toString());
    
    // Extract info about cart items for AI context
    const cartContext = cartItems.map((item: any) => ({
      title: item.title,
      price: item.price,
      handle: item.handle
    }));

    // Filter out items already in the cart from the catalog sent to AI
    // We check by product_id if available, or handle
    const catalogContext = dbProducts
      .filter(p => !cartProductIds.includes(p.id) && !cartHandles.includes(p.handle))
      .map(p => ({ id: p.id, title: p.title, tags: p.tags, product_type: p.product_type }));

    if (catalogContext.length === 0) {
      return NextResponse.json({ products: [], title: "" });
    }

    const prompt = `
You are an expert e-commerce cross-selling AI. 
The customer has the following items in their shopping cart:
${JSON.stringify(cartContext, null, 2)}

Here is the store's available product catalog (excluding what they already have):
${JSON.stringify(catalogContext, null, 2)}

Analyze the customer's entire basket and deduce their intent or activity. 
Select EXACTLY 2 highly complementary items from the catalog that they should add to their order before checking out (e.g., batteries, accessories, matching items). Do NOT recommend items that compete with what they are already buying.

Return ONLY a raw JSON array of the 2 product IDs you selected, like this: ["id1", "id2"]. No markdown, no explanations.
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content?.trim() || "[]";
    let recIds = [];
    try {
      recIds = JSON.parse(content);
    } catch (e) {
      console.error("[AI Cart Upsell] Failed to parse JSON:", content);
      return NextResponse.json({ error: "AI response error" }, { status: 500 });
    }

    const recommendedProducts = recIds
      .map((id: string) => dbProducts.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({
      title: "Don't Forget These!",
      products: recommendedProducts
    });

  } catch (err: any) {
    console.error("[Cart Upsell] Error:", err.message);
    
    // Graceful fallback to ensure the UI NEVER breaks or shows a 500 error
    try {
      const { searchParams } = new URL(request.url);
      const storeId = searchParams.get('storeId');
      const body = await request.json().catch(() => ({}));
      const cartItems = body.items || [];
      const cartProductIds = cartItems.map((item: any) => item.product_id?.toString());
      
      const { data: dbProducts } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId);
        
      if (dbProducts) {
        const fallbackProducts = dbProducts
          .filter(p => !cartProductIds.includes(p.id))
          .slice(0, 2);
          
        if (fallbackProducts.length > 0) {
          return NextResponse.json({
            title: "Don't Forget These!",
            products: fallbackProducts
          });
        }
      }
    } catch (fallbackErr) {
      // Ignore fallback errors
    }
    
    return NextResponse.json({ products: [] });
  }
}
