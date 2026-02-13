
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

// Map Product Title -> Filename
const imageMap: Record<string, string> = {
    "The Merino Turtleneck": "hero_merino_turtleneck_1770210993042.png",
    "The Oxford Button-Down": "hero_oxford_shirt_1770211029858.png",
    "The Chelsea Boot": "hero_chelsea_boot_1770211079147.png",
}

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b"

async function uploadHeroImages() {
    console.log('🚀 Starting hero image upload for new products...')

    for (const [title, filename] of Object.entries(imageMap)) {
        console.log(`\nProcessing: ${title}`)
        const filePath = path.join(ARTIFACTS_DIR, filename)

        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ File not found: ${filePath}`)
            continue
        }

        try {
            // 1. Upload Asset
            console.log(`   Uploading asset...`)
            const buffer = fs.readFileSync(filePath)
            const asset = await client.assets.upload('image', buffer, {
                filename: filename
            })

            // 2. Find Product ID
            const product = await client.fetch(`*[_type == "product" && title == $title][0]`, { title })

            if (!product) {
                console.error(`   ❌ Product not found: ${title}`)
                continue
            }

            // 3. Patch Product (Set variants[0].images[0])
            console.log(`   Linking to product ${product._id}...`)

            // We want this to be the MAIN image (first image)
            // If images array is empty, we just set it.
            // If not, we prepend or replace? Let's prepend or set if empty.
            // Actually, for these new products, we know variants[0].images is empty [] from creation script.

            await client
                .patch(product._id)
                .setIfMissing({ 'variants': [] })
                .setIfMissing({ 'variants[0]': { images: [] } })
                .setIfMissing({ 'variants[0].images': [] })
                .prepend('variants[0].images', [{
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: asset._id
                    }
                }])
                .commit()

            console.log(`   ✅ Success!`)

        } catch (err) {
            console.error(`   ❌ Failed: ${err}`)
        }
    }
}

uploadHeroImages()
