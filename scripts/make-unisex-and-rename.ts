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

async function runUpdates() {
    console.log("🚀 Starting Premium Unisex and Rename Updates...")

    // 1. Update 'The Classic Chic Shirt' to unisex
    const chicShirt = await client.fetch(`*[_type == "product" && slug.current == "the-classic-chic-shirt"][0]`)
    if (chicShirt) {
        console.log(`Updating "${chicShirt.title}" gender to unisex...`)
        await client.patch(chicShirt._id).set({ gender: 'unisex' }).commit()
        console.log(`✅ Updated "${chicShirt.title}"`)
    } else {
        console.log(`⚠️ "The Classic Chic Shirt" not found`)
    }

    // 2. Update 'The Bori Wool-Cashmere Knit' to unisex
    const boriKnit = await client.fetch(`*[_type == "product" && slug.current == "the-bori-wool-cashmere-knit"][0]`)
    if (boriKnit) {
        console.log(`Updating "${boriKnit.title}" gender to unisex...`)
        await client.patch(boriKnit._id).set({ gender: 'unisex' }).commit()
        console.log(`✅ Updated "${boriKnit.title}"`)
    } else {
        console.log(`⚠️ "The Bori Wool-Cashmere Knit" not found`)
    }

    // 3. Rename 'watch' to 'The Heritage Chronograph' and update slug/gender
    const watch = await client.fetch(`*[_type == "product" && slug.current == "ghdi"][0]`)
    if (watch) {
        console.log(`Renaming "${watch.title}" to "The Heritage Chronograph" and setting gender to unisex...`)
        await client.patch(watch._id).set({
            title: 'The Heritage Chronograph',
            slug: { _type: 'slug', current: 'the-heritage-chronograph' },
            gender: 'unisex'
        }).commit()
        console.log(`✅ Updated watch product!`)
    } else {
        // Check if already renamed
        const renamedWatch = await client.fetch(`*[_type == "product" && slug.current == "the-heritage-chronograph"][0]`)
        if (renamedWatch) {
            console.log(`✅ Watch already updated and renamed: "${renamedWatch.title}"`)
        } else {
            console.log(`⚠️ Watch product (slug: "ghdi" or "the-heritage-chronograph") not found`)
        }
    }

    console.log("\n🏁 Done with updates!")
}

runUpdates().catch(console.error)
