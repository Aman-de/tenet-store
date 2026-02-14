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

const PRODUCT_TITLE = "Vintage Wash Selvedge Denim";

async function main() {
    console.log(`Searching for product: "${PRODUCT_TITLE}"...`);

    // Find product
    const query = `*[_type == "product" && title == $title][0]._id`;
    const productId = await client.fetch(query, { title: PRODUCT_TITLE });

    if (!productId) {
        console.error(`Product "${PRODUCT_TITLE}" not found.`);
        return;
    }

    console.log(`Found product ID: ${productId}. Deleting...`);

    // Delete product
    try {
        await client.delete(productId);
        console.log(`✅ Successfully deleted "${PRODUCT_TITLE}" (${productId}).`);
    } catch (err) {
        console.error(`❌ Failed to delete product:`, err);
    }
}

main().catch(console.error);
