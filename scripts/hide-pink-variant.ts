import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '../sanity/env';

const token = process.env.SANITY_API_TOKEN;

if (!token) {
    console.error("SANITY_API_TOKEN is missing in environment variables.");
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token
});

async function main() {
    try {
        console.log("Searching for Chocolate & Denim Set...");
        const products = await client.fetch(`*[_type == "product" && title == "Chocolate & Denim Set"]{_id, variants}`);
        
        if (products.length === 0) {
            console.error("Could not find product matching 'Chocolate & Denim Set'");
            return;
        }

        const product = products[0];
        const variants = product.variants;

        // Update the Pink variant
        const pinkIndex = variants.findIndex((v: any) => v.colorName === "Pink");
        if (pinkIndex !== -1) {
            variants[pinkIndex].onlyAvailableAsSet = true;
            
            console.log("Setting 'onlyAvailableAsSet' to true for Pink variant...");
            await client
                .patch(product._id)
                .set({ variants: variants })
                .commit();

            console.log("Success! The Pink variant is now only available when 'Full Set' is selected.");
        } else {
            console.error("Could not find Pink variant in the product.");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
