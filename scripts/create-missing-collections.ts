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
    { title: 'Shirting', value: 'shirting', desc: 'Premium European linen and cotton shirts.' },
    { title: 'Trousers', value: 'trousers', desc: 'Impeccably tailored trousers and chinos.' },
    { title: 'Shorts', value: 'shorts', desc: 'Tailored shorts for warm weather elegance.' },
    { title: 'Swimwear', value: 'swimwear', desc: 'Quick-dry, tailored swim shorts.' },
    { title: 'Outerwear', value: 'outerwear', desc: 'Timeless jackets and coats.' },
    { title: 'Footwear', value: 'footwear', desc: 'Hand-stitched leather loafers and boots.', sizeType: 'footwear' },
    { title: 'Accessories', value: 'accessories', desc: 'The finishing touches.', sizeType: 'none' },
    { title: 'Jackets', value: 'jackets', desc: 'Lightweight layers and blazers.' },
    { title: 'Sets', value: 'sets', desc: 'Coordinated matching sets.' },
    { title: 'Shirts', value: 'shirts', desc: 'Casual and smart-casual shirts.' }
]

async function createMissingCollections() {
    console.log('🚀 Checking for missing collections...')

    for (const cat of definedCategories) {
        // Check if collection exists
        const existing = await client.fetch(`*[_type == "collection" && slug.current == $slug][0]`, { slug: cat.value })

        if (existing) {
            console.log(`✅ Collection exists for: ${cat.title}`)
            continue
        }

        console.log(`⚠️ Missing Collection: ${cat.title}. Attempting to create...`)

        // Find a product with this category to use its image
        const product = await client.fetch(`*[_type == "product" && category == $cat][0]`, { cat: cat.value })

        if (!product) {
            console.log(`   ⏭️ Skipping: No products found with category '${cat.value}' to use for cover image.`)
            continue
        }

        const imageAsset = product.variants?.[0]?.images?.[0]?.asset || product.variants?.[0]?.images?.[1]?.asset

        if (!imageAsset) {
            console.log(`   ⏭️ Skipping: Found product '${product.title}' but it has no variant images.`)
            continue
        }

        const doc = {
            _type: 'collection',
            title: cat.title,
            slug: { _type: 'slug', current: cat.value },
            description: cat.desc,
            filterTag: cat.value,
            sizeType: cat.sizeType || 'clothing',
            image: {
                _type: 'image',
                asset: imageAsset
            },
            products: [] // Rely on dynamic query fix for products
        }

        try {
            await client.create(doc)
            console.log(`   ✨ Created Collection: ${cat.title} using image from '${product.title}'`)
        } catch (err) {
            console.error(`   ❌ Failed to create Collection ${cat.title}:`, err)
        }
    }

    console.log('\n🎉 Finished creating missing collections!')
}

createMissingCollections()
