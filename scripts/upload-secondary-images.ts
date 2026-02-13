
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

// SECONDARY MAP: Product Only Images (Correction Phase)
const secondaryImageMap: Record<string, string> = {
    "The Pleated Chino": "flat_pleated_chino_navy_1770050721344.png",
    "The Harrington": "flat_harrington_tan_1770050747796.png",
    "The Diplomat Overcoat": "flat_diplomat_overcoat_black_1770050773729.png",
    "The Weekender": "flat_weekender_cognac_1770050799646.png",
    "The Heritage Cable Knit": "flat_cable_knit_1769839631884.png",
    "The Noir Quarter-Zip": "flat_noir_zip_1769839651954.png",
    "The Cashmere Polo": "flat_cashmere_polo_1769839681001.png",
    "The Riviera Linen Shirt": "flat_riviera_shirt_1769839732309.png",
    "The Amalfi Stripe": "flat_amalfi_stripe_1769839758454.png",
    "The Gurkha Trouser": "flat_gurkha_trouser_1769839784073.png",
}

const ARTIFACT_DIRS = [
    "/Users/uditsharma/.gemini/antigravity/brain/60c7ea9b-3177-4b12-8a7c-956138ea2356",
    "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b"
]

async function uploadSecondaryImages() {
    console.log('🚀 Starting secondary image upload...')

    for (const [title, filename] of Object.entries(secondaryImageMap)) {
        console.log(`\nProcessing: ${title}`)

        let filePath = ''
        for (const dir of ARTIFACT_DIRS) {
            const attemptPath = path.join(dir, filename)
            if (fs.existsSync(attemptPath)) {
                filePath = attemptPath
                break
            }
        }

        if (!filePath) {
            console.warn(`⚠️ File not found in any artifact dir: ${filename}`)
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
