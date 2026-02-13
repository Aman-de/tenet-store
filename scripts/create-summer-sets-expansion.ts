
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

const ARTIFACTS_DIR = "/Users/uditsharma/.gemini/antigravity/brain/3de14e97-48ea-4cc8-b527-efaf85fe934a"

const sets = [
    {
        name: "The Amalfi Day Edit",
        slug: "the-amalfi-day-edit",
        price: 38000,
        description: "Light Blue Linen Shirt, White Tailored Shorts, Suede Loafers.",
        color: "Blue & White",
        colorHex: "#87CEEB",
        heroImage: "hero_amalfi_day", // Prefix, will match with timestamp
        flatImage: "flat_amalfi_day",
        image_prompt: "Light blue linen shirt, white tailored shorts, tan suede loafers."
    },
    {
        name: "The Santorini Sunset Edit",
        slug: "the-santorini-sunset-edit",
        price: 42000,
        description: "Sand Structured Blazer, White Linen Trousers, Espadrilles.",
        color: "Sand & White",
        colorHex: "#F4A460",
        heroImage: "hero_santorini_sunset",
        flatImage: "flat_santorini_sunset",
        image_prompt: "Sand structured blazer, white linen trousers, beige espadrilles."
    },
    {
        name: "The Capri Evening Edit",
        slug: "the-capri-evening-edit",
        price: 45000,
        description: "Navy Silk Polo, Charcoal Trousers, Black Loafers.",
        color: "Navy & Charcoal",
        colorHex: "#000080",
        heroImage: "hero_capri_evening",
        flatImage: "flat_capri_evening",
        image_prompt: "Navy silk polo, charcoal trousers, black loafers."
    },
    // Round 2 Sets
    {
        name: "The Havana Lounge Edit",
        slug: "the-havana-lounge-edit",
        price: 38000,
        description: "White Guayabera Shirt, Tobacco Linen Trousers, Leather Slides.",
        color: "White & Tobacco",
        colorHex: "#8B4513",
        heroImage: "hero_havana_lounge",
        flatImage: "flat_havana_lounge",
        image_prompt: "White guayabera-style linen shirt, tobacco brown linen trousers, dark brown leather slides."
    },
    {
        name: "The Mykonos Day Club Edit",
        slug: "the-mykonos-day-club-edit",
        price: 40000,
        description: "Cream Open-Knit Polo, Olive Swim Shorts, Espadrilles.",
        color: "Cream & Olive",
        colorHex: "#F5F5DC",
        heroImage: "hero_mykonos_day_club",
        flatImage: "flat_mykonos_day_club",
        image_prompt: "Cream open-knit polo shirt, olive green swim shorts, beige canvas espadrilles."
    },
    {
        name: "The St. Tropez Promenade Edit",
        slug: "the-st-tropez-promenade-edit",
        price: 36000,
        description: "Breton Stripe Tee, Navy Tailored Shorts, White Sneakers.",
        color: "Navy & White",
        colorHex: "#000080",
        heroImage: "hero_st_tropez_promenade",
        flatImage: "flat_st_tropez_promenade",
        image_prompt: "Navy and white Breton stripe long-sleeve tee, navy blue tailored shorts, crisp white leather sneakers."
    },
    // Round 3 Sets
    {
        name: "The Hamptons Weekend Edit",
        slug: "the-hamptons-weekend-edit",
        price: 42000,
        description: "Blue Seersucker Shirt, Nantucket Red Shorts, Boat Shoes.",
        color: "Blue & Red",
        colorHex: "#CD5C5C",
        heroImage: "hero_hamptons_weekend",
        flatImage: "flat_hamptons_weekend",
        image_prompt: "Blue and white seersucker shirt, Nantucket red chino shorts, brown leather boat shoes."
    },
    {
        name: "The Monaco Grand Prix Edit",
        slug: "the-monaco-grand-prix-edit",
        price: 48000,
        description: "White Tipped Knit Polo, Navy Trousers, Suede Loafers.",
        color: "White & Navy",
        colorHex: "#000080",
        heroImage: "hero_monaco_grand_prix",
        flatImage: "flat_monaco_grand_prix",
        image_prompt: "White knit polo with navy tipping, navy blue tailored trousers, navy suede loafers."
    },
    {
        name: "The Tulum Eco-Luxe Edit",
        slug: "the-tulum-eco-luxe-edit",
        price: 39000,
        description: "Beige Linen Shirt, Olive Drawstring Trousers, Leather Sandals.",
        color: "Beige & Olive",
        colorHex: "#808000",
        heroImage: "hero_tulum_eco_luxe",
        flatImage: "flat_tulum_eco_luxe",
        image_prompt: "Beige linen shirt, olive green drawstring linen trousers, dark brown leather gladiator sandals."
    },
    // Round 4 Sets (Pending Images)
    {
        name: "The Lake Como Villa Edit",
        slug: "the-lake-como-villa-edit",
        price: 52000,
        description: "Stone Linen Suit, White Dress Shirt, Loafers.",
        color: "Stone & White",
        colorHex: "#D2B48C",
        heroImage: "hero_lake_como_villa",
        flatImage: "flat_lake_como_villa",
        image_prompt: "Stone-colored linen suit (blazer and trousers), crisp white dress shirt, dark brown leather loafers."
    },
    {
        name: "The Ibiza Boho Edit",
        slug: "the-ibiza-boho-edit",
        price: 35000,
        description: "White Kurta Shirt, Beige Linen Drawstring Pants, Sandals.",
        color: "White & Beige",
        colorHex: "#F5F5DC",
        heroImage: "hero_ibiza_boho",
        flatImage: "flat_ibiza_boho",
        image_prompt: "White kurta-style shirt, beige linen drawstring pants, leather sandals."
    },
    {
        name: "The Maldives Resort Edit",
        slug: "the-maldives-resort-edit",
        price: 37000,
        description: "Tropical Print Silk Shirt, White Tailored Shorts, Slides.",
        color: "Multi & White",
        colorHex: "#00CED1",
        heroImage: "hero_maldives_resort",
        flatImage: "flat_maldives_resort",
        image_prompt: "Tropical print silk shirt, white tailored shorts, slides."
    },
    // Casual Summer Expansion
    {
        name: "The Cabana Terry Set",
        slug: "the-cabana-terry-set",
        price: 28000,
        description: "Navy Blue Terry Cloth Polo, Navy Terry Shorts, Video Leather Sneakers.",
        color: "Navy Monochrome",
        colorHex: "#000080",
        heroImage: "hero_cabana_terry",
        flatImage: "flat_cabana_terry",
        image_prompt: "Navy Blue Terry Cloth Polo, Navy Terry Cloth Shorts, and white leather sneakers."
    },
    {
        name: "The Urban Explorer Edit",
        slug: "the-urban-explorer-edit",
        price: 24000,
        description: "Heavyweight White Cotton Tee, Olive Green Cargo Shorts, Chunky Sneakers.",
        color: "White & Olive",
        colorHex: "#556B2F",
        heroImage: "hero_urban_explorer",
        flatImage: "flat_urban_explorer",
        image_prompt: "Heavyweight White Cotton Tee, Olive Green Cargo Shorts, and chunky sneakers."
    },
    {
        name: "The Sunset Swim Edit",
        slug: "the-sunset-swim-edit",
        price: 32000,
        description: "Geometric Print Swim Trunks, White Linen Shirt, Slides.",
        color: "Multi & White",
        colorHex: "#FF4500",
        heroImage: "hero_sunset_swim",
        flatImage: "flat_sunset_swim",
        image_prompt: "Geometric Print Swim Trunks, White Linen Shirt, and slides."
    }
]

