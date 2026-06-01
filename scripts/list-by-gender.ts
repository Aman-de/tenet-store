import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing environment variables')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

async function listByGender() {
    console.log("🔍 Fetching all products from Sanity...")
    const query = `*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        gender,
        category
    }`
    const products = await client.fetch(query)

    console.log(`\n📊 Total products: ${products.length}\n`)

    const byGender: Record<string, any[]> = {}
    products.forEach((p: any) => {
        const g = p.gender || 'undefined'
        if (!byGender[g]) byGender[g] = []
        byGender[g].push(p)
    })

    for (const [gender, list] of Object.entries(byGender)) {
        console.log(`=== GENDER: "${gender}" (${list.length} products) ===`)
        list.sort((a, b) => a.title.localeCompare(b.title)).forEach(p => {
            console.log(`  - ${p.title} (slug: ${p.slug}, cat: ${p.category})`)
        })
        console.log()
    }
}

listByGender().catch(console.error)
