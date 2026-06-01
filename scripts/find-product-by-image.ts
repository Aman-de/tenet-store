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

const IMAGE_URLS_TO_CHECK = [
    "65551871c76c8f842ad258ae019611e7ee32d403-1125x1688.jpg",
    "bf3e42b331555dfb683ff3e70923ae49e6b7cb1b-1200x1500.jpg",
    "904e646ebebc619c6b85da8da41249a227134685-640x640.jpg",
    "117ef8a141e8002d9be68181043e221fcde5d2d8-1125x1688.jpg"
]

async function run() {
    console.log("🔍 Fetching all products from Sanity to match images...")
    const query = `*[_type == "product"]{
        title,
        gender,
        category,
        "images": variants[].images[].asset->url
    }`
    const products = await client.fetch(query)

    for (const imgId of IMAGE_URLS_TO_CHECK) {
        console.log(`\nChecking Image ID substring: "${imgId}"`)
        const matching = products.filter((p: any) => 
            p.images && p.images.some((url: string) => url && url.includes(imgId))
        )
        if (matching.length > 0) {
            matching.forEach((p: any) => {
                console.log(`  ✅ Matches Product: "${p.title}" | Gender: "${p.gender}" | Category: "${p.category}"`)
            })
        } else {
            console.log(`  ❌ No matching product found in Sanity.`)
        }
    }
}

run().catch(console.error)
