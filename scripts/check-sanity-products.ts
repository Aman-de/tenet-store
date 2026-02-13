
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false, // Ensure we get fresh data
})

async function checkProducts() {
    console.log("🔍 Checking products in Sanity with FULL Query...")

    const query = `*[_type == "product"]{
    _id,
    title,
    "slug": slug.current,
    "imageUrl": variants[0].images[0].asset->url,
    "hoverImageUrl": variants[0].images[1].asset->url
  }`;

    const products = await client.fetch(query)

    console.log(`Found ${products.length} products.`)

    let missingCount = 0;
    const suspects = [
        "The Highland Estate Edit",
    ];

    products.forEach((p: any) => {
        if (suspects.includes(p.title)) {
            console.log(`\n🧐 Suspicious Product: ${p.title}`)
            console.log(`   Slug: ${p.slug}`)
            console.log(`   Image 1: ${p.imageUrl}`)
            console.log(`   Image 2: ${p.hoverImageUrl}`)
        }
    })

    if (missingCount === 0) {
        console.log("\n✅ All products have images.")
    } else {
        console.log(`\n⚠️ Found ${missingCount} products with missing images.`)
    }
}

checkProducts()
