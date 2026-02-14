import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
});

const TITLES_TO_DELETE = [
    "Essential Heavyweight Tee",
    "Classic Pique Polo",
    "Breezy Linen Resort Shirt",
    "Everyday Chino Trouser"
];

async function main() {
    console.log(`Starting deletion of ${TITLES_TO_DELETE.length} products...`);

    for (const title of TITLES_TO_DELETE) {
        console.log(`Searching for product: "${title}"...`);

        // Find product
        const query = `*[_type == "product" && title == $title][0]._id`;
        const productId = await client.fetch(query, { title });

        if (!productId) {
            console.warn(`⚠️ Product "${title}" not found. Skipping.`);
            continue;
        }

        console.log(`Found product ID: ${productId}. Deleting...`);

        // Delete product
        try {
            await client.delete(productId);
            console.log(`✅ Successfully deleted "${title}" (${productId}).`);
        } catch (err) {
            console.error(`❌ Failed to delete product "${title}":`, err);
        }
    }
    console.log('Batch deletion complete.');
}

main().catch(console.error);
