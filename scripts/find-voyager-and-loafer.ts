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
    console.log('=== Voyager assets ===')
    assets.filter((a: any) => a.originalFilename && a.originalFilename.toLowerCase().includes('voyager'))
          .forEach((a: any) => console.log(` - ${a.originalFilename} (ID: ${a._id})`))

    console.log('=== Loafer/Shoe assets ===')
    assets.filter((a: any) => a.originalFilename && (a.originalFilename.toLowerCase().includes('loafer') || a.originalFilename.toLowerCase().includes('shoe') || a.originalFilename.toLowerCase().includes('boot')))
          .forEach((a: any) => console.log(` - ${a.originalFilename} (ID: ${a._id})`))
}

listAssets()
