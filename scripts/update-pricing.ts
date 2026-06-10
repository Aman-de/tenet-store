import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

function getRealisticPrice(category: string, title: string): { price: number, originalPrice: number } {
    const cat = (category || "").toLowerCase();
    const name = (title || "").toLowerCase();
    
    // PREMIUM: 4,999 - 9,999 (previously 35k - 75k)
    if (cat.includes('jacket') || cat.includes('outerwear') || cat.includes('suit') || cat.includes('blazer') || name.includes('cashmere') || name.includes('leather') || name.includes('evening') || name.includes('trench')) {
        const base = Math.floor(Math.random() * (10 - 5 + 1) + 5) * 1000;
        const discountPercent = Math.random() > 0.5 ? 0.2 : 0;
        const price = base - 10;
        const originalPrice = discountPercent > 0 ? base + Math.floor(base * discountPercent) : price;
        return { price, originalPrice };
    }
    
    // MID: 1,999 - 4,999 (previously 12k - 28k)
    if (cat.includes('shirt') || cat.includes('trouser') || cat.includes('knit') || cat.includes('pant') || cat.includes('set') || cat.includes('footwear') || cat.includes('lounge') || name.includes('oxford') || name.includes('linen') || name.includes('sneaker') || name.includes('boot')) {
        const base = Math.floor(Math.random() * (5 - 2 + 1) + 2) * 1000;
        const discountPercent = Math.random() > 0.5 ? 0.15 : 0;
        const price = base - 10;
        const originalPrice = discountPercent > 0 ? base + Math.floor(base * discountPercent) : price;
        return { price, originalPrice };
    }
    
    // STANDARD: 999 - 1,999 (previously 3k - 9k)
    const base = Math.floor(Math.random() * (2 - 1 + 1) + 1) * 1000;
    const discountPercent = Math.random() > 0.5 ? 0.25 : 0;
    const price = base - 10;
    const originalPrice = discountPercent > 0 ? base + Math.floor(base * discountPercent) : price;
    return { price, originalPrice };
}

async function main() {
    console.log("Fetching all products to update pricing...");
    const products = await client.fetch(`*[_type == "product"] { _id, title, category, price, originalPrice }`);
    
    console.log(`Found ${products.length} products to potentially update.`);
    let updatedCount = 0;

    for (const product of products) {
        const { price, originalPrice } = getRealisticPrice(product.category, product.title);
        
        console.log(`Updating: "${product.title}" (${product.category}) -> ₹${price}`);
        
        await client.patch(product._id)
            .set({ price: price, originalPrice: originalPrice })
            .commit();
            
        updatedCount++;
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} products with realistic tiered pricing.`);
}

main().catch(console.error);
