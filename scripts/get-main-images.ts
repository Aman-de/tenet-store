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

const titles = [
    "The Archive Cable Knit Zip",
    "The Tailored Gurkha Trouser",
    "The Voyager Leather Duffel",
    "The Heritage Chronograph",
    "The Weekender",
    "The Hamptons Weekend Edit",
    "The Amalfi Stripe",
    "The Sterling Cashmere Vest",
    "The Mediterranean Retreat Edit"
]

async function main() {
    const query = `*[_type == "product" && title in $titles]{
        title,
        "slug": slug.current,
        "imageUrl": variants[0].images[0].asset->url,
        "hoverImageUrl": variants[0].images[1].asset->url
    }`
    try {
        const results = await client.fetch(query, { titles })
        console.log(JSON.stringify(results, null, 2))
    } catch (err) {
        console.error(err)
    }
}

main()
