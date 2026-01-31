
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

// Map of Title -> Filename
const imageMap: Record<string, string> = {
    "The Heritage Cable Knit": "heritage_cable_knit_1769838263520.png",
    "The Noir Quarter-Zip": "noir_quarter_zip_1769838281290.png",
    "The Cashmere Polo": "cashmere_polo_1769838325764.png",
    "The Riviera Linen Shirt": "riviera_linen_shirt_1769838346603.png",
    "The Amalfi Stripe": "amalfi_stripe_1769838363946.png",
    "The Gurkha Trouser": "gurkha_trouser_1769838296620.png",
    "The Pleated Chino": "pleated_chino_1769838382486.png",
    "The Harrington": "harrington_jacket_1769838412001.png",
    "The Diplomat Overcoat": "diplomat_overcoat_1769838428705.png",
    "The Penny Loafer": "penny_loafer_1769838446100.png",
    "The Weekender": "weekender_bag_1769838467779.png"
}

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/60c7ea9b-3177-4b12-8a7c-956138ea2356"

async function uploadImages() {
    console.log('🚀 Starting image upload...')

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

            // 3. Patch Product (Set variants[0].images[0] AND verify variants exists)
            console.log(`   Linking to product ${product._id}...`)

            // We need to robustly ensure the variants array structure exists.
            // But since we JUST seeded it, we know variants[0] exists.
            // We'll set the FIRST image of the FIRST variant.

            await client
                .patch(product._id)
                .setIfMissing({ 'variants': [] })
                .setIfMissing({ 'variants[0]': { images: [] } }) // This might fail if variants is empty array, but seed made var1.
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

uploadImages()
