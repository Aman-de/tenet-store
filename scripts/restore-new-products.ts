/**
 * restore-new-products.ts
 * Adds brand-new product categories (shorts, swimwear, shirts, lounge, accessories)
 * using freshly generated images. Non-destructive – skips existing products.
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('Missing env vars'); process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const CURRENT_DIR = '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f'
const A209_DIR    = '/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0'
const D39E_DIR    = '/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b'

const assetCache: Record<string, string> = {}

async function upload(filePath: string): Promise<string | null> {
    if (assetCache[filePath]) return assetCache[filePath]
    if (!fs.existsSync(filePath)) {
        console.warn(`   ⚠️ Not found: ${filePath}`); return null
    }
    const buffer = fs.readFileSync(filePath)
    const asset = await client.assets.upload('image', buffer, { filename: path.basename(filePath) })
    assetCache[filePath] = asset._id
    console.log(`   📸 Uploaded: ${path.basename(filePath)}`)
    return asset._id
}

function img(dir: string, file: string) { return path.join(dir, file) }

const NEW_PRODUCTS = [
    // ─── SWIMWEAR ─────────────────────────────────────────────────────
    {
        title: 'The Harbour Stripe Swim', slug: 'the-harbour-stripe-swim',
        price: 5500, originalPrice: 7200, category: 'swimwear', gender: 'man',
        sizeType: 'clothing', sizes: ['S', 'M', 'L', 'XL'],
        description: 'Navy pinstripe quick-dry swim shorts with an elasticated waistband and rope drawstring. Lined with mesh for comfort. A poolside essential for the modern gentleman.',
        images: [
            img(CURRENT_DIR, 'navy_swim_shorts_flat_1779436277004.png'),
        ]
    },
    // ─── SHORTS ──────────────────────────────────────────────────────
    {
        title: 'The Riviera Linen Short', slug: 'the-riviera-linen-short',
        price: 4200, originalPrice: 5500, category: 'shorts', gender: 'man',
        sizeType: 'clothing', sizes: ['S', 'M', 'L', 'XL'],
        description: 'Pure linen tailored shorts in natural sand. Relaxed waistband with drawstring, side pockets, and a mid-thigh hem. The perfect companion for warm-weather escapes.',
        images: [
            img(CURRENT_DIR, 'linen_shorts_beige_flat_1779436301372.png'),
        ]
    },
    // ─── SHIRTS ──────────────────────────────────────────────────────
    {
        title: 'The Oxford Blue Shirt', slug: 'the-oxford-blue-shirt',
        price: 3800, originalPrice: 5000, category: 'shirts', gender: 'man',
        sizeType: 'clothing', sizes: ['S', 'M', 'L', 'XL'],
        description: 'Light blue Oxford weave shirt with a button-down collar and chest pocket. Made from premium 100% cotton with a relaxed fit. Works dressed up or down with equal ease.',
        images: [
            img(CURRENT_DIR, 'oxford_shirt_blue_flat_1779436324997.png'),
            img(D39E_DIR,    'flat_oxford_shirt_1770228013702.png'),
        ]
    },
    {
        title: 'The Highland Flannel Shirt', slug: 'the-highland-flannel-shirt',
        price: 5200, originalPrice: 6800, category: 'shirts', gender: 'man',
        sizeType: 'clothing', sizes: ['S', 'M', 'L', 'XL'],
        description: 'Heavy brushed flannel shirt in a classic earthy plaid. Double chest pockets and a spread collar. Worn open as a lightweight overshirt or fully buttoned for outdoors.',
        images: [
            img(CURRENT_DIR, 'flannel_shirt_plaid_flat_1779436350969.png'),
        ]
    },
    // ─── LOUNGE ──────────────────────────────────────────────────────
    {
        title: 'The Essential Jogger', slug: 'the-essential-jogger',
        price: 3900, originalPrice: 5200, category: 'lounge', gender: 'man',
        sizeType: 'clothing', sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'French terry lounge joggers in heather grey. Tapered leg, ribbed ankle cuffs, hidden drawstring waist, and zippered side pockets. 380 GSM — heavy enough to feel substantial.',
        images: [
            img(CURRENT_DIR, 'lounge_joggers_grey_flat_1779436378908.png'),
        ]
    },
    // ─── ACCESSORIES ─────────────────────────────────────────────────
    {
        title: 'The Bridle Leather Belt', slug: 'the-bridle-leather-belt',
        price: 4800, originalPrice: 6500, category: 'accessories', gender: 'man',
        sizeType: 'onesize', sizes: [],
        description: 'Full-grain vegetable-tanned leather belt with a solid brass roller buckle. Hand-stitched edges that develop a beautiful patina over time. Available in 30–44 inch waist.',
        images: [
            img(CURRENT_DIR, 'leather_belt_tan_flat_1779436407470.png'),
        ]
    },
    // ─── FOOTWEAR ─────────────────────────────────────────────────────
    {
        title: 'The Desert Boot', slug: 'the-desert-boot',
        price: 9500, originalPrice: 12500, category: 'footwear', gender: 'man',
        sizeType: 'numeric', sizes: ['7', '8', '9', '10', '11'],
        description: 'Unlined sand suede desert boot with a natural crepe rubber sole. The original minimal boot — two eyelets, whisper-soft nubuck, and a silhouette that improves with age.',
        images: [
            img(CURRENT_DIR, 'desert_boot_suede_flat_1779436441248.png'),
        ]
    },
    // ─── More KNITWEAR using existing d39e images ─────────────────────
    {
        title: 'The Merino Crewneck', slug: 'the-merino-crewneck',
        price: 6800, originalPrice: 8900, category: 'knitwear', gender: 'man',
        sizeType: 'clothing', sizes: ['S', 'M', 'L', 'XL'],
        description: 'Classic merino wool crewneck in a refined mid-weight. Ribbed collar, cuffs and hem. Versatile enough to wear alone or layer under a jacket. A year-round wardrobe anchor.',
        images: [
            img(D39E_DIR, 'flat_merino_turtleneck_1770227985744.png'),
            img(D39E_DIR, 'hero_merino_turtleneck_1770210993042.png'),
        ]
    },
]

async function main() {
    console.log('🚀 Adding new product categories...\n')

    const existing = await client.fetch(`*[_type == "product"]{ title, "slug": slug.current }`)
    const existingSlugs = new Set(existing.map((p: any) => p.slug))
    const existingTitles = new Set(existing.map((p: any) => p.title))
    console.log(`📊 Currently: ${existing.length} products in DB\n`)

    let created = 0, skipped = 0

    for (const p of NEW_PRODUCTS) {
        if (existingSlugs.has(p.slug) || existingTitles.has(p.title)) {
            console.log(`⏭️  Exists: ${p.title}`); skipped++; continue
        }

        console.log(`\n📦 Creating: ${p.title}`)
        const imageRefs: any[] = []
        for (const imgPath of p.images) {
            const assetId = await upload(imgPath)
            if (assetId) {
                imageRefs.push({
                    _type: 'image',
                    _key: Math.random().toString(36).slice(2, 9),
                    asset: { _type: 'reference', _ref: assetId }
                })
            }
        }

        if (imageRefs.length === 0) {
            console.warn(`   ⚠️ No images uploaded, skipping`); continue
        }

        const doc: any = {
            _type: 'product',
            title: p.title,
            slug: { _type: 'slug', current: p.slug },
            price: p.price,
            originalPrice: p.originalPrice,
            description: p.description,
            category: p.category,
            gender: p.gender || 'man',
            sizeType: p.sizeType,
            sizes: p.sizes,
            variants: [{
                _key: 'var1',
                colorName: 'Primary',
                colorHex: '#2C2C2C',
                stock: 30,
                images: imageRefs
            }],
            discountLabel: `SAVE ₹${p.originalPrice - p.price}`
        }

        try {
            const result = await client.create(doc)
            console.log(`   ✅ Created: ${p.title} (${result._id})`)
            created++
        } catch (err) {
            console.error(`   ❌ Failed: ${p.title}:`, err)
        }
    }

    console.log(`\n🏁 Done! Created: ${created} | Skipped: ${skipped}`)
    const total = await client.fetch(`count(*[_type == "product"])`)
    console.log(`📊 Total products now in DB: ${total}`)
}

main().catch(console.error)
