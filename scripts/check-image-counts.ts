import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

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

async function checkImages() {
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        category,
        variants
    }`)

    console.log('=== Checking Product Variant Image Counts ===')
    let subThreeCount = 0
    let watchBeltCount = 0
    let details = []

    for (const p of products) {
        if (!p.variants || !Array.isArray(p.variants)) {
            console.log(`⚠️ Product "${p.title}" (${p.slug}) has no variants array!`)
            continue
        }
        for (const v of p.variants) {
            const count = v.images ? v.images.length : 0
            const colorName = v.colorName || 'Default'
            const isWatchOrBelt = (p.slug || '').includes('watch') || (p.slug || '').includes('chronograph') || 
                                  p.title.toLowerCase().includes('watch') || p.title.toLowerCase().includes('chronograph') ||
                                  p.slug === 'the-bridle-leather-belt'

            if (count < 3) {
                subThreeCount++
                console.log(`❌ [UNDER-LIMIT] "${p.title}" (${p.slug}) - Variant "${colorName}": Only ${count} images! (IsWatchOrBelt: ${isWatchOrBelt})`)
            } else {
                if (isWatchOrBelt) {
                    watchBeltCount++
                }
            }
        }
    }

    console.log('\n=== Summary ===')
    console.log(`Total Products: ${products.length}`)
    console.log(`Variants with < 3 images: ${subThreeCount}`)
    console.log(`Watch/Belt variants with >= 3 images: ${watchBeltCount}`)
}

checkImages()
