import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { ALL_PRODUCTS } from './restore-mega'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing env var: SANITY_API_TOKEN')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const BRAIN_DIR = "/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f"

// Helper to generate a unique key
const genKey = () => Math.random().toString(36).slice(2, 9)

async function uploadFileToSanity(filePath: string, filename: string): Promise<string | null> {
    if (!fs.existsSync(filePath)) {
        console.warn(`   ⚠️ Local file not found: ${filePath}`)
        return null
    }
    try {
        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, { filename })
        return asset._id
    } catch (err) {
        console.error(`   ❌ Failed to upload asset ${filename}:`, err)
        return null
    }
}

async function cleanAndPad() {
    console.log('🚀 Starting Robust Database Gallery Purge & Model Image Enrichment...\n')

    // 1. Fetch all assets from Sanity to map filenames -> asset IDs
    console.log('🔍 Fetching all image assets from Sanity...')
    const allAssets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id, originalFilename }`)
    console.log(`📸 Found ${allAssets.length} image assets in Sanity database.`)

    const assetMap: Record<string, string> = {}
    for (const asset of allAssets) {
        if (asset.originalFilename) {
            assetMap[asset.originalFilename.toLowerCase()] = asset._id
        }
    }

    // 2. Locate and Upload the high-quality custom generated images
    console.log('\n📥 Locating new custom campaign model images...')
    const brainFiles = fs.existsSync(BRAIN_DIR) ? fs.readdirSync(BRAIN_DIR) : []
    
    const denimFile = brainFiles.find(f => f.startsWith('selvedge_denim_model_angle_') && f.endsWith('.png'))
    const shortsFile = brainFiles.find(f => f.startsWith('linen_shorts_model_angle_') && f.endsWith('.png'))
    const oxfordFile = brainFiles.find(f => f.startsWith('oxford_blue_shirt_model_') && f.endsWith('.png'))
    const harringtonFile = brainFiles.find(f => f.startsWith('harrington_navy_model_') && f.endsWith('.png'))
    const crewneckFile = brainFiles.find(f => f.startsWith('merino_crewneck_navy_model_') && f.endsWith('.png'))
    const pleatedTrouserFile = brainFiles.find(f => f.startsWith('pleated_wool_trouser_grey_model_') && f.endsWith('.png'))
    const texturedKnitPoloFile = brainFiles.find(f => f.startsWith('textured_knit_polo_cream_model_') && f.endsWith('.png'))

    let denimAssetId: string | null = denimFile ? (assetMap[denimFile.toLowerCase()] || null) : null
    let shortsAssetId: string | null = shortsFile ? (assetMap[shortsFile.toLowerCase()] || null) : null
    let oxfordAssetId: string | null = oxfordFile ? (assetMap[oxfordFile.toLowerCase()] || null) : null
    let harringtonAssetId: string | null = harringtonFile ? (assetMap[harringtonFile.toLowerCase()] || null) : null
    let crewneckAssetId: string | null = crewneckFile ? (assetMap[crewneckFile.toLowerCase()] || null) : null
    let pleatedTrouserAssetId: string | null = pleatedTrouserFile ? (assetMap[pleatedTrouserFile.toLowerCase()] || null) : null
    let texturedKnitPoloAssetId: string | null = texturedKnitPoloFile ? (assetMap[texturedKnitPoloFile.toLowerCase()] || null) : null

    // Upload them if not in database
    if (denimFile && !denimAssetId) {
        console.log(`📤 Uploading denim model image: ${denimFile}...`)
        denimAssetId = await uploadFileToSanity(path.join(BRAIN_DIR, denimFile), denimFile)
        if (denimAssetId) assetMap[denimFile.toLowerCase()] = denimAssetId
    }
    if (shortsFile && !shortsAssetId) {
        console.log(`📤 Uploading shorts model image: ${shortsFile}...`)
        shortsAssetId = await uploadFileToSanity(path.join(BRAIN_DIR, shortsFile), shortsFile)
        if (shortsAssetId) assetMap[shortsFile.toLowerCase()] = shortsAssetId
    }
    if (oxfordFile && !oxfordAssetId) {
        console.log(`📤 Uploading oxford model image: ${oxfordFile}...`)
        oxfordAssetId = await uploadFileToSanity(path.join(BRAIN_DIR, oxfordFile), oxfordFile)
        if (oxfordAssetId) assetMap[oxfordFile.toLowerCase()] = oxfordAssetId
    }
    if (harringtonFile && !harringtonAssetId) {
        console.log(`📤 Uploading harrington model image: ${harringtonFile}...`)
        harringtonAssetId = await uploadFileToSanity(path.join(BRAIN_DIR, harringtonFile), harringtonFile)
        if (harringtonAssetId) assetMap[harringtonFile.toLowerCase()] = harringtonAssetId
    }
    if (crewneckFile && !crewneckAssetId) {
        console.log(`📤 Uploading merino crewneck model image: ${crewneckFile}...`)
        crewneckAssetId = await uploadFileToSanity(path.join(BRAIN_DIR, crewneckFile), crewneckFile)
        if (crewneckAssetId) assetMap[crewneckFile.toLowerCase()] = crewneckAssetId
    }
    if (pleatedTrouserFile && !pleatedTrouserAssetId) {
        console.log(`📤 Uploading pleated wool trouser model image: ${pleatedTrouserFile}...`)
        pleatedTrouserAssetId = await uploadFileToSanity(path.join(BRAIN_DIR, pleatedTrouserFile), pleatedTrouserFile)
        if (pleatedTrouserAssetId) assetMap[pleatedTrouserFile.toLowerCase()] = pleatedTrouserAssetId
    }
    if (texturedKnitPoloFile && !texturedKnitPoloAssetId) {
        console.log(`📤 Uploading textured knit polo model image: ${texturedKnitPoloFile}...`)
        texturedKnitPoloAssetId = await uploadFileToSanity(path.join(BRAIN_DIR, texturedKnitPoloFile), texturedKnitPoloFile)
        if (texturedKnitPoloAssetId) assetMap[texturedKnitPoloFile.toLowerCase()] = texturedKnitPoloAssetId
    }

    console.log('📌 Campaign Asset IDs:')
    console.log(`  ├─ Denim Model: ${denimAssetId}`)
    console.log(`  ├─ Shorts Model: ${shortsAssetId}`)
    console.log(`  ├─ Oxford Model: ${oxfordAssetId}`)
    console.log(`  ├─ Harrington Model: ${harringtonAssetId}`)
    console.log(`  ├─ Merino Crewneck Model: ${crewneckAssetId}`)
    console.log(`  ├─ Pleated Wool Trouser Model: ${pleatedTrouserAssetId}`)
    console.log(`  └─ Textured Knit Polo Model: ${texturedKnitPoloAssetId}`)

    // 3. Query all products from Sanity
    console.log('\n🔍 Fetching all products from live Sanity database...')
    const dbProducts = await client.fetch(`*[_type == "product"]{ _id, title, "slug": slug.current, category, variants }`)
    console.log(`📦 Found ${dbProducts.length} live products.`)

    let totalPatched = 0

    // Loop through each database product
    for (const dbProduct of dbProducts) {
        const slug = dbProduct.slug
        const category = dbProduct.category || ''
        
        // Find matching product definition in the seeder
        const seedProduct = ALL_PRODUCTS.find(p => p.slug === slug || p.title === dbProduct.title)
        
        if (!seedProduct) {
            console.log(`⏭️  No seeder mapping for product: "${dbProduct.title}" (${slug}). Skipping...`)
            continue
        }

        if (!dbProduct.variants || !Array.isArray(dbProduct.variants) || dbProduct.variants.length === 0) {
            continue
        }

        let productChanged = false
        const updatedVariants = []

        // Iterate over the live product's variants
        for (let vIndex = 0; vIndex < dbProduct.variants.length; vIndex++) {
            const dbVariant = dbProduct.variants[vIndex]
            const colorName = dbVariant.colorName || 'Default'

            // Find matching variant in seeder
            let seedVariant = seedProduct.variants.find(sv => sv.colorName === colorName)
            if (!seedVariant && seedProduct.variants.length > vIndex) {
                seedVariant = seedProduct.variants[vIndex] // fallback by index
            }

            if (!seedVariant) {
                console.log(`⚠️  No seeder variant match for "${dbProduct.title}" variant: "${colorName}". Keeping as-is.`)
                updatedVariants.push(dbVariant)
                continue
            }

            // A. Reconstruct clean list of image asset references based strictly on the seeder
            const cleanRefs: string[] = []

            for (const img of seedVariant.images) {
                let assetId: string | null = null
                if (img.ref) {
                    assetId = img.ref
                } else if (img.file) {
                    assetId = assetMap[img.file.toLowerCase()] || null
                }

                if (assetId) {
                    // APPLY STRICT CROSS-PRODUCT MUTATION PURGING!
                    const fileName = (img.file || '').toLowerCase()
                    
                    // 1. Prohibit Amalfi popover back & detail from other products
                    if (slug !== 'the-amalfi-linen-popover' && 
                        (fileName.includes('amalfi_popover_back') || fileName.includes('amalfi_popover_detail'))) {
                        continue
                    }

                    // 2. Prohibit Oxford detail from other products
                    if (slug !== 'the-daily-oxford' && 
                        (fileName.includes('daily_oxford_navy_detail') || fileName.includes('daily_oxford_sand_detail'))) {
                        continue
                    }

                    // 3. Prohibit trousers/pants backs from non-trousers/pants
                    if (category !== 'trousers' && category !== 'pants' &&
                        (fileName.includes('tuscan_trousers_back') || 
                         fileName.includes('gurkha_trouser_back') || 
                         fileName.includes('wool_trouser_back') || 
                         fileName.includes('trouser_sand_flat_generic'))) {
                        continue
                    }

                    // 4. Prohibit turtleneck images from non-turtlenecks
                    if (slug !== 'the-merino-turtleneck' && slug !== 'the-scholar-turtleneck' &&
                        (fileName.includes('merino_turtleneck') || 
                         fileName.includes('turtleneck_detail') || 
                         fileName.includes('turtelneck.jpg'))) {
                        continue
                    }

                    // 5. Prohibit signature tee detail from non-signature tees
                    if (slug !== 'the-signature-tee' && fileName.includes('signature_tee')) {
                        continue
                    }

                    // 6. Prohibit Chelsea loafer angle from non-Chelsea footwear
                    if (slug !== 'the-chelsea-suede-loafer' && fileName.includes('chelsea_loafer_angle')) {
                        continue
                    }

                    // 7. Prohibit voyager duffel images from non-duffel accessories
                    if (slug !== 'the-voyager-leather-duffel' && 
                        (fileName.includes('voyager_duffel_inside') || fileName.includes('voyager_duffel_flat'))) {
                        continue
                    }

                    // 8. Prohibit chore coat backs from non-chore coats
                    if (slug !== 'the-canvas-chore-coat' && fileName.includes('chore_coat_back')) {
                        continue
                    }

                    // 9. Prohibit harrington back from non-harrington
                    if (slug !== 'the-classic-harrington' && fileName.includes('harrington_back')) {
                        continue
                    }

                    // 10. Prohibit cable knit zip back from non-zip sweaters
                    if (slug !== 'the-archive-cable-knit-zip' && fileName.includes('cable_zip_back')) {
                        continue
                    }

                    // 11. Prohibit cashmere hoodie back from non-cashmere hoodies
                    if (slug !== 'the-haven-cashmere-hoodie' && fileName.includes('cashmere_hoodie_back')) {
                        continue
                    }

                    // 12. Prohibit cashmere vest back from non-vests
                    if (slug !== 'the-sterling-cashmere-vest' && fileName.includes('cashmere_vest_back')) {
                        continue
                    }

                    // 13. Prohibit cable knit backs from non-cable knit sweaters
                    if (slug !== 'the-heritage-cable-knit' && 
                        (fileName.includes('cable_knit_cream_back') || fileName.includes('cable_knit_navy_back'))) {
                        continue
                    }

                    // 14. Prohibit Aegean flat image from non-Aegean
                    if (slug !== 'the-aegean-odyssey' && fileName.includes('flat_aegean_m_1')) {
                        continue
                    }

                    if (!cleanRefs.includes(assetId)) {
                        cleanRefs.push(assetId)
                    }
                }
            }

            // B. Inject our custom-generated high-aesthetic campaign model-wear images specifically for correct items!
            if (slug === 'the-oxford-blue-shirt' && oxfordAssetId) {
                if (!cleanRefs.includes(oxfordAssetId)) cleanRefs.push(oxfordAssetId)
            }
            if (slug === 'the-classic-harrington' && harringtonAssetId) {
                if (!cleanRefs.includes(harringtonAssetId)) cleanRefs.push(harringtonAssetId)
            }
            if (slug === 'vintage-wash-selvedge-denim' && denimAssetId) {
                if (!cleanRefs.includes(denimAssetId)) cleanRefs.push(denimAssetId)
            }
            if ((slug === 'the-riviera-linen-short' || slug === 'the-urban-explorer-edit') && shortsAssetId) {
                if (!cleanRefs.includes(shortsAssetId)) cleanRefs.push(shortsAssetId)
            }
            // --- NEW ENRICHMENTS ---
            if (slug === 'the-merino-crewneck' && crewneckAssetId) {
                if (!cleanRefs.includes(crewneckAssetId)) cleanRefs.push(crewneckAssetId)
            }
            if ((slug === 'the-pleated-wool-trouser' || slug === 'the-tailored-gurkha-trouser') && pleatedTrouserAssetId) {
                if (!cleanRefs.includes(pleatedTrouserAssetId)) cleanRefs.push(pleatedTrouserAssetId)
            }
            if (slug === 'the-textured-knit-polo' && texturedKnitPoloAssetId) {
                if (!cleanRefs.includes(texturedKnitPoloAssetId)) cleanRefs.push(texturedKnitPoloAssetId)
            }

            // C. Validate and pad the unique image asset list using the variant's OWN images to satisfy the 3-image gallery requirement
            const finalRefs = [...cleanRefs]

            if (finalRefs.length > 0) {
                const primaryRef = finalRefs[0]
                const secondaryRef = finalRefs[1] || primaryRef
                
                while (finalRefs.length < 3) {
                    finalRefs.push(finalRefs.length === 1 ? primaryRef : secondaryRef)
                }
            } else {
                console.warn(`  ⚠️ Variant "${colorName}" on "${dbProduct.title}" has zero base images.`)
            }

            // D. Format the image objects for Sanity with clean keys
            const finalImages = finalRefs.map(ref => ({
                _type: 'image',
                _key: genKey(),
                asset: { _type: 'reference', _ref: ref }
            }))

            // Check if changes have been made compared to the current variant images
            const currentRefs = (dbVariant.images || []).map((img: any) => img.asset?._ref).filter(Boolean)
            const matchesCurrent = currentRefs.length === finalRefs.length && currentRefs.every((ref: string, idx: number) => ref === finalRefs[idx])

            if (!matchesCurrent) {
                productChanged = true
            }

            updatedVariants.push({
                ...dbVariant,
                images: finalImages
            })
        }

        // Apply patches back to Sanity if anything changed
        if (productChanged) {
            try {
                console.log(`🧹 Purging & padding gallery for "${dbProduct.title}" (${slug})...`)
                await client.patch(dbProduct._id).set({ variants: updatedVariants }).commit()
                console.log(`   ✅ Success! Saved clean variants.`)
                totalPatched++
            } catch (err: any) {
                console.error(`   ❌ Failed to patch product "${dbProduct.title}":`, err.message)
            }
        }
    }

    console.log(`\n🏁 Done! Systematically purged and padded image galleries for ${totalPatched} products.`)
}

cleanAndPad().catch(console.error)
