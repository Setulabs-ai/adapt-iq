const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ==========================================
// MOCK DATABASE
// ==========================================

const mockStoreConfig = {
  "store_123": {
    storeName: "Demo Shopify Store",
    features: {
      recommendations: true,
      search: false,
      bundles: true
    },
    theme: {
      primaryColor: "#7c6dfa"
    }
  }
};

const mockProducts = [
  { id: "9336993317079", name: "The Collection Snowboard: Liquid", price: "$749.95", image: "https://placehold.co/400x400/eeeeee/333333?text=Snowboard+Liquid", tags: ["Snowboard", "Liquid"] },
  { id: "9336993284311", name: "The Collection Snowboard: Oxygen", price: "$749.95", image: "https://placehold.co/400x400/eeeeee/333333?text=Snowboard+Oxygen", tags: ["Snowboard", "Oxygen"] },
  { id: "9336993251543", name: "The 3p Fulfilled Snowboard", price: "$699.00", image: "https://placehold.co/400x400/eeeeee/333333?text=3p+Snowboard", tags: ["Snowboard"] }
];

// In a real app, this would be computed by AI based on the current product
const mockRecommendations = {
  "9336993317079": ["9336993284311", "9336993251543"], // If viewing Liquid, recommend Oxygen and 3p
  "9336993284311": ["9336993317079", "9336993251543"], // If viewing Oxygen, recommend Liquid and 3p
  "9336993251543": ["9336993317079", "9336993284311"]  // If viewing 3p, recommend Liquid and Oxygen
};

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Get Store Config
app.get('/api/config', (req, res) => {
  const storeId = req.query.storeId;
  const config = mockStoreConfig[storeId];
  
  if (!config) {
    return res.status(404).json({ error: "Store not found" });
  }
  
  res.json(config);
});

// 2. Get Recommendations
app.get('/api/recommendations', (req, res) => {
  const storeId = req.query.storeId;
  const productId = req.query.productId;
  
  if (!mockStoreConfig[storeId]) {
    return res.status(404).json({ error: "Store not found" });
  }

  // Find recommended product IDs
  const recIds = mockRecommendations[productId] || [];
  
  // Map IDs back to full product objects
  const recommendations = recIds.map(id => mockProducts.find(p => p.id === id));
  
  res.json({
    title: "Precision Recommendations",
    products: recommendations
  });
});

// 3. Update Store Config
app.post('/api/config', (req, res) => {
  const storeId = req.body.storeId;
  const updates = req.body.config;
  
  if (!mockStoreConfig[storeId]) {
    return res.status(404).json({ error: "Store not found" });
  }

  // Deep merge updates
  mockStoreConfig[storeId] = {
    ...mockStoreConfig[storeId],
    ...updates,
    features: { ...mockStoreConfig[storeId].features, ...(updates.features || {}) },
    theme: { ...mockStoreConfig[storeId].theme, ...(updates.theme || {}) }
  };
  
  res.json({ success: true, config: mockStoreConfig[storeId] });
});

// 4. Get Mock Analytics
app.get('/api/stats', (req, res) => {
  const storeId = req.query.storeId;
  if (!mockStoreConfig[storeId]) {
    return res.status(404).json({ error: "Store not found" });
  }

  // Generate some realistic-looking mock data for the dashboard
  res.json({
    views: 12450,
    clicks: 3840,
    ctr: "30.8%",
    revenueLift: "$4,250",
    recentEvents: [
      { event: "recommendation_click", product: "The Collection Snowboard: Oxygen", time: "2 mins ago" },
      { event: "page_view", product: "The Collection Snowboard: Liquid", time: "5 mins ago" },
      { event: "recommendation_click", product: "The 3p Fulfilled Snowboard", time: "12 mins ago" }
    ]
  });
});

// 5. Track Event (Analytics)
app.post('/api/track', (req, res) => {
  const { storeId, event, data } = req.body;
  console.log(`[TRACK] Store: ${storeId} | Event: ${event} | Data:`, data);
  // In a real app, we would save this to Supabase/PostgreSQL
  res.json({ success: true });
});

// ==========================================
// SERVER START
// ==========================================
app.listen(PORT, () => {
  console.log(`AdaptIQ Backend API running at http://localhost:${PORT}`);
});
