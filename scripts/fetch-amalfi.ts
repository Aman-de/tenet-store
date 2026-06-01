import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

async function main() {
    const query = `*[_type == "product" && slug.current == "the-amalfi-stripe"][0]{
        _id,
        title,
        "slug": slug.current,
        variants[]{
            colorName,
            colorHex,
            stock,
            "images": images[].asset->url
        }
    }`
    const result = await client.fetch(query)
    console.log(JSON.stringify(result, null, 2))
}

main()
