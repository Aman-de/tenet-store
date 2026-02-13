
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

async function deduplicateImages() {
    console.log('🚀 Deduplicating images...')

    // Fetch all products
    const products = await client.fetch(`*[_type == "product"]{_id, title, variants}`)

    for (const p of products) {
        if (!p.variants?.[0]?.images) continue

        const images = p.variants[0].images
        if (images.length > 1) {
            console.log(`Cleaning duplicate images for: ${p.title} (${images.length} images)`)

            // Keep only the first image (index 0)
            const firstImage = images[0]

            await client.patch(p._id)
                .set({ 'variants[0].images': [firstImage] })
                .commit()
            console.log(`   ✅ Reset to 1 image`)
        }
    }
    console.log('✨ Deduplication Complete!')
}

deduplicateImages()
