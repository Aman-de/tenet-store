
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

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

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b"
const IMAGE_FILENAME = "summer_collection_combo_1770238522254.png"

const product = {
    name: "The Mediterranean Retreat Edit",
    price: 28500, // Bundle price
    category: "knitwear", // It's a mix, but let's categorize it under knitwear or create a new category if schema allows. Schema has fixed categories. Let's use 'knitwear' as the polo is prominent, or maybe 'outerwear' as a full look? Let's stick to 'knitwear' or 'shirting'.
    // Actually, looking at the image, it's a full look. Maybe I should just pick one valid category. 'knitwear' is fine.
    color: "Beige & Cream",
    colorHex: "#F5F5DC",
    description: "The ultimate summer sophisticated look. Includes the Monte Carlo Knit Polo, Marrakech Linen Trousers, Suede Loafers, and Leather Belt.",
    image_prompt: "Professional fashion flat lay of a 4-piece summer outfit. Minimalist, high-end 'Old Money' aesthetic."
}

async function createSummerCollection() {
    console.log(`🚀 Creating Summer Collection product...`)

    try {
        // 1. Upload Image
        console.log(`   Uploading image...`)
        const filePath = path.join(ARTIFACTS_DIR, IMAGE_FILENAME)

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`)
        }

        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, {
            filename: IMAGE_FILENAME
        })

        // 2. Create Product
        const doc = {
            _type: 'product',
            title: product.name,
            slug: { _type: 'slug', current: 'mediterranean-retreat-edit' },
            price: product.price,
            originalPrice: 35000,
            description: product.description,
            category: product.category,
            sizeType: 'clothing',
            sizes: ['S', 'M', 'L', 'XL'],
            variants: [
                {
                    _key: 'var1',
                    colorName: product.color,
                    colorHex: product.colorHex,
                    stock: 5,
                    images: [{
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: asset._id
                        }
                    }],
                }
            ],
            imagePromptNote: product.image_prompt,
        };

        // Check availability
        const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: doc.slug.current })
        if (existing) {
            console.log(`⚠️ Product already exists. Updating image...`)
            await client.patch(existing._id)
                .set({
                    variants: doc.variants,
                    description: doc.description,
                    price: doc.price
                })
                .commit()
            console.log(`   ✅ Updated!`)
        } else {
            await client.create(doc);
            console.log(`   ✅ Created!`)
        }

    } catch (err) {
        console.error(`   ❌ Failed: ${err}`)
        process.exit(1)
    }
}

createSummerCollection()
