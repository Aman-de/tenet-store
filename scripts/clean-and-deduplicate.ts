import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing environment variables NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const HIDDEN_PRODUCT_TITLES = new Set([
    "The Alpine Lodge Edit",
    "The Savannah Explorer Edit",
    "The Manhattan Evening Edit",
    "The Paris Flâneur Edit",
    "The Harrington",
    "The Polo Ground Edit",
    "The Riviera Retreat",
    "The Oxford Blue Shirt",
    "The Yacht Club Edit",
    "The Aegean Odyssey Edit",
    "The Quarter-Zip Pullover",
    "The Highland Estate Edit",
    "The Aspen Chalet Edit",
    "The Oxford Scholar Edit",
    "The Country Club Brunch Edit",
    "The Diplomat Overcoat",
    "The Highland Flannel Shirt"
])

const FALLBACK_FILENAMES = new Set([
    'amalfi_popover_back_1779288908233.png',
    'amalfi_popover_detail_1779288938199.png',
    'riviera_shirt_back_1779289012029.png',
    'signature_tee_white_detail_1779438536951.png',
    'signature_tee_black_detail_1779438515599.png',
    'daily_oxford_navy_detail_1779438559419.png',
    'daily_oxford_sand_detail_1779438581916.png',
    'cable_knit_cream_back_1779290478632.png',
    'cable_knit_navy_back_1779290514853.png',
    'quarter_zip_back_1779290562573.png',
    'harrington_back_1779290699671.png',
    'chore_coat_back_1779290738145.png',
    'tuscan_trousers_back_1779288964552.png',
    'gurkha_trouser_back_1779290599911.png',
    'wool_trouser_back_1779290652871.png',
    'linen_shorts_beige_flat_1779436301372.png',
    'navy_swim_shorts_flat_1779436277004.png',
    'lounge_joggers_grey_flat_1779436378908.png',
    'cashmere_hoodie_back_1779291571486.png',
    'cashmere_vest_back_1779290779631.png',
    'chelsea_loafer_angle_1779289108716.png',
    'voyager_duffel_inside_1779289173569.png'
])

async function main() {
    console.log('🧹 Fetching all products from Sanity...')
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        category,
        variants[]{
            _key,
            colorName,
            colorHex,
            stock,
            images[]{
                _key,
                _type,
                asset{
                    _type,
                    _ref
                },
                "filename": asset->originalFilename
            }
        }
    }`)

    console.log(`📦 Found ${products.length} products. Starting de-duplication and fallback purging...`)

    let totalPatched = 0

    for (const p of products) {
        if (!p.variants || !Array.isArray(p.variants) || p.variants.length === 0) {
            continue
        }

        let productChanged = false
        const updatedVariants = []

        const isHidden = HIDDEN_PRODUCT_TITLES.has(p.title)

        for (const v of p.variants) {
            if (!v.images || !Array.isArray(v.images) || v.images.length === 0) {
                updatedVariants.push(v)
                continue
            }

            const seenRefs = new Set<string>()
            const cleanImages = []

            for (const img of v.images) {
                const ref = img.asset?._ref
                if (!ref) {
                    cleanImages.push(img)
                    continue
                }

                // 1. Skip duplicate images
                if (seenRefs.has(ref)) {
                    productChanged = true
                    console.log(`  🗑️ Removing duplicate image from "${p.title}" [${v.colorName}]: ${img.filename || ref}`)
                    continue
                }

                // 2. Skip mismatched fallback images (if it's not the product's own image)
                const fname = (img.filename || '').toLowerCase()
                let isMismatched = false

                if (FALLBACK_FILENAMES.has(img.filename)) {
                    const isOwnImage = p.slug.replace(/-/g, '_').includes(fname.split('_')[0]) || 
                                       p.title.toLowerCase().includes(fname.split('_')[0]) ||
                                       (p.slug === 'the-tailored-gurkha-trouser' && fname.includes('gurkha')) ||
                                       (p.slug === 'the-canvas-chore-coat' && fname.includes('chore_coat')) ||
                                       (p.slug === 'the-classic-harrington' && fname.includes('harrington')) ||
                                       (p.slug === 'the-sterling-cashmere-vest' && fname.includes('cashmere_vest')) ||
                                       (p.slug === 'the-haven-cashmere-hoodie' && fname.includes('cashmere_hoodie')) ||
                                       (p.slug === 'the-penny-loafer' && fname.includes('penny_loafer')) ||
                                       (p.slug === 'the-chelsea-boot' && fname.includes('chelsea_boot')) ||
                                       (p.slug === 'the-voyager-leather-duffel' && fname.includes('voyager_duffel')) ||
                                       (p.slug === 'the-essential-jogger' && fname.includes('lounge_jogger'))

                    if (!isOwnImage) {
                        isMismatched = true
                        productChanged = true
                        console.log(`  🗑️ Purging mismatched fallback "${img.filename}" from "${p.title}" [Category: ${p.category}]`)
                        continue
                    }
                }

                seenRefs.add(ref)
                cleanImages.push({
                    _key: img._key,
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: ref
                    }
                })
            }

            updatedVariants.push({
                _key: v._key,
                colorName: v.colorName,
                colorHex: v.colorHex,
                stock: v.stock,
                images: cleanImages
            })
        }

        if (productChanged) {
            try {
                await client.patch(p._id).set({ variants: updatedVariants }).commit()
                console.log(`✅ Successfully updated "${p.title}" (${p.slug})`)
                totalPatched++
            } catch (err: any) {
                console.error(`❌ Failed to update "${p.title}":`, err.message)
            }
        }
    }

    console.log(`\n🏁 Done! Successfully cleaned and de-duplicated ${totalPatched} products.`)
}

main().catch(console.error)
