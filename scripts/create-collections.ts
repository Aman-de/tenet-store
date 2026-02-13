
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

const collections = [
    {
        title: "Knitwear",
        slug: "knitwear",
        description: "The finest merino wool and cashmere essentials for the colder months.",
        filterTag: "knitwear",
        imageProductTitle: "The Heritage Cable Knit"
    },
    {
        title: "Shirting",
        slug: "shirting",
        description: "Premium European linen and cotton shirts for effortless elegance.",
        filterTag: "shirting",
        imageProductTitle: "The Riviera Linen Shirt"
    },
    {
        title: "Trousers",
        slug: "trousers",
        description: "Impeccably tailored trousers, from high-waisted gurkhas to classic chinos.",
        filterTag: "trousers",
        imageProductTitle: "The Gurkha Trouser"
    },
    {
        title: "Outerwear",
        slug: "outerwear",
        description: "Timeless jackets and coats designed to weather elements in style.",
        filterTag: "outerwear",
        imageProductTitle: "The Harrington"
    },
    {
        title: "Footwear",
        slug: "footwear",
        description: "Hand-stitched leather loafers and boots built for longevity.",
        filterTag: "footwear",
        imageProductTitle: "The Penny Loafer",
        sizeType: "footwear"
    },
    {
        title: "Accessories",
        slug: "accessories",
        description: "The finishing touches. Leather bags, belts, and more.",
        filterTag: "accessories",
        imageProductTitle: "The Weekender",
        sizeType: "none"
    }
]

async function createCollections() {
    console.log('🚀 Creating Collections...')

    for (const c of collections) {
        // 1. Find Product Image to use as Cover
        const product = await client.fetch(`*[_type == "product" && title == $title][0]`, { title: c.imageProductTitle })

        if (!product) {
            console.warn(`⚠️ Product not found for cover image: ${c.imageProductTitle}`)
            continue
        }

        // Use the first image of the first variant, or fallback to main image logic if structure differs
        // Based on restore-all, we put images in variants[0].images[0]
        const imageAsset = product.variants?.[0]?.images?.[0]?.asset

        if (!imageAsset) {
            console.warn(`⚠️ No image found on product: ${c.imageProductTitle}`)
            continue
        }

        // 1.5 Fetch products for this category to populate the 'products' array
        const categoryProducts = await client.fetch(`*[_type == "product" && category == $filterTag]`, { filterTag: c.filterTag })
        const productRefs = categoryProducts.map((p: any) => ({
            _type: 'reference',
            _key: p._id,
            _ref: p._id
        }))

        // 2. Create Collection Document
        const doc = {
            _type: 'collection',
            title: c.title,
            slug: { _type: 'slug', current: c.slug },
            description: c.description,
            filterTag: c.filterTag,
            sizeType: c.sizeType || 'clothing',
            image: {
                _type: 'image',
                asset: imageAsset
            },
            products: productRefs
        }

        const existing = await client.fetch(`*[_type == "collection" && slug.current == $slug][0]`, { slug: c.slug })

        if (existing) {
            console.log(`Updated: ${c.title}`)
            await client.patch(existing._id).set(doc).commit()
        } else {
            console.log(`Created: ${c.title}`)
            await client.create(doc)
        }
    }
    console.log('✨ Collections Created!')
}

createCollections()
