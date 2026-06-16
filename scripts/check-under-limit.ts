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
    for (const p of products) {
        const hasKurti = p.title.toLowerCase().includes('kurti')
        const hasHeels = p.title.toLowerCase().includes('heels')
        const hasNecklace = p.title.toLowerCase().includes('necklace')
        
        if (hasKurti || hasHeels || hasNecklace) {
            console.log(`- ${p.title} (${p.slug})`)
            if (p.variants) {
                p.variants.forEach((v: any, idx: number) => {
                    const count = v.images ? v.images.length : 0
                    console.log(`  Variant ${idx}: "${v.colorName}" - Hex: ${v.colorHex} - Image Count: ${count}`)
                    if (v.images) {
                        v.images.forEach((img: any, imgIdx: number) => {
                            console.log(`    Image ${imgIdx}: ${img.asset?._ref}`)
                        })
                    }
                })
            } else {
                console.log(`  No variants found!`)
            }
        }
    }
}

check().catch(console.error)
