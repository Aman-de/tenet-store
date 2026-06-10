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

async function main() {
    console.log("Fetching all products from Sanity to clean up discount tags...");
    const query = `*[_type == "product"] { _id, title, price, originalPrice }`;
    const products = await client.fetch(query);
    
    console.log(`Found ${products.length} products total.`);
    
    let discountedCount = 0;
    let regularCount = 0;
    
    for (const p of products) {
        // Only keep discount for roughly 15% of products
        const shouldDiscount = Math.random() < 0.15;
        
        if (shouldDiscount) {
            // Keep or set a discount
            let origPrice = p.originalPrice;
            if (!origPrice || origPrice <= p.price) {
                // If it didn't have one, make it ~25-40% higher
                origPrice = Math.round(p.price * (1 + (Math.random() * 0.15 + 0.2)));
            }
            
            console.log(`🏷️  KEEPING DISCOUNT: "${p.title}" -> Price: ₹${p.price}, Original: ₹${origPrice}`);
            await client.patch(p._id).set({ originalPrice: origPrice }).commit();
            discountedCount++;
        } else {
            // Remove the discount tag entirely by unsetting originalPrice
            console.log(`✨ REMOVING DISCOUNT: "${p.title}" -> Price: ₹${p.price} (No discount badge)`);
            await client.patch(p._id).unset(['originalPrice']).commit();
            regularCount++;
        }
    }
    
    console.log(`\nCleanup complete!`);
    console.log(`- Products without discount tags: ${regularCount}`);
    console.log(`- Products with active discount tags (15%): ${discountedCount}`);
}

main().catch(console.error);
