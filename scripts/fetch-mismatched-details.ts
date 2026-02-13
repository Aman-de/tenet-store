
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
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

const slugs = [
    "the-alpine-lodge-edit",
    "the-savannah-sunset",
    "the-savannah-explorer-edit",
    "the-manhattan-evening-edit",
    "the-country-club-brunch-edit",
    "the-bali-bamboo-edit",
    "the-penny-loafer",
    "the-yacht-club-edit",
    "the-aegean-odyssey",
    "the-aegean-odyssey-edit",
    "the-paris-flaneur-edit",
    "the-oxford-button-down",
    "the-chelsea-boot",
    "the-merino-turtleneck",
    "the-polo-ground-edit",
    "the-riviera-retreat",
    "the-amalfi-aperitivo",
    "the-highland-estate-edit",
    "the-aspen-chalet-edit",
    "the-oxford-scholar-edit",
    "the-venetian-gondola-edit",
    "mediterranean-retreat-edit"
]

async function fetchDetails() {
    console.log('Fetching product details via GROQ...')
    const query = `*[_type == "product" && slug.current in $slugs]{
        title,
        "slug": slug.current,
        description,
        "color": variants[0].colorName, // Fallback if root color not set, assuming structure
        imagePromptNote
    }`

    const products = await client.fetch(query, { slugs })

    console.log('--- Product Details ---')
    console.log(JSON.stringify(products, null, 2))
}

fetchDetails()
