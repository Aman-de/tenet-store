
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

const p = {
    title: "The Paris Flâneur Edit",
    slug: "the-paris-flaneur-edit",
    hero: "hero_paris_flaneur_1770836558589.png"
}

async function updateParis() {
    console.log(`🚀 Updating Paris (Hero Only)...`)

    try {
        // 1. Upload Hero
        const heroPath = path.join(ARTIFACTS_DIR, p.hero)
        if (!fs.existsSync(heroPath)) {
            console.error(`   ❌ Hero image not found: ${p.hero}`)
            process.exit(1)
        }
        const heroBuffer = fs.readFileSync(heroPath)
        console.log(`   Uploading Hero...`)
        const heroAsset = await client.assets.upload('image', heroBuffer, { filename: p.hero })

        // 2. Update Product (Use Hero for both slots)
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
                                asset: { _type: 'reference', _ref: heroAsset._id } // Use Hero for 2nd slot too
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

    } catch (err) {
        console.error(`   ❌ Failed: ${err}`)
        process.exit(1)
    }
}

updateParis()
