
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

// Helper to create simple SVG placeholder
function createSVG(text: string, bgColor: string, textColor: string): string {
    return `<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="50%" y="50%" font-family="Arial" font-size="60" fill="${textColor}" text-anchor="middle" dy="0">${text}</text>
  <text x="50%" y="58%" font-family="Arial" font-size="40" fill="${textColor}" text-anchor="middle" dy="0">Coming Soon</text>
</svg>`
}

const updates = [
    {
        title: "The Aspen Chalet Edit",
        slug: "the-aspen-chalet-edit",
        filePrefix: "placeholder_aspen",
        bgColor: "#D2B48C", // Tan
        textColor: "#FFFFFF"
    },
    {
        title: "The Oxford Scholar Edit",
        slug: "the-oxford-scholar-edit",
        filePrefix: "placeholder_oxford",
        bgColor: "#2F4F4F", // Dark Slate Gray
        textColor: "#FFFFFF"
    },
    {
        title: "The Paris Flâneur Edit",
        slug: "the-paris-flaneur-edit",
        filePrefix: "placeholder_paris",
        bgColor: "#708090", // Slate Grey
        textColor: "#FFFFFF"
    }
]

async function fixDuplicateImages() {
    console.log("🚀 Creating distinct SVG placeholders...")

    for (const update of updates) {
        console.log(`\nProcessing: ${update.title}`)

        // 1. Generate SVG
        const svgContent = createSVG(update.title, update.bgColor, update.textColor)
        const fileName = `${update.filePrefix}.svg`
        const filePath = path.join(ARTIFACTS_DIR, fileName)

        fs.writeFileSync(filePath, svgContent)
        console.log(`   Generated SVG: ${fileName}`)

        // 2. Upload to Sanity
        console.log(`   Uploading to Sanity...`)
        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, { filename: fileName })

        // 3. Patch Product
        const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: update.slug })

        if (product) {
            console.log(`   Patching product ${product._id}...`)
            await client.patch(product._id)
                .set({
                    variants: product.variants.map((v: any) => ({
                        ...v,
                        images: [
                            { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
                            { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
                        ]
                    }))
                })
                .commit()
            console.log(`   ✅ Fixed!`)
        } else {
            console.log(`   ⚠️ Product not found (skipping patch)`)
        }
    }
}

fixDuplicateImages()
