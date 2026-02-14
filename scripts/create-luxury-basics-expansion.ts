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

// Paths to the generated images
const ARTIFACTS_DIR = '/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0';

const IMAGES = {
    hoodie: {
        black: path.join(ARTIFACTS_DIR, 'heavyweight_hoodie_black_flat_1771028111881.png'),
        grey: path.join(ARTIFACTS_DIR, 'heavyweight_hoodie_grey_flat_1771028125055.png'),
    },
    polo: {
        cream: path.join(ARTIFACTS_DIR, 'knit_polo_cream_flat_v2_1771028149807.png'),
        navy: path.join(ARTIFACTS_DIR, 'knit_polo_navy_flat_v2_1771028167164.png'),
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
        title: "The Heavyweight Hoodie",
        price: 3499,
        originalPrice: 4999,
        category: "knitwear",
        gender: "man",
        description: "Constructed from ultra-heavy 500 GSM loopback cotton fleece. Featuring a double-lined hood and a structured fit that holds its shape. No drawstrings for a clean, minimalist silhouette.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL", "XXL"],
        variants: [
            { colorName: "Jet Black", colorHex: "#000000", imagePath: IMAGES.hoodie.black },
            { colorName: "Heather Grey", colorHex: "#808080", imagePath: IMAGES.hoodie.grey },
        ]
    },
    {
        title: "The Textured Knit Polo",
        price: 2899,
        originalPrice: 3999,
        category: "knitwear",
        gender: "man",
        description: "A sophisticated take on casual. Knit from a premium cotton-silk blend with a distinct waffle texture. The open johnny collar adds a relaxed elegance perfect for evening layering.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Rich Cream", colorHex: "#F5F5DC", imagePath: IMAGES.polo.cream },
            { colorName: "Deep Navy", colorHex: "#000080", imagePath: IMAGES.polo.navy },
        ]
    }
];

async function main() {
    console.log('Starting creation of Luxury Basics Expansion...');

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
                stock: 75
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

    console.log('Expansion complete!');
}

main().catch(console.error);
