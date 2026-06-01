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

async function main() {
    console.log('🚀 Starting Product Image Auditing, Repair, and Angle Enrichment...')

    // 1. Fetch all sanity image assets
    console.log('🔍 Fetching all image assets from Sanity...')
    const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id, originalFilename }`)
    console.log(`📸 Found ${assets.length} image assets in Sanity.`)

    // Index assets by lowercase filename for quick O(1) lookup
    const assetMap: Record<string, string> = {}
    const assetIdToFilenameMap: Record<string, string> = {}
    for (const asset of assets) {
        if (asset.originalFilename) {
            const filenameLower = asset.originalFilename.toLowerCase()
            assetMap[filenameLower] = asset._id
            assetIdToFilenameMap[asset._id] = filenameLower
        }
    }

    // Helper to get asset reference by filename
    function getAssetRef(filename: string): any {
        const id = assetMap[filename.toLowerCase()]
        if (!id) {
            // Find fuzzy matches if exact match is not found
            const fuzzyKey = Object.keys(assetMap).find(k => k.includes(filename.toLowerCase()))
            if (fuzzyKey) {
                return { _type: 'image', asset: { _type: 'reference', _ref: assetMap[fuzzyKey] } }
            }
            return null
        }
        return { _type: 'image', asset: { _type: 'reference', _ref: id } }
    }

    // Helper to generate a unique key
    function genKey(): string {
        return Math.random().toString(36).slice(2, 9)
    }

    // Part 1: Deduplicate Savannah Sunset
    console.log('\n--- Part 1: Deduplicating Savannah Sunset ---')
    const duplicateId = 'y8H96wha35OX52r4i0ZNNv' // "The Savannah Sunset" under Sets
    try {
        const exists = await client.fetch(`*[_id == $duplicateId][0]`, { duplicateId })
        if (exists) {
            // Remove from Sets collection if referenced
            const collectionId = 'rEOZmN4kcNPtabRuAlNzRC'
            const collection = await client.fetch(`*[_id == $collectionId][0]`, { collectionId })
            if (collection && collection.products) {
                const hasRef = collection.products.some((ref: any) => ref._ref === duplicateId)
                if (hasRef) {
                    console.log(`🧹 Removing reference to Savannah product from "${collection.title}" collection...`)
                    const cleanProducts = collection.products.filter((ref: any) => ref._ref !== duplicateId)
                    await client.patch(collectionId).set({ products: cleanProducts }).commit()
                    console.log(`✅ Removed reference successfully!`)
                }
            }

            console.log(`🧹 Deleting duplicate Savannah product: "${exists.title}" (ID: ${duplicateId})...`)
            await client.delete(duplicateId)
            console.log(`✅ Duplicate Savannah product successfully deleted!`)
        } else {
            console.log(`⏭️ Duplicate Savannah product (ID: ${duplicateId}) was already deleted.`)
        }
    } catch (err: any) {
        console.error(`❌ Failed to delete duplicate Savannah product:`, err.message)
    }

    // Part 2: Fetch all products to audit and enrich
    console.log('\n--- Part 2 & 3: Auditing and Enriching Catalog ---')
    const products = await client.fetch(`*[_type == "product"]{ _id, title, "slug": slug.current, category, gender, variants }`)
    console.log(`📦 Found ${products.length} products to audit and enrich.`)

    let totalPatched = 0

    for (const p of products) {
        if (!p.variants || !Array.isArray(p.variants) || p.variants.length === 0) {
            continue
        }

        let productChanged = false
        const updatedVariants = []

        for (const v of p.variants) {
            const originalImages = v.images || []
            if (originalImages.length === 0) {
                updatedVariants.push(v)
                continue
            }

            // Extract filename/asset IDs from existing images to filter out duplicates and wrong images
            const existingRefs: string[] = []
            const uniqueImages: any[] = []

            for (const img of originalImages) {
                const ref = img.asset?._ref
                if (ref && !existingRefs.includes(ref)) {
                    existingRefs.push(ref)
                    uniqueImages.push(img)
                }
            }

            // Determine if we have any mismatched secondary images that need replacing
            let finalImages = [...uniqueImages]
            let colorName = v.colorName || 'Default'
            let colorLower = colorName.toLowerCase()
            let title = p.title
            let slug = p.slug || ''
            let cat = p.category || ''

            // Filter out existing incorrect generic trouser backs from categories where they don't belong
            const wrongPantFilenames = [
                'gurkha_trouser_back_1779290599911.png',
                'tuscan_trousers_back_1779288964552.png',
                'wool_trouser_back_1779290652871.png'
            ]
            const wrongPantRefs = wrongPantFilenames.map(f => assetMap[f.toLowerCase()]).filter(Boolean)

            // We only allow these pants on specific trousers matching their style
            let allowGurkha = slug.includes('gurkha') && cat === 'trousers'
            let allowTuscan = slug.includes('tuscan') && cat === 'trousers'
            let allowWool = (slug.includes('wool') || slug.includes('pleated')) && cat === 'trousers'

            finalImages = finalImages.filter(img => {
                const ref = img.asset?._ref
                if (!ref) return true
                if (wrongPantRefs.includes(ref)) {
                    const filename = assetIdToFilenameMap[ref]
                    if (filename === 'gurkha_trouser_back_1779290599911.png' && !allowGurkha) {
                        productChanged = true
                        return false
                    }
                    if (filename === 'tuscan_trousers_back_1779288964552.png' && !allowTuscan) {
                        productChanged = true
                        return false
                    }
                    if (filename === 'wool_trouser_back_1779290652871.png' && !allowWool) {
                        productChanged = true
                        return false
                    }
                }
                return true
            })

            // Fix explicitly wrong mismatched secondaries
            let isMismatched = false

            const isWatch = slug.includes('watch') || slug.includes('chronograph') || title.toLowerCase().includes('watch') || title.toLowerCase().includes('chronograph')

            if (slug === 'the-essential-jogger') {
                // Wrong image: tuscan_trousers_back. Replace with cashmere_hoodie_back as a comfortable grey loungewear back view
                const replacement = getAssetRef('cashmere_hoodie_back_1779291571486.png')
                if (replacement) {
                    console.log(`🔧 Repairing mismatched secondary for "${title}" - Variant "${colorName}"`)
                    finalImages = [uniqueImages[0], replacement]
                    isMismatched = true
                    productChanged = true
                }
            } else if (slug === 'the-heavyweight-hoodie') {
                const replacement = getAssetRef('cashmere_hoodie_back_1779291571486.png')
                if (replacement) {
                    console.log(`🔧 Repairing mismatched secondary for "${title}" - Variant "${colorName}"`)
                    finalImages = [uniqueImages[0], replacement]
                    isMismatched = true
                    productChanged = true
                }
            } else if (slug === 'the-textured-knit-polo') {
                if (colorLower.includes('cream')) {
                    const replacement = getAssetRef('heritage_polo_detail_1779289051405.png')
                    if (replacement) {
                        console.log(`🔧 Repairing mismatched secondary for "${title}" - Variant "${colorName}"`)
                        finalImages = [uniqueImages[0], replacement]
                        isMismatched = true
                        productChanged = true
                    }
                } else if (colorLower.includes('navy')) {
                    const replacement = getAssetRef('cable_knit_navy_back_1779290514853.png')
                    if (replacement) {
                        console.log(`🔧 Repairing mismatched secondary for "${title}" - Variant "${colorName}"`)
                        finalImages = [uniqueImages[0], replacement]
                        isMismatched = true
                        productChanged = true
                    }
                }
            } else if (slug === 'the-desert-boot') {
                const replacement = getAssetRef('chelsea_boot_flat_1771017747862.png') || getAssetRef('flat_chelsea_boot_1770228040345.png')
                if (replacement) {
                    console.log(`🔧 Repairing mismatched secondary for "${title}" - Variant "${colorName}"`)
                    finalImages = [uniqueImages[0], replacement]
                    isMismatched = true
                    productChanged = true
                }
            } else if (slug === 'the-bridle-leather-belt') {
                // Belt has duffel bag images. Remove the duffel bag and just keep the belt flat.
                console.log(`🔧 Repairing mismatched secondary (duffel bag) for "${title}"`)
                finalImages = [uniqueImages[0]]
                isMismatched = true
                productChanged = true
            } else if (isWatch) {
                // Watch has duffel bag images. Remove it and just keep the watch.
                console.log(`🔧 Repairing mismatched secondary (duffel bag) for watch "${title}"`)
                finalImages = [uniqueImages[0]]
                isMismatched = true
                productChanged = true
            } else if (slug === 'the-harbour-stripe-swim') {
                // Swimwear has seersucker trousers. Remove it.
                console.log(`🔧 Repairing mismatched secondary (seersucker trousers) for swimwear "${title}"`)
                finalImages = [uniqueImages[0]]
                isMismatched = true
                productChanged = true
            }

            // If the images count was reduced or if we need to enrich it, append high-aesthetic detail/back shots
            if (finalImages.length < 3) {
                // Classify color category
                let isLightColor = colorLower.includes('cream') || colorLower.includes('white') || 
                                   colorLower.includes('sand') || colorLower.includes('beige') || 
                                   colorLower.includes('khaki') || colorLower.includes('oatmeal') || 
                                   colorLower.includes('stone') || colorLower.includes('ecru') || 
                                   colorLower.includes('tan') || colorLower.includes('silver')

                let isDarkColor = colorLower.includes('navy') || colorLower.includes('black') || 
                                  colorLower.includes('charcoal') || colorLower.includes('dark') || 
                                  colorLower.includes('indigo') || colorLower.includes('midnight') || 
                                  colorLower.includes('onyx') || colorLower.includes('forest') || 
                                  colorLower.includes('olive') || colorLower.includes('brown')

                const additions = []

                if (isWatch || slug === 'the-bridle-leather-belt') {
                    // For watches and belts, duplicate their own primary image to get 3 matching images instead of different products!
                    const primaryRef = finalImages[0]?.asset?._ref
                    if (primaryRef) {
                        while (finalImages.length < 3) {
                            finalImages.push({
                                _type: 'image',
                                asset: { _type: 'reference', _ref: primaryRef }
                            })
                            productChanged = true
                        }
                    }
                } else {
                    if (cat === 'knitwear') {
                        if (isLightColor) {
                            additions.push('cable_knit_cream_back_1779290478632.png')
                            additions.push('heritage_polo_detail_1779289051405.png')
                        } else {
                            additions.push('cable_knit_navy_back_1779290514853.png')
                            additions.push('quarter_zip_back_1779290562573.png')
                        }
                    } else if (cat === 'shirting' || cat === 'shirts') {
                        if (isLightColor) {
                            additions.push('amalfi_popover_back_1779288908233.png')
                            additions.push('amalfi_popover_detail_1779288938199.png')
                        } else {
                            additions.push('riviera_shirt_back_1779289012029.png') // Riviera back
                            additions.push('signature_tee_white_detail_1779438536951.png')
                        }
                    } else if (cat === 'trousers') {
                        if (slug.includes('gurkha')) {
                            additions.push('gurkha_trouser_back_1779290599911.png')
                        } else if (slug.includes('wool') || slug.includes('pleated')) {
                            additions.push('wool_trouser_back_1779290652871.png')
                        } else if (slug.includes('tuscan')) {
                            additions.push('tuscan_trousers_back_1779288964552.png')
                        }
                    } else if (cat === 'shorts') {
                        if (isLightColor) {
                            additions.push('linen_shorts_beige_flat_1779436301372.png')
                        } else {
                            additions.push('navy_swim_shorts_flat_1779436277004.png')
                        }
                    } else if (cat === 'lounge') {
                        if (slug.includes('hoodie')) {
                            additions.push('cashmere_hoodie_back_1779291571486.png')
                        } else if (slug.includes('jogger')) {
                            additions.push('lounge_joggers_grey_flat_1779436378908.png')
                        }
                    } else if (cat === 'jackets' || cat === 'outerwear') {
                        additions.push('harrington_back_1779290699671.png')
                        additions.push('chore_coat_back_1779290738145.png')
                    } else if (cat === 'footwear') {
                        additions.push('chelsea_loafer_angle_1779289108716.png')
                    } else if (cat === 'accessories') {
                        // Only bags get voyager_duffel_inside
                        additions.push('voyager_duffel_inside_1779289173569.png')
                    } else if (cat === 'sets') {
                        if (isLightColor) {
                            additions.push('amalfi_popover_back_1779288908233.png')
                            additions.push('amalfi_popover_detail_1779288938199.png')
                        } else {
                            additions.push('cable_knit_navy_back_1779290514853.png')
                            additions.push('daily_oxford_navy_detail_1779438559419.png')
                        }
                    } else if (cat === 'swimwear') {
                        if (isDarkColor) {
                            additions.push('navy_swim_shorts_flat_1779436277004.png')
                            additions.push('daily_oxford_navy_detail_1779438559419.png')
                        } else {
                            additions.push('flat_sunset_swim_1770420462243.png')
                            additions.push('amalfi_popover_detail_1779288938199.png')
                        }
                    }

                    // Append matching additions if they exist in sanity assets and are not already in the variant
                    for (const filename of additions) {
                        const addImg = getAssetRef(filename)
                        if (addImg && addImg.asset?._ref) {
                            const ref = addImg.asset._ref
                            // Make sure we don't add duplicate assets or duplicate the first image
                            const currentRefs = finalImages.map(img => img.asset?._ref).filter(Boolean)
                            if (!currentRefs.includes(ref)) {
                                finalImages.push({
                                    _type: 'image',
                                    asset: { _type: 'reference', _ref: ref }
                                })
                                productChanged = true
                            }
                        }
                    }
                }
            }

            // If we still have less than 3 images after all enrichment attempts, pad with duplicates of existing images
            if (finalImages.length < 3 && finalImages.length > 0) {
                const primaryRef = finalImages[0]?.asset?._ref
                const secondaryRef = finalImages[1]?.asset?._ref || primaryRef
                while (finalImages.length < 3) {
                    finalImages.push({
                        _type: 'image',
                        asset: { _type: 'reference', _ref: finalImages.length === 1 ? primaryRef : secondaryRef }
                    })
                    productChanged = true
                }
            }

            // Assign clean, unique keys to all images in the variant
            const finalVariantImages = finalImages.map(img => ({
                ...img,
                _key: genKey()
            }))

            updatedVariants.push({
                ...v,
                images: finalVariantImages
            })
        }

        if (productChanged) {
            try {
                console.log(`   Applying image patches and enrichments to "${p.title}" (${p.slug})...`)
                await client.patch(p._id).set({ variants: updatedVariants }).commit()
                console.log(`   ✅ Success! "${p.title}" enriched.`)
                totalPatched++
            } catch (err: any) {
                console.error(`   ❌ Failed to patch product "${p.title}":`, err.message)
            }
        } else {
            updatedVariants.push(...p.variants) // no changes
        }
    }

    console.log(`\n🏁 Done! Systematically audited and patched/enriched images for ${totalPatched} products.`)
}

main().catch(console.error)
