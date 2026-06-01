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

const GIRLS_CLOTHES_SLUGS = [
    'the-riviera-resort-chic-shirt',
    'the-0438-tailored-pleated-trouser',
    'the-st-tropez-promenade-edit',
    'the-0438-cashmere-mockneck',
    'breezy-linen-resort-shirt',
    'the-0215-structured-overcoat',
    'the-amalfi-day-edit',
    'the-santorini-sunset-edit'
]

async function runPatch() {
    console.log("🚀 Starting Sanity Girls' Collection Gender Patch...")

    for (const slug of GIRLS_CLOTHES_SLUGS) {
        const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug })
        if (product) {
            console.log(`Found "${product.title}" (ID: ${product._id}). Current gender: "${product.gender}"`)
            console.log(`Setting gender to "woman"...`)
            await client.patch(product._id).set({ gender: 'woman' }).commit()
            console.log(`✅ Successfully updated "${product.title}" to gender "woman"\n`)
        } else {
            console.warn(`⚠️ Product with slug "${slug}" not found in Sanity.\n`)
        }
    }

    console.log("🏁 Done with girls' clothes patching!")
}

runPatch().catch(err => {
    console.error("❌ Error running girls' clothes patch:", err)
})
