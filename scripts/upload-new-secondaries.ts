
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
    "The Merino Turtleneck": "flat_merino_turtleneck_1770227985744.png",
    "The Oxford Button-Down": "flat_oxford_shirt_1770228013702.png",
    "The Chelsea Boot": "flat_chelsea_boot_1770228040345.png",
}

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b"

async function uploadSecondaryImages() {
    console.log('🚀 Starting flat lay image upload for new products...')

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

            // 3. Patch Product (Append to variants[0].images)
            console.log(`   Linking to product ${product._id}...`)

            await client
                .patch(product._id)
                .setIfMissing({ 'variants': [] })
                .setIfMissing({ 'variants[0]': { images: [] } })
                .setIfMissing({ 'variants[0].images': [] })
                .append('variants[0].images', [{
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

uploadSecondaryImages()
