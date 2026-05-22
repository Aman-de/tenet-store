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
    console.log('Creating watch product (slug: ghdi) in Sanity...')
    
    // Check if it already exists
    const existing = await client.fetch(`*[_type == "product" && slug.current == "ghdi"][0]`)

    const doc = {
        _type: 'product',
        title: 'watch',
        slug: {
            _type: 'slug',
            current: 'ghdi'
        },
        price: 15000,
        originalPrice: 15000,
        category: 'accessories',
        gender: 'man',
        sizeType: 'onesize',
        description: 'Crafted from the finest materials, this piece embodies the essence of silent luxury. Designed for the modern gentleman who values heritage and quality above all else.',
        variants: [
            {
                _key: 'variant-emerald-green',
                colorName: 'Emerald Green',
                colorHex: '#124530',
                stock: 10,
                images: [
                    {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: 'image-b29be6ea4b4333bf30d5244a7785ca7004af3e4f-375x469-jpg'
                        }
                    },
                    {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: 'image-b29be6ea4b4333bf30d5244a7785ca7004af3e4f-375x469-jpg'
                        }
                    }
                ]
            }
        ]
    }

    if (existing) {
        console.log('Watch product already exists in Sanity. Updating variants to ensure secondary image is present...')
        await client.patch(existing._id).set({ variants: doc.variants }).commit()
        console.log('Successfully updated watch product variants!')
        return
    }

    const result = await client.create(doc)
    console.log('Successfully created watch product in Sanity:', result._id)
}

main().catch(console.error)
