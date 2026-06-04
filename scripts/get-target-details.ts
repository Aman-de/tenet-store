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
    "Premium Designer Kurti 1",
    "Premium Designer Kurti 2",
    "Premium Designer Kurti 3",
    "Premium Designer Kurti 4",
    "Premium Designer Kurti 5",
    "Premium Designer Kurti 6",
    "Premium Designer Kurti 7",
    "Premium Designer Kurti 8",
    "Premium Designer Kurti 9",
    "Premium Designer Kurti 10",
    "Elegant Evening Heels",
    "Royal Gold Necklace Set"
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
