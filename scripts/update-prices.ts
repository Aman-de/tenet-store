import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    const products = await client.fetch(`*[_type == "product"]{ _id, title, price, originalPrice }`)
    console.log(`Found ${products.length} products. Updating prices to be under 1k...`)

    let i = 0;
    for (const p of products) {
        const newPrice = getRandomInt(499, 999);
        const originalPrice = newPrice + getRandomInt(500, 1500); 
        
        try {
            await client.patch(p._id)
                .set({ price: newPrice, originalPrice: originalPrice })
                .commit()
        } catch (err: any) {
            console.error(`Failed on ${p._id}: ${err.message}`);
        }
            
        i++;
        if (i % 10 === 0) console.log(`Updated ${i}/${products.length} products...`)
    }
    
    console.log("All prices successfully reduced under 1k!");
}

main().catch(console.error);
