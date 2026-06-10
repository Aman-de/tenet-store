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
    console.log("Fetching products to rename 'Edit' to 'Set'...");
    const products = await client.fetch(`*[_type == "product" && title match "*Edit*"] { _id, title }`);
    
    console.log(`Found ${products.length} products to potentially update.`);
    let updatedCount = 0;

    for (const product of products) {
        if (product.title.includes('Edit')) {
            const newTitle = product.title.replace(/Edit/g, 'Set');
            console.log(`Renaming: "${product.title}" -> "${newTitle}"`);
            
            await client.patch(product._id)
                .set({ title: newTitle })
                .commit();
                
            updatedCount++;
        }
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} products.`);
}

main().catch(console.error);
