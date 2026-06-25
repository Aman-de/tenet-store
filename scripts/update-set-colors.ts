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
        
        const denimBlueHex = "#32445E"; // A nice dark denim blue

        // Update the Chocolate variant
        const chocolateIndex = variants.findIndex((v: any) => v.colorName === "Chocolate & Denim");
        if (chocolateIndex !== -1) {
            variants[chocolateIndex].colorHex = { _type: "color", hex: "#7B3F00" }; // Brown
            variants[chocolateIndex].secondaryColorHex = { _type: "color", hex: denimBlueHex };
        }

        // Update the Pink variant
        const pinkIndex = variants.findIndex((v: any) => v.colorName === "Pink");
        if (pinkIndex !== -1) {
            variants[pinkIndex].colorHex = { _type: "color", hex: "#FFB6C1" }; // Pink
            variants[pinkIndex].secondaryColorHex = { _type: "color", hex: denimBlueHex };
        }

        console.log("Updating product variants in Sanity...");
        await client
            .patch(product._id)
            .set({ variants: variants })
            .commit();

        console.log("Success! The two-tone colors have been configured.");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
