import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
});

const ARTIFACTS_DIR = '/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0';
const IMAGES = {
    sand: path.join(ARTIFACTS_DIR, 'gurkha_trouser_sand_detail_flat_1771035138655.png'),
    olive: path.join(ARTIFACTS_DIR, 'gurkha_trouser_olive_detail_flat_1771035216870.png'),
};

async function uploadImage(filePath: string) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            return null;
        }
        const buffer = fs.readFileSync(filePath);
        const asset = await client.assets.upload('image', buffer, {
            filename: path.basename(filePath),
        });
        return asset._id;
    } catch (error) {
        console.error(`Error uploading image ${filePath}:`, error);
        return null;
    }
}

async function main() {
    console.log('Updating images for "The Tailored Gurkha Trouser"...');

    // 1. Find Product
    const query = `*[_type == "product" && title == "The Tailored Gurkha Trouser"][0]`;
    const product = await client.fetch(query);

    if (!product) {
        console.error('❌ Product "The Tailored Gurkha Trouser" not found.');
        return;
    }
    console.log(`Found product: ${product._id}`);

    // 2. Upload New Images
    console.log('Uploading new specific images...');
    const sandAssetId = await uploadImage(IMAGES.sand);
    const oliveAssetId = await uploadImage(IMAGES.olive);

    if (!sandAssetId || !oliveAssetId) {
        console.error('❌ Failed to upload one or more images. Aborting.');
        return;
    }

    // 3. Construct Updated Variants
    const updatedVariants = product.variants.map((variant: any) => {
        if (variant.colorName.includes("Sand")) {
            return {
                ...variant,
                images: [{ _type: 'image', asset: { _type: "reference", _ref: sandAssetId } }]
            };
        }
        if (variant.colorName.includes("Olive")) {
            return {
                ...variant,
                images: [{ _type: 'image', asset: { _type: "reference", _ref: oliveAssetId } }]
            };
        }
        return variant;
    });

    // 4. Construct Updated Main Images (Combine all variant images)
    const updatedImages = updatedVariants.flatMap((v: any) => v.images);

    // 5. Patch Product
    try {
        await client.patch(product._id)
            .set({
                variants: updatedVariants,
                images: updatedImages
            })
            .commit();
        console.log('✅ Successfully updated Gurkha Trouser images.');
    } catch (err) {
        console.error('❌ Failed to patch product:', err);
    }
}

main().catch(console.error);
