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
    console.log("Fetching all women's products from Sanity...");
    const query = `*[_type == "product" && gender == "woman"] { _id, title, "slug": slug.current, category }`;
    const products = await client.fetch(query);
    
    console.log(`Found ${products.length} women's products.`);
    
    for (const p of products) {
        const titleLower = p.title.toLowerCase();
        const slugLower = (p.slug || "").toLowerCase();
        
        let price = 899;
        let originalPrice = 1499;
        
        const isSilkOrPremium = titleLower.includes('silk') || titleLower.includes('lehenga') || titleLower.includes('saree') || slugLower.includes('silk') || slugLower.includes('lehenga') || slugLower.includes('saree');
        
        if (isSilkOrPremium) {
            // Premium silk items can reach more than 1200
            price = Math.random() > 0.5 ? 1299 : 1499;
            originalPrice = price === 1299 ? 1999 : 2499;
        } else {
            // Keep most other products around 899 or lower
            const roll = Math.random();
            if (roll < 0.2) {
                price = 799;
                originalPrice = 1299;
            } else if (roll < 0.8) {
                price = 899;
                originalPrice = 1499;
            } else {
                price = 999;
                originalPrice = 1699;
            }
        }
        
        console.log(`Updating Women's product: "${p.title}" -> Price: ₹${price}, Original: ₹${originalPrice}`);
        await client.patch(p._id).set({ price, originalPrice }).commit();
    }
    
    console.log("Women's pricing updated successfully!");
}

main().catch(console.error);
