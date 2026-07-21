import { NextResponse } from 'next/server';

// Placeholder OpenAI integration
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const intent = searchParams.get('intent') || 'general';

  // In the real version, we will pass this intent to OpenAI along with the merchant's catalog
  // and ask OpenAI to generate a contextualized headline, subtext, and featured product.

  let adaptiveData = {
    headline: "Welcome to our Store",
    subtext: "Discover the best gear for your next adventure.",
    primaryColor: "#7c6dfa"
  };

  if (intent === 'snowboarder') {
    adaptiveData = {
      headline: "Dominate the Slopes This Winter",
      subtext: "Pro-grade snowboards built for aggressive carving and maximum air.",
      primaryColor: "#3b82f6" // Blue
    };
  } else if (intent === 'eco') {
    adaptiveData = {
      headline: "Sustainable Winter Gear",
      subtext: "Zero-emission manufacturing. 100% recycled materials.",
      primaryColor: "#10b981" // Green
    };
  } else if (intent === 'budget') {
    adaptiveData = {
      headline: "Huge Winter Clearance Sale",
      subtext: "Up to 60% off premium snowboards. While supplies last.",
      primaryColor: "#ef4444" // Red
    };
  }

  // Simulate OpenAI network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(adaptiveData);
}
