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
const reviewPhotos = [
    "review_mirror_selfie1_1780613376429.png",
    "review_mirror_selfie2_1780613389970.png",
    "review_shoes_photo_1780613403181.png"
];

async function uploadImage(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return null;
    }
    const buffer = fs.readFileSync(filePath);
    return await client.assets.upload('image', buffer, {
        filename: path.basename(filePath)
    });
}

async function main() {
    console.log("Uploading review photos...");
    const imageAssets = [];
    for (const photo of reviewPhotos) {
        const asset = await uploadImage(path.join(artifactDir, photo));
        if (asset) imageAssets.push(asset._id);
    }
    
    // Fetch some 5-star reviews
    const reviews = await client.fetch(`*[_type == "review" && rating == 5][0...20]{ _id }`);
    
    // Attach a random image to half of them
    console.log("Attaching images to reviews...");
    for (let i = 0; i < reviews.length; i++) {
        // give 30% of reviews an image
        if (Math.random() < 0.4) {
            const randomAsset = imageAssets[Math.floor(Math.random() * imageAssets.length)];
            await client.patch(reviews[i]._id)
                .set({
                    images: [{
                        _type: 'image',
                        asset: { _type: 'reference', _ref: randomAsset }
                    }]
                })
                .commit();
            console.log(`Attached image to review ${reviews[i]._id}`);
        }
    }
    
    console.log("Review image seeding complete!");
}

main().catch(console.error);
