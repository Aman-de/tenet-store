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

// Mapping available images (reusing some due to generation capacity limits)
const IMAGES = {
    knit: {
        cream: path.join(ARTIFACTS_DIR, 'cable_knit_cream_flat_1771028542886.png'),
        navy: path.join(ARTIFACTS_DIR, 'cable_knit_navy_flat_v2_1771028568397.png'),
        charcoal: path.join(ARTIFACTS_DIR, 'quarter_zip_charcoal_flat_v2_1771028582947.png'),
    },
    trouser: {
        sand: path.join(ARTIFACTS_DIR, 'trouser_sand_flat_generic_1771028636473.png'),
    },
    outerwear: {
        navy: path.join(ARTIFACTS_DIR, 'harrington_navy_flat_generic_1771028651698.png'),
        olive: path.join(ARTIFACTS_DIR, 'chore_coat_olive_flat_generic_1771028667076.png'),
    }
};

async function uploadImage(filePath: string) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            return null; // Don't crash, just skip image
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
    // KNITWEAR
    {
        title: "The Heritage Cable Knit",
        price: 3899,
        originalPrice: 4999,
        category: "knitwear",
        gender: "man",
        description: "A timeless classic inspired by Irish fisherman sweaters. Knit from thick, 5-gauge merino wool for warmth and durability. Feature intricate cable patterns and ribbed trims.",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Aran Cream", colorHex: "#F5F5DC", imagePath: IMAGES.knit.cream },
            { colorName: "Deep Navy", colorHex: "#000080", imagePath: IMAGES.knit.navy },
        ]
    },
    {
        title: "The Quarter-Zip Pullover",
        price: 3499,
        originalPrice: 4499,
        category: "knitwear",
        gender: "man",
        description: "The ultimate layering piece. Crafted from a dense cotton-cashmere blend. Features a polished metal YKK zipper and a stand collar that looks sharp over a tee or oxford.",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Charcoal Grey", colorHex: "#36454F", imagePath: IMAGES.knit.charcoal },
            { colorName: "Jet Black", colorHex: "#000000", imagePath: IMAGES.knit.charcoal }, // Reusing Charcoal
        ]
    },

    // TROUSERS
    {
        title: "The Tailored Gurkha Trouser",
        price: 4999,
        originalPrice: 6999,
        category: "trousers",
        gender: "man",
        description: "Sartorial elegance meets military history. High-waisted with the signature double-buckle waistband closure. Cut from heavy cotton drill with single pleats for comfort and style.",
        sizes: ["30", "32", "34", "36"],
        variants: [
            { colorName: "Sand Beige", colorHex: "#C2B280", imagePath: IMAGES.trouser.sand },
            { colorName: "Olive Drab", colorHex: "#6B8E23", imagePath: IMAGES.trouser.sand }, // Reusing Sand
        ]
    },
    {
        title: "The Pleated Wool Trouser",
        price: 5499,
        originalPrice: 7999,
        category: "trousers",
        gender: "man",
        description: "Your go-to formal trouser. Made from Super 120s Italian wool flannel. Features a double-pleated front, side adjusters, and a tapered leg for a modern silhouette.",
        sizes: ["30", "32", "34", "36"],
        variants: [
            { colorName: "Heather Grey", colorHex: "#808080", imagePath: IMAGES.trouser.sand }, // Reusing Sand (Placeholder)
            { colorName: "Charcoal", colorHex: "#36454F", imagePath: IMAGES.trouser.sand }, // Reusing Sand (Placeholder)
        ]
    },

    // OUTERWEAR
    {
        title: "The Classic Harrington",
        price: 5999,
        originalPrice: 8999,
        category: "jackets",
        gender: "man",
        description: "An icon of British style. Water-resistant cotton blend shell with the signature tartan lining. Features a double-button funnel neck, raglan sleeves, and umbrella yoke back.",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Midnight Navy", colorHex: "#000080", imagePath: IMAGES.outerwear.navy },
            { colorName: "Stone Beige", colorHex: "#CDC9C9", imagePath: IMAGES.outerwear.navy }, // Reusing Navy
        ]
    },
    {
        title: "The Canvas Chore Coat",
        price: 4499,
        originalPrice: 6499,
        category: "jackets",
        gender: "man",
        description: "Workwear refined. Built from 12oz duck canvas that gets better with age. Features three patch pockets, reinforced elbows, and shank buttons. Unlined for year-round wear.",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Field Olive", colorHex: "#556B2F", imagePath: IMAGES.outerwear.olive },
            { colorName: "Workwear Tan", colorHex: "#D2B48C", imagePath: IMAGES.outerwear.olive }, // Reusing Olive
        ]
    }
];

async function main() {
    console.log('Starting Massive Expansion of Luxury Basics...');

    for (const productDef of PRODUCTS) {
        console.log(`Processing ${productDef.title}...`);

        // 1. Process Variants
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedVariants: any[] = [];
        const allImages: string[] = [];
        // Cache asset IDs to avoid re-uploading same image multiple times in this run
        const assetCache: Record<string, string> = {};

        for (const variant of productDef.variants) {
            console.log(`  - Processing variant: ${variant.colorName}`);

            let assetId = assetCache[variant.imagePath];
            if (!assetId) {
                const id = await uploadImage(variant.imagePath);
                if (id) {
                    assetId = id;
                    assetCache[variant.imagePath] = id;
                }
            }

            const variantImageRefs = [];
            if (assetId) {
                variantImageRefs.push({
                    _type: 'image',
                    asset: { _type: "reference", _ref: assetId }
                });
                // Add to main images (prevent duplicates if reusing same image)
                // @ts-ignore
                if (!allImages.some(img => img.asset._ref === assetId)) {
                    // @ts-ignore
                    allImages.push(...variantImageRefs);
                }
            }

            processedVariants.push({
                colorName: variant.colorName,
                colorHex: variant.colorHex,
                images: variantImageRefs,
                stock: 50
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
            sizeType: "clothing",
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

    console.log('Massive Expansion complete!');
}

main().catch(console.error);
