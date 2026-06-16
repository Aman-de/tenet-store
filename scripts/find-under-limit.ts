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

async function check() {
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        variants
    }`)

    console.log(`Found ${products.length} products in Sanity.`)
    let underLimitCount = 0
    for (const p of products) {
        if (!p.variants || !Array.isArray(p.variants)) {
            console.log(`⚠️ Product "${p.title}" (${p.slug}) has no variants!`)
            continue
        }
        for (const v of p.variants) {
            const count = v.images ? v.images.length : 0
            const colorName = v.colorName || 'Default'
            if (count < 3) {
                underLimitCount++
                console.log(`❌ [UNDER-LIMIT] "${p.title}" (${p.slug}) - Variant "${colorName}": Only ${count} images!`)
            }
        }
    }
    console.log(`Total under-limit variants: ${underLimitCount}`)
}

check().catch(console.error)
