
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

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

const targetProducts = [
    "The Pleated Chino",
    "The Harrington",
    "The Diplomat Overcoat",
    "The Weekender"
]

async function fetchDetails() {
    try {
        const query = `*[_type == "product" && title in $titles]{
            title,
            description,
            variants[]{
                colorName,
                colorHex
            }
        }`
        const products = await client.fetch(query, { titles: targetProducts })
        console.log(JSON.stringify(products, null, 2))
    } catch (err) {
        console.error(err)
    }
}

fetchDetails()