async function findImageFile(prefix: string) {
    const files = fs.readdirSync(ARTIFACTS_DIR)
    // Find file that starts with prefix and (optionally) has timestamp
    // The previous tool usage suggests generated images are like "flat_amalfi_day_1770318544560.png"
    // So we look for files starting with the prefix.
    const match = files.find(f => f.startsWith(prefix) && f.endsWith('.png'))
    if (match) return match
    return null
}

async function createSets() {
    console.log(`🚀 Creating Summer Collection Expansion Sets...`)

    for (const set of sets) {
        try {
            console.log(`\n-----------------------------------`)
            console.log(`Processing: ${set.name}`)

            // 1. Upload Hero Image
            let heroAssetId = null
            const heroFilename = await findImageFile(set.heroImage)
            if (heroFilename) {
                console.log(`   Found Hero image: ${heroFilename}`)
                const heroPath = path.join(ARTIFACTS_DIR, heroFilename)
                const heroBuffer = fs.readFileSync(heroPath)
                const heroAsset = await client.assets.upload('image', heroBuffer, { filename: heroFilename })
                heroAssetId = heroAsset._id
            } else {
                console.log(`   ⚠️ Hero image not found for ${set.name} (prefix: ${set.heroImage})`)
            }

            // 2. Upload Flat Image
            let flatAssetId = null
            const flatFilename = await findImageFile(set.flatImage)
            if (flatFilename) {
                console.log(`   Found Flat image: ${flatFilename}`)
                const flatPath = path.join(ARTIFACTS_DIR, flatFilename)
                const flatBuffer = fs.readFileSync(flatPath)
                const flatAsset = await client.assets.upload('image', flatBuffer, { filename: flatFilename })
                flatAssetId = flatAsset._id
            } else {
                console.log(`   ⚠️ Flat image not found for ${set.name} (prefix: ${set.flatImage})`)
            }

            if (!heroAssetId && !flatAssetId) {
                console.log(`   ❌ No images found for ${set.name}. Skipping product creation.`)
                continue
            }

            // 3. Create Product
            const images = []
            if (heroAssetId) images.push({ _type: 'image', asset: { _type: 'reference', _ref: heroAssetId } })
            if (flatAssetId) images.push({ _type: 'image', asset: { _type: 'reference', _ref: flatAssetId } })

            const doc = {
                _type: 'product',
                title: set.name,
                slug: { _type: 'slug', current: set.slug },
                price: set.price,
                originalPrice: set.price + 5000,
                description: set.description,
                category: 'knitwear', // keeping consistent with previous sets
                sizeType: 'clothing',
                sizes: ['S', 'M', 'L', 'XL'],
                variants: [
                    {
                        _key: 'var1',
                        colorName: set.color,
                        colorHex: set.colorHex,
                        stock: 5,
                        images: images,
                    }
                ],
                imagePromptNote: set.image_prompt,
            };

            // Check availability
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: doc.slug.current })
            if (existing) {
                console.log(`⚠️ Product already exists. Updating images...`)
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
            console.error(`   ❌ Failed for ${set.name}: ${err}`)
        }
    }
}

createSets()
