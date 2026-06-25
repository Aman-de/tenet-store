import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import shortid from 'shortid';
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
        // 1. Find the Chocolate Tassel Kurti product
        console.log("Searching for Chocolate & Denim Set...");
        const products = await client.fetch(`*[_type == "product" && title == "Chocolate & Denim Set"]{_id, title, variants}`);
        
        if (products.length === 0) {
            console.error("Could not find product matching 'Chocolate & Denim Set'");
            return;
        }

        const product = products[0];
        console.log(`Found product: ${product.title} (${product._id})`);

        // 2. Upload images
        const imagesDir = "/Users/uditsharma/Downloads/colour varient ";
        const imageFiles = ["03dtxun.webp", "03jmofc.webp", "03kxjpy.webp", "03vibqf.webp"];
        const imageAssetIds: string[] = [];

        for (const file of imageFiles) {
            const filePath = path.join(imagesDir, file);
            console.log(`Uploading ${filePath}...`);
            const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
                filename: file
            });
            imageAssetIds.push(asset._id);
            console.log(`Uploaded! Asset ID: ${asset._id}`);
        }

        // 3. Create the new variant object
        const newVariant = {
            _key: shortid.generate(),
            colorName: "Pink",
            colorHex: {
                _type: "color",
                hex: "#FFB6C1" // Light pink
            },
            stock: 10,
            images: imageAssetIds.map(id => ({
                _key: shortid.generate(),
                _type: "image",
                asset: {
                    _type: "reference",
                    _ref: id
                }
            }))
        };

        // 4. Append variant to product
        console.log("Updating product variants...");
        await client
            .patch(product._id)
            .setIfMissing({ variants: [] })
            .append('variants', [newVariant])
            .commit();

        console.log("Success! The Pink variant has been added to Sanity.");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
