import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

async function patchChicShirt() {
    console.log("🚀 Starting patch for The Riviera Resort Chic Shirt...")

    const product = await client.fetch(`*[_type == "product" && slug.current == "the-riviera-resort-chic-shirt"][0]`)
    if (!product) {
        console.warn("⚠️ The Riviera Resort Chic Shirt not found.")
        return
    }

    if (!product.variants || !Array.isArray(product.variants)) {
        console.warn("⚠️ No variants found.")
        return
    }

    const updatedVariants = []
    let changed = false

    for (const v of product.variants) {
        if (!v.images || !Array.isArray(v.images)) {
            updatedVariants.push(v)
            continue
        }

        const cleanImages = []
        for (const img of v.images) {
            if (img.asset?._ref) {
                // Fetch the asset to check filename
                const asset = await client.fetch(`*[_id == $ref][0]{ originalFilename }`, { ref: img.asset._ref })
                const filename = (asset?.originalFilename || '').toLowerCase()
                
                if (filename.includes('amalfi_popover')) {
                    console.log(`  🗑️ Removing mismatched amalfi popover image from variant: "${v.colorName}"`)
                    changed = true
                    continue
                }
                cleanImages.push(img)
            } else {
                cleanImages.push(img)
            }
        }

        // Pad with duplicates of its own correct images to reach 3
        const finalImages = [...cleanImages]
        if (finalImages.length > 0) {
            const primary = finalImages[0]
            const secondary = finalImages[1] || primary
            while (finalImages.length < 3) {
                finalImages.push(finalImages.length === 1 ? primary : secondary)
            }
        }

        updatedVariants.push({
            ...v,
            images: finalImages
        })
    }

    if (changed) {
        await client.patch(product._id).set({ variants: updatedVariants }).commit()
        console.log("✅ Successfully updated The Riviera Resort Chic Shirt gallery!")
    } else {
        console.log("ℹ️ No changes needed for The Riviera Resort Chic Shirt.")
    }
}

patchChicShirt().catch(console.error)
