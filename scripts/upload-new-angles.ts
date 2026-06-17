import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN || !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing Sanity environment variables in .env.local')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const BRAIN_DIR = "/Users/uditsharma/.gemini/antigravity/brain/3c7156c7-5c6e-421a-a58c-822ecb8664e0"

const genKey = () => Math.random().toString(36).slice(2, 9)

async function uploadAndLink() {
    console.log('🚀 Uploading and linking new product image angles to Sanity...\n')

    if (!fs.existsSync(BRAIN_DIR)) {
        console.error(`❌ Brain directory does not exist: ${BRAIN_DIR}`)
        process.exit(1)
    }

    const files = fs.readdirSync(BRAIN_DIR)
    console.log(`📝 Found ${files.length} files in brain directory.`)

    // Define the mappings of image patterns to target products and variants
    const targets = [
        {
            filePattern: 'heavyweight_hoodie_black_angle_4',
            productSlug: 'the-heavyweight-hoodie',
            variantColor: 'Jet Black',
        },
        {
            filePattern: 'breezy_linen_resort_shirt_white_angle_4',
            productSlug: 'breezy-linen-resort-shirt',
            variantColor: 'Crisp White',
        },
        {
            filePattern: 'heritage_chronograph_silver_angle_4',
            productSlug: 'the-heritage-chronograph',
            variantColor: 'Classic Silver',
        },
        {
            filePattern: 'crewneck_white_angle_4',
            productSlug: 'the-essential-black-crewneck',
            variantColor: 'Cloud White',
        },
        {
            filePattern: 'pleated_trouser_charcoal_angle_4',
            productSlug: 'the-pleated-wool-trouser',
            variantColor: 'Charcoal',
        },
        {
            filePattern: 'daily_oxford_sand_angle_4',
            productSlug: 'the-daily-oxford',
            variantColor: 'Dune Sand',
        },
        {
            filePattern: 'pique_polo_black_angle_4',
            productSlug: 'classic-pique-polo',
            variantColor: 'Jet Black',
        },
        {
            filePattern: 'pique_polo_navy_angle_4',
            productSlug: 'classic-pique-polo',
            variantColor: 'Royal Navy',
        },
        {
            filePattern: 'silk_blouse_pink_angle_4',
            productSlug: 'the-classic-silk-blouse',
            variantColor: 'pink ',
        },
        {
            filePattern: 'silk_blouse_green_angle_4',
            productSlug: 'the-classic-silk-blouse',
            variantColor: 'green ',
        },
        {
            filePattern: 'selvedge_denim_indigo_angle_4',
            productSlug: 'vintage-wash-selvedge-denim',
            variantColor: 'Indigo Rinse',
        },
        {
            filePattern: 'amalfi_stripe_grey_angle_4',
            productSlug: 'the-amalfi-stripe-shirt',
            variantColor: 'Heather Grey',
        },
        {
            filePattern: 'tuscan_trousers_grey_angle_4',
            productSlug: 'the-scholar-turtleneck',
            variantColor: 'Heather Grey',
        },
        {
            filePattern: 'tuscan_trousers_cream_angle_4',
            productSlug: 'the-scholar-turtleneck',
            variantColor: 'Aran Cream',
        },
        {
            filePattern: 'safari_lounge_black_angle_4',
            productSlug: 'the-safari-lounge-set',
            variantColor: 'Off Black',
        },
        {
            filePattern: 'cashmere_sweater_forest_angle_4',
            productSlug: 'the-haven-cashmere-sweater',
            variantColor: 'Deep Forest',
        },
        {
            filePattern: 'olive_resort_navy_angle_4',
            productSlug: 'the-olive-resort-shirt',
            variantColor: 'Deep Navy',
        }
    ]

    for (const target of targets) {
        const matchingFile = files.find(f => f.startsWith(target.filePattern) && f.endsWith('.png'))
        if (!matchingFile) {
            console.log(`⚠️ No matching file found for pattern: "${target.filePattern}"`)
            continue
        }

        const filePath = path.join(BRAIN_DIR, matchingFile)
        console.log(`\n📸 Found matching file: ${matchingFile}`)

        // 1. Upload the image asset to Sanity
        console.log(`   📤 Uploading ${matchingFile} to Sanity...`)
        let assetId: string
        try {
            const buffer = fs.readFileSync(filePath)
            const asset = await client.assets.upload('image', buffer, { filename: matchingFile })
            assetId = asset._id
            console.log(`   ✅ Uploaded successfully! Asset ID: ${assetId}`)
        } catch (err: any) {
            console.error(`   ❌ Failed to upload asset: ${err.message}`)
            continue
        }

        // 2. Fetch the target product
        const product = await client.fetch(
            `*[_type == "product" && slug.current == $slug][0]`,
            { slug: target.productSlug }
        )

        if (!product) {
            console.error(`   ❌ Product with slug "${target.productSlug}" not found in Sanity.`)
            continue
        }

        if (!product.variants || !Array.isArray(product.variants)) {
            console.error(`   ❌ Product "${product.title}" has no variants.`)
            continue
        }

        // Find the target variant
        const variantIndex = product.variants.findIndex(
            (v: any) => v.colorName?.toLowerCase().trim() === target.variantColor.toLowerCase().trim()
        )

        if (variantIndex === -1) {
            console.error(
                `   ❌ Variant with color "${target.variantColor}" not found in product "${product.title}".`
            )
            continue
        }

        const variant = product.variants[variantIndex]
        const currentImages = variant.images || []

        // Check if the image is already linked to avoid duplicates
        const alreadyLinked = currentImages.some((img: any) => img.asset?._ref === assetId)
        if (alreadyLinked) {
            console.log(`   ⏭️ Image is already linked to variant "${variant.colorName}".`)
            continue
        }

        // Append the new image
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

        // Update product in Sanity
        console.log(`   💾 Saving updated product document...`)
        try {
            await client.patch(product._id).set({ variants: updatedVariants }).commit()
            console.log(`   🎉 Successfully updated "${product.title}" - Variant "${variant.colorName}"! Now has ${updatedImages.length} images.`)
        } catch (err: any) {
            console.error(`   ❌ Failed to save product update: ${err.message}`)
        }
    }

    console.log('\n🏁 Done processing uploads and linking!')
}

uploadAndLink().catch(console.error)
