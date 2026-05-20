import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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

const IMAGES = {
    amalfiPopover: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f/amalfi_popover_flat_1779246640817.png',
    tuscanTrousers: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f/tuscan_trousers_flat_1779246670578.png',
    rivieraShirt: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f/riviera_shirt_flat_1779246695628.png',
    heritagePolo: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f/heritage_polo_flat_1779246803183.png',
    chelseaLoafer: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f/chelsea_loafer_flat_1779246878425.png',
    voyagerDuffel: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f/voyager_duffel_flat_1779247010443.png'
};

const PRODUCTS = [
    {
        title: "The Amalfi Linen Popover",
        price: 3800,
        originalPrice: 4800,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "An olive green linen popover shirt with a relaxed camp collar. Cut from premium lightweight European linen, perfect for warm tropical weather. Pre-washed for maximum softness and drape.",
        variants: [
            { colorName: "Olive Green", colorHex: "#556B2F", imagePath: IMAGES.amalfiPopover }
        ]
    },
    {
        title: "Tuscan Drawstring Trousers",
        price: 4200,
        originalPrice: 5200,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Sand beige drawstring trousers, tailored with a relaxed waist and slightly tapered leg. Crafted from a breathable cotton-linen blend that holds its shape while keeping you cool.",
        variants: [
            { colorName: "Sand Beige", colorHex: "#C2B280", imagePath: IMAGES.tuscanTrousers }
        ]
    },
    {
        title: "The Riviera Resort Shirt",
        price: 3600,
        originalPrice: 4500,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Terracotta and cream vertical striped resort shirt, featuring an airy weave and a classic flat camp collar. The perfect companion for beach escapes and casual weekends.",
        variants: [
            { colorName: "Terracotta & Cream", colorHex: "#C05A46", imagePath: IMAGES.rivieraShirt }
        ]
    },
    {
        title: "The Heritage Structured Polo",
        price: 4900,
        originalPrice: 5900,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Aran cream long-sleeve waffle knit polo. Structured ribbed collar and three-button placket. Warm yet breathable, making it a year-round silent luxury staple.",
        variants: [
            { colorName: "Aran Cream", colorHex: "#FDFBF7", imagePath: IMAGES.heritagePolo }
        ]
    },
    {
        title: "The Chelsea Suede Loafer",
        price: 8500,
        originalPrice: 11000,
        category: "footwear",
        gender: "man",
        sizeType: "numeric",
        sizes: ["7", "8", "9", "10", "11"],
        description: "Handcrafted penny loafer in rich tobacco suede with authentic leather soles. Features an unlined design that immediately conforms to your foot for custom comfort.",
        variants: [
            { colorName: "Tobacco Suede", colorHex: "#8B5A2B", imagePath: IMAGES.chelseaLoafer }
        ]
    },
    {
        title: "The Voyager Leather Duffel",
        price: 15500,
        originalPrice: 18500,
        category: "accessories",
        gender: "unisex",
        sizeType: "onesize",
        sizes: [],
        description: "Full-grain cognac leather weekend travel bag, featuring brass hardware, double carrying handles, and an adjustable, padded shoulder strap. Perfectly sized for short business trips or weekend getaways.",
        variants: [
            { colorName: "Cognac Brown", colorHex: "#8B4513", imagePath: IMAGES.voyagerDuffel }
        ]
    }
];

async function uploadImage(filePath: string) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Image file not found: ${filePath}`);
            return null;
        }
        const buffer = fs.readFileSync(filePath);
        const asset = await client.assets.upload('image', buffer, {
            filename: path.basename(filePath),
        });
        return asset._id;
    } catch (error) {
        console.error(`❌ Error uploading image ${filePath}:`, error);
        return null;
    }
}

async function main() {
    console.log('🚀 Initiating Clean Luxury Seeding...');

    // 1. Delete dependent collections to prevent dangling reference errors
    console.log('🗑️ Wiping Order history and customer Reviews...');
    await client.delete({ query: '*[_type == "order"]' });
    await client.delete({ query: '*[_type == "review"]' });

    // 2. Unset products from collection maps
    console.log('🗑️ Unlinking products from collections...');
    await client.patch({ query: '*[_type == "collection" && defined(products)]' })
        .unset(['products'])
        .commit();

    // 3. Delete existing products
    console.log('🗑️ Deleting all previous products...');
    await client.delete({ query: '*[_type == "product"]' });
    console.log('✅ Old catalog cleared.');

    // 4. Create new products
    for (const productDef of PRODUCTS) {
        console.log(`📦 Processing product: ${productDef.title}...`);

        const processedVariants: any[] = [];
        const allImages: any[] = [];

        for (const variant of productDef.variants) {
            console.log(`   - Uploading image asset: ${variant.colorName}`);
            const assetId = await uploadImage(variant.imagePath);

            if (assetId) {
                const imgRef = {
                    _type: 'image',
                    asset: { _type: "reference", _ref: assetId }
                };
                allImages.push(imgRef);
                processedVariants.push({
                    colorName: variant.colorName,
                    colorHex: variant.colorHex,
                    images: [imgRef],
                    stock: 45
                });
            } else {
                processedVariants.push({
                    colorName: variant.colorName,
                    colorHex: variant.colorHex,
                    images: [],
                    stock: 45
                });
            }
        }

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
            discountLabel: `SAVE ₹${productDef.originalPrice - productDef.price}`
        };

        try {
            const created = await client.create(productDoc);
            console.log(`✅ Created product: ${created.title} (${created._id})`);
        } catch (err) {
            console.error(`❌ Failed to publish ${productDef.title}:`, err);
        }
    }

    console.log('✨ Clean Seeding complete! All product listings updated.');
}

main().catch(console.error);
