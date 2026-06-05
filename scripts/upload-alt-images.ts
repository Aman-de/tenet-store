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

const artifactDir = '/Users/uditsharma/.gemini/antigravity/brain/7b120e1e-ec1a-4f91-8002-8e8f600b6ac1/';

const map = {
    "The Silk Floral Scarf": ["silk_scarf_alt_1780613094625.png"],
    "The Classic Silk Blouse": ["silk_blouse_alt_1780613106264.png"],
    "Chocolate Set": ["chocolate_set_alt_1780613117517.png"],
    "The Woven Rattan Tote Bag": ["rattan_tote_alt_1780613128353.png"],
    "The Pearl Drop Earrings": ["pearl_earrings_alt_1780613150507.png"],
    "Elegant Evening Heels": ["evening_heels_alt1_1780613230156.png", "evening_heels_alt2_1780613176175.png"],
    "The Black Stiletto Heels": ["stiletto_heels_alt1_1780613187813.png", "stiletto_heels_alt2_1780613199756.png"],
    "The Chelsea Suede Loafer": ["suede_loafer_alt_1780613243159.png"],
    "The Penny Loafer": ["penny_loafer_alt_1780613255587.png"],
    "The Santorini Walk Edit": ["santorini_walk_alt_1780613266702.png"],
};

async function uploadImage(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return null;
    }
    const buffer = fs.readFileSync(filePath);
    const asset = await client.assets.upload('image', buffer, {
        filename: path.basename(filePath)
    });
    return asset;
}

async function main() {
    for (const [title, filenames] of Object.entries(map)) {
        const query = `*[_type == "product" && title == $title]`;
        const products = await client.fetch(query, { title });
        if (products.length === 0) continue;
        
        const product = products[0];
        const variants = product.variants || [];
        if (variants.length === 0) continue;
        
        const currentImages = variants[0].images || [];
        const newImages = [...currentImages];
        
        for (const filename of filenames) {
            console.log(`Uploading ${filename} for ${title}...`);
            const asset = await uploadImage(path.join(artifactDir, filename));
            if (asset) {
                newImages.push({
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id }
                });
                
                // If it needs more to reach 4, just duplicate the last one (lazy pad to 4)
                while (newImages.length < 4 && currentImages.length + filenames.length < 4) {
                     newImages.push({
                        _type: 'image',
                        asset: { _type: 'reference', _ref: asset._id }
                    });
                }
            }
        }
        
        variants[0].images = newImages;
        await client.patch(product._id).set({ variants }).commit();
        console.log(`Updated ${title} with new images!`);
    }
}

main().catch(console.error);
