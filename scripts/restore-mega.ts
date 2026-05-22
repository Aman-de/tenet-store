/**
 * restore-mega.ts
 * Non-destructive mega-restore: adds every product that has images but is missing from the DB.
 * Safe to re-run – checks slugs before creating.
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

const DIRS: Record<string, string> = {
    d39e:    '/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b',
    e2ad:    '/Users/uditsharma/.gemini/antigravity/brain/e2adc946-4afc-4cb4-a6fc-6fea5425392a',
    ace5:    '/Users/uditsharma/.gemini/antigravity/brain/ace51c03-e5ea-4e4c-a6fe-1a891674d2c1',
    c55b:    '/Users/uditsharma/.gemini/antigravity/brain/55be8c19-23dd-46d2-b41c-edeb421b7252',
    c3de:    '/Users/uditsharma/.gemini/antigravity/brain/3de14e97-48ea-4cc8-b527-efaf85fe934a',
    current: '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f',
    a209:    '/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0',
    local:   '/Users/uditsharma/tenet-store/public/images/products',
    old60:   '/Users/uditsharma/.gemini/antigravity/brain/60c7ea9b-3177-4b12-8a7c-956138ea2356',
}

// =====================================================================
// PRODUCT CATALOGUE — all products that should exist (with image paths)
// =====================================================================

type ProductDef = {
    title: string
    slug: string
    price: number
    originalPrice: number
    category: string
    gender?: string
    sizeType?: string
    sizes?: string[]
    description: string
    variants: { colorName: string; colorHex: string; images: { dir?: string; file?: string; ref?: string }[] }[]
}

export const ALL_PRODUCTS: ProductDef[] = [
    {
        title: "The Archive Cable Knit Zip",
        slug: "the-archive-cable-knit-zip",
        price: 4200,
        originalPrice: 8400,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "A chunky cardigan styled with dynamic cabling and a heavy metal two-way zipper. Perfect for transitioning seasons with structural warmth and versatility.",
        variants: [{colorName: "Forest Green",colorHex: "#355E3B",images:[{dir: "local",file: "combo.jpeg"},{dir: "current",file: "cable_zip_back_1779291191871.png" }]},{colorName: "Dark Charcoal",colorHex: "#1A1A1A",images:[{dir: "local",file: "combo.jpeg"},{dir: "current",file: "cable_zip_back_1779291191871.png" }] }]
    },
    {
        title: "The Tailored Gurkha Trouser",
        slug: "the-tailored-gurkha-trouser",
        price: 4999,
        originalPrice: 6999,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["30","32","34","36"],
        description: "Sartorial elegance meets military history. High-waisted with the signature double-buckle waistband closure. Cut from heavy cotton drill with single pleats for comfort and style.",
        variants: [{colorName: "Sand Beige",colorHex: "#C2B280",images:[{dir: "a209",file: "trouser_sand_flat_generic_1771028636473.png"},{dir: "current",file: "gurkha_trouser_back_1779290599911.png" }]},{colorName: "Olive Drab",colorHex: "#6B8E23",images:[{dir: "a209",file: "trouser_sand_flat_generic_1771028636473.png"},{dir: "current",file: "gurkha_trouser_back_1779290599911.png" }] }]
    },
    {
        title: "The Classic Harrington",
        slug: "the-classic-harrington",
        price: 5999,
        originalPrice: 8999,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "An icon of British style. Water-resistant cotton blend shell with the signature tartan lining. Features a double-button funnel neck, raglan sleeves, and umbrella yoke back.",
        variants: [{colorName: "Midnight Navy",colorHex: "#000080",images:[{dir: "a209",file: "harrington_navy_flat_generic_1771028651698.png"},{dir: "current",file: "harrington_back_1779290699671.png" }]},{colorName: "Stone Beige",colorHex: "#CDC9C9",images:[{dir: "a209",file: "harrington_navy_flat_generic_1771028651698.png"},{dir: "current",file: "harrington_back_1779290699671.png" }] }]
    },
    {
        title: "The Canvas Chore Coat",
        slug: "the-canvas-chore-coat",
        price: 4499,
        originalPrice: 6499,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Workwear refined. Built from 12oz duck canvas that gets better with age. Features three patch pockets, reinforced elbows, and shank buttons. Unlined for year-round wear.",
        variants: [{colorName: "Field Olive",colorHex: "#556B2F",images:[{dir: "a209",file: "chore_coat_olive_flat_generic_1771028667076.png"},{dir: "current",file: "chore_coat_back_1779290738145.png" }]},{colorName: "Workwear Tan",colorHex: "#D2B48C",images:[{dir: "a209",file: "chore_coat_olive_flat_generic_1771028667076.png"},{dir: "current",file: "chore_coat_back_1779290738145.png" }] }]
    },
    {
        title: "The Voyager Leather Duffel",
        slug: "the-voyager-leather-duffel",
        price: 15500,
        originalPrice: 18500,
        category: "accessories",
        gender: "unisex",
        sizeType: "onesize",
        sizes: [],
        description: "Full-grain cognac leather weekend travel bag, featuring brass hardware, double carrying handles, and an adjustable, padded shoulder strap. Perfectly sized for short business trips or weekend getaways.",
        variants: [{colorName: "Cognac Brown",colorHex: "#8B4513",images:[{dir: "current",file: "voyager_duffel_flat_1779247010443.png"},{dir: "current",file: "voyager_duffel_inside_1779289173569.png" }] }]
    },
    {
        title: "The Capri Evening Edit",
        slug: "the-capri-evening-edit",
        price: 45000,
        originalPrice: 50000,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Navy Silk Polo, Charcoal Trousers, Black Loafers.",
        variants: [{colorName: "Navy & Charcoal",colorHex: "#000080",images:[{dir: "c55b",file: "hero_capri_evening_1770318678698.png"},{dir: "c55b",file: "flat_capri_evening_1770318663684.png" }] }]
    },
    {
        title: "The Ibiza Boho Edit",
        slug: "the-ibiza-boho-edit",
        price: 35000,
        originalPrice: 40000,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "White Kurta Shirt, Beige Linen Drawstring Pants, Sandals.",
        variants: [{colorName: "White & Beige",colorHex: "#F5F5DC",images:[{dir: "c3de",file: "hero_ibiza_boho_1770413188530.png"},{dir: "c3de",file: "flat_ibiza_boho_1770413203113.png" }] }]
    },
    {
        title: "The Urban Explorer Edit",
        slug: "the-urban-explorer-edit",
        price: 24000,
        originalPrice: 29000,
        category: "shorts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Heavyweight White Cotton Tee, Olive Green Cargo Shorts, Chunky Sneakers.",
        variants: [{colorName: "White & Olive",colorHex: "#556B2F",images:[{dir: "c3de",file: "hero_urban_explorer_1770420505052.png"},{dir: "c3de",file: "flat_urban_explorer_1770420521489.png" }] }]
    },
    {
        title: "The Cabana Terry Set",
        slug: "the-cabana-terry-set",
        price: 28000,
        originalPrice: 33000,
        category: "sets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Navy Blue Terry Cloth Polo, Navy Terry Shorts, Video Leather Sneakers.",
        variants: [{colorName: "Navy Monochrome",colorHex: "#000080",images:[{dir: "c3de",file: "hero_cabana_terry_1770419773167.png"},{dir: "c3de",file: "flat_cabana_terry_1770419786098.png" }] }]
    },
    {
        title: "The Signature Tee",
        slug: "the-signature-tee",
        price: 1299,
        originalPrice: 1999,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "The ultimate luxury basic. Cut from 260 GSM supima cotton with a mercerized finish for a silk-like touch. Features a tailored fit that sits perfectly at the waist and biceps. Minimalist, timeless, and built to last.",
        variants: [{colorName: "Onyx Black",colorHex: "#000000",images:[{dir: "a209",file: "signature_tee_black_flat_1771027847447.png"},{dir: "current",file: "signature_tee_black_detail_1779438515599.png" }]},{colorName: "Cloud White",colorHex: "#FFFFFF",images:[{dir: "a209",file: "signature_tee_white_flat_1771027863508.png"},{dir: "current",file: "signature_tee_white_detail_1779438536951.png" }] }]
    },
    {
        title: "The Harrington",
        slug: "the-harrington",
        price: 9500,
        originalPrice: 11400,
        category: "outerwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Water-resistant cotton shell with tartan lining. The definitive classic.",
        variants: [{colorName: "Tan",colorHex: "#D2B48C",images:[{dir: "old60",file: "harrington_jacket_1769838412001.png"},{dir: "d39e",file: "flat_harrington_tan_1770050747796.png" }] }]
    },
    {
        title: "The Oxford Blue Shirt",
        slug: "the-oxford-blue-shirt",
        price: 3800,
        originalPrice: 5000,
        category: "shirts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Light blue Oxford weave shirt with a button-down collar and chest pocket. Made from premium 100% cotton with a relaxed fit. Works dressed up or down with equal ease.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "current",file: "oxford_shirt_blue_flat_1779436324997.png"},{dir: "d39e",file: "flat_oxford_shirt_1770228013702.png" }] }]
    },
    {
        title: "The Paris Flâneur Edit",
        slug: "the-paris-flaneur-edit",
        price: 58000,
        originalPrice: 69600,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Cinematic urban sophistication. Features a Beige Trench Coat, Black Merino Turtleneck, and Charcoal Trousers.",
        variants: [{colorName: "Beige & Black",colorHex: "#F5F5DC",images:[{dir: "ace5",file: "hero_paris_flaneur_1770836558589.png"},{dir: "ace5",file: "hero_paris_flaneur_1770836558589.png" }] }]
    },
    {
        title: "The St. Tropez Promenade Edit",
        slug: "the-st-tropez-promenade-edit",
        price: 36000,
        originalPrice: 41000,
        category: "shorts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Breton Stripe Tee, Navy Tailored Shorts, White Sneakers.",
        variants: [{colorName: "Navy & White",colorHex: "#000080",images:[{dir: "c55b",file: "hero_st_tropez_promenade_1770318973891.png"},{dir: "c55b",file: "flat_st_tropez_promenade_1770318957196.png" }] }]
    },
    {
        title: "The Monaco Grand Prix Edit",
        slug: "the-monaco-grand-prix-edit",
        price: 48000,
        originalPrice: 53000,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "White Tipped Knit Polo, Navy Trousers, Suede Loafers.",
        variants: [{colorName: "White & Navy",colorHex: "#000080",images:[{dir: "current",file: "monaco_hero_1779428682995.png"},{dir: "current",file: "monaco_flat_1779428709567.png" }] }]
    },
    {
        title: "The Tulum Eco-Luxe Edit",
        slug: "the-tulum-eco-luxe-edit",
        price: 39000,
        originalPrice: 44000,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Beige Linen Shirt, Olive Drawstring Trousers, Leather Sandals.",
        variants: [{colorName: "Beige & Olive",colorHex: "#808000",images:[{dir: "current",file: "tulum_hero_1779428732004.png"},{dir: "current",file: "tulum_flat_1779428757773.png" }] }]
    },
    {
        title: "The Maldives Resort Edit",
        slug: "the-maldives-resort-edit",
        price: 37000,
        originalPrice: 42000,
        category: "shorts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Tropical Print Silk Shirt, White Tailored Shorts, Slides.",
        variants: [{colorName: "Multi & White",colorHex: "#00CED1",images:[{dir: "c3de",file: "hero_maldives_resort_1770413220425.png"},{dir: "c3de",file: "flat_maldives_resort_1770413236714.png" }] }]
    },
    {
        title: "The Sunset Swim Edit",
        slug: "the-sunset-swim-edit",
        price: 32000,
        originalPrice: 37000,
        category: "swimwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Geometric Print Swim Trunks, White Linen Shirt, Slides.",
        variants: [{colorName: "Multi & White",colorHex: "#FF4500",images:[{dir: "c3de",file: "hero_sunset_swim_1770420486367.png"},{dir: "c3de",file: "flat_sunset_swim_1770420462243.png" }] }]
    },
    {
        title: "The Chelsea Boot",
        slug: "the-chelsea-boot",
        price: 13500,
        originalPrice: 16200,
        category: "footwear",
        gender: "man",
        sizeType: "numeric",
        sizes: ["7","8","9","10","11"],
        description: "Italian suede with elastic side panels. Blake stitched construction.",
        variants: [{colorName: "Dark Brown",colorHex: "#4B3621",images:[{dir: "d39e",file: "hero_chelsea_boot_1770211079147.png"},{dir: "d39e",file: "flat_chelsea_boot_1770228040345.png" }] }]
    },
    {
        title: "Essential Heavyweight Tee",
        slug: "essential-heavyweight-tee",
        price: 1999,
        originalPrice: 2499,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL","XXL"],
        description: "The only t-shirt you'll ever need. Crafted from 280 GSM heavyweight cotton for a structured drape that doesn't cling. Pre-shrunk and garment-dyed for lasting color and a broken-in feel from day one.",
        variants: [{colorName: "Midnight Black",colorHex: "#000000",images:[{dir: "current",file: "pexels-photo-1656684.jpeg.jpg"},{dir: "current",file: "pexels-photo-991509.jpeg.jpg" }]},{colorName: "Optic White",colorHex: "#FFFFFF",images:[{dir: "current",file: "pexels-photo-2294342.jpeg.jpg"},{dir: "current",file: "pexels-photo-428338.jpeg.jpg" }]},{colorName: "Navy Blue",colorHex: "#000080",images:[{dir: "current",file: "pexels-photo-3755706.jpeg.jpg"},{dir: "current",file: "pexels-photo-1043474.jpeg.jpg" }]},{colorName: "Olive Green",colorHex: "#556B2F",images:[{dir: "current",file: "pexels-photo-1183266.jpeg.jpg" }] }]
    },
    {
        title: "The Cashmere Polo",
        slug: "the-cashmere-polo",
        price: 12000,
        originalPrice: 14400,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Pure cashmere long-sleeve polo. Softness without compromise.",
        variants: [{colorName: "Charcoal Grey",colorHex: "#36454F",images:[{dir: "old60",file: "cashmere_polo_1769838325764.png"},{dir: "old60",file: "flat_cashmere_polo_1769839681001.png" }] }]
    },
    {
        title: "The Merino Crewneck",
        slug: "the-merino-crewneck",
        price: 6800,
        originalPrice: 8900,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Classic merino wool crewneck in a refined mid-weight. Ribbed collar, cuffs and hem. Versatile enough to wear alone or layer under a jacket. A year-round wardrobe anchor.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "d39e",file: "flat_merino_turtleneck_1770227985744.png"},{dir: "d39e",file: "hero_merino_turtleneck_1770210993042.png" }] }]
    },
    {
        title: "The Riviera Resort Shirt",
        slug: "the-riviera-resort-shirt",
        price: 3600,
        originalPrice: 4500,
        category: "shirts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Terracotta and cream vertical striped resort shirt, featuring an airy weave and a classic flat camp collar. The perfect companion for beach escapes and casual weekends.",
        variants: [{colorName: "Terracotta & Cream",colorHex: "#C05A46",images:[{dir: "current",file: "riviera_shirt_flat_1779246695628.png"},{dir: "current",file: "riviera_shirt_back_1779289012029.png" }] }]
    },
    {
        title: "The Mykonos Day Club Edit",
        slug: "the-mykonos-day-club-edit",
        price: 40000,
        originalPrice: 45000,
        category: "swimwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Cream Open-Knit Polo, Olive Swim Shorts, Espadrilles.",
        variants: [{colorName: "Cream & Olive",colorHex: "#F5F5DC",images:[{dir: "c55b",file: "hero_mykonos_day_club_1770318942498.png"},{dir: "c55b",file: "flat_mykonos_day_club_1770318927017.png" }] }]
    },
    {
        title: "Breezy Linen Resort Shirt",
        slug: "breezy-linen-resort-shirt",
        price: 2999,
        originalPrice: 3999,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "100% French linen, stone-washed for incredible softness. Designed with a relaxed camp collar and distinct texture. The ultimate summer staple for effortless style.",
        variants: [{colorName: "Crisp White",colorHex: "#FFFFFF",images:[{dir: "current",file: "pexels-photo-1963236.jpeg.jpg"},{dir: "current",file: "pexels-photo-6626903.jpeg.jpg" }]},{colorName: "Sky Blue",colorHex: "#87CEEB",images:[{dir: "current",file: "pexels-photo-3651597.jpeg.jpg" }] }]
    },
    {
        title: "The Weekender",
        slug: "the-weekender",
        price: 22000,
        originalPrice: 26400,
        category: "accessories",
        gender: "man",
        sizeType: "onesize",
        sizes: [],
        description: "Full-grain vegetable tanned leather duffel bag. Built for travel.",
        variants: [{colorName: "Cognac Leather",colorHex: "#8B4513",images:[{dir: "old60",file: "weekender_bag_1769838467779.png"},{dir: "d39e",file: "flat_weekender_cognac_1770050799646.png" }] }]
    },
    {
        title: "The Pleated Wool Trouser",
        slug: "the-pleated-wool-trouser",
        price: 5499,
        originalPrice: 7999,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["30","32","34","36"],
        description: "Your go-to formal trouser. Made from Super 120s Italian wool flannel. Features a double-pleated front, side adjusters, and a tapered leg for a modern silhouette.",
        variants: [{colorName: "Heather Grey",colorHex: "#808080",images:[{dir: "a209",file: "trouser_sand_flat_generic_1771028636473.png"},{dir: "current",file: "wool_trouser_back_1779290652871.png" }]},{colorName: "Charcoal",colorHex: "#36454F",images:[{dir: "a209",file: "trouser_sand_flat_generic_1771028636473.png"},{dir: "current",file: "wool_trouser_back_1779290652871.png" }] }]
    },
    {
        title: "The Savannah Sunset Edit",
        slug: "the-savannah-sunset-edit",
        price: 45000,
        originalPrice: 52000,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Luxury safari, warm evening wear. Features a lightweight khaki field jacket, cream linen trousers, white t-shirt, and leather sandals.",
        variants: [{colorName: "Khaki & Cream",colorHex: "#F0E68C",images:[{dir: "e2ad",file: "hero_savannah_m_1_1770663312853.png"},{dir: "e2ad",file: "flat_savannah_m_1_1770663328357.png" }] }]
    },
    {
        title: "The Hamptons Weekend Edit",
        slug: "the-hamptons-weekend-edit",
        price: 42000,
        originalPrice: 47000,
        category: "shorts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Blue Seersucker Shirt, Nantucket Red Shorts, Boat Shoes.",
        variants: [{colorName: "Blue & Red",colorHex: "#CD5C5C",images:[{dir: "c55b",file: "hero_hamptons_weekend_1770322031527.png"},{dir: "c55b",file: "flat_hamptons_weekend_1770322015557.png" }] }]
    },
    {
        title: "The Daily Oxford",
        slug: "the-daily-oxford",
        price: 1899,
        originalPrice: 2499,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Your everyday armor. Crafted from Italian linen-cotton blend that breathes with you. Garment-washed for instant comfort and a lived-in texture. The button-down collar rolls perfectly without a tie.",
        variants: [{colorName: "Midnight Navy",colorHex: "#000080",images:[{dir: "a209",file: "daily_oxford_navy_flat_1771027880548.png"},{dir: "current",file: "daily_oxford_navy_detail_1779438559419.png" }]},{colorName: "Dune Sand",colorHex: "#C2B280",images:[{dir: "a209",file: "daily_oxford_sand_flat_1771027896268.png"},{dir: "current",file: "daily_oxford_sand_detail_1779438581916.png" }] }]
    },
    {
        title: "Classic Pique Polo",
        slug: "classic-pique-polo",
        price: 2499,
        originalPrice: 3299,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL","XXL"],
        description: "A modern update to the classic polo. Made from premium combed cotton pique with a hint of stretch. Features a structured collar that stays crisp and genuine mother-of-pearl buttons.",
        variants: [{colorName: "Classic White",colorHex: "#FFFFFF",images:[{dir: "current",file: "pexels-photo-1232459.jpeg.jpg"},{dir: "current",file: "pexels-photo-298863.jpeg.jpg" }]},{colorName: "Jet Black",colorHex: "#000000",images:[{dir: "current",file: "pexels-photo-3760610.jpeg.jpg"},{dir: "current",file: "pexels-photo-4890733.jpeg.jpg" }]},{colorName: "Royal Navy",colorHex: "#000080",images:[{dir: "current",file: "pexels-photo-5384445.jpeg.jpg" }] }]
    },
    {
        title: "The Bali Bamboo Edit",
        slug: "the-bali-bamboo-edit",
        price: 36000,
        originalPrice: 43200,
        category: "shirts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Tropical luxury. Features an Olive Linen Kimono Shirt, Black Linen Shorts, and Leather Slides.",
        variants: [{colorName: "Olive & Black",colorHex: "#556B2F",images:[{dir: "ace5",file: "hero_bali_bamboo_1770836894353.png"},{dir: "ace5",file: "flat_bali_bamboo_1770836926427.png" }] }]
    },
    {
        title: "The Merino Turtleneck",
        slug: "the-merino-turtleneck",
        price: 9500,
        originalPrice: 11400,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Fine gauge merino wool. A sophisticated layer for the modern wardrobe.",
        variants: [{colorName: "Black",colorHex: "#000000",images:[{dir: "d39e",file: "hero_merino_turtleneck_1770210993042.png"},{dir: "d39e",file: "flat_merino_turtleneck_1770227985744.png" }] }]
    },
    {
        title: "Vintage Wash Selvedge Denim",
        slug: "vintage-wash-selvedge-denim",
        price: 4999,
        originalPrice: 6999,
        category: "trousers",
        gender: "man",
        sizeType: "numeric",
        sizes: ["28","30","32","34","36","38"],
        description: "Authentic japanese selvedge denim, rinsed for a softer feel. Features classic 5-pocket styling and antique copper hardware. A wardrobe staple that gets better with every wear.",
        variants: [{colorName: "Light Wash",colorHex: "#ADD8E6",images:[{dir: "current",file: "pexels-photo-1082529.jpeg.jpg"},{dir: "current",file: "pexels-photo-603022.jpeg.jpg" }]},{colorName: "Indigo Rinse",colorHex: "#4B0082",images:[{dir: "current",file: "pexels-photo-1598505.jpeg.jpg" }] }]
    },
    {
        title: "The Noir Quarter-Zip",
        slug: "the-noir-quarter-zip",
        price: 6200,
        originalPrice: 7440,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Sleek, breathable wool blend designed for layering over shirts.",
        variants: [{colorName: "Midnight Navy",colorHex: "#191970",images:[{dir: "old60",file: "noir_quarter_zip_1769838281290.png"},{dir: "old60",file: "flat_noir_zip_1769839651954.png" }] }]
    },
    {
        title: "The Pleated Chino",
        slug: "the-pleated-chino",
        price: 4800,
        originalPrice: 5760,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Classic single pleat, tapered fit. Structured cotton twill.",
        variants: [{colorName: "Navy",colorHex: "#000080",images:[{dir: "old60",file: "pleated_chino_1769838382486.png"},{dir: "d39e",file: "flat_pleated_chino_navy_1770050721344.png" }] }]
    },
    {
        title: "The Riviera Linen Short",
        slug: "the-riviera-linen-short",
        price: 4200,
        originalPrice: 5500,
        category: "shorts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Pure linen tailored shorts in natural sand. Relaxed waistband with drawstring, side pockets, and a mid-thigh hem. The perfect companion for warm-weather escapes.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "current",file: "linen_shorts_beige_flat_1779436301372.png"},{dir: "e2ad",file: "flat_riviera_m_1_1770663297989.png" }] }]
    },
    {
        title: "The Essential Jogger",
        slug: "the-essential-jogger",
        price: 3900,
        originalPrice: 5200,
        category: "lounge",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL","XXL"],
        description: "French terry lounge joggers in heather grey. Tapered leg, ribbed ankle cuffs, hidden drawstring waist, and zippered side pockets. 380 GSM — heavy enough to feel substantial.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "current",file: "lounge_joggers_grey_flat_1779436378908.png"},{dir: "current",file: "tuscan_trousers_back_1779288964552.png" }] }]
    },
    {
        title: "The Yacht Club Edit",
        slug: "the-yacht-club-edit",
        price: 45000,
        originalPrice: 52000,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Nautical sophistication for the modern gentleman. Features a classic Navy Double-Breasted Blazer, White Chinos, Oxford Shirt, and Boat Shoes.",
        variants: [{colorName: "Navy & White",colorHex: "#000080",images:[{dir: "d39e",file: "hero_yacht_club_1770239426661.png"},{dir: "a209",file: "yacht_club_edit_flat_v2_1771020663930.png" }] }]
    },
    {
        title: "The Aegean Odyssey Edit",
        slug: "the-aegean-odyssey-edit",
        price: 52000,
        originalPrice: 62400,
        category: "sets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Grecian minimalism. Features a White Silk-Linen Suit and Grecian Leather Sandals.",
        variants: [{colorName: "White Monochrome",colorHex: "#FFFFFF",images:[{dir: "ace5",file: "hero_aegean_odyssey_1770836846549.png"},{dir: "a209",file: "aegean_odyssey_edit_flat_v2_1771020691525.png" }] }]
    },
    {
        title: "The Quarter-Zip Pullover",
        slug: "the-quarter-zip-pullover",
        price: 3499,
        originalPrice: 4499,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "The ultimate layering piece. Crafted from a dense cotton-cashmere blend. Features a polished metal YKK zipper and a stand collar that looks sharp over a tee or oxford.",
        variants: [{colorName: "Charcoal Grey",colorHex: "#36454F",images:[{dir: "a209",file: "quarter_zip_charcoal_flat_v2_1771028582947.png"},{dir: "current",file: "quarter_zip_back_1779290562573.png" }]},{colorName: "Jet Black",colorHex: "#000000",images:[{dir: "a209",file: "quarter_zip_charcoal_flat_v2_1771028582947.png"},{dir: "current",file: "quarter_zip_back_1779290562573.png" }] }]
    },
    {
        title: "The Heavyweight Hoodie",
        slug: "the-heavyweight-hoodie",
        price: 3499,
        originalPrice: 4999,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL","XXL"],
        description: "Constructed from ultra-heavy 500 GSM loopback cotton fleece. Featuring a double-lined hood and a structured fit that holds its shape. No drawstrings for a clean, minimalist silhouette.",
        variants: [{colorName: "Jet Black",colorHex: "#000000",images:[{dir: "a209",file: "heavyweight_hoodie_black_flat_1771028111881.png"},{dir: "current",file: "signature_tee_black_detail_1779438515599.png" }]},{colorName: "Heather Grey",colorHex: "#808080",images:[{dir: "a209",file: "heavyweight_hoodie_grey_flat_1771028125055.png"},{dir: "current",file: "tuscan_trousers_back_1779288964552.png" }] }]
    },
    {
        title: "The Amalfi Stripe",
        slug: "the-amalfi-stripe",
        price: 4200,
        originalPrice: 5040,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Vertical striped vacation shirt with a camp collar.",
        variants: [{colorName: "Olive & White",colorHex: "#556B2F",images:[{dir: "old60",file: "amalfi_stripe_1769838363946.png"},{dir: "old60",file: "flat_amalfi_stripe_1769839758454.png" }] }]
    },
    {
        title: "The Heritage Structured Polo",
        slug: "the-heritage-structured-polo",
        price: 4900,
        originalPrice: 5900,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Aran cream long-sleeve waffle knit polo. Structured ribbed collar and three-button placket. Warm yet breathable, making it a year-round silent luxury staple.",
        variants: [{colorName: "Aran Cream",colorHex: "#FDFBF7",images:[{dir: "current",file: "heritage_polo_flat_1779246803183.png"},{dir: "current",file: "heritage_polo_detail_1779289051405.png" }] }]
    },
    {
        title: "The Scholar Turtleneck",
        slug: "the-scholar-turtleneck",
        price: 4200,
        originalPrice: 6500,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "A sophisticated turtleneck spun from a soft merino-cotton blend. Snug neck support, ribbed cuffs, and a slim, flattering profile that pairs perfectly under coats.",
        variants: [{colorName: "Off Black",colorHex: "#1A1A1A",images:[{dir: "local",file: "turtelneck.jpg"},{dir: "current",file: "turtleneck_detail_1779308415542.png" }]},{colorName: "Heather Grey",colorHex: "#808080",images:[{dir: "local",file: "turtelneck.jpg"},{dir: "current",file: "turtleneck_detail_1779308415542.png" }]},{colorName: "Aran Cream",colorHex: "#FDFBF7",images:[{dir: "local",file: "turtelneck.jpg"},{dir: "current",file: "turtleneck_detail_1779308415542.png" }] }]
    },
    {
        title: "Tuscan Drawstring Trousers",
        slug: "tuscan-drawstring-trousers",
        price: 4200,
        originalPrice: 5200,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Sand beige drawstring trousers, tailored with a relaxed waist and slightly tapered leg. Crafted from a breathable cotton-linen blend that holds its shape while keeping you cool.",
        variants: [{colorName: "Sand Beige",colorHex: "#C2B280",images:[{dir: "current",file: "tuscan_trousers_flat_1779246670578.png"},{dir: "current",file: "tuscan_trousers_back_1779288964552.png" }] }]
    },
    {
        title: "The Alpine Lodge Edit",
        slug: "the-alpine-lodge-edit",
        price: 55000,
        originalPrice: 62000,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Après-ski luxury defined. Features a Chunky Cream Roll-neck Sweater, Chocolate Brown Corduroy Trousers, and Leather Hiking Boots.",
        variants: [{colorName: "Cream & Brown",colorHex: "#F5F5DC",images:[{dir: "d39e",file: "hero_alpine_lodge_1770240393686.png"},{dir: "d39e",file: "flat_alpine_lodge_1770240376904.png" }] }]
    },
    {
        title: "The Savannah Explorer Edit",
        slug: "the-savannah-explorer-edit",
        price: 48000,
        originalPrice: 58000,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Vintage adventure luxury. Features a Beige Linen Safari Jacket, White Trousers, Brown Loafers, and a Silk Scarf.",
        variants: [{colorName: "Beige & White",colorHex: "#F5F5DC",images:[{dir: "d39e",file: "hero_savannah_explorer_1770240457660.png"},{dir: "d39e",file: "flat_savannah_explorer_1770240440949.png" }] }]
    },
    {
        title: "The Manhattan Evening Edit",
        slug: "the-manhattan-evening-edit",
        price: 62000,
        originalPrice: 75000,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Urban noir for the city night. Features a Charcoal Wool Overcoat, Black Mock Neck Sweater, Grey Flannel Trousers, and Chelsea Boots.",
        variants: [{colorName: "Charcoal & Black",colorHex: "#36454F",images:[{dir: "d39e",file: "hero_manhattan_evening_1770240522517.png"},{dir: "d39e",file: "flat_manhattan_evening_1770240506927.png" }] }]
    },
    {
        title: "The Havana Lounge Edit",
        slug: "the-havana-lounge-edit",
        price: 38000,
        originalPrice: 43000,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "White Guayabera Shirt, Tobacco Linen Trousers, Leather Slides.",
        variants: [{colorName: "White & Tobacco",colorHex: "#8B4513",images:[{dir: "c55b",file: "hero_havana_lounge_1770318908401.png"},{dir: "c55b",file: "flat_havana_lounge_1770318891540.png" }] }]
    },
    {
        title: "The Lake Como Villa Edit",
        slug: "the-lake-como-villa-edit",
        price: 52000,
        originalPrice: 57000,
        category: "sets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Stone Linen Suit, White Dress Shirt, Loafers.",
        variants: [{colorName: "Stone & White",colorHex: "#D2B48C",images:[{dir: "c3de",file: "hero_lake_como_villa_1770413155250.png"},{dir: "c3de",file: "flat_lake_como_villa_1770413170290.png" }] }]
    },
    {
        title: "Everyday Chino Trouser",
        slug: "everyday-chino-trouser",
        price: 3499,
        originalPrice: 4999,
        category: "trousers",
        gender: "man",
        sizeType: "numeric",
        sizes: ["28","30","32","34","36","38"],
        description: "Versatile chinos cut for a relaxed yet tailored fit. Constructed from mid-weight cotton twill with 2% elastane for all-day comfort. Perfect for both office hours and weekend wanderings.",
        variants: [{colorName: "Sand Beige",colorHex: "#F5F5DC",images:[{dir: "current",file: "jeans-pants-blue-shop-52518.jpeg.jpg"},{dir: "a209",file: "trouser_sand_flat_generic_1771028636473.png" }]},{colorName: "True Navy",colorHex: "#000080",images:[{dir: "current",file: "pexels-photo-45982.jpeg.jpg"},{dir: "d39e",file: "flat_pleated_chino_navy_1770050721344.png" }]},{colorName: "Olive Drab",colorHex: "#6B8E23",images:[{dir: "current",file: "pexels-photo-2343661.jpeg.jpg"},{dir: "d39e",file: "flat_pleated_chino_1770050067412.png" }] }]
    },
    {
        title: "The Harbour Stripe Swim",
        slug: "the-harbour-stripe-swim",
        price: 5500,
        originalPrice: 7200,
        category: "swimwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Navy pinstripe quick-dry swim shorts with an elasticated waistband and rope drawstring. Lined with mesh for comfort. A poolside essential for the modern gentleman.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "current",file: "navy_swim_shorts_flat_1779436277004.png"},{dir: "e2ad",file: "flat_aegean_m_1_1770667919410.png" }] }]
    },
    {
        title: "The Polo Ground Edit",
        slug: "the-polo-ground-edit",
        price: 38000,
        originalPrice: 45000,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Quintessential British style. Features a Cream Cable-Knit Cricket Sweater, Grey Wool Trousers, White Shirt, and Suede Chakra Boots.",
        variants: [{colorName: "Cream & Grey",colorHex: "#F5F5DC",images:[{dir: "d39e",file: "hero_polo_ground_1770239520328.png"},{dir: "a209",file: "polo_ground_edit_flat_v2_1771020898667.png" }] }]
    },
    {
        title: "The Riviera Retreat",
        slug: "the-riviera-retreat",
        price: 42000,
        originalPrice: 48000,
        category: "sets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Mediterranean luxury, yacht club casual. Features a white linen button-down shirt, navy blue tailored swim shorts, brown leather espadrilles, and designer sunglasses.",
        variants: [{colorName: "White & Navy",colorHex: "#FFFFFF",images:[{dir: "e2ad",file: "hero_riviera_m_1_1770663283747.png"},{dir: "a209",file: "riviera_retreat_flat_v2_1771020781803.png" }] }]
    },
    {
        title: "The Amalfi Aperitivo",
        slug: "the-amalfi-aperitivo",
        price: 40000,
        originalPrice: 46000,
        category: "sets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Italian summer evening, relaxed elegance. Features a light blue linen shirt, beige Gurkha shorts, brown suede loafers, and sunglasses.",
        variants: [{colorName: "Light Blue & Beige",colorHex: "#ADD8E6",images:[{dir: "e2ad",file: "hero_amalfi_m_1_1770667885164.png"},{dir: "a209",file: "amalfi_aperitivo_flat_v2_1771020802562.png" }] }]
    },
    {
        title: "The Highland Estate Edit",
        slug: "the-highland-estate-edit",
        price: 52000,
        originalPrice: 65000,
        category: "outerwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Rugged refinement for the countryside. Features a Green Tweed Jacket, Tattersall Check Shirt, Moleskin Trousers, and Leather Brogue Boots.",
        variants: [{colorName: "Green & Brown",colorHex: "#556B2F",images:[{dir: "current",file: "highland_estate_hero_new_1779438426699.png"},{dir: "a209",file: "highland_estate_edit_flat_v2_1771020914342.png" }] }]
    },
    {
        title: "The Aspen Chalet Edit",
        slug: "the-aspen-chalet-edit",
        price: 85000,
        originalPrice: 102000,
        category: "outerwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Mountain luxury for the global jet-set. Features a Tan Shearling Coat, Grey Cashmere Sweater, Dark Wool Trousers.",
        variants: [{colorName: "Tan & Grey",colorHex: "#D2B48C",images:[{dir: "current",file: "aspen_chalet_hero_1779437969711.png"},{dir: "e2ad",file: "flat_aspen_m_1_1770668670504.png" }] }]
    },
    {
        title: "The Oxford Scholar Edit",
        slug: "the-oxford-scholar-edit",
        price: 42000,
        originalPrice: 50400,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Intellectual charm. Features a Brown Corduroy Blazer, Fair Isle Knit Vest, and White Oxford Shirt.",
        variants: [{colorName: "Brown & White",colorHex: "#8B4513",images:[{dir: "ace5",file: "hero_oxford_scholar_1770836760639.png"},{dir: "a209",file: "oxford_scholar_edit_flat_v2_1771020817069.png" }] }]
    },
    {
        title: "The Venetian Gondola Edit",
        slug: "the-venetian-gondola-edit",
        price: 45000,
        originalPrice: 54000,
        category: "shirts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Evening in Venice. Features a Striped Linen Shirt, Cream Trousers, and Velvet Loafers.",
        variants: [{colorName: "Striped & Cream",colorHex: "#F5F5DC",images:[{dir: "ace5",file: "hero_venetian_gondola_1770836805221.png"},{dir: "a209",file: "venetian_gondola_edit_flat_v2_1771020832689.png" }] }]
    },
    {
        title: "The Mediterranean Retreat Edit",
        slug: "mediterranean-retreat-edit",
        price: 28500,
        originalPrice: 35000,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "The ultimate summer sophisticated look. Includes the Monte Carlo Knit Polo, Marrakech Linen Trousers, Suede Loafers, and Leather Belt.",
        variants: [{colorName: "Beige & Cream",colorHex: "#F5F5DC",images:[{dir: "d39e",file: "summer_collection_combo_1770238522254.png"},{dir: "a209",file: "mediterranean_retreat_edit_flat_v2_1771020850202.png" }] }]
    },
    {
        title: "The Sterling Cashmere Vest",
        slug: "the-sterling-cashmere-vest",
        price: 10600,
        originalPrice: 18600,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Indulge in absolute luxury with our 100% fine-gauge Mongolian cashmere vest. Clean silhouette, ribbed v-neck collar, and lightweight warmth designed for modern layering.",
        variants: [{colorName: "Alabaster White",colorHex: "#FDFBF7",images:[{dir: "local",file: "white.jpeg"},{dir: "current",file: "cashmere_vest_back_1779290779631.png" }]},{colorName: "Off Black",colorHex: "#1A1A1A",images:[{dir: "local",file: "white.jpeg"},{dir: "current",file: "cashmere_vest_back_1779290779631.png" }] }]
    },
    {
        title: "The Haven Cashmere Hoodie",
        slug: "the-haven-cashmere-hoodie",
        price: 8400,
        originalPrice: 12500,
        category: "lounge",
        gender: "unisex",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "An ultra-soft cashmere-merino blend loungewear hoodie. Featuring double-lined hood, premium metal aglets on drawstrings, and a cozy front kangaroo pocket.",
        variants: [{colorName: "Oatmeal Beige",colorHex: "#F5F5DC",images:[{dir: "local",file: "hoodie.jpeg"},{dir: "current",file: "cashmere_hoodie_back_1779291571486.png" }]},{colorName: "Deep Forest",colorHex: "#2F4F4F",images:[{dir: "local",file: "hoodie.jpeg"},{dir: "current",file: "cashmere_hoodie_back_1779291571486.png" }] }]
    },
    {
        title: "The Country Club Brunch Edit",
        slug: "the-country-club-brunch-edit",
        price: 36000,
        originalPrice: 42000,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Relaxed sophistication. Features a Navy Shawl Collar Cardigan, Blue Striped Oxford Shirt, Beige Chinos, and Suede Loafers.",
        variants: [{colorName: "Navy & Beige",colorHex: "#000080",images:[{dir: "d39e",file: "hero_country_club_1770240588432.png"},{dir: "d39e",file: "flat_country_club_1770240572451.png" }] }]
    },
    {
        title: "The Textured Knit Polo",
        slug: "the-textured-knit-polo",
        price: 2899,
        originalPrice: 3999,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "A sophisticated take on casual. Knit from a premium cotton-silk blend with a distinct waffle texture. The open johnny collar adds a relaxed elegance perfect for evening layering.",
        variants: [{colorName: "Rich Cream",colorHex: "#F5F5DC",images:[{dir: "a209",file: "knit_polo_cream_flat_v2_1771028149807.png"},{dir: "current",file: "daily_oxford_sand_detail_1779438581916.png" }]},{colorName: "Deep Navy",colorHex: "#000080",images:[{dir: "a209",file: "knit_polo_navy_flat_v2_1771028167164.png"},{dir: "current",file: "daily_oxford_navy_detail_1779438559419.png" }] }]
    },
    {
        title: "The Riviera Linen Shirt",
        slug: "the-riviera-linen-shirt",
        price: 4500,
        originalPrice: 5400,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Airy, premium European linen. Cut for a relaxed summer silhouette.",
        variants: [{colorName: "White",colorHex: "#FFFFFF",images:[{dir: "old60",file: "riviera_linen_shirt_1769838346603.png"},{dir: "old60",file: "flat_riviera_shirt_1769839732309.png" }] }]
    },
    {
        title: "The Gurkha Trouser",
        slug: "the-gurkha-trouser",
        price: 5500,
        originalPrice: 6600,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "High-waisted, double-pleated with signature side adjusters.",
        variants: [{colorName: "Beige",colorHex: "#F5F5DC",images:[{dir: "old60",file: "gurkha_trouser_1769838296620.png"},{dir: "old60",file: "flat_gurkha_trouser_1769839784073.png" }] }]
    },
    {
        title: "The Penny Loafer",
        slug: "the-penny-loafer",
        price: 11000,
        originalPrice: 13200,
        category: "footwear",
        gender: "man",
        sizeType: "numeric",
        sizes: ["7","8","9","10","11"],
        description: "Hand-stitched suede with leather soles. Unlined for immediate comfort.",
        variants: [{colorName: "Tobacco Suede",colorHex: "#964B00",images:[{dir: "old60",file: "penny_loafer_1769838446100.png"},{dir: "d39e",file: "flat_penny_loafer_1770050145744.png" }] }]
    },
    {
        title: "The Desert Boot",
        slug: "the-desert-boot",
        price: 9500,
        originalPrice: 12500,
        category: "footwear",
        gender: "man",
        sizeType: "numeric",
        sizes: ["7","8","9","10","11"],
        description: "Unlined sand suede desert boot with a natural crepe rubber sole. The original minimal boot — two eyelets, whisper-soft nubuck, and a silhouette that improves with age.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "current",file: "desert_boot_suede_flat_1779436441248.png"},{dir: "current",file: "chelsea_loafer_angle_1779289108716.png" }] }]
    },
    {
        title: "The Amalfi Linen Popover",
        slug: "the-amalfi-linen-popover",
        price: 3800,
        originalPrice: 4800,
        category: "shirts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "An olive green linen popover shirt with a relaxed camp collar. Cut from premium lightweight European linen, perfect for warm tropical weather. Pre-washed for maximum softness and drape.",
        variants: [{colorName: "Olive Green",colorHex: "#556B2F",images:[{dir: "current",file: "amalfi_popover_flat_1779246640817.png"},{dir: "current",file: "amalfi_popover_back_1779288908233.png"},{dir: "current",file: "amalfi_popover_detail_1779288938199.png" }] }]
    },
    {
        title: "The Heritage Cable Knit",
        slug: "the-heritage-cable-knit",
        price: 3899,
        originalPrice: 4999,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "A timeless classic inspired by Irish fisherman sweaters. Knit from thick, 5-gauge merino wool for warmth and durability. Feature intricate cable patterns and ribbed trims.",
        variants: [{colorName: "Aran Cream",colorHex: "#F5F5DC",images:[{dir: "a209",file: "cable_knit_cream_flat_1771028542886.png"},{dir: "current",file: "cable_knit_cream_back_1779290478632.png" }]},{colorName: "Deep Navy",colorHex: "#000080",images:[{dir: "a209",file: "cable_knit_navy_flat_v2_1771028568397.png"},{dir: "current",file: "cable_knit_navy_back_1779290514853.png" }] }]
    },
    {
        title: "The Chelsea Suede Loafer",
        slug: "the-chelsea-suede-loafer",
        price: 8500,
        originalPrice: 11000,
        category: "footwear",
        gender: "man",
        sizeType: "numeric",
        sizes: ["7","8","9","10","11"],
        description: "Handcrafted penny loafer in rich tobacco suede with authentic leather soles. Features an unlined design that immediately conforms to your foot for custom comfort.",
        variants: [{colorName: "Tobacco Suede",colorHex: "#8B5A2B",images:[{dir: "current",file: "chelsea_loafer_flat_1779246878425.png"},{dir: "current",file: "chelsea_loafer_angle_1779289108716.png" }] }]
    },
    {
        title: "The Amalfi Day Edit",
        slug: "the-amalfi-day-edit",
        price: 38000,
        originalPrice: 43000,
        category: "shorts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Light Blue Linen Shirt, White Tailored Shorts, Suede Loafers.",
        variants: [{colorName: "Blue & White",colorHex: "#87CEEB",images:[{dir: "c55b",file: "hero_amalfi_day_1770318559833.png"},{dir: "c55b",file: "flat_amalfi_day_1770318544560.png" }] }]
    },
    {
        title: "The Santorini Sunset Edit",
        slug: "the-santorini-sunset-edit",
        price: 42000,
        originalPrice: 47000,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Sand Structured Blazer, White Linen Trousers, Espadrilles.",
        variants: [{colorName: "Sand & White",colorHex: "#F4A460",images:[{dir: "c55b",file: "hero_santorini_sunset_1770318643232.png"},{dir: "c55b",file: "flat_santorini_sunset_1770318621391.png" }] }]
    },
    {
        title: "The Oxford Button-Down",
        slug: "the-oxford-button-down",
        price: 5200,
        originalPrice: 6240,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Classic heavy cotton oxford cloth. Garment washed for softness.",
        variants: [{colorName: "Light Blue",colorHex: "#ADD8E6",images:[{dir: "d39e",file: "hero_oxford_shirt_1770211029858.png"},{dir: "d39e",file: "flat_oxford_shirt_1770228013702.png" }] }]
    },
    {
        title: "The Diplomat Overcoat",
        slug: "the-diplomat-overcoat",
        price: 18000,
        originalPrice: 21600,
        category: "outerwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Italian wool blend. Structured shoulders and knee-length drape.",
        variants: [{colorName: "Black",colorHex: "#000000",images:[{dir: "old60",file: "diplomat_overcoat_1769838428705.png"},{dir: "d39e",file: "flat_diplomat_overcoat_black_1770050773729.png" }] }]
    },
    {
        title: "The Highland Flannel Shirt",
        slug: "the-highland-flannel-shirt",
        price: 5200,
        originalPrice: 6800,
        category: "shirts",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Heavy brushed flannel shirt in a classic earthy plaid. Double chest pockets and a spread collar. Worn open as a lightweight overshirt or fully buttoned for outdoors.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "current",file: "flannel_shirt_plaid_flat_1779436350969.png"},{dir: "d39e",file: "flat_highland_estate_1770241977609.png" }] }]
    },
    {
        title: "The Bridle Leather Belt",
        slug: "the-bridle-leather-belt",
        price: 4800,
        originalPrice: 6500,
        category: "accessories",
        gender: "man",
        sizeType: "onesize",
        sizes: [],
        description: "Full-grain vegetable-tanned leather belt with a solid brass roller buckle. Hand-stitched edges that develop a beautiful patina over time. Available in 30–44 inch waist.",
        variants: [{colorName: "Primary",colorHex: "#2C2C2C",images:[{dir: "current",file: "leather_belt_tan_flat_1779436407470.png"},{dir: "current",file: "voyager_duffel_flat_1779247010443.png" }] }]
    },
    {
        title: "The Aegean Odyssey",
        slug: "the-aegean-odyssey",
        price: 44000,
        originalPrice: 48000,
        category: "sets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Greek island hopping, breezy and light. Features a white grandad collar shirt, blue and white striped seersucker trousers, and leather sandals.",
        variants: [{
            colorName: "White & Blue Stripe",
            colorHex: "#FFFFFF",
            images: [
                { dir: "e2ad", file: "hero_aegean_m_1_1770667903822.png" },
                { dir: "e2ad", file: "flat_aegean_m_1_1770667919410.png" }
            ]
        }]
    },
    {
        title: "The Savannah Sunset",
        slug: "the-savannah-sunset",
        price: 45000,
        originalPrice: 52000,
        category: "sets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S","M","L","XL"],
        description: "Luxury safari, warm evening wear. Features a lightweight khaki field jacket, cream linen trousers, white t-shirt, and leather sandals.",
        variants: [{
            colorName: "Khaki & Cream",
            colorHex: "#F0E68C",
            images: [
                { dir: "e2ad", file: "hero_savannah_m_1_1770663312853.png" },
                { dir: "e2ad", file: "flat_savannah_m_1_1770663328357.png" }
            ]
        }]
    },
    {
        title: "watch",
        slug: "ghdi",
        price: 15000,
        originalPrice: 15000,
        category: "accessories",
        gender: "man",
        sizeType: "onesize",
        sizes: [],
        description: "Crafted from the finest materials, this piece embodies the essence of silent luxury. Designed for the modern gentleman who values heritage and quality above all else.",
        variants: [{
            colorName: "Emerald Green",
            colorHex: "#124530",
            images: [
                { ref: "image-b29be6ea4b4333bf30d5244a7785ca7004af3e4f-375x469-jpg" },
                { ref: "image-b29be6ea4b4333bf30d5244a7785ca7004af3e4f-375x469-jpg" }
            ]
        }]
    },
]

// =====================================================================
// Upload helper with cache
// =====================================================================
const assetCache: Record<string, string> = {}

async function uploadImage(dirKey: string, filename: string): Promise<string | null> {
    const cacheKey = `${dirKey}::${filename}`
    if (assetCache[cacheKey]) return assetCache[cacheKey]

    const dirPath = DIRS[dirKey]
    if (!dirPath) { console.warn(`   ⚠️ Unknown dir key: ${dirKey}`); return null }

    const filePath = path.join(dirPath, filename)
    if (!fs.existsSync(filePath)) {
        console.warn(`   ⚠️ File not found: ${filePath}`)
        return null
    }

    try {
        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, { filename })
        assetCache[cacheKey] = asset._id
        return asset._id
    } catch (err) {
        console.error(`   ❌ Upload failed for ${filename}:`, err)
        return null
    }
}

// =====================================================================
// Main
// =====================================================================
async function main() {
    console.log('🚀 Mega-restore: checking all products...\n')

    // Fetch all existing slugs once
    const existing: any[] = await client.fetch(`*[_type == "product"]{ title, "slug": slug.current }`)
    const existingSlugs = new Set(existing.map((p: any) => p.slug))
    const existingTitles = new Set(existing.map((p: any) => p.title))
    console.log(`📊 Currently in DB: ${existing.length} products\n`)

    let created = 0, skipped = 0, failed = 0

    for (const p of ALL_PRODUCTS) {
        if (existingSlugs.has(p.slug) || existingTitles.has(p.title)) {
            console.log(`⏭️  Already exists: ${p.title}`)
            skipped++
            continue
        }

        console.log(`\n📦 Creating: ${p.title}`)

        const processedVariants: any[] = []

        for (const variant of p.variants) {
            const imageRefs: any[] = []
            for (const img of variant.images) {
                let assetId: string | null = null
                if (img.ref) {
                    assetId = img.ref
                } else if (img.dir && img.file) {
                    assetId = await uploadImage(img.dir, img.file)
                }
                if (assetId) {
                    imageRefs.push({
                        _type: 'image',
                        _key: Math.random().toString(36).slice(2, 9),
                        asset: { _type: 'reference', _ref: assetId }
                    })
                }
            }
            processedVariants.push({
                _key: Math.random().toString(36).slice(2, 9),
                colorName: variant.colorName,
                colorHex:  variant.colorHex,
                stock: 45,
                images: imageRefs
            })
        }

        const sizeType = p.sizeType || (p.category === 'footwear' ? 'numeric' : p.category === 'accessories' ? 'onesize' : 'clothing')
        const sizes = p.sizes !== undefined ? p.sizes : (p.category === 'footwear' ? ['7','8','9','10','11'] : p.category === 'accessories' ? [] : ['S','M','L','XL'])

        const doc: any = {
            _type: 'product',
            title: p.title,
            slug: { _type: 'slug', current: p.slug },
            price: p.price,
            originalPrice: p.originalPrice,
            description: p.description,
            category: p.category,
            gender: p.gender || 'man',
            sizeType,
            sizes,
            variants: processedVariants,
            discountLabel: p.originalPrice > p.price ? `SAVE ₹${p.originalPrice - p.price}` : undefined
        }

        try {
            const result = await client.create(doc)
            console.log(`   ✅ Created: ${p.title} (${result._id})`)
            created++
        } catch (err) {
            console.error(`   ❌ Failed to create ${p.title}:`, err)
            failed++
        }
    }

    console.log(`\n🏁 Done! Created: ${created} | Skipped (already existed): ${skipped} | Failed: ${failed}`)

    const total = await client.fetch(`count(*[_type == "product"])`)
    console.log(`📊 Total products now in DB: ${total}`)
}

main().catch(console.error)
