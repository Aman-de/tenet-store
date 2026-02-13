
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

async function migrateGender() {
    console.log('🚀 Starting Gender Migration...')

    // Fetch all products that don't have a gender
    const products = await client.fetch(`*[_type == "product" && !defined(gender)]{_id, title}`)

    console.log(`Found ${products.length} products to update.`)

    for (const p of products) {
        console.log(`Updating: ${p.title}...`)

        await client.patch(p._id)
            .set({ gender: 'man' })
            .commit()

        console.log(`   ✅ Set to 'man'`)
    }
    console.log('✨ Migration Complete!')
}

migrateGender()
