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
    console.log("Fetching all products from Sanity to swap images...");
    const query = `*[_type == "product"] { _id, title, images }`;
    const products = await client.fetch(query);
    
    console.log(`Found ${products.length} products total.`);
    
    let updatedCount = 0;
    
    for (const p of products) {
        if (p.images && p.images.length >= 2) {
            // Swap images[0] and images[1]
            const temp = p.images[0];
            p.images[0] = p.images[1];
            p.images[1] = temp;

            try {
                await client.patch(p._id)
                    .set({ images: p.images })
                    .commit();
                console.log(`Swapped images for: ${p.title}`);
                updatedCount++;
            } catch (err) {
                console.error(`Failed to update ${p.title}:`, err);
            }
        }
    }
    
    console.log(`Successfully swapped images for ${updatedCount} products.`);
}

main().catch(console.error);
