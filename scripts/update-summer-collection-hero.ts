
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
const IMAGE_FILENAME = "hero_summer_collection_model_1770238924433.png"

async function updateSummerCollectionHero() {
    console.log(`🚀 Updating Summer Collection Hero Image...`)

    try {
        // 1. Upload Image
        console.log(`   Uploading image...`)
        const filePath = path.join(ARTIFACTS_DIR, IMAGE_FILENAME)

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`)
        }

        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, {
            filename: IMAGE_FILENAME
        })

        // 2. Find Product
        const productSlug = 'mediterranean-retreat-edit'
        const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: productSlug })

        if (!product) {
            throw new Error(`Product not found: ${productSlug}`)
        }

        // 3. Patch Product (Prepend to variants[0].images)
        console.log(`   Linking to product ${product._id}...`)

        await client
            .patch(product._id)
            .setIfMissing({ 'variants': [] })
            .setIfMissing({ 'variants[0]': { images: [] } }) // Ensure structure exists
            .prepend('variants[0].images', [{
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            }])
            .commit()

        console.log(`   ✅ Success! New hero image added.`)

    } catch (err) {
        console.error(`   ❌ Failed: ${err}`)
        process.exit(1)
    }
}

updateSummerCollectionHero()
