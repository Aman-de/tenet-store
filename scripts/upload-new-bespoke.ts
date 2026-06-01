import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN environment variables.')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const BRAIN_DIR = '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f'

// Define the mapping from file keys to product queries
const uploads = [
    {
        filename: 'gurkha_trouser_front_flat_1779618465543.png',
        query: '*[_type == "product" && title match "*Gurkha Trouser*"][0]',
        description: 'Gurkha Trouser front flat lay'
    },
    {
        filename: 'selvedge_denim_cuff_detail_1779618494967.png',
        query: '*[_type == "product" && title match "*Selvedge Denim*"][0]',
        description: 'Selvedge Denim close-up cuff detail'
    },
    {
        filename: 'cable_knit_cream_texture_detail_1779618569714.png',
        query: '*[_type == "product" && title match "*Cable Knit*" && !(title match "*Zip*")][0]',
        description: 'Heritage Cable Knit cream texture detail'
    },
    {
        filename: 'penny_loafer_front_angle_1779618598852.png',
        query: '*[_type == "product" && title match "*Penny Loafer*"][0]',
        description: 'Penny Loafer suede three-quarter front angle'
    },
    {
        filename: 'voyager_duffel_buckle_detail_1779618646363.png',
        query: '*[_type == "product" && title match "*Voyager*"][0]',
        description: 'Voyager Leather Duffel close-up brass buckle & zipper detail'
    }
]

async function main() {
    console.log('🚀 Starting premium bespoke image upload and patching process...')

    for (const item of uploads) {
        const filePath = path.join(BRAIN_DIR, item.filename)
        console.log(`\n----------------------------------------`)
        console.log(`🔍 Processing: ${item.description}`)
        console.log(`📂 File: ${filePath}`)

        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found at path: ${filePath}`)
            continue
        }

        // 1. Fetch matching product
        const product = await client.fetch(item.query)
        if (!product) {
            console.error(`❌ No product found matching query: ${item.query}`)
            continue
        }
        console.log(`🎯 Matched product in Sanity: "${product.title}" (ID: ${product._id}, Category: ${product.category})`)

        // 2. Upload the file to Sanity
        console.log(`📤 Uploading image to Sanity...`)
        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, {
            filename: item.filename,
            contentType: 'image/png'
        })
        console.log(`✅ Asset uploaded successfully! Asset ID: ${asset._id}`)

        // 3. Patch the product variants
        if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
            console.log(`⏭️ Product has no variants. Skipping patch.`)
            continue
        }

        console.log(`🛠️ Patching variants...`)
        const updatedVariants = []
        let changed = false

        for (const v of product.variants) {
            const images = v.images || []
            
            // Check if the asset is already linked to this variant
            const alreadyHasAsset = images.some((img: any) => img.asset?._ref === asset._id)
            if (alreadyHasAsset) {
                console.log(`  ⏭️ Variant "${v.colorName}" already has this image linked.`)
                updatedVariants.push(v)
                continue
            }

            // Append the new bespoke image to the variant images
            const newImageObj = {
                _key: Math.random().toString(36).slice(2, 9),
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            }

            const newImagesList = [...images, newImageObj]
            updatedVariants.push({
                ...v,
                images: newImagesList
            })
            changed = true
            console.log(`  ➕ Appended bespoke image to variant "${v.colorName}" (New total images: ${newImagesList.length})`)
        }

        if (changed) {
            try {
                await client.patch(product._id).set({ variants: updatedVariants }).commit()
                console.log(`✅ Successfully updated product "${product.title}" in Sanity!`)
            } catch (err: any) {
                console.error(`❌ Failed to update product "${product.title}":`, err.message)
            }
        } else {
            console.log(`⏭️ No changes needed for product "${product.title}".`)
        }
    }

    console.log(`\n🏁 Upload and patch process completed!`)
}

main().catch(console.error)
