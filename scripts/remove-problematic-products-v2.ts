
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

    // 1. Fetch products to get IDs
    const products = await client.fetch(`*[_type == "product" && title in $titles]`, { titles: productsToRemove })

    console.log(`   Found ${products.length} products to remove.`)

    if (products.length === 0) {
        console.log("   No products found. Exiting.")
        return
    }

    const productIds = products.map((p: any) => p._id)

    // 2. Backup (again, just to be safe)
    const backupPath = path.join(process.cwd(), 'backup-removed-products-v2.json')
    fs.writeFileSync(backupPath, JSON.stringify(products, null, 2))
    console.log(`   ✅ Backed up data to ${backupPath}`)

    // 3. Remove References
    console.log("   Checking for references...")
    const referencingDocs = await client.fetch(`*[references($ids)]`, { ids: productIds })

    if (referencingDocs.length > 0) {
        console.log(`   Found ${referencingDocs.length} documents referencing these products. Cleaning up...`)

        for (const doc of referencingDocs) {
            console.log(`   Cleaning references in: ${doc.title || doc._id} (${doc._type})`)

            // Assume the reference is in a 'products' array (common for collections)
            // We use 'unset' for specific array items if we can match them, but simpler is to 
            // read the current list, filter, and set it back.
            // Or use Sanity's unset() with a path like products[_ref in $ids] -- but GROQ patches are limited.
            // Easiest: filter locally and replace via set() if it's a simple array.

            if (doc.products && Array.isArray(doc.products)) {
                const newProducts = doc.products.filter((ref: any) => !productIds.includes(ref._ref))
                if (newProducts.length !== doc.products.length) {
                    await client.patch(doc._id).set({ products: newProducts }).commit()
                    console.log(`     Removed ${doc.products.length - newProducts.length} references.`)
                }
            } else {
                console.warn(`     ⚠️ Unable to automatically clean references in ${doc._id}. Manual check required or reference is not in 'products' array.`)
            }
        }
    }

    // 4. Delete
    for (const product of products) {
        console.log(`   Deleting: ${product.title} (${product._id})...`)
        try {
            await client.delete(product._id)
        } catch (e: any) {
            console.error(`     ❌ Failed to delete ${product.title}: ${e.message}`)
        }
    }

    console.log(`   ✅ Finished removal process.`)
}

removeProducts()
