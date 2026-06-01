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

async function findPants() {
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        category,
        variants
    }`)

    const pantAssetNames = [
        'gurkha_trouser_back_1779290599911.png',
        'tuscan_trousers_back_1779288964552.png',
        'wool_trouser_back_1779290652871.png'
    ]

    // Fetch the asset IDs of these pants to compare
    const assets = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename in $pantAssetNames]{ _id, originalFilename }`, { pantAssetNames })
    const assetMap: Record<string, string> = {}
    assets.forEach((a: any) => {
        assetMap[a._id] = a.originalFilename
    })

    console.log('=== Products containing the Trouser/Pants Back images ===')
    let foundCount = 0
    for (const p of products) {
        if (!p.variants) continue
        for (const v of p.variants) {
            if (!v.images) continue
            const matchingImages = v.images.filter((img: any) => img.asset?._ref && assetMap[img.asset._ref])
            if (matchingImages.length > 0) {
                console.log(`- "${p.title}" (${p.slug}) Category: "${p.category}" - Variant "${v.colorName}":`)
                matchingImages.forEach((img: any) => {
                    console.log(`   └─ Found pant image: ${assetMap[img.asset._ref]}`)
                })
                foundCount++
            }
        }
    }
    console.log(`\nTotal variant instances found: ${foundCount}`)
}

findPants()
