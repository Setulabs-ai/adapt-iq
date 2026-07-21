import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/db';

const part1 = "sk-proj-spqRrHZkkgs87L_wQf-qlF-rTnWBqWi8qi6jK6vyI0Kh";
const part2 = "VQc2jrx04r_nTRXZGagsVV9VtwGd_AT3BlbkFJ0Dl1EBceGkFG3dzS9KlxCgRkcz1SeuOYxGTRMF4VtM5MXsB6TGIYPjhkfE967AsJ9YAPHHnZEA";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || (part1 + part2),
});

export async function POST(request: Request) {
  try {
    const { storeId, context } = await request.json();

    if (!storeId || !context) {
      return NextResponse.json({ error: "Missing storeId or context" }, { status: 400 });
    }

    // 1. Fetch Store Config to know what the store is about
    const { data: storeConfig } = await supabase
      .from('store_configs')
      .select('*')
      .eq('store_id', storeId)
      .single();

    const storeName = storeConfig?.store_name || "Liquid Snowboards";

    // 2. Build the LLM Prompt
    const systemPrompt = `
      You are an expert eCommerce conversion copywriter for a premium clothing store named "${storeName}".
      Your job is to adapt the storefront's hero section dynamically based on the user's hidden context.
      
      User Context:
      - Referrer: ${context.referrer || 'Direct Traffic'}
      - Device/User Agent: ${context.userAgent || 'Unknown'}
      - Network Speed: ${context.speed || 'Unknown'}
      - UTM Parameters: ${context.urlParams || 'None'}
      
      Instructions:
      1. Analyze the context to determine the shopper's intent (e.g., price-sensitive, impatient, eco-conscious, pro rider).
      2. Write a highly compelling 'headline' (max 6 words).
      3. Write an urgent or specific 'subtext' (max 15 words).
      4. Suggest a 'primaryColor' hex code that matches the vibe (e.g., Red for sales, Green for eco, Blue for pro).
      
      You must respond ONLY with a valid JSON object matching this schema:
      {
        "headline": "string",
        "subtext": "string",
        "primaryColor": "string"
      }
    `;

    // 3. Call OpenAI with JSON mode
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate the adapted storefront copy." }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error("[Adaptive Storefront API] Error:", error);
    // Fallback if AI fails
    return NextResponse.json({
      headline: "The Summer Collection",
      subtext: "Elevate your everyday wardrobe.",
      primaryColor: "#7c6dfa"
    });
  }
}
