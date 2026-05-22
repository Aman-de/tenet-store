import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

async function checkDiff() {
    // 1. Get all products from Sanity
    const existing: any[] = await client.fetch(`*[_type == "product"]{ title, "slug": slug.current }`)
    const existingTitles = new Set(existing.map(p => p.title.toLowerCase().trim()))
    console.log(`Existing in Sanity: ${existing.length} products`)

    // 2. Scan scripts folder for product definitions
    const scriptFiles = fs.readdirSync('scripts').filter(f => f.endsWith('.ts') || f.endsWith('.js'))
    const foundTitles = new Set<string>()

    for (const file of scriptFiles) {
        const content = fs.readFileSync(path.join('scripts', file), 'utf8')
        // Try to match patterns like: name: "..." or title: "..." or name: '...' or title: '...'
        const matches = content.matchAll(/(?:title|name)\s*:\s*["'`]([^"'`]+)["'`]/g)
        for (const match of matches) {
            const title = match[1].trim()
            // Exclude common non-product title variables if any, but keep product names
            if (title.length > 3 && !title.includes('product') && !title.includes('collection') && !title.includes('slug')) {
                foundTitles.add(title)
            }
        }
    }

    // Also read backup-removed-products.json
    if (fs.existsSync('backup-removed-products.json')) {
        const backup = JSON.parse(fs.readFileSync('backup-removed-products.json', 'utf8'))
        for (const p of backup) {
            foundTitles.add(p.title)
        }
    }

    console.log(`Total unique titles found in scripts/backups: ${foundTitles.size}`)

    const missing = []
    for (const title of foundTitles) {
        if (!existingTitles.has(title.toLowerCase().trim())) {
            missing.push(title)
        }
    }

    console.log('\nMissing products (defined but not in Sanity):')
    console.log(missing.sort())
}

checkDiff().catch(console.error)
