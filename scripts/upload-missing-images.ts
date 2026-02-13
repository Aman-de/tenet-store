
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
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

const imageMap: Record<string, string> = {
    "the-alpine-lodge-edit": "alpine_lodge_edit_flat_1771017604965.png",
    "the-savannah-sunset": "savannah_sunset_flat_1771017620614.png",
    "the-savannah-explorer-edit": "savannah_explorer_edit_flat_1771017923175.png",
    "the-manhattan-evening-edit": "manhattan_evening_edit_flat_1771017939333.png",
    "the-country-club-brunch-edit": "country_club_brunch_edit_flat_1771017956307.png",
    "the-bali-bamboo-edit": "bali_bamboo_edit_flat_1771017636341.png",
    "the-penny-loafer": "penny_loafer_flat_1771017650643.png",
    "the-yacht-club-edit": "yacht_club_edit_flat_1771017667750.png",
    "the-aegean-odyssey": "aegean_odyssey_flat_1771017684161.png",
    "the-aegean-odyssey-edit": "aegean_odyssey_edit_flat_1771017700613.png",
    "the-paris-flaneur-edit": "paris_flaneur_edit_flat_1771017716929.png",
    "the-oxford-button-down": "oxford_button_down_flat_1771017733209.png",
    "the-chelsea-boot": "chelsea_boot_flat_1771017747862.png",
    "the-merino-turtleneck": "merino_turtleneck_flat_1771017764561.png",
    "the-polo-ground-edit": "polo_ground_edit_flat_1771017778279.png",
    "the-riviera-retreat": "riviera_retreat_flat_1771017793703.png",
    "the-amalfi-aperitivo": "amalfi_aperitivo_flat_1771017807934.png",
    "the-highland-estate-edit": "highland_estate_edit_flat_1771017823280.png",
    "the-aspen-chalet-edit": "aspen_chalet_edit_flat_1771017837090.png",
    "the-oxford-scholar-edit": "oxford_scholar_edit_flat_1771017852986.png",
    "the-venetian-gondola-edit": "venetian_gondola_edit_flat_1771017869220.png",
    "mediterranean-retreat-edit": "mediterranean_retreat_edit_flat_1771017883622.png"
}

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0"

async function uploadImages() {
    console.log('🚀 Starting batch image upload...')

    for (const [slug, filename] of Object.entries(imageMap)) {
        console.log(`\nProcessing: ${slug}`)
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

            // 2. Find Product
            const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug })

            if (!product) {
                console.error(`   ❌ Product not found: ${slug}`)
                continue
            }

            // 3. Patch Product
            const currentImages = product.variants?.[0]?.images || [];

            if (currentImages.length >= 2) {
                console.log(`   ⚠️ Product already has >= 2 images. Skipping to avoid overwriting/duplicating blindly.`)
                continue;
            }

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

uploadImages()
