import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

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

async function main() {
    console.log('🔍 Fetching all products from Sanity...')
    const products = await client.fetch(`*[_type == "product"]{ _id, title, variants }`)
    console.log(`Found ${products.length} products. Scanning variants...`)

    let updatedCount = 0

    for (const p of products) {
        if (!p.variants || !Array.isArray(p.variants) || p.variants.length === 0) {
            continue
        }

        let changed = false
        const updatedVariants = p.variants.map((v: any) => {
            const images = v.images || []
            if (Array.isArray(images) && images.length === 1) {
                console.log(`📸 Product "${p.title}" - Variant "${v.colorName || 'Default'}" has only 1 image. Duplicating...`)
                const duplicateImage = {
                    ...images[0],
                    _key: Math.random().toString(36).slice(2, 9), // unique key
                }
                changed = true
                return {
                    ...v,
                    images: [images[0], duplicateImage]
                }
            }
            return v
        })

        if (changed) {
            try {
                console.log(`   Applying patch to "${p.title}" in Sanity...`)
                await client.patch(p._id).set({ variants: updatedVariants }).commit()
                console.log(`   ✅ Successfully updated "${p.title}"!`)
                updatedCount++
            } catch (err: any) {
                console.error(`   ❌ Failed to update "${p.title}":`, err.message)
            }
        }
    }

    console.log(`\n🏁 Done! Total products patched: ${updatedCount}`)
}

main().catch(console.error)
