
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

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

const productsToRemove = [
    "The Polo Ground Edit",
    "The Riviera Retreat",
    "The Amalfi Aperitivo",
    "The Highland Estate Edit",
    "The Mediterranean Retreat Edit",
    "The Venetian Gondola Edit",
    "The Oxford Scholar Edit",
    "The Aspen Chalet Edit",
    "The Aegean Odyssey Edit",
    "The Yacht Club Edit"
]

async function removeProducts() {
    console.log(`🚀 Starting removal of ${productsToRemove.length} products...`)

    // 1. Fetch products to get IDs and backup data
    const products = await client.fetch(`*[_type == "product" && title in $titles]`, { titles: productsToRemove })

    console.log(`   Found ${products.length} products to remove.`)

    if (products.length === 0) {
        console.log("   No products found. Exiting.")
        return
    }

    // 2. Backup
    const backupPath = path.join(process.cwd(), 'backup-removed-products.json')
    fs.writeFileSync(backupPath, JSON.stringify(products, null, 2))
    console.log(`   ✅ Backed up data to ${backupPath}`)

    // 3. Delete
    for (const product of products) {
        console.log(`   Deleting: ${product.title} (${product._id})...`)
        await client.delete(product._id)
    }

    console.log(`   ✅ Successfully removed products.`)
}

removeProducts()
