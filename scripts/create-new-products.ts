
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

const newProducts = [
    {
        name: "The Merino Turtleneck",
        price: 9500,
        category: "knitwear",
        color: "Black",
        colorHex: "#000000",
        description: "Fine gauge merino wool. A sophisticated layer for the modern wardrobe.",
        image_prompt: "Cinematic portrait, man in black turtleneck, studio lighting, dark background, rim light."
    },
    {
        name: "The Oxford Button-Down",
        price: 5200,
        category: "shirting",
        color: "Light Blue",
        colorHex: "#ADD8E6",
        description: "Classic heavy cotton oxford cloth. Garment washed for softness.",
        image_prompt: "Relaxed shot, man in light blue oxford shirt, sleeves rolled, holding a book, natural light."
    },
    {
        name: "The Chelsea Boot",
        price: 13500,
        category: "footwear",
        color: "Dark Brown",
        colorHex: "#4B3621",
        description: "Italian suede with elastic side panels. Blake stitched construction.",
        image_prompt: "Low angle, man calling a cab, wearing dark brown suede chelsea boots, city street background."
    }
]

async function createProducts() {
    console.log(`📦 Creating ${newProducts.length} new products...`);

    for (const p of newProducts) {
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
            originalPrice: p.price * 1.2,
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
            imagePromptNote: p.image_prompt,
        };

        // Check if exists to prevent duplicates
        const existing = await client.fetch(`*[_type == "product" && title == $title][0]`, { title: p.name })
        if (existing) {
            console.log(`⚠️ ${p.name} already exists. Skipping.`);
            continue;
        }

        await client.create(doc);
        console.log(`+ Created: ${p.name}`);
    }
    console.log('✨ Done!');
}

createProducts()
