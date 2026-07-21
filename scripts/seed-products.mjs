import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productsToInsert = [
  // Tops (Shirts, T-shirts, Jackets, Hoodies)
  { id: "clothing_101", store_id: "store_123", name: "Classic White Oxford Shirt", price: "$49.99", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop", description: "A timeless, crisp white oxford shirt perfect for business or casual wear. 100% cotton.", tags: ["clothing", "shirt", "tops", "cotton", "casual", "business"] },
  { id: "clothing_102", store_id: "store_123", name: "Navy Blue Essential T-Shirt", price: "$24.99", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop", description: "Ultra-soft, organic cotton t-shirt. The perfect everyday basic.", tags: ["clothing", "t-shirt", "tops", "cotton", "casual", "basic"] },
  { id: "clothing_103", store_id: "store_123", name: "Black Graphic Tee", price: "$29.99", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400&auto=format&fit=crop", description: "Streetwear inspired graphic t-shirt with a relaxed fit.", tags: ["clothing", "t-shirt", "tops", "streetwear", "graphic", "casual"] },
  { id: "clothing_104", store_id: "store_123", name: "Vintage Denim Jacket", price: "$89.99", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=400&auto=format&fit=crop", description: "Rugged and durable denim jacket with a classic vintage wash.", tags: ["clothing", "jacket", "outerwear", "denim", "vintage"] },
  { id: "clothing_105", store_id: "store_123", name: "Waterproof Windbreaker", price: "$79.99", image: "https://images.unsplash.com/photo-1544605963-7eb9272338c9?q=80&w=400&auto=format&fit=crop", description: "Lightweight, breathable windbreaker perfect for rainy days.", tags: ["clothing", "jacket", "outerwear", "waterproof", "activewear"] },
  { id: "clothing_106", store_id: "store_123", name: "Heavyweight Pullover Hoodie", price: "$59.99", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop", description: "Cozy fleece hoodie for maximum warmth and comfort.", tags: ["clothing", "hoodie", "sweatshirt", "tops", "winter", "cozy"] },
  { id: "clothing_107", store_id: "store_123", name: "Merino Wool Crewneck Sweater", price: "$99.99", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&auto=format&fit=crop", description: "Luxurious merino wool sweater that regulates temperature.", tags: ["clothing", "sweater", "tops", "wool", "winter", "premium"] },

  // Bottoms (Pants, Jeans, Shorts)
  { id: "clothing_201", store_id: "store_123", name: "Premium Selvedge Denim Jeans", price: "$129.99", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop", description: "High-quality, raw selvedge denim that fades beautifully over time.", tags: ["clothing", "pants", "bottoms", "denim", "jeans", "premium"] },
  { id: "clothing_202", store_id: "store_123", name: "Slim Fit Chino Pants", price: "$59.99", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&auto=format&fit=crop", description: "Versatile chino pants that can be dressed up or down. Stretch fabric.", tags: ["clothing", "pants", "bottoms", "chino", "casual", "business"] },
  { id: "clothing_203", store_id: "store_123", name: "Athletic Performance Joggers", price: "$49.99", image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=400&auto=format&fit=crop", description: "Moisture-wicking joggers for the gym or lounging at home.", tags: ["clothing", "pants", "bottoms", "joggers", "activewear", "gym"] },
  { id: "clothing_204", store_id: "store_123", name: "Summer Linen Shorts", price: "$39.99", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400&auto=format&fit=crop", description: "Breathable linen shorts, perfect for the beach or hot summer days.", tags: ["clothing", "shorts", "bottoms", "linen", "summer", "casual"] },
  { id: "clothing_205", store_id: "store_123", name: "Cargo Utility Pants", price: "$69.99", image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=400&auto=format&fit=crop", description: "Durable cargo pants with multiple pockets for everyday utility.", tags: ["clothing", "pants", "bottoms", "cargo", "streetwear", "utility"] },

  // Footwear
  { id: "clothing_301", store_id: "store_123", name: "Minimalist White Sneakers", price: "$89.99", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=400&auto=format&fit=crop", description: "Clean, low-profile leather sneakers that go with any outfit.", tags: ["clothing", "shoes", "footwear", "sneakers", "leather", "casual"] },
  { id: "clothing_302", store_id: "store_123", name: "Classic Leather Boots", price: "$149.99", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=400&auto=format&fit=crop", description: "Handcrafted leather boots built to last a lifetime.", tags: ["clothing", "shoes", "footwear", "boots", "leather", "winter", "premium"] },
  { id: "clothing_303", store_id: "store_123", name: "Performance Running Shoes", price: "$119.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop", description: "Lightweight, responsive cushioning for your daily runs.", tags: ["clothing", "shoes", "footwear", "sneakers", "activewear", "running"] },
  { id: "clothing_304", store_id: "store_123", name: "Canvas Slip-On Shoes", price: "$49.99", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=400&auto=format&fit=crop", description: "Easy on, easy off. The perfect lazy weekend shoe.", tags: ["clothing", "shoes", "footwear", "canvas", "casual", "summer"] },

  // Accessories
  { id: "clothing_401", store_id: "store_123", name: "Premium Leather Belt", price: "$34.99", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=400&auto=format&fit=crop", description: "Full-grain leather belt with a solid brass buckle.", tags: ["clothing", "accessories", "belt", "leather"] },
  { id: "clothing_402", store_id: "store_123", name: "Organic Cotton Ankle Socks (3-Pack)", price: "$14.99", image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=400&auto=format&fit=crop", description: "Soft, breathable ankle socks with arch support.", tags: ["clothing", "accessories", "socks", "cotton", "activewear"] },
  { id: "clothing_403", store_id: "store_123", name: "Merino Wool Beanie", price: "$24.99", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=400&auto=format&fit=crop", description: "Warm, itch-free merino wool beanie for the colder months.", tags: ["clothing", "accessories", "hat", "beanie", "winter", "wool"] },
  { id: "clothing_404", store_id: "store_123", name: "Classic Aviator Sunglasses", price: "$59.99", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop", description: "Polarized lenses with 100% UV protection and a timeless frame.", tags: ["clothing", "accessories", "sunglasses", "eyewear", "summer"] },
  { id: "clothing_405", store_id: "store_123", name: "Canvas Tote Bag", price: "$19.99", image: "https://images.unsplash.com/photo-1597633244018-80e9086c8717?q=80&w=400&auto=format&fit=crop", description: "Durable, eco-friendly tote bag for everyday carry.", tags: ["clothing", "accessories", "bag", "tote", "canvas"] },
  { id: "clothing_406", store_id: "store_123", name: "Cashmere Scarf", price: "$69.99", image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698e?q=80&w=400&auto=format&fit=crop", description: "Ultra-soft cashmere scarf for elegant winter warmth.", tags: ["clothing", "accessories", "scarf", "winter", "premium"] },
];

async function seedProducts() {
  console.log("Preparing to seed products to Supabase...");
  
  // 1. Delete existing products for store_123 to clean up old snowboards
  console.log("Deleting old product catalog...");
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('store_id', 'store_123');
    
  if (deleteError) {
    console.error("Failed to delete old products:", deleteError.message);
    return;
  }
  
  console.log("Old products cleared. Inserting new clothing catalog...");

  // 2. Insert new clothing products
  const { data, error } = await supabase
    .from('products')
    .upsert(productsToInsert, { onConflict: 'id,store_id' });

  if (error) {
    console.error("Failed to seed products:", error.message);
  } else {
    console.log(`Successfully seeded ${productsToInsert.length} clothing products!`);
  }
}

seedProducts();
