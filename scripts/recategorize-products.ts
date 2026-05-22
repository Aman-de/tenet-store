import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing project credentials in env config.');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const mappings: Record<string, string> = {
    // Shorts
    "the-amalfi-day-edit": "shorts",
    "the-st-tropez-promenade-edit": "shorts",
    "the-hamptons-weekend-edit": "shorts",
    "the-maldives-resort-edit": "shorts",
    "the-urban-explorer-edit": "shorts",

    // Swimwear
    "the-mykonos-day-club-edit": "swimwear",
    "the-sunset-swim-edit": "swimwear",

    // Sets
    "the-riviera-retreat": "sets",
    "the-amalfi-aperitivo": "sets",
    "the-aegean-odyssey-edit": "sets",
    "the-lake-como-villa-edit": "sets",
    "the-cabana-terry-set": "sets",

    // Outerwear
    "the-highland-estate-edit": "outerwear",
    "the-aspen-chalet-edit": "outerwear",

    // Shirts
    "the-venetian-gondola-edit": "shirts",
    "the-bali-bamboo-edit": "shirts",
    "the-riviera-resort-shirt": "shirts",
    "the-amalfi-linen-popover": "shirts"
};

async function main() {
    console.log('🚀 Initiating recategorization of 18 key products...');

    for (const [slug, newCategory] of Object.entries(mappings)) {
        console.log(`♻️ Processing slug: "${slug}" ➔ New Category: "${newCategory}"`);

        try {
            // Find product by slug
            const query = `*[_type == "product" && slug.current == $slug][0]`;
            const prod = await client.fetch(query, { slug });

            if (!prod) {
                console.warn(`   ⚠️ Product with slug "${slug}" not found in Sanity. Skipping...`);
                continue;
            }

            console.log(`   Found Product: "${prod.title}" (Current Category: "${prod.category}")`);

            if (prod.category === newCategory) {
                console.log(`   ✅ Category is already "${newCategory}". No update needed.`);
                continue;
            }

            // Patch the category
            await client.patch(prod._id)
                .set({ category: newCategory })
                .commit();

            console.log(`   ✨ Successfully updated category to "${newCategory}" for "${prod.title}"`);
        } catch (err) {
            console.error(`   ❌ Failed to update slug "${slug}":`, err);
        }
    }

    console.log('🎉 Product recategorization script execution complete!');
}

main().catch(console.error);
