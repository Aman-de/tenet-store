import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9zyx0aef',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function main() {
    console.log('🧹 Wiping all Gadget products from Sanity...');
    const existing = await client.fetch<Array<{ _id: string; title: string }>>(
        '*[_type == "product" && (category == "gadgets" || category == "electronics")]{_id, title}'
    );
    console.log(`Found ${existing.length} gadget products to disable/delete.`);
    for (const prod of existing) {
        try {
            await client.delete(prod._id);
            console.log(`  ❌ Deleted gadget product: "${prod.title}" (${prod._id})`);
        } catch (e) {
            console.error(`Failed to delete ${prod._id}:`, e);
        }
    }
    console.log('✅ All Gadget products have been successfully disabled from Sanity!');
}

main().catch(console.error);
