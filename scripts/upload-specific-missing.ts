import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const targets = [
    {
        filePath: '/Users/uditsharma/.gemini/antigravity/brain/3c7156c7-5c6e-421a-a58c-822ecb8664e0/tuscan_trousers_grey_angle_4_1781649037164.png',
        productSlug: 'tuscan-drawstring-trousers',
        variantColor: 'Heather Grey',
    },
    {
        filePath: '/Users/uditsharma/.gemini/antigravity/brain/3c7156c7-5c6e-421a-a58c-822ecb8664e0/tuscan_trousers_cream_angle_4_1781649066792.png',
        productSlug: 'tuscan-drawstring-trousers',
        variantColor: 'Aran Cream',
    },
    {
        filePath: '/Users/uditsharma/.gemini/antigravity/brain/3c7156c7-5c6e-421a-a58c-822ecb8664e0/cashmere_sweater_forest_angle_4_1781649119499.png',
        productSlug: 'the-haven-cashmere-sweater',
        variantColor: 'Deep Forest',
    }
]

const genKey = () => Math.random().toString(36).slice(2, 9)

async function uploadAndLink() {
    console.log('🚀 Starting Specific Image Upload and Link...')
    for (const target of targets) {
        console.log(`\nProcessing variant "${target.variantColor}" of "${target.productSlug}"...`)
        if (!fs.existsSync(target.filePath)) {
            console.error(`❌ File does not exist: ${target.filePath}`)
            continue
        }
        
        // 1. Upload to Sanity
        console.log(`   Uploading image: ${path.basename(target.filePath)}...`)
        const buffer = fs.readFileSync(target.filePath)
        const asset = await client.assets.upload('image', buffer, { filename: path.basename(target.filePath) })
        const assetId = asset._id
        console.log(`   ✅ Uploaded! Asset ID: ${assetId}`)

        // 2. Fetch products
        const products = await client.fetch(
            `*[_type == "product" && slug.current == $slug]`,
            { slug: target.productSlug }
        )
        if (!products || products.length === 0) {
            console.error(`   ❌ Product not found: ${target.productSlug}`)
            continue
        }

        for (const product of products) {
            const variantIndex = product.variants.findIndex(
                (v: any) => v.colorName?.toLowerCase().trim() === target.variantColor.toLowerCase().trim()
            )
            if (variantIndex === -1) {
                console.log(`   ⚠️ Variant "${target.variantColor}" not found in product variants of document ${product._id}. Skipping this doc.`)
                continue
            }

            const variant = product.variants[variantIndex]
            const currentImages = variant.images || []
            const alreadyLinked = currentImages.some((img: any) => img.asset?._ref === assetId)
            if (alreadyLinked) {
                console.log(`   ⏭️ Already linked to variant in document ${product._id}.`)
                continue
            }

            const updatedImages = [
                ...currentImages,
                {
                    _type: 'image',
                    _key: genKey(),
                    asset: { _type: 'reference', _ref: assetId }
                }
            ]

            const updatedVariants = [...product.variants]
            updatedVariants[variantIndex] = {
                ...variant,
                images: updatedImages
            }

            console.log(`   Saving product update to Sanity for document ${product._id}...`)
            try {
                await client.patch(product._id).set({ variants: updatedVariants }).commit()
                console.log(`   🎉 Successfully updated product document ${product._id}! Now has ${updatedImages.length} images.`)
            } catch (err: any) {
                console.error(`   ❌ Failed to update document ${product._id}: ${err.message}`)
            }
        }
    }
}

uploadAndLink().catch(console.error)
