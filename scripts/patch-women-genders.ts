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

async function runPatch() {
    console.log("🚀 Starting Sanity Gender Patch for strictly women's garments...")

    // 1. Patch 'The Classic Chic Shirt' (slug: 'the-classic-chic-shirt')
    const chicShirt = await client.fetch(`*[_type == "product" && slug.current == "the-classic-chic-shirt"][0]`)
    if (chicShirt) {
        console.log(`Found "${chicShirt.title}" (ID: ${chicShirt._id}). Current gender: "${chicShirt.gender}"`)
        console.log(`Setting gender to "woman"...`)
        await client.patch(chicShirt._id).set({ gender: 'woman' }).commit()
        console.log(`✅ Successfully updated "${chicShirt.title}" to gender "woman"`)
    } else {
        console.warn(`⚠️ "The Classic Chic Shirt" (slug: 'the-classic-chic-shirt') not found in Sanity.`)
    }

    // 2. Patch 'The Bori Wool-Cashmere Knit' (slug: 'the-bori-wool-cashmere-knit')
    const boriKnit = await client.fetch(`*[_type == "product" && slug.current == "the-bori-wool-cashmere-knit"][0]`)
    if (boriKnit) {
        console.log(`Found "${boriKnit.title}" (ID: ${boriKnit._id}). Current gender: "${boriKnit.gender}"`)
        console.log(`Setting gender to "woman"...`)
        await client.patch(boriKnit._id).set({ gender: 'woman' }).commit()
        console.log(`✅ Successfully updated "${boriKnit.title}" to gender "woman"`)
    } else {
        console.warn(`⚠️ "The Bori Wool-Cashmere Knit" (slug: 'the-bori-wool-cashmere-knit') not found in Sanity.`)
    }

    console.log("\n🏁 Done with gender patching!")
}

runPatch().catch(err => {
    console.error("❌ Error running gender patch:", err)
})
