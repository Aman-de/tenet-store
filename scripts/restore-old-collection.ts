import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing project credentials in env config.');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
});

// Category mapping helper
function mapCategory(originalCategory: string): string {
    const category = originalCategory.toLowerCase();
    switch (category) {
        case 'suits':
            return 'sets';
        case 'blazers':
            return 'jackets';
        default:
            return category; // e.g. knitwear remains knitwear, sets remains sets, outerwear remains outerwear
    }
}

async function main() {
    console.log('🚀 Initiating recovery of the 10 old outfit edits...');

    const backupPath = path.resolve(process.cwd(), 'backup-removed-products.json');
    if (!fs.existsSync(backupPath)) {
        console.error(`❌ Backup file not found at: ${backupPath}`);
        process.exit(1);
    }

    const backupProducts = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    console.log(`📦 Loaded ${backupProducts.length} products from backup.`);

    for (const prod of backupProducts) {
        const newCategory = mapCategory(prod.category);
        console.log(`♻️ Processing: "${prod.title}" (Category: ${prod.category} ➔ ${newCategory})`);

        // Prepare document for Sanity
        const doc: any = {
            _type: 'product',
            _id: prod._id, // Use the original ID
            title: prod.title,
            slug: prod.slug,
            price: prod.price,
            originalPrice: prod.originalPrice,
            description: prod.description,
            category: newCategory,
            gender: prod.gender || 'man',
            sizeType: prod.sizeType || 'clothing',
            sizes: prod.sizes || ['S', 'M', 'L', 'XL'],
            variants: prod.variants,
            imagePromptNote: prod.imagePromptNote,
            discountLabel: prod.originalPrice && prod.price ? `SAVE ₹${prod.originalPrice - prod.price}` : undefined
        };

        // If the variant stock is missing or low, initialize it
        if (doc.variants) {
            doc.variants = doc.variants.map((v: any) => ({
                ...v,
                stock: v.stock !== undefined ? v.stock : 45
            }));
        }

        try {
            // Check if product exists already
            const existing = await client.fetch(`*[_type == "product" && _id == $id][0]`, { id: prod._id });
            if (existing) {
                console.log(`   ⚠️ Document exists. Updating...`);
                await client.createOrReplace(doc);
            } else {
                console.log(`   ✅ Creating new document...`);
                await client.create(doc);
            }
            console.log(`   ✨ Successfully processed: "${prod.title}"`);
        } catch (err) {
            console.error(`   ❌ Failed to process "${prod.title}":`, err);
        }
    }

    console.log('🎉 Old collection restoration script execution complete!');
}

main().catch(console.error);
