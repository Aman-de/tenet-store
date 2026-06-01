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

async function listAssets() {
    const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id, originalFilename }`)
    console.log(`📸 Found ${assets.length} image assets in Sanity.`)
    const terms = ['duffel', 'voyager', 'loafer', 'chelsea', 'boot', 'shoe', 'flat', 'belt', 'leather']
    for (const term of terms) {
        const matches = assets.filter((a: any) => a.originalFilename && a.originalFilename.toLowerCase().includes(term))
        console.log(`\nMatches for "${term}":`)
        matches.forEach((a: any) => console.log(` - ${a.originalFilename} (ID: ${a._id})`))
    }
}

listAssets()
