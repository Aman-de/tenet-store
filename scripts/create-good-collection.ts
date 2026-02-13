
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

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/ace51c03-e5ea-4e4c-a6fe-1a891674d2c1"

const products = [
    // Update existing placeholders
    {
        name: "The Aspen Chalet Edit",
        slug: "the-aspen-chalet-edit",
        price: 85000,
        category: "outerwear",
        color: "Tan & Grey",
        colorHex: "#D2B48C",
        description: "Mountain luxury for the global jet-set. Features a Tan Shearling Coat, Grey Cashmere Sweater, Dark Wool Trousers.",
        image_prompt: "Tan shearling coat, grey cashmere sweater, dark wool trousers.",
        heroPrefix: "hero_aspen_chalet",
        flatPrefix: "flat_aspen_chalet"
    },
    {
        name: "The Oxford Scholar Edit",
        slug: "the-oxford-scholar-edit",
        price: 42000,
        category: "blazers",
        color: "Brown & White",
        colorHex: "#8B4513",
        description: "Intellectual charm. Features a Brown Corduroy Blazer, Fair Isle Knit Vest, and White Oxford Shirt.",
        image_prompt: "Brown corduroy blazer, fair isle vest, white oxford shirt.",
        heroPrefix: "hero_oxford_scholar",
        flatPrefix: "flat_oxford_scholar"
    },
    // New Ultra-Luxury Summer Sets
    {
        name: "The Venetian Gondola Edit",
        slug: "the-venetian-gondola-edit",
        price: 45000,
        category: "shirts",
        color: "Striped & Cream",
        colorHex: "#F5F5DC",
        description: "Evening in Venice. Features a Striped Linen Shirt, Cream Trousers, and Velvet Loafers.",
        image_prompt: "Striped linen shirt, cream trousers, velvet loafers.",
        heroPrefix: "hero_venetian_gondola",
        flatPrefix: "flat_venetian_gondola"
    },
    {
        name: "The Aegean Odyssey Edit",
        slug: "the-aegean-odyssey-edit",
        price: 52000,
        category: "suits",
        color: "White Monochrome",
        colorHex: "#FFFFFF",
        description: "Grecian minimalism. Features a White Silk-Linen Suit and Grecian Leather Sandals.",
        image_prompt: "White silk-linen suit, grecian leather sandals.",
        heroPrefix: "hero_aegean_odyssey",
        flatPrefix: "flat_aegean_odyssey"
    },
    {
        name: "The Bali Bamboo Edit",
        slug: "the-bali-bamboo-edit",
        price: 36000,
        category: "shirts",
        color: "Olive & Black",
        colorHex: "#556B2F",
        description: "Tropical luxury. Features an Olive Linen Kimono Shirt, Black Linen Shorts, and Leather Slides.",
        image_prompt: "Olive linen kimono shirt, black linen shorts, leather slides.",
        heroPrefix: "hero_bali_bamboo",
        flatPrefix: "flat_bali_bamboo"
    }
]

async function findImageFile(prefix: string) {
    if (!prefix) return null
    try {
        const files = fs.readdirSync(ARTIFACTS_DIR)
        // Find file that starts with prefix and ends with .png
        return files.find(f => f.startsWith(prefix) && f.endsWith('.png'))
    } catch (e) {
        console.error(`Error reading directory: ${e}`)
        return null
    }
}

async function createGoodCollection() {
    console.log(`🚀 Finalizing The Good Collection & Adding Summer Sets...`)

    for (const p of products) {
        console.log(`\nProcessing: ${p.name}`)

        // 1. Find Images
        const heroFilename = await findImageFile(p.heroPrefix)
        const flatFilename = await findImageFile(p.flatPrefix)

        let heroAssetId, flatAssetId

        if (heroFilename) {
            console.log(`   Found Hero: ${heroFilename}`)
            const buffer = fs.readFileSync(path.join(ARTIFACTS_DIR, heroFilename))
            const asset = await client.assets.upload('image', buffer, { filename: heroFilename })
            heroAssetId = asset._id
        }

        if (flatFilename) {
            console.log(`   Found Flat: ${flatFilename}`)
            const buffer = fs.readFileSync(path.join(ARTIFACTS_DIR, flatFilename))
            const asset = await client.assets.upload('image', buffer, { filename: flatFilename })
            flatAssetId = asset._id
        }

        if (!heroAssetId && !flatAssetId) {
            // For new products, skip if no images. For existing, we might just want to update metadata, but let's require images for now to be safe
            console.log(`   ⚠️ No images found. Skipping...`)
            continue
        }

        // 2. Prepare Product Doc
        const images = []
        if (heroAssetId) images.push({ _type: 'image', asset: { _type: 'reference', _ref: heroAssetId } })
        if (flatAssetId) images.push({ _type: 'image', asset: { _type: 'reference', _ref: flatAssetId } })

        // If we only found one image, we might want to use it for both slots or keep existing? 
        // Logic: specific images found replace everything.

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
                    stock: 8,
                    images: images
                }
            ],
            imagePromptNote: p.image_prompt
        }

        // 3. Create or Update
        const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: p.slug })

        if (existing) {
            console.log(`   Product exists. Updating...`)
            // If we found new images, use them. If not, keep existing? 
            // The logic above skips if NO images found, so we definitely have at least one new image here.
            await client.patch(existing._id).set({
                variants: doc.variants,
                description: doc.description,
                imagePromptNote: doc.imagePromptNote
            }).commit()
            console.log(`   ✅ Updated!`)
        } else {
            await client.create(doc)
            console.log(`   ✅ Created!`)
        }
    }
}

createGoodCollection()
