import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing environment variable: SANITY_API_TOKEN')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const BRAIN_DIR = process.env.BRAIN_DIR || "/Users/uditsharma/.gemini/antigravity/brain/0dfa3795-7979-4ed8-9872-d3e3f9efcfe3"

const genKey = () => Math.random().toString(36).slice(2, 9)

// Helper to sanitize color names for matching in filenames
function sanitizeString(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').trim()
}

async function main() {
    console.log('🚀 Starting Automatic Image Uploader & Catalog Enricher...\n')

    // 1. Fetch all products from Sanity
    console.log('🔍 Fetching all products from Sanity...')
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        category,
        description,
        variants
    }`)
    console.log(`📦 Loaded ${products.length} products.`)

    // 2. Fetch all existing image assets to avoid duplicate uploads
    console.log('📸 Fetching all Sanity image assets to check for duplicates...')
    const allAssets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id, originalFilename }`)
    const assetMap: Record<string, string> = {}
    for (const asset of allAssets) {
        if (asset.originalFilename) {
            assetMap[asset.originalFilename.toLowerCase()] = asset._id
        }
    }

    // 3. Scan the brain directory for newly generated images
    console.log(`📂 Scanning brain directory: ${BRAIN_DIR}...`)
    if (!fs.existsSync(BRAIN_DIR)) {
        console.error(`❌ Brain directory does not exist: ${BRAIN_DIR}`)
        process.exit(1)
    }

    const files = fs.readdirSync(BRAIN_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
    console.log(`📝 Found ${files.length} image files in the brain directory.`)

    let totalUploaded = 0
    let totalPatched = 0

    // 4. For each under-limit product, try to find a matching file
    for (const p of products) {
        if (!p.variants || !Array.isArray(p.variants)) continue

        let productChanged = false
        const updatedVariants = []

        for (const v of p.variants) {
            const currentImages = v.images || []
            const colorName = v.colorName || 'Default'
            const isWatchOrBelt = p.slug.includes('watch') || p.slug.includes('chronograph') || 
                                  p.title.toLowerCase().includes('watch') || p.title.toLowerCase().includes('chronograph') ||
                                  p.slug === 'the-bridle-leather-belt'

            // We only process if it has fewer than 3 images
            if (currentImages.length < 3) {
                console.log(`\n🔍 Product "${p.title}" (${p.slug}) - Variant "${colorName}" has only ${currentImages.length} images.`)

                // Search for files in the brain folder that match the product slug and color
                const sanitizedSlug = sanitizeString(p.slug)
                const sanitizedColor = sanitizeString(colorName)

                const matchingFiles = files.filter(filename => {
                    const fnLower = filename.toLowerCase()
                    // Must contain slug, and if not default color, must contain sanitized color name too
                    const matchesSlug = fnLower.includes(sanitizedSlug)
                    const matchesColor = colorName === 'Default' || colorName === 'Primary' || fnLower.includes(sanitizedColor)
                    return matchesSlug && matchesColor
                })

                if (matchingFiles.length > 0) {
                    console.log(`   ✨ Found ${matchingFiles.length} matching file(s) in brain directory:`, matchingFiles)

                    const finalImages = [...currentImages]
                    const existingRefs = currentImages.map((img: any) => img.asset?._ref).filter(Boolean)

                    for (const filename of matchingFiles) {
                        const filePath = path.join(BRAIN_DIR, filename)
                        let assetId = assetMap[filename.toLowerCase()]

                        if (!assetId) {
                            console.log(`   📤 Uploading new asset: ${filename}...`)
                            try {
                                const buffer = fs.readFileSync(filePath)
                                const asset = await client.assets.upload('image', buffer, { filename })
                                assetId = asset._id
                                assetMap[filename.toLowerCase()] = assetId
                                totalUploaded++
                                console.log(`   ✅ Uploaded! Asset ID: ${assetId}`)
                            } catch (err: any) {
                                console.error(`   ❌ Failed to upload ${filename}:`, err.message)
                                continue
                            }
                        } else {
                            console.log(`   ⏭️ Asset already uploaded: ${filename} (ID: ${assetId})`)
                        }

                        if (assetId && !existingRefs.includes(assetId)) {
                            finalImages.push({
                                _type: 'image',
                                _key: genKey(),
                                asset: { _type: 'reference', _ref: assetId }
                            })
                            existingRefs.push(assetId)
                            productChanged = true
                        }
                    }

                    updatedVariants.push({
                        ...v,
                        images: finalImages
                    })
                } else {
                    console.log(`   ⚠️ No matching files in brain directory. Needs files matching: *${sanitizedSlug}*${sanitizedColor}*.png`)
                    updatedVariants.push(v)
                }
            } else {
                updatedVariants.push(v)
            }
        }

        if (productChanged) {
            try {
                console.log(`💾 Saving updated image gallery for "${p.title}" (${p.slug})...`)
                await client.patch(p._id).set({ variants: updatedVariants }).commit()
                console.log(`✅ Successfully updated "${p.title}"!`)
                totalPatched++
            } catch (err: any) {
                console.error(`❌ Failed to patch product "${p.title}":`, err.message)
            }
        }
    }

    console.log(`\n🏁 Done! Uploaded ${totalUploaded} new images and patched ${totalPatched} products.`)
}

main().catch(console.error)
