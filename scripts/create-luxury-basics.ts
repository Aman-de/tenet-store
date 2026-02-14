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

// Paths to the generated images in the artifacts directory
// Note: These paths need to be precise. I will use the known paths from the generation step.
const ARTIFACTS_DIR = '/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0';

const IMAGES = {
    tee: {
        black: path.join(ARTIFACTS_DIR, 'signature_tee_black_flat_1771027847447.png'),
        white: path.join(ARTIFACTS_DIR, 'signature_tee_white_flat_1771027863508.png'),
    },
    shirt: {
        navy: path.join(ARTIFACTS_DIR, 'daily_oxford_navy_flat_1771027880548.png'),
        sand: path.join(ARTIFACTS_DIR, 'daily_oxford_sand_flat_1771027896268.png'),
    }
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

const PRODUCTS = [
    {
        title: "The Signature Tee",
        price: 1299,
        originalPrice: 1999,
        category: "shirting",
        gender: "man",
        description: "The ultimate luxury basic. Cut from 260 GSM supima cotton with a mercerized finish for a silk-like touch. Features a tailored fit that sits perfectly at the waist and biceps. Minimalist, timeless, and built to last.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Onyx Black", colorHex: "#000000", imagePath: IMAGES.tee.black },
            { colorName: "Cloud White", colorHex: "#FFFFFF", imagePath: IMAGES.tee.white },
        ]
    },
    {
        title: "The Daily Oxford",
        price: 1899,
        originalPrice: 2499,
        category: "shirting",
        gender: "man",
        description: "Your everyday armor. Crafted from Italian linen-cotton blend that breathes with you. Garment-washed for instant comfort and a lived-in texture. The button-down collar rolls perfectly without a tie.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Midnight Navy", colorHex: "#000080", imagePath: IMAGES.shirt.navy },
            { colorName: "Dune Sand", colorHex: "#C2B280", imagePath: IMAGES.shirt.sand },
        ]
    }
];

async function main() {
    console.log('Starting creation of Luxury Basics...');

    for (const productDef of PRODUCTS) {
        console.log(`Processing ${productDef.title}...`);

        // 1. Process Variants
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedVariants: any[] = [];
        const allImages: string[] = [];

        for (const variant of productDef.variants) {
            console.log(`  - Processing variant: ${variant.colorName}`);

            const assetId = await uploadImage(variant.imagePath);
            const variantImageRefs = [];

            if (assetId) {
                variantImageRefs.push({
                    _type: 'image',
                    asset: { _type: "reference", _ref: assetId }
                });
                // Add to main images
                // @ts-ignore
                allImages.push(...variantImageRefs);
            }

            processedVariants.push({
                colorName: variant.colorName,
                colorHex: variant.colorHex,
                images: variantImageRefs,
                stock: 100
            });
        }

        // 2. Create Product Document
        const productDoc = {
            _type: 'product',
            title: productDef.title,
            slug: {
                _type: 'slug',
                current: productDef.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            },
            price: productDef.price,
            originalPrice: productDef.originalPrice,
            description: productDef.description,
            category: productDef.category,
            gender: productDef.gender,
            sizeType: productDef.sizeType,
            sizes: productDef.sizes,
            variants: processedVariants,
            images: allImages,
            discountLabel: (productDef.originalPrice && productDef.originalPrice > productDef.price)
                ? `SAVE ₹${productDef.originalPrice - productDef.price}`
                : undefined
        };

        try {
            const createdProduct = await client.create(productDoc);
            console.log(`✅ Created product: ${createdProduct.title} (${createdProduct._id})`);
        } catch (err) {
            console.error(`❌ Failed to create product ${productDef.title}:`, err);
        }
    }

    console.log('Creation complete!');
}

main().catch(console.error);
