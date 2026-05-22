
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

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/60c7ea9b-3177-4b12-8a7c-956138ea2356"
const SECONDARY_ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b"

// The 10 missing original products from seed-sanity.ts
const products = [
    {
        name: "The Noir Quarter-Zip",
        price: 6200,
        category: "knitwear",
        color: "Midnight Navy",
        colorHex: "#191970",
        description: "Sleek, breathable wool blend designed for layering over shirts.",
        heroImage: "noir_quarter_zip_1769838281290.png",
        flatImage: "flat_noir_zip_1769839651954.png",
    },
    {
        name: "The Cashmere Polo",
        price: 12000,
        category: "knitwear",
        color: "Charcoal Grey",
        colorHex: "#36454F",
        description: "Pure cashmere long-sleeve polo. Softness without compromise.",
        heroImage: "cashmere_polo_1769838325764.png",
        flatImage: "flat_cashmere_polo_1769839681001.png",
    },
    {
        name: "The Riviera Linen Shirt",
        price: 4500,
        category: "shirting",
        color: "White",
        colorHex: "#FFFFFF",
        description: "Airy, premium European linen. Cut for a relaxed summer silhouette.",
        heroImage: "riviera_linen_shirt_1769838346603.png",
        flatImage: "flat_riviera_shirt_1769839732309.png",
    },
    {
        name: "The Amalfi Stripe",
        price: 4200,
        category: "shirting",
        color: "Olive & White",
        colorHex: "#556B2F",
        description: "Vertical striped vacation shirt with a camp collar.",
        heroImage: "amalfi_stripe_1769838363946.png",
        flatImage: "flat_amalfi_stripe_1769839758454.png",
    },
    {
        name: "The Gurkha Trouser",
        price: 5500,
        category: "trousers",
        color: "Beige",
        colorHex: "#F5F5DC",
        description: "High-waisted, double-pleated with signature side adjusters.",
        heroImage: "gurkha_trouser_1769838296620.png",
        flatImage: "flat_gurkha_trouser_1769839784073.png",
    },
    {
        name: "The Pleated Chino",
        price: 4800,
        category: "trousers",
        color: "Navy",
        colorHex: "#000080",
        description: "Classic single pleat, tapered fit. Structured cotton twill.",
        heroImage: "pleated_chino_1769838382486.png",
        flatImage: "flat_pleated_chino_navy_1770050721344.png",
        flatImageDir: SECONDARY_ARTIFACTS_DIR,
    },
    {
        name: "The Harrington",
        price: 9500,
        category: "outerwear",
        color: "Tan",
        colorHex: "#D2B48C",
        description: "Water-resistant cotton shell with tartan lining. The definitive classic.",
        heroImage: "harrington_jacket_1769838412001.png",
        flatImage: "flat_harrington_tan_1770050747796.png",
        flatImageDir: SECONDARY_ARTIFACTS_DIR,
    },
    {
        name: "The Diplomat Overcoat",
        price: 18000,
        category: "outerwear",
        color: "Black",
        colorHex: "#000000",
        description: "Italian wool blend. Structured shoulders and knee-length drape.",
        heroImage: "diplomat_overcoat_1769838428705.png",
        flatImage: "flat_diplomat_overcoat_black_1770050773729.png",
        flatImageDir: SECONDARY_ARTIFACTS_DIR,
    },
    {
        name: "The Penny Loafer",
        price: 11000,
        category: "footwear",
        color: "Tobacco Suede",
        colorHex: "#964B00",
        description: "Hand-stitched suede with leather soles. Unlined for immediate comfort.",
        heroImage: "penny_loafer_1769838446100.png",
        flatImage: "flat_penny_loafer_1770050145744.png",
        flatImageDir: SECONDARY_ARTIFACTS_DIR,
    },
    {
        name: "The Weekender",
        price: 22000,
        category: "accessories",
        color: "Cognac Leather",
        colorHex: "#8B4513",
        description: "Full-grain vegetable tanned leather duffel bag. Built for travel.",
        heroImage: "weekender_bag_1769838467779.png",
        flatImage: "flat_weekender_cognac_1770050799646.png",
        flatImageDir: SECONDARY_ARTIFACTS_DIR,
    },
]

async function uploadImageAsset(filename: string, dir: string): Promise<string | null> {
    const filePath = path.join(dir, filename)
    if (!fs.existsSync(filePath)) {
        console.warn(`   ⚠️ File not found: ${filePath}`)
        return null
    }
    const buffer = fs.readFileSync(filePath)
    const asset = await client.assets.upload('image', buffer, { filename })
    console.log(`   📸 Uploaded: ${filename} → ${asset._id}`)
    return asset._id
}

async function restoreOriginalCore() {
    console.log('🚀 Starting non-destructive restore of 10 original core products...\n')

    for (const p of products) {
        const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^w-]/g, '').replace(/'/g, '')

        // Check if already exists
        const existing = await client.fetch(`*[_type == "product" && title == $title][0]._id`, { title: p.name })
        if (existing) {
            console.log(`⏭️  Already exists: ${p.name}`)
            continue
        }

        const isFootwear = p.category === 'footwear'
        const isAccessory = p.category === 'accessories'
        const sizeType = isFootwear ? 'numeric' : isAccessory ? 'onesize' : 'clothing'
        const sizes = isFootwear ? ['7', '8', '9', '10', '11'] : isAccessory ? [] : ['S', 'M', 'L', 'XL']

        console.log(`\n📦 Creating: ${p.name}`)

        // Upload hero image
        console.log(`   Uploading hero image...`)
        const heroAssetId = await uploadImageAsset(p.heroImage, ARTIFACTS_DIR)

        // Upload flat lay image
        console.log(`   Uploading flat lay image...`)
        const flatDir = (p as any).flatImageDir || ARTIFACTS_DIR
        const flatAssetId = await uploadImageAsset(p.flatImage, flatDir)

        // Build images array
        const images: any[] = []
        if (heroAssetId) {
            images.push({ _type: 'image', _key: `hero_${Date.now()}`, asset: { _type: 'reference', _ref: heroAssetId } })
        }
        if (flatAssetId) {
            images.push({ _type: 'image', _key: `flat_${Date.now()}`, asset: { _type: 'reference', _ref: flatAssetId } })
        }

        // Create product document
        const doc = {
            _type: 'product',
            title: p.name,
            slug: { _type: 'slug', current: p.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') },
            price: p.price,
            originalPrice: Math.round(p.price * 1.2),
            description: p.description,
            category: p.category,
            sizeType,
            sizes,
            variants: [
                {
                    _key: 'var1',
                    colorName: p.color,
                    colorHex: p.colorHex,
                    stock: 15,
                    images,
                }
            ],
        }

        try {
            const created = await client.create(doc)
            console.log(`   ✅ Created: ${p.name} (${created._id})`)
        } catch (err) {
            console.error(`   ❌ Failed to create ${p.name}:`, err)
        }
    }

    console.log('\n✨ Restore complete! Running final count...')
    const allProducts = await client.fetch(`*[_type == "product"]{title}`)
    console.log(`\n📊 Total products in database: ${allProducts.length}`)
    console.log('Products:', allProducts.map((p: any) => p.title).sort().join('\n  - '))
}

restoreOriginalCore().catch((err) => {
    console.error(err)
    process.exit(1)
})
