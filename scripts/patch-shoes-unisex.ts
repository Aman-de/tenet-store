import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing environment variables NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const SHOE_SLUGS = [
    'the-chelsea-boot',
    'the-penny-loafer',
    'the-desert-boot',
    'the-chelsea-suede-loafer'
]

async function runPatch() {
    console.log("🚀 Starting Sanity Footwear Unisex Gender Patch...")

    for (const slug of SHOE_SLUGS) {
        const shoe = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug })
        if (shoe) {
            console.log(`Found "${shoe.title}" (ID: ${shoe._id}). Current gender: "${shoe.gender}"`)
            console.log(`Setting gender to "unisex"...`)
            await client.patch(shoe._id).set({ gender: 'unisex' }).commit()
            console.log(`✅ Successfully updated "${shoe.title}" to gender "unisex"\n`)
        } else {
            console.warn(`⚠️ "${slug}" not found in Sanity.\n`)
        }
    }

    console.log("🏁 Done with footwear unisex patching!")
}

runPatch().catch(err => {
    console.error("❌ Error running footwear patch:", err)
})
