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

const definedCategories = [
    { title: 'Knitwear', value: 'knitwear', desc: 'The finest merino wool and cashmere essentials.' },
    { title: 'Shirting', value: 'shirting', desc: 'Premium European linen and cotton shirting.' },
    { title: 'Trousers', value: 'trousers', desc: 'Impeccably tailored trousers and chinos.' },
    { title: 'Shorts', value: 'shorts', desc: 'Tailored shorts for warm weather elegance.' },
    { title: 'Swimwear', value: 'swimwear', desc: 'Quick-dry, tailored swim shorts.' },
    { title: 'Outerwear', value: 'outerwear', desc: 'Timeless jackets and coats.' },
    { title: 'Footwear', value: 'footwear', desc: 'Hand-stitched leather loafers and boots.', sizeType: 'footwear' },
    { title: 'Accessories', value: 'accessories', desc: 'The finishing touches. Leather bags, belts, and more.', sizeType: 'none' },
    { title: 'Jackets', value: 'jackets', desc: 'Lightweight layers and blazers.' },
    { title: 'Sets', value: 'sets', desc: 'Coordinated matching sets.' },
    { title: 'Shirts', value: 'shirts', desc: 'Casual and smart-casual shirts.' },
    { title: 'Lounge', value: 'lounge', desc: 'Premium lounge and leisurewear.' }
]

async function syncAllCollections() {
    console.log('🚀 Synchronizing and rebuilding all collections...')

    for (const cat of definedCategories) {
        console.log(`\nProcessing Category: ${cat.title} (${cat.value})...`)

        // Find all products in Sanity belonging to this category
        const products = await client.fetch(
            `*[_type == "product" && category == $cat] | order(title asc)`,
            { cat: cat.value }
        )

        console.log(`   Found ${products.length} products.`)

        if (products.length === 0) {
            console.log(`   ⏭️ Skipping collection: No products found.`)
            continue
        }

        // Find cover image from one of the products
        let coverAssetRef = null
        for (const p of products) {
            const asset = p.variants?.[0]?.images?.[0]?.asset || p.variants?.[0]?.images?.[1]?.asset
            if (asset) {
                coverAssetRef = asset
                console.log(`   Using cover image from product: "${p.title}"`)
                break
            }
        }

        if (!coverAssetRef) {
            console.warn(`   ⚠️ No image asset found among products in this category.`)
        }

        // Prepare product references
        const productRefs = products.map((p: any) => ({
            _type: 'reference',
            _key: p._id,
            _ref: p._id
        }))

        // Prepare collection document
        const doc: any = {
            _type: 'collection',
            title: cat.title,
            slug: { _type: 'slug', current: cat.value },
            description: cat.desc,
            filterTag: cat.value,
            sizeType: cat.sizeType || 'clothing',
            products: productRefs
        }

        if (coverAssetRef) {
            doc.image = {
                _type: 'image',
                asset: coverAssetRef
            }
        }

        // Check if collection already exists
        const existing = await client.fetch(
            `*[_type == "collection" && slug.current == $slug][0]`,
            { slug: cat.value }
        )

        try {
            if (existing) {
                console.log(`   Existing collection found (ID: ${existing._id}). Patching...`)
                await client.patch(existing._id).set(doc).commit()
                console.log(`   ✅ Collection "${cat.title}" successfully updated!`)
            } else {
                console.log(`   No existing collection. Creating new one...`)
                await client.create(doc)
                console.log(`   ✨ Collection "${cat.title}" successfully created!`)
            }
        } catch (err: any) {
            console.error(`   ❌ Failed to sync collection "${cat.title}":`, err.message)
        }
    }

    console.log('\n🎉 Rebuilding and sync of all collections finished!')
}

syncAllCollections().catch(console.error)
