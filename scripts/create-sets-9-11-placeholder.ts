
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

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

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b"
// Using Set 8 Flat Lay as placeholder for all
const PLACEHOLDER_IMAGE = "flat_highland_estate_1770241977609.png"

const products = [
    {
        name: "The Aspen Chalet Edit",
        slug: "the-aspen-chalet-edit",
        price: 85000,
        category: "outerwear",
        color: "Tan & Grey",
        colorHex: "#D2B48C",
        description: "Mountain luxury for the global jet-set. Features a Tan Shearling Coat, Grey Cashmere Sweater, Dark Wool Trousers.",
        image_prompt: "Tan shearling coat, grey cashmere sweater, dark wool trousers."
    },
    {
        name: "The Oxford Scholar Edit",
        slug: "the-oxford-scholar-edit",
        price: 42000,
        category: "blazers",
        color: "Brown & White",
        colorHex: "#8B4513",
        description: "Intellectual charm. Features a Brown Corduroy Blazer, Fair Isle Knit Vest, and White Oxford Shirt.",
        image_prompt: "Brown corduroy blazer, fair isle vest, white oxford shirt."
    },
    {
        name: "The Paris Flâneur Edit",
        slug: "the-paris-flaneur-edit",
        price: 58000,
        category: "outerwear",
        color: "Beige & Black",
        colorHex: "#F5F5DC",
        description: "Cinematic urban sophistication. Features a Beige Trench Coat, Black Merino Turtleneck, and Charcoal Trousers.",
        image_prompt: "Beige trench coat, black turtleneck, charcoal trousers."
    }
]

async function createPlaceholderSets() {
    console.log(`🚀 Creating Sets 9-11 (with placeholders)...`)

    try {
        const imagePath = path.join(ARTIFACTS_DIR, PLACEHOLDER_IMAGE)
        const imageBuffer = fs.readFileSync(imagePath)

        console.log(`   Uploading placeholder asset...`)
        const asset = await client.assets.upload('image', imageBuffer, { filename: "placeholder_kvl.png" })

        for (const p of products) {
            console.log(`   Creating '${p.name}'...`)

            const doc = {
                _type: 'product',
                title: p.name,
                slug: { _type: 'slug', current: p.slug },
                price: p.price,
                originalPrice: p.price * 1.2,
                description: p.description,
                category: p.category,
                sizeType: 'clothing',
                sizes: ['S', 'M', 'L', 'XL'],
                variants: [
                    {
                        _key: 'var1',
                        colorName: p.color,
                        colorHex: p.colorHex,
                        stock: 5,
                        images: [
                            {
                                _type: 'image',
                                asset: { _type: 'reference', _ref: asset._id }
                            },
                            {
                                _type: 'image',
                                asset: { _type: 'reference', _ref: asset._id }
                            }
                        ],
                    }
                ],
                imagePromptNote: p.image_prompt + " (Image Quota Placeholder)",
            };

            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: doc.slug.current })
            if (existing) {
                console.log(`   ⚠️ Product exists. Updating...`)
                await client.patch(existing._id).set({
                    variants: doc.variants,
                    description: doc.description,
                    imagePromptNote: doc.imagePromptNote
                }).commit()
                console.log(`   ✅ Updated!`)
            } else {
                await client.create(doc);
                console.log(`   ✅ Created!`)
            }
        }

    } catch (err) {
        console.error(`   ❌ Failed: ${err}`)
        process.exit(1)
    }
}

createPlaceholderSets()
