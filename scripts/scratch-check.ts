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
    const products = await client.fetch('*[_type == "product" && !(_id in path("drafts.**"))]{ title, "slug": slug.current, variants }')
    console.log("=== Products with variants having < 4 images ===")
    let countUnderFour = 0
    for (const p of products) {
        let hasUnderFour = false
        for (const v of p.variants || []) {
            const count = v.images ? v.images.length : 0
            if (count < 4) {
                hasUnderFour = true
            }
        }
        if (hasUnderFour) {
            countUnderFour++
            console.log(`Product: ${p.title} (${p.slug})`)
            for (const v of p.variants || []) {
                console.log(`  - ${v.colorName}: ${v.images ? v.images.length : 0} images`)
            }
        }
    }
    console.log(`\nTotal products with variants having < 4 images: ${countUnderFour}`)
}

check().catch(console.error)
