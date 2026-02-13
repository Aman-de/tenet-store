
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

async function checkImages() {
    const products = await client.fetch(`*[_type == "product"]{
        _id,
        title,
        "slug": slug.current,
        "imageCount": count(variants[0].images),
        "secondImage": variants[0].images[1]
    }`)

    console.log('--- Products with missing second image ---');
    const missing = products.filter((p: any) => p.imageCount < 2);
    missing.forEach((p: any) => {
        console.log(`${p.title} (Slug: ${p.slug}) - Image Count: ${p.imageCount}`);
    });
    console.log(`Total missing: ${missing.length}`);
}

checkImages();
