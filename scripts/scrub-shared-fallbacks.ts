import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

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

async function runScrubAndEnrich() {
    console.log('🚀 Starting Pure Bespoke Product Images & Cross-Product Purging...\n')

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

    const findAssetIdByPrefix = (prefix: string) => {
        const key = Object.keys(assetMap).find(k => k.startsWith(prefix.toLowerCase()));
        return key ? assetMap[key] : null;
    }

    // 2. Scan the brain directory and upload key assets
    const brainFiles = fs.existsSync(BRAIN_DIR) ? fs.readdirSync(BRAIN_DIR) : []
    console.log(`📂 Found ${brainFiles.length} files in the brain directory.`)

    const findBrainFile = (prefix: string) => {
        return brainFiles.find(f => f.toLowerCase().startsWith(prefix.toLowerCase()) && f.endsWith('.png'))
    }

    // List of assets we want to ensure are in Sanity
    const assetPrefixes = {
        selvedgeDenim: 'selvedge_denim_model_angle_',
        linenShorts: 'linen_shorts_model_angle_',
        oxfordBlueModel: 'oxford_blue_shirt_model_',
        harringtonModel: 'harrington_navy_model_',
        merinoCrewneckModel: 'merino_crewneck_navy_model_',
        pleatedWoolTrouserModel: 'pleated_wool_trouser_grey_model_',
        texturedKnitPoloModel: 'textured_knit_polo_cream_model_',
        rivieraLinenWhiteModel: 'riviera_linen_shirt_white_model_',
        dailyOxfordNavyModel: 'daily_oxford_navy_model_',
        rivieraResortTerracottaModel: 'riviera_resort_terracotta_model_',
        breezyLinenWhiteDetail: 'breezy_linen_white_detail_',
        breezyLinenBlueModel: 'breezy_linen_blue_model_',
        dailyOxfordSandModel: 'daily_oxford_sand_model_',
        rivieraResortTerracottaFlat: 'riviera_resort_terracotta_flat_',
        rivieraResortTerracottaDetail: 'riviera_resort_terracotta_detail_',
        breezyLinenWhiteFlat: 'breezy_linen_white_flat_',
        breezyLinenWhiteModel: 'breezy_linen_white_model_',
        breezyLinenBlueFlat: 'breezy_linen_blue_flat_',
        breezyLinenBlueDetail: 'breezy_linen_blue_detail_'
    }

    const uploadedAssets: Record<string, string | null> = {}

    for (const [key, prefix] of Object.entries(assetPrefixes)) {
        const localFile = findBrainFile(prefix)
        if (localFile) {
            let assetId = assetMap[localFile.toLowerCase()] || null
            if (!assetId) {
                console.log(`📤 Uploading local brain asset: ${localFile}...`)
                assetId = await uploadFileToSanity(path.join(BRAIN_DIR, localFile), localFile)
                if (assetId) assetMap[localFile.toLowerCase()] = assetId
            } else {
                console.log(`✅ Asset already uploaded: ${localFile} (${assetId})`)
            }
            uploadedAssets[key] = assetId
        } else {
            console.warn(`⚠️ Local brain file for prefix "${prefix}" not found.`)
            uploadedAssets[key] = null
        }
    }

    // 3. Query all products from Sanity
    console.log('\n🔍 Fetching all products from live Sanity database...')
    const dbProducts = await client.fetch(`*[_type == "product"]{ _id, title, "slug": slug.current, category, variants[]{ ..., images[]{ "assetId": asset->_id, "filename": asset->originalFilename } } }`)
    console.log(`📦 Found ${dbProducts.length} live products.`)

    let totalPatched = 0

    // Loop through each product
    for (const dbProduct of dbProducts) {
        const slug = dbProduct.slug
        const category = (dbProduct.category || '').toLowerCase()
        
        if (!dbProduct.variants || !Array.isArray(dbProduct.variants) || dbProduct.variants.length === 0) {
            continue
        }

        let productChanged = false
        const updatedVariants = []

        for (const dbVariant of dbProduct.variants) {
            const colorName = dbVariant.colorName || 'Default'
            const currentImages = dbVariant.images || []
            
            // A. Reconstruct clean list of image asset IDs, removing prohibited files
            const cleanRefs: string[] = []

            for (const img of currentImages) {
                const assetId = img.assetId
                const fileName = (img.filename || '').toLowerCase()

                if (!assetId) continue

                // 1. Prohibit Amalfi popover back & detail from other products
                if (slug !== 'the-amalfi-linen-popover' && 
                    (fileName.includes('amalfi_popover_back') || fileName.includes('amalfi_popover_detail'))) {
                    continue
                }

                // 2. Prohibit Oxford details and navy model from other products
                if (slug !== 'the-daily-oxford' && 
                    (fileName.includes('daily_oxford_navy_detail') || fileName.includes('daily_oxford_sand_detail') || fileName.includes('daily_oxford_navy_model'))) {
                    continue
                }

                // 3. Prohibit Riviera linen shirt white model from other products
                if (slug !== 'the-riviera-linen-shirt' && fileName.includes('riviera_linen_shirt_white_model')) {
                    continue
                }

                // 4. Prohibit Riviera resort shirt terracotta model from other products
                if (slug !== 'the-riviera-resort-shirt' && fileName.includes('riviera_resort_terracotta_model')) {
                    continue
                }

                // 5. Prohibit breezy linen resort shirt details from other products
                if (slug !== 'breezy-linen-resort-shirt' && 
                    (fileName.includes('breezy_linen_white_detail') || fileName.includes('breezy_linen_blue_model'))) {
                    continue
                }

                // 6. Prohibit trousers/shorts/pants back & model shots from non-trousers/shorts/pants
                if (category !== 'trousers' && category !== 'pants' && category !== 'shorts' && category !== 'jeans' && category !== 'activewear' &&
                    (fileName.includes('tuscan_trousers_back') || 
                     fileName.includes('gurkha_trouser_back') || 
                     fileName.includes('wool_trouser_back') || 
                     fileName.includes('trouser_sand_flat_generic') ||
                     fileName.includes('pleated_wool_trouser_grey_model') ||
                     fileName.includes('linen_shorts_model_angle') ||
                     fileName.includes('flat_pleated_chino_navy') ||
                     fileName.includes('selvedge_denim_model_angle'))) {
                    continue
                }

                // 7. Strict cross-trouser/shorts separations
                if (category === 'trousers' || category === 'pants' || category === 'shorts' || category === 'jeans' || category === 'activewear') {
                    // "The Tailored Gurkha Trouser" should not share Pleated Wool Trouser model or generic flat sand trouser
                    if (slug === 'the-tailored-gurkha-trouser' && 
                        (fileName.includes('pleated_wool_trouser_grey_model') || fileName.includes('trouser_sand_flat_generic'))) {
                        continue
                    }
                    // "The Pleated Wool Trouser" should not share generic flat sand trouser
                    if (slug === 'the-pleated-wool-trouser' && fileName.includes('trouser_sand_flat_generic')) {
                        continue
                    }
                    // "The Urban Explorer Edit" should not share the Riviera Linen Short model
                    if (slug === 'the-urban-explorer-edit' && fileName.includes('linen_shorts_model_angle')) {
                        continue
                    }
                    // "Everyday Chino Trouser" should not share flat pleated chino navy
                    if (slug === 'everyday-chino-trouser' && fileName.includes('flat_pleated_chino_navy')) {
                        continue
                    }
                }

                // 8. Prohibit turtleneck images from non-turtlenecks
                if (slug !== 'the-merino-turtleneck' && slug !== 'the-scholar-turtleneck' &&
                    (fileName.includes('merino_turtleneck') || 
                     fileName.includes('turtleneck_detail') || 
                     fileName.includes('turtelneck.jpg'))) {
                    continue
                }

                // 9. Prohibit signature tee detail from non-signature tees
                if (slug !== 'the-signature-tee' && fileName.includes('signature_tee')) {
                    continue
                }

                // 10. Prohibit Chelsea loafer angle from non-Chelsea footwear
                if (slug !== 'the-chelsea-suede-loafer' && fileName.includes('chelsea_loafer_angle')) {
                    continue
                }

                // 11. Prohibit voyager duffel images from non-duffel accessories
                if (slug !== 'the-voyager-leather-duffel' && 
                    (fileName.includes('voyager_duffel_inside') || fileName.includes('voyager_duffel_flat'))) {
                    continue
                }

                // 12. Prohibit chore coat backs from non-chore coats
                if (slug !== 'the-canvas-chore-coat' && fileName.includes('chore_coat_back')) {
                    continue
                }

                // 13. Prohibit harrington back & model from non-harringtons
                if (slug !== 'the-classic-harrington' && 
                    (fileName.includes('harrington_back') || fileName.includes('harrington_navy_model'))) {
                    continue
                }

                // 14. Prohibit cable knit zip back from non-zip sweaters
                if (slug !== 'the-archive-cable-knit-zip' && fileName.includes('cable_zip_back')) {
                    continue
                }

                // 15. Prohibit cashmere hoodie back from non-cashmere hoodies
                if (slug !== 'the-haven-cashmere-hoodie' && fileName.includes('cashmere_hoodie_back')) {
                    continue
                }

                // 16. Prohibit cashmere vest back from non-vests
                if (slug !== 'the-sterling-cashmere-vest' && fileName.includes('cashmere_vest_back')) {
                    continue
                }

                // 17. Prohibit cable knit backs from non-cable knit sweaters
                if (slug !== 'the-heritage-cable-knit' && 
                    (fileName.includes('cable_knit_cream_back') || fileName.includes('cable_knit_navy_back'))) {
                    continue
                }

                // 18. Prohibit textured knit polo model from non-textured knit polos
                if (slug !== 'the-textured-knit-polo' && fileName.includes('textured_knit_polo_cream_model')) {
                    continue
                }

                if (!cleanRefs.includes(assetId)) {
                    cleanRefs.push(assetId)
                }
            }

            // B. Inject our custom-generated high-aesthetic campaign/detail images specifically for correct items!
            if (slug === 'the-riviera-linen-shirt' && colorName === 'White' && uploadedAssets.rivieraLinenWhiteModel) {
                if (!cleanRefs.includes(uploadedAssets.rivieraLinenWhiteModel)) {
                    cleanRefs.push(uploadedAssets.rivieraLinenWhiteModel)
                }
            }
            if (slug === 'the-daily-oxford' && colorName === 'Midnight Navy' && uploadedAssets.dailyOxfordNavyModel) {
                if (!cleanRefs.includes(uploadedAssets.dailyOxfordNavyModel)) {
                    cleanRefs.push(uploadedAssets.dailyOxfordNavyModel)
                }
            }
            if (slug === 'the-riviera-resort-shirt' && colorName === 'Terracotta & Cream' && uploadedAssets.rivieraResortTerracottaModel) {
                if (!cleanRefs.includes(uploadedAssets.rivieraResortTerracottaModel)) {
                    cleanRefs.push(uploadedAssets.rivieraResortTerracottaModel)
                }
            }
            if (slug === 'breezy-linen-resort-shirt' && colorName === 'Crisp White' && uploadedAssets.breezyLinenWhiteDetail) {
                if (!cleanRefs.includes(uploadedAssets.breezyLinenWhiteDetail)) {
                    cleanRefs.push(uploadedAssets.breezyLinenWhiteDetail)
                }
            }
            if (slug === 'breezy-linen-resort-shirt' && colorName === 'Sky Blue' && uploadedAssets.breezyLinenBlueModel) {
                if (!cleanRefs.includes(uploadedAssets.breezyLinenBlueModel)) {
                    cleanRefs.push(uploadedAssets.breezyLinenBlueModel)
                }
            }
            if (slug === 'the-classic-harrington' && uploadedAssets.harringtonModel) {
                if (!cleanRefs.includes(uploadedAssets.harringtonModel)) {
                    cleanRefs.push(uploadedAssets.harringtonModel)
                }
            }
            if (slug === 'vintage-wash-selvedge-denim' && uploadedAssets.selvedgeDenim) {
                if (!cleanRefs.includes(uploadedAssets.selvedgeDenim)) {
                    cleanRefs.push(uploadedAssets.selvedgeDenim)
                }
            }
            if (slug === 'the-riviera-linen-short' && uploadedAssets.linenShorts) {
                if (!cleanRefs.includes(uploadedAssets.linenShorts)) {
                    cleanRefs.push(uploadedAssets.linenShorts)
                }
            }
            if (slug === 'the-merino-crewneck' && uploadedAssets.merinoCrewneckModel) {
                if (!cleanRefs.includes(uploadedAssets.merinoCrewneckModel)) {
                    cleanRefs.push(uploadedAssets.merinoCrewneckModel)
                }
            }
            if (slug === 'the-pleated-wool-trouser' && uploadedAssets.pleatedWoolTrouserModel) {
                if (!cleanRefs.includes(uploadedAssets.pleatedWoolTrouserModel)) {
                    cleanRefs.push(uploadedAssets.pleatedWoolTrouserModel)
                }
            }
            if (slug === 'the-textured-knit-polo' && uploadedAssets.texturedKnitPoloModel) {
                if (!cleanRefs.includes(uploadedAssets.texturedKnitPoloModel)) {
                    cleanRefs.push(uploadedAssets.texturedKnitPoloModel)
                }
            }

            // C. Validate and pad the unique image asset list using the variant's OWN images to satisfy the 3-image gallery requirement
            let customGalleryRefs: string[] | null = null;

            if (slug === 'the-daily-oxford') {
                if (colorName === 'Midnight Navy') {
                    const flat = findAssetIdByPrefix('daily_oxford_navy_flat_');
                    const detail = findAssetIdByPrefix('daily_oxford_navy_detail_');
                    const model = uploadedAssets.dailyOxfordNavyModel || findAssetIdByPrefix('daily_oxford_navy_model_');
                    if (flat && detail && model) {
                        customGalleryRefs = [flat, detail, model];
                    }
                } else if (colorName === 'Dune Sand') {
                    const flat = findAssetIdByPrefix('daily_oxford_sand_flat_');
                    const detail = findAssetIdByPrefix('daily_oxford_sand_detail_');
                    const model = uploadedAssets.dailyOxfordSandModel || findAssetIdByPrefix('daily_oxford_sand_model_');
                    if (flat && detail && model) {
                        customGalleryRefs = [flat, detail, model];
                    }
                }
            } else if (slug === 'the-riviera-linen-shirt' && colorName === 'White') {
                const flat = findAssetIdByPrefix('riviera_shirt_flat_');
                const back = findAssetIdByPrefix('riviera_shirt_back_');
                const model = uploadedAssets.rivieraLinenWhiteModel || findAssetIdByPrefix('riviera_linen_shirt_white_model_');
                if (flat && back && model) {
                    customGalleryRefs = [flat, back, model];
                }
            } else if (slug === 'the-riviera-resort-shirt' && colorName === 'Terracotta & Cream') {
                const flat = uploadedAssets.rivieraResortTerracottaFlat || findAssetIdByPrefix('riviera_resort_terracotta_flat_');
                const detail = uploadedAssets.rivieraResortTerracottaDetail || findAssetIdByPrefix('riviera_resort_terracotta_detail_');
                const model = uploadedAssets.rivieraResortTerracottaModel || findAssetIdByPrefix('riviera_resort_terracotta_model_');
                if (flat && detail && model) {
                    customGalleryRefs = [flat, detail, model];
                }
            } else if (slug === 'breezy-linen-resort-shirt') {
                if (colorName === 'Crisp White') {
                    const flat = uploadedAssets.breezyLinenWhiteFlat || findAssetIdByPrefix('breezy_linen_white_flat_');
                    const detail = uploadedAssets.breezyLinenWhiteDetail || findAssetIdByPrefix('breezy_linen_white_detail_');
                    const model = uploadedAssets.breezyLinenWhiteModel || findAssetIdByPrefix('breezy_linen_white_model_');
                    if (flat && detail && model) {
                        customGalleryRefs = [flat, detail, model];
                    }
                } else if (colorName === 'Sky Blue') {
                    const flat = uploadedAssets.breezyLinenBlueFlat || findAssetIdByPrefix('breezy_linen_blue_flat_');
                    const detail = uploadedAssets.breezyLinenBlueDetail || findAssetIdByPrefix('breezy_linen_blue_detail_');
                    const model = uploadedAssets.breezyLinenBlueModel || findAssetIdByPrefix('breezy_linen_blue_model_');
                    if (flat && detail && model) {
                        customGalleryRefs = [flat, detail, model];
                    }
                }
            }

            const finalRefs = customGalleryRefs ? [...customGalleryRefs] : [...cleanRefs];

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
            const currentRefs = (dbVariant.images || []).map((img: any) => img.assetId).filter(Boolean)
            const matchesCurrent = currentRefs.length === finalRefs.length && currentRefs.every((ref: string, idx: number) => ref === finalRefs[idx])

            if (!matchesCurrent) {
                productChanged = true
            }

            // Keep other fields of variant as-is, just update images
            const { images, ...restVariant } = dbVariant
            updatedVariants.push({
                ...restVariant,
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

runScrubAndEnrich().catch(console.error)
