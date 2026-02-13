
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

const products = [
    {
        title: "The Aspen Chalet Edit",
        slug: "the-aspen-chalet-edit",
        hero: "hero_aspen_m_1_1770668657577.png",
        flat: "flat_aspen_m_1_1770668670504.png"
    },
    {
        title: "The Oxford Scholar Edit",
        slug: "the-oxford-scholar-edit",
        hero: "hero_oxford_m_1_1770668687558.png",
        flat: "flat_oxford_m_1_1770668702486.png"
    },
    {
        title: "The Paris Flâneur Edit",
        slug: "the-paris-flaneur-edit",
        hero: "hero_paris_m_1_1770668716166.png",
        flat: "flat_paris_m_1_1770668740000.png" // Placeholder, will replace with actual filename after generation
    }
]

// Note: I will need to update the filename for Paris Flat after it generates.
// For now, I'll rely on listing the directory or just hardcoding what I expect if I can't catch it dynamically.
// Actually, since I am writing this file *before* sure success of the image, 
// I should perhaps list the directory in the script to find the file matching the pattern.

async function updateProducts() {
    console.log(`🚀 Updating Placeholders...`)

    try {
        // Find the actual filename for Paris Flat
        const files = fs.readdirSync(ARTIFACTS_DIR);
        const parisFlatFile = files.find(f => f.startsWith("flat_paris_m_1") && f.endsWith(".png"));
        if (parisFlatFile) {
            products[2].flat = parisFlatFile;
        } else {
            console.warn("⚠️ Paris Flat image not found in artifacts. Skipping Paris update.");
        }

        for (const p of products) {
            console.log(`\nProcessing ${p.title}...`)

            // 1. Upload Hero
            const heroPath = path.join(ARTIFACTS_DIR, p.hero)
            if (!fs.existsSync(heroPath)) {
                console.error(`   ❌ Hero image not found: ${p.hero}`)
                continue
            }
            const heroBuffer = fs.readFileSync(heroPath)
            console.log(`   Uploading Hero...`)
            const heroAsset = await client.assets.upload('image', heroBuffer, { filename: p.hero })

            // 2. Upload Flat
            const flatPath = path.join(ARTIFACTS_DIR, p.flat)
            if (!fs.existsSync(flatPath)) {
                console.error(`   ❌ Flat image not found: ${p.flat}`)
                continue
            }
            const flatBuffer = fs.readFileSync(flatPath)
            console.log(`   Uploading Flat...`)
            const flatAsset = await client.assets.upload('image', flatBuffer, { filename: p.flat })

            // 3. Update Product
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: p.slug })
            if (existing) {
                console.log(`   Updating product...`)
                await client.patch(existing._id).set({
                    variants: [
                        {
                            ...existing.variants[0],
                            images: [
                                {
                                    _type: 'image',
                                    asset: { _type: 'reference', _ref: heroAsset._id }
                                },
                                {
                                    _type: 'image',
                                    asset: { _type: 'reference', _ref: flatAsset._id }
                                }
                            ]
                        }
                    ],
                    imagePromptNote: existing.imagePromptNote ? existing.imagePromptNote.replace(" (Image Quota Placeholder)", "") : ""
                }).commit()
                console.log(`   ✅ Updated!`)
            } else {
                console.error(`   ❌ Product not found in Sanity: ${p.slug}`)
            }
        }

    } catch (err) {
        console.error(`   ❌ Failed: ${err}`)
        process.exit(1)
    }
}

updateProducts()
