import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const DIRS = {
    current: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f',
    e2ad: '/Users/uditsharma/.gemini/antigravity/brain/e2adc946-4afc-4cb4-a6fc-6fea5425392a',
    a209: '/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0',
    d39e: '/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b',
}

const assetCache: Record<string, string> = {}

async function uploadImage(dirKey: keyof typeof DIRS, filename: string): Promise<string | null> {
    const cacheKey = `${dirKey}::${filename}`
    if (assetCache[cacheKey]) return assetCache[cacheKey]

    const dirPath = DIRS[dirKey]
    const filePath = path.join(dirPath, filename)
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`)
        return null
    }

    try {
        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, { filename })
        assetCache[cacheKey] = asset._id
        console.log(`📸 Uploaded: ${filename} -> ${asset._id}`)
        return asset._id
    } catch (err) {
        console.error(`❌ Upload failed for ${filename}:`, err)
        return null
    }
}

interface SecondaryUpdate {
    slug: string
    variantColor: string // to identify which variant to patch (colorName)
    secDir: keyof typeof DIRS
    secFile: string
}

const updates: SecondaryUpdate[] = [
    // 1. The Signature Tee
    {
        slug: "the-signature-tee",
        variantColor: "Onyx Black",
        secDir: "current",
        secFile: "signature_tee_black_detail_1779438515599.png"
    },
    {
        slug: "the-signature-tee",
        variantColor: "Cloud White",
        secDir: "current",
        secFile: "signature_tee_white_detail_1779438536951.png"
    },
    // 2. The Daily Oxford
    {
        slug: "the-daily-oxford",
        variantColor: "Midnight Navy",
        secDir: "current",
        secFile: "daily_oxford_navy_detail_1779438559419.png"
    },
    {
        slug: "the-daily-oxford",
        variantColor: "Dune Sand",
        secDir: "current",
        secFile: "daily_oxford_sand_detail_1779438581916.png"
    },
    // 3. The Riviera Linen Short
    {
        slug: "the-riviera-linen-short",
        variantColor: "Primary",
        secDir: "e2ad",
        secFile: "flat_riviera_m_1_1770663297989.png"
    },
    // 4. The Essential Jogger
    {
        slug: "the-essential-jogger",
        variantColor: "Primary",
        secDir: "current",
        secFile: "tuscan_trousers_back_1779288964552.png"
    },
    // 5. The Heavyweight Hoodie
    {
        slug: "the-heavyweight-hoodie",
        variantColor: "Jet Black",
        secDir: "current",
        secFile: "signature_tee_black_detail_1779438515599.png"
    },
    {
        slug: "the-heavyweight-hoodie",
        variantColor: "Heather Grey",
        secDir: "current",
        secFile: "tuscan_trousers_back_1779288964552.png"
    },
    // 6. Everyday Chino Trouser
    {
        slug: "everyday-chino-trouser",
        variantColor: "Sand Beige",
        secDir: "a209",
        secFile: "trouser_sand_flat_generic_1771028636473.png"
    },
    {
        slug: "everyday-chino-trouser",
        variantColor: "True Navy",
        secDir: "d39e",
        secFile: "flat_pleated_chino_navy_1770050721344.png"
    },
    {
        slug: "everyday-chino-trouser",
        variantColor: "Olive Drab",
        secDir: "d39e",
        secFile: "flat_pleated_chino_1770050067412.png"
    },
    // 7. The Harbour Stripe Swim
    {
        slug: "the-harbour-stripe-swim",
        variantColor: "Primary",
        secDir: "e2ad",
        secFile: "flat_aegean_m_1_1770667919410.png"
    },
    // 8. The Textured Knit Polo
    {
        slug: "the-textured-knit-polo",
        variantColor: "Rich Cream",
        secDir: "current",
        secFile: "daily_oxford_sand_detail_1779438581916.png"
    },
    {
        slug: "the-textured-knit-polo",
        variantColor: "Deep Navy",
        secDir: "current",
        secFile: "daily_oxford_navy_detail_1779438559419.png"
    },
    // 9. The Desert Boot
    {
        slug: "the-desert-boot",
        variantColor: "Primary",
        secDir: "current",
        secFile: "chelsea_loafer_angle_1779289108716.png"
    },
    // 10. The Highland Flannel Shirt
    {
        slug: "the-highland-flannel-shirt",
        variantColor: "Primary",
        secDir: "d39e",
        secFile: "flat_highland_estate_1770241977609.png"
    },
    // 11. The Bridle Leather Belt
    {
        slug: "the-bridle-leather-belt",
        variantColor: "Primary",
        secDir: "current",
        secFile: "voyager_duffel_flat_1779247010443.png"
    }
]

async function main() {
    console.log("🚀 Updating secondary images for the 11 products...")

    // Group updates by product slug to fetch and patch once per product
    const updatesBySlug: Record<string, SecondaryUpdate[]> = {}
    for (const u of updates) {
        if (!updatesBySlug[u.slug]) updatesBySlug[u.slug] = []
        updatesBySlug[u.slug].push(u)
    }

    for (const [slug, prodUpdates] of Object.entries(updatesBySlug)) {
        console.log(`\nProcessing product: ${slug}`)
        
        const doc = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug })
        if (!doc) {
            console.error(`❌ Product not found: ${slug}`)
            continue
        }

        let isPatched = false
        const updatedVariants = doc.variants.map((variant: any) => {
            const match = prodUpdates.find(u => u.variantColor === variant.colorName)
            if (match) {
                return (async () => {
                    const secAssetId = await uploadImage(match.secDir, match.secFile)
                    if (secAssetId) {
                        const existingImages = variant.images || []
                        const mainImageRef = existingImages[0]?.asset?._ref

                        const newImages = []
                        if (mainImageRef) {
                            newImages.push({ _type: 'image', asset: { _type: 'reference', _ref: mainImageRef } })
                        }
                        newImages.push({ _type: 'image', asset: { _type: 'reference', _ref: secAssetId } })

                        isPatched = true
                        return {
                            ...variant,
                            images: newImages
                        }
                    }
                    return variant
                })()
            }
            return Promise.resolve(variant)
        })

        const resolvedVariants = await Promise.all(updatedVariants)

        if (isPatched) {
            await client.patch(doc._id).set({ variants: resolvedVariants }).commit()
            console.log(`✅ Successfully updated variants for ${slug}`)
        } else {
            console.log(`⏭️ No updates applied for ${slug}`)
        }
    }

    console.log("\n🏁 Done updating secondary images!")
}

main().catch(console.error)
