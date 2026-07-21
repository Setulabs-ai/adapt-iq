import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdaptIQ — AI-Powered Adaptive Storefront for Shopify",
  description:
    "Give every visitor a personalised Shopify storefront. AdaptIQ uses AI to surface the right products, bundles, and search results for each shopper — boosting cart value, conversions, and repeat visits automatically.",
  keywords:
    "shopify personalisation, adaptive ecommerce, AI product recommendations, semantic search, intelligent merchandising, ecommerce AI, Shopify upsell",
  openGraph: {
    title: "AdaptIQ — AI-Powered Adaptive Storefront for Shopify",
    description:
      "Give every visitor a personalised Shopify storefront. Precision Recommendations, LiveStore Intelligence, and Semantic Search — deployed in under 15 minutes.",
    type: "website",
    url: "https://adaptiq.co",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdaptIQ — AI-Powered Adaptive Storefront for Shopify",
    description:
      "Give every visitor a personalised Shopify storefront — AI-powered, agency-ready, deployed in minutes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
