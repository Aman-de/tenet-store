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
    console.log("Fetching all footwear products from Sanity...");
    const query = `*[_type == "product" && (category in ["footwear", "shoes"] || title match "*heel*" || title match "*boot*" || title match "*loafer*" || title match "*sneaker*")] { _id, title, category, price, originalPrice, gender }`;
    const products = await client.fetch(query);
    
    console.log(`Found ${products.length} footwear products.`);
    
    for (const p of products) {
        let price = 899;
        let originalPrice = 1499;
        
        const isWoman = p.gender === 'woman';
        const titleLower = p.title.toLowerCase();
        
        if (isWoman) {
            // Under 1000, few slightly above
            if (titleLower.includes('stiletto') || titleLower.includes('evening')) {
                price = Math.random() > 0.5 ? 999 : 1199; // Stilettos/heels slightly higher
                originalPrice = price === 999 ? 1699 : 1999;
            } else {
                price = Math.random() > 0.5 ? 799 : 899; // Loafers/boots under 1000
                originalPrice = price === 799 ? 1299 : 1499;
            }
        } else {
            // Men's footwear under or near 1000
            if (titleLower.includes('sneaker') || titleLower.includes('leather')) {
                price = Math.random() > 0.5 ? 999 : 1299;
                originalPrice = price === 999 ? 1699 : 1999;
            } else {
                price = Math.random() > 0.5 ? 899 : 999;
                originalPrice = price === 899 ? 1499 : 1699;
            }
        }
        
        console.log(`Updating: "${p.title}" (${p.gender}) -> price: ₹${price}, originalPrice: ₹${originalPrice}`);
        await client.patch(p._id).set({ price, originalPrice }).commit();
    }
    
    console.log("Footwear pricing updated successfully!");
}

main().catch(console.error);
