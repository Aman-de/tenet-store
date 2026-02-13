
import { execSync } from 'child_process'

const scripts = [
    'scripts/create-set-1-yacht.ts',
    'scripts/create-set-2-polo.ts',
    'scripts/create-set-3-riviera.ts',
    'scripts/create-set-4-alpine.ts',
    'scripts/create-set-4-savannah.ts',
    'scripts/create-set-5-amalfi.ts',
    'scripts/create-set-5-savannah.ts',
    'scripts/create-set-6-aegean.ts',
    'scripts/create-set-6-manhattan.ts',
    'scripts/create-set-7-country.ts',
    'scripts/create-set-8-highland.ts',
    'scripts/update-paris-hero.ts',
    'scripts/create-good-collection.ts', // This restores the final state of Aspen/Oxford/Summer Expansion
    'scripts/create-new-products.ts', // Create Merino, Oxford, Chelsea Boot
    'scripts/upload-new-heroes.ts', // Upload HERO images for new products
    'scripts/upload-images.ts', // Restore images for core products
    'scripts/deduplicate-images.ts', // Reset to 1 image before adding secondaries
    'scripts/upload-new-secondaries.ts',
    'scripts/upload-secondary-images.ts',
    'scripts/create-collections.ts'
]

console.log('🚀 Starting Full Restoration...')

for (const script of scripts) {
    console.log(`\n-----------------------------------`)
    console.log(`Running: ${script}`)
    try {
        execSync(`npx tsx ${script}`, { stdio: 'inherit' })
        console.log(`✅ ${script} completed.`)
    } catch (e) {
        console.error(`❌ Failed to run ${script}`)
        // Continue mainly because some scripts might be redundant or fail if product exists, but we want to try all
    }
}

console.log('\n✨ Restoration Complete!')
