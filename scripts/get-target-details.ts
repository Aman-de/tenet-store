import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
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

const targetTitles = [
    "The Sterling Cashmere Vest",
    "The Scholar Turtleneck",
    "The Amalfi Stripe",
    "The Heritage Chronograph",
    "The Canvas Chore Coat",
    "The Tailored Gurkha Trouser",
    "The Archive Cable Knit Zip"
]

async function fetchDetails() {
    console.log('Fetching target product details...')
    const query = `*[_type == "product" && title in $targetTitles]{
        title,
        "slug": slug.current,
        description,
        imagePromptNote,
        variants[]{
            colorName,
            colorHex,
            "images": images[].asset->url
        }
    }`

    const products = await client.fetch(query, { targetTitles })
    console.log('--- Target Product Details ---')
    console.log(JSON.stringify(products, null, 2))
}

fetchDetails()
