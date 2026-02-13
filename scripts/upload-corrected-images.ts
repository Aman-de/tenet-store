
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

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0"

// Map of slug -> filename. Note: Timestamps might vary, so we'll look for files starting with the name.
const imageMap: Record<string, string> = {
    "the-alpine-lodge-edit": "alpine_lodge_edit_flat_v2",
    "the-savannah-sunset": "savannah_sunset_flat_v2",
    "the-savannah-explorer-edit": "savannah_explorer_edit_flat_v2",
    "the-manhattan-evening-edit": "manhattan_evening_edit_flat_v2",
    "the-country-club-brunch-edit": "country_club_brunch_edit_flat_v2",
    "the-bali-bamboo-edit": "bali_bamboo_edit_flat_v2",
    "the-penny-loafer": "penny_loafer_flat_v2",
    "the-yacht-club-edit": "yacht_club_edit_flat_v2",
    "the-aegean-odyssey": "aegean_odyssey_flat_v2",
    "the-aegean-odyssey-edit": "aegean_odyssey_edit_flat_v2",
    "the-paris-flaneur-edit": "paris_flaneur_edit_flat_v2",
    "the-oxford-button-down": "oxford_button_down_flat_v2",
    "the-chelsea-boot": "chelsea_boot_flat_v2",
    "the-merino-turtleneck": "merino_turtleneck_flat_v2",
    "the-polo-ground-edit": "polo_ground_edit_flat_v2",
    "the-riviera-retreat": "riviera_retreat_flat_v2",
    "the-amalfi-aperitivo": "amalfi_aperitivo_flat_v2",
    "the-highland-estate-edit": "highland_estate_edit_flat_v2",
    "the-aspen-chalet-edit": "aspen_chalet_edit_flat_v2",
    "the-oxford-scholar-edit": "oxford_scholar_edit_flat_v2",
    "the-venetian-gondola-edit": "venetian_gondola_edit_flat_v2",
    "mediterranean-retreat-edit": "mediterranean_retreat_edit_flat_v2",
}

async function findFile(prefix: string) {
    const files = fs.readdirSync(ARTIFACTS_DIR)
    // Find file that starts with prefix and ends with .png
    // We want the LATEST one if multiple exist, but usually v2 is unique enough or we trust the prefix match.
    // Actually, let's sort by time if multiple?
    const matches = files.filter(f => f.startsWith(prefix) && f.endsWith('.png'))
    if (matches.length === 0) return null
    // Sort matches to get the one with the latest timestamp (timestamps are at the end)
    // Assuming format name_timestamp.png
    matches.sort()
    return matches[matches.length - 1]
}

async function uploadCorrectedImages() {
    console.log('🚀 Starting batch upload of CORRECTED images...')

    for (const [slug, filePrefix] of Object.entries(imageMap)) {
        console.log(`\nProcessing: ${slug}`)

        const filename = await findFile(filePrefix)
        if (!filename) {
            console.warn(`   ⚠️ File not found for prefix: ${filePrefix}`)
            // Special handling for Aspen Chalet if it failed? 
            // If it failed, we skip it.
            continue
        }

        const filePath = path.join(ARTIFACTS_DIR, filename)
        console.log(`   Found file: ${filename}`)

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
            console.log(`   Current images count: ${currentImages.length}`)

            const patch = client.patch(product._id)
                .setIfMissing({ 'variants': [] })
                .setIfMissing({ 'variants[0]': { images: [] } })
                .setIfMissing({ 'variants[0].images': [] })

            if (currentImages.length >= 2) {
                console.log(`   Replacing second image (index 1)...`)
                // Replace index 1
                await patch.set({
                    'variants[0].images[1]': {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: asset._id
                        }
                    }
                }).commit()
            } else {
                console.log(`   Appending as second image...`)
                // Append
                await patch.append('variants[0].images', [{
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: asset._id
                    }
                }]).commit()
            }

            console.log(`   ✅ Success!`)

        } catch (err) {
            console.error(`   ❌ Failed: ${err}`)
        }
    }
}

uploadCorrectedImages()
