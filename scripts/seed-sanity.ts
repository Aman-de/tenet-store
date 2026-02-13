
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('Missing env vars')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const products = [
    // --- KNITWEAR ---
    {
        name: "The Heritage Cable Knit",
        price: 8500,
        category: "knitwear",
        color: "Cream",
        colorHex: "#FFFDD0",
        description: "Heavyweight merino wool with traditional cabling. A winter essential. Model is 6'1\" wearing size L.",
        image_prompt: "Editorial shot, man in cream cable knit sweater holding coffee, sitting in leather chair, soft morning light, texture focus."
    },
    {
        name: "The Noir Quarter-Zip",
        price: 6200,
        category: "knitwear",
        color: "Midnight Navy",
        colorHex: "#191970",
        description: "Sleek, breathable wool blend designed for layering over shirts.",
        image_prompt: "Cinematic medium shot, man in navy quarter-zip standing in a library, looking out window, moody lighting."
    },
    {
        name: "The Cashmere Polo",
        price: 12000,
        category: "knitwear",
        color: "Charcoal Grey",
        colorHex: "#36454F",
        description: "Pure cashmere long-sleeve polo. Softness without compromise.",
        image_prompt: "Close up portrait, man wearing charcoal knit polo, collar detail, blurred city background, soft bokeh."
    },

    // --- SHIRTING ---
    {
        name: "The Riviera Linen Shirt",
        price: 4500,
        category: "shirting",
        color: "White",
        colorHex: "#FFFFFF",
        description: "Airy, premium European linen. Cut for a relaxed summer silhouette.",
        image_prompt: "Candid shot, man in white linen shirt with sleeves rolled up, leaning on a balcony railing, ocean background, bright airy light."
    },
    {
        name: "The Amalfi Stripe",
        price: 4200,
        category: "shirting",
        color: "Olive & White",
        colorHex: "#556B2F",
        description: "Vertical striped vacation shirt with a camp collar.",
        image_prompt: "Street style, man walking on cobblestone street wearing olive striped shirt, sunglasses, motion blur walking towards camera."
    },

    // --- TROUSERS ---
    {
        name: "The Gurkha Trouser",
        price: 5500,
        category: "trousers",
        color: "Beige",
        colorHex: "#F5F5DC",
        description: "High-waisted, double-pleated with signature side adjusters.",
        image_prompt: "Waist-down detail shot, man with hands in pockets showing the side buckles of beige gurkha trousers, marble floor background."
    },
    {
        name: "The Pleated Chino",
        price: 4800,
        category: "trousers",
        color: "Navy",
        colorHex: "#000080",
        description: "Classic single pleat, tapered fit. Structured cotton twill.",
        image_prompt: "Full body outfit shot, man leaning against a vintage car, wearing navy chinos and loafers, golden hour sun."
    },

    // --- OUTERWEAR ---
    {
        name: "The Harrington",
        price: 9500,
        category: "outerwear",
        color: "Tan",
        colorHex: "#D2B48C",
        description: "Water-resistant cotton shell with tartan lining. The definitive classic.",
        image_prompt: "Upper body shot, man in tan Harrington jacket with collar popped, windy day, countryside background, film grain."
    },
    {
        name: "The Diplomat Overcoat",
        price: 18000,
        category: "outerwear",
        color: "Black",
        colorHex: "#000000",
        description: "Italian wool blend. Structured shoulders and knee-length drape.",
        image_prompt: "Back view, man walking away in long black wool coat, snowy city street, cinematic wide angle."
    },

    // --- FOOTWEAR ---
    {
        name: "The Penny Loafer",
        price: 11000,
        category: "footwear",
        color: "Tobacco Suede",
        colorHex: "#964B00", // Approx tobacco brown
        description: "Hand-stitched suede with leather soles. Unlined for immediate comfort.",
        image_prompt: "Low angle ground shot, feet resting on an antique rug, wearing brown suede loafers, warm lighting."
    },

    // --- ACCESSORIES ---
    {
        name: "The Weekender",
        price: 22000,
        category: "accessories",
        color: "Cognac Leather",
        colorHex: "#8B4513",
        description: "Full-grain vegetable tanned leather duffel bag. Built for travel.",
        image_prompt: "Still life on a wooden bench, leather bag sitting next to a passport and sunglasses, travel aesthetic."
    }
];

async function seed() {
    console.log('🚀 Starting seed...');

    // 1. Delete all existing products (Safe Delete - Unset references first)
    console.log('🗑️ Cleaning up existing references...');

    // Wipe dependent documents first (Orders, Reviews)
    console.log('🗑️ Wiping Orders and Reviews to clear references...');
    await client.delete({ query: '*[_type == "order"]' });
    await client.delete({ query: '*[_type == "review"]' });

    // Unlink from Collections specifically (strong typing helper)
    await client.patch({ query: '*[_type == "collection" && defined(products)]' })
        .unset(['products'])
        .commit();

    // Unlink from any other place (e.g. pairsWellWith in other products if self-referencing)
    await client.patch({ query: '*[_type == "product" && defined(pairsWellWith)]' })
        .unset(['pairsWellWith'])
        .commit();

    console.log('🗑️ Deleting existing products...');
    // Simple delete should work now that dependents are gone/unlinked
    await client.delete({ query: '*[_type == "product"]' });
    console.log('✅ Deleted.');

    // 2. Create new products
    console.log(`📦 Creating ${products.length} new products...`);

    for (const p of products) {
        const isFootwear = p.category === 'footwear';
        const isAccessory = p.category === 'accessories';

        let sizeType = 'clothing';
        if (isFootwear) sizeType = 'numeric';
        if (isAccessory) sizeType = 'onesize';

        let sizes = ['S', 'M', 'L', 'XL'];
        if (isFootwear) sizes = ['7', '8', '9', '10', '11'];
        if (isAccessory) sizes = [];

        const doc = {
            _type: 'product',
            title: p.name,
            slug: { _type: 'slug', current: p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') },
            price: p.price,
            originalPrice: p.price * 1.2, // Fake markup
            description: p.description,
            category: p.category,
            sizeType,
            sizes,
            variants: [
                {
                    _key: 'var1',
                    colorName: p.color,
                    colorHex: p.colorHex,
                    stock: 15,
                    images: [], // Images to be added later
                }
            ],
            imagePromptNote: p.image_prompt, // Saving for reference
        };

        await client.create(doc);
        console.log(`+ Created: ${p.name}`);
    }

    console.log('✨ Seed complete!');
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
