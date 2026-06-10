import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const reviewTexts = [
    "Absolutely love the quality and fit! Exceeded my expectations.",
    "The material feels so premium. Definitely worth the price.",
    "Perfect fit, true to size. I've gotten so many compliments.",
    "Fast shipping and gorgeous packaging. The item itself is stunning.",
    "I'm obsessed with this piece! It's become a staple in my wardrobe.",
    "Great craftsmanship and attention to detail.",
    "So comfortable yet incredibly stylish. Highly recommend.",
    "This was my first purchase and I am blown away. Will buy again!",
    "Looks exactly like the pictures. Very satisfied with my order.",
    "A bit pricey, but the quality justifies it. Beautifully made.",
    "Fits like a glove. The fabric is breathable and soft.",
    "Such an elegant design. I wore it out last night and loved it.",
    "Incredible piece. The color is rich and vibrant.",
    "Customer service was great when I had a sizing question. The item is perfect.",
    "My new favorite! Can't wait to see what else they release.",
    "The stitching is flawless. The fabric has a nice weight to it.",
    "Clean, minimalist aesthetic that works with everything in my closet.",
    "Exquisite styling. Truly silent luxury. Very happy patron."
];

const authors = [
    "Sarah M.", "Jessica T.", "Emily R.", "Amanda K.", "Olivia C.", 
    "Sophia L.", "Isabella W.", "Mia H.", "Charlotte D.", "Amelia P.",
    "Harper G.", "Evelyn B.", "Abigail M.", "Elizabeth F.", "Sofia S.",
    "Avery V.", "Ella N.", "Scarlett J.", "Grace A.", "Chloe Y.",
    "Arjun S.", "Rohan M.", "Kabir D.", "Aditya P.", "Vikram K.",
    "Rohan G.", "Aarav B.", "Vivaan S.", "Karan V.", "Aria D."
];

const femaleSpecificReviews = [
    "The embroidery on this is stunning. Very elegant and comfortable.",
    "The fabric is incredibly soft and drapes beautifully. True ethnic charm.",
    "Perfect lehenga! I wore it for a family function and everyone loved it.",
    "The print is gorgeous and the fit is incredibly flattering. A must-buy!",
    "Beautiful heels, very comfortable to wear for long hours. Classy design.",
    "High quality leather and detail. Looks incredibly premium and polished."
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 4);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

async function seedAllReviews() {
    console.log("🧹 Deleting existing reviews to fresh start...");
    await client.delete({ query: '*[_type == "review"]' });

    // Find all products
    const products = await client.fetch(`*[_type == "product"]{ _id, title, "slug": slug.current, gender }`);
    console.log(`Found ${products.length} products to seed reviews for.`);

    // Check for the generated review images in the artifacts directory
    const artifactsDir = "/Users/uditsharma/.gemini/antigravity/brain/7b120e1e-ec1a-4f91-8002-8e8f600b6ac1";
    const imageFiles = fs.readdirSync(artifactsDir);
    
    // Helper to find the latest file matching the pattern
    const getLatestImage = (pattern: string) => {
        const matches = imageFiles.filter(f => f.startsWith(pattern) && f.endsWith('.png'));
        if (matches.length === 0) return null;
        matches.sort((a, b) => {
            const statA = fs.statSync(path.join(artifactsDir, a));
            const statB = fs.statSync(path.join(artifactsDir, b));
            return statB.mtime.getTime() - statA.mtime.getTime();
        });
        return path.join(artifactsDir, matches[0]);
    };

    const imageMappings = {
        'classic-chikankari-suit': getLatestImage('review_chikankari_suit'),
        'festive-silk-banarasi-lehenga': getLatestImage('review_banarasi_lehenga'),
        'jaipur-block-print-kurta-set': getLatestImage('review_jaipur_kurta'),
        'elegant-evening-heels': getLatestImage('review_evening_heels')
    };

    const uploadedAssets: Record<string, string> = {};

    // Upload the amateur photos to Sanity
    for (const [slug, filePath] of Object.entries(imageMappings)) {
        if (filePath && fs.existsSync(filePath)) {
            try {
                console.log(`📤 Uploading review image for product slug "${slug}"...`);
                const buffer = fs.readFileSync(filePath);
                const asset = await client.assets.upload('image', buffer, {
                    filename: path.basename(filePath)
                });
                uploadedAssets[slug] = asset._id;
                console.log(`   Uploaded asset: ${asset._id}`);
            } catch (err: any) {
                console.error(`   ❌ Failed to upload asset for ${slug}:`, err.message);
            }
        } else {
            console.warn(`   ⚠️ Reference image file for slug "${slug}" not found at path: ${filePath}`);
        }
    }

    let reviewDocs = [];

    for (const product of products) {
        const isWoman = product.gender === 'woman';
        const numReviews = getRandomInt(3, 5); // Seed 3 to 5 reviews per product

        for (let i = 0; i < numReviews; i++) {
            // Pick a comment
            let comment = reviewTexts[getRandomInt(0, reviewTexts.length - 1)];
            if (isWoman && Math.random() > 0.5) {
                comment = femaleSpecificReviews[getRandomInt(0, femaleSpecificReviews.length - 1)];
            }

            const reviewDoc: any = {
                _type: 'review',
                product: {
                    _type: 'reference',
                    _ref: product._id
                },
                author: authors[getRandomInt(0, authors.length - 1)],
                rating: getRandomInt(4, 5),
                comment: comment,
                status: 'Approved',
                _createdAt: getRandomDate()
            };

            // If we have an uploaded image asset for this product, attach it to the first review
            if (i === 0 && uploadedAssets[product.slug]) {
                reviewDoc.images = [{
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: uploadedAssets[product.slug]
                    }
                }];
                console.log(`📸 Attaching uploaded review photo to review for "${product.title}"`);
            }

            reviewDocs.push(reviewDoc);
        }
    }

    console.log(`📦 Seeding ${reviewDocs.length} reviews...`);
    let count = 0;
    for (const doc of reviewDocs) {
        try {
            await client.create(doc);
            count++;
            if (count % 50 === 0) {
                console.log(`Seeded ${count}/${reviewDocs.length} reviews`);
            }
        } catch (err: any) {
            console.error(`Failed to create review:`, err.message);
        }
    }

    console.log("✅ Reviews seeded successfully!");
}

seedAllReviews().catch(console.error);
