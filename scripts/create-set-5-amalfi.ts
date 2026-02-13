
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

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/e2adc946-4afc-4cb4-a6fc-6fea5425392a"
const HERO_IMAGE = "hero_amalfi_m_1_1770667885164.png"
const FLAT_IMAGE = "flat_amalfi_m_1_1770667971886.png"

const product = {
    name: "The Amalfi Aperitivo",
    price: 40000,
    category: "sets",
    color: "Light Blue & Beige",
    colorHex: "#ADD8E6",
    description: "Italian summer evening, relaxed elegance. Features a light blue linen shirt, beige Gurkha shorts, brown suede loafers, and sunglasses.",
    image_prompt: "Man enjoying aperitivo on terrace in Positano, light blue linen shirt, beige Gurkha shorts."
}

async function createAmalfiProduct() {
    console.log(`🚀 Creating '${product.name}'...`)

    try {
        // 1. Upload Hero Image
        console.log(`   Uploading Hero image...`)
        const heroPath = path.join(ARTIFACTS_DIR, HERO_IMAGE)
        const heroBuffer = fs.readFileSync(heroPath)
        const heroAsset = await client.assets.upload('image', heroBuffer, { filename: HERO_IMAGE })

        // 2. Upload Flat Image
        console.log(`   Uploading Flat image...`)
        const flatPath = path.join(ARTIFACTS_DIR, FLAT_IMAGE)
        const flatBuffer = fs.readFileSync(flatPath)
        const flatAsset = await client.assets.upload('image', flatBuffer, { filename: FLAT_IMAGE })

        // 3. Create Product
        const doc = {
            _type: 'product',
            title: product.name,
            slug: { _type: 'slug', current: 'the-amalfi-aperitivo' },
            price: product.price,
            originalPrice: 46000,
            description: product.description,
            category: product.category,
            sizeType: 'clothing',
            sizes: ['S', 'M', 'L', 'XL'],
            variants: [
                {
                    _key: 'var1',
                    colorName: product.color,
                    colorHex: product.colorHex,
                    stock: 5,
                    images: [
                        {
                            _type: 'image',
                            asset: { _type: 'reference', _ref: heroAsset._id }
                        },
                        {
                            _type: 'image',
                            asset: { _type: 'reference', _ref: flatAsset._id }
                        }
                    ],
                }
            ],
            imagePromptNote: product.image_prompt,
        };

        // Check availability
        const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: doc.slug.current })
        if (existing) {
            console.log(`⚠️ Product already exists. Updating images...`)
            await client.patch(existing._id)
                .set({
                    variants: doc.variants,
                    description: doc.description,
                    price: doc.price
                })
                .commit()
            console.log(`   ✅ Updated!`)
        } else {
            await client.create(doc);
            console.log(`   ✅ Created!`)
        }

    } catch (err) {
        console.error(`   ❌ Failed: ${err}`)
        process.exit(1)
    }
}

createAmalfiProduct()
