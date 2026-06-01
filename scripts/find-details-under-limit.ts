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

async function findDetails() {
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        category,
        description,
        variants
    }`)

    const underLimit = []

    for (const p of products) {
        if (!p.variants || !Array.isArray(p.variants)) continue
        for (const v of p.variants) {
            const count = v.images ? v.images.length : 0
            if (count < 3) {
                underLimit.push({
                    title: p.title,
                    slug: p.slug,
                    category: p.category,
                    description: p.description,
                    colorName: v.colorName,
                    imageCount: count,
                    firstImageRef: v.images?.[0]?.asset?._ref || null
                })
            }
        }
    }

    console.log(JSON.stringify(underLimit, null, 2))
}

findDetails()
