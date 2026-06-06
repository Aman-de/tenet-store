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

const englishReviews = [
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

const hinglishReviews = [
    "Quality bohot acchi hai, fit bhi perfect aaya!",
    "Material kafi premium lag raha hai. Sahi product hai.",
    "Bohot pyara set hai, fitting ekdum mast hai.",
    "Kapde ka material bohot soft hai, worth buying!",
    "Mast look hai. Packing bhi acchi thi.",
    "Size ekdum perfect fit hua. Value for money hai boss.",
    "Bhai kya mast fabric hai! Mazaa aa gaya dekh kar.",
    "Delivery kafi fast thi aur dress bohot achhi hai.",
    "Kapda kafi soft hai aur design ekdum luxury lagta hai.",
    "Fitting a-one hai, material me dum hai.",
    "Photos se bhi achha lag raha hai real me.",
    "Pehli baar mangwaya aur bohot pasand aaya. Value for money.",
    "Bohot comfortable hai daily wear ke liye.",
    "Kurta set ka look bohot elegant hai, perfect for functions."
];

const lowEffortReviews = [
    "Mast!",
    "Nice",
    "Good",
    "Perfect",
    "Loved it",
    "A1 quality",
    "Superb",
    "Okk",
    "Awesome",
    "Badhiya hai",
    "Value for money",
    "Nice fit",
    "Best purchase",
    "Great product",
    "Five stars!"
];

const authors = [
    "Amit Sharma", "Priya Patel", "Rohan Mehta", "Neha Gupta", "Vikram Singh",
    "Sneha Rao", "Rahul Verma", "Ananya Iyer", "Karan Malhotra", "Divya Nair",
    "Arjun Sen", "Sunita Devi", "Siddharth Roy", "Pooja Reddy", "Aditya Joshi",
    "Ritu Kapoor", "Manish Pandey", "Kriti Saxena", "Sanjay Dutt", "Jyoti Prasad",
    "Jessica T.", "Emily R.", "Sarah M.", "Olivia C.", "Marcus K.", "David L."
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 5);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

async function seedReviews() {
    console.log("🧹 Deleting existing reviews to start fresh...");
    await client.delete({ query: '*[_type == "review"]' });

    // Find all products
    const products = await client.fetch(`*[_type == "product"]{ _id, title, "slug": slug.current }`);
    console.log(`Fetched ${products.length} products.`);

    const artifactsDir = "/Users/uditsharma/.gemini/antigravity/brain/7b120e1e-ec1a-4f91-8002-8e8f600b6ac1";
    const files = fs.readdirSync(artifactsDir);
    console.log(`Found ${files.length} files in artifacts directory.`);

    // Group files by product matchers
    const productMatchers = [
        {
            key: 'breezy-linen-resort-shirt',
            patterns: ['review_breezy_linen_'],
            titles: ['linen resort shirt', 'breezy linen']
        },
        {
            key: 'chocolate-set',
            patterns: ['chocolate_set_review_', 'review_chocolate_'],
            titles: ['chocolate set']
        },
        {
            key: 'classic-chikankari-suit',
            patterns: ['review_chikankari_suit', 'review_chikankari_'],
            titles: ['chikankari suit']
        },
        {
            key: 'festive-silk-banarasi-lehenga',
            patterns: ['review_banarasi_lehenga', 'review_lehenga_'],
            titles: ['banarasi lehenga']
        },
        {
            key: 'elegant-evening-heels',
            patterns: ['review_evening_heels', 'evening_heels_'],
            titles: ['evening heels']
        },
        {
            key: 'jaipur-block-print-kurta-set',
            patterns: ['review_jaipur_kurta', 'jaipur_kurta_'],
            titles: ['jaipur print kurta', 'jaipur kurta']
        }
    ];

    // Upload files and cache their asset IDs
    const uploadedAssets: Record<string, string[]> = {};

    for (const matcher of productMatchers) {
        uploadedAssets[matcher.key] = [];
        
        // Find all files matching the patterns
        const matchingFiles = files.filter(f => {
            return matcher.patterns.some(pat => f.startsWith(pat)) && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp'));
        });

        console.log(`Found ${matchingFiles.length} images for ${matcher.key}`);

        for (const filename of matchingFiles) {
            const filePath = path.join(artifactsDir, filename);
            try {
                console.log(`📤 Uploading review image "${filename}" for "${matcher.key}"...`);
                const buffer = fs.readFileSync(filePath);
                const asset = await client.assets.upload('image', buffer, {
                    filename: filename
                });
                uploadedAssets[matcher.key].push(asset._id);
                console.log(`   Uploaded asset: ${asset._id}`);
            } catch (err: any) {
                console.error(`   ❌ Failed to upload asset ${filename}:`, err.message);
            }
        }
    }

    const reviewDocs = [];

    for (const p of products) {
        // Find if this product matches any of our key review image matchers
        let matchedKey = '';
        for (const matcher of productMatchers) {
            const matchesTitle = matcher.titles.some(t => p.title.toLowerCase().includes(t));
            const slugStr = p.slug || '';
            const matchesSlug = slugStr ? (slugStr.toLowerCase().includes(matcher.key) || matcher.key.includes(slugStr.toLowerCase())) : false;
            if (matchesTitle || matchesSlug) {
                matchedKey = matcher.key;
                break;
            }
        }

        const assets = matchedKey ? (uploadedAssets[matchedKey] || []) : [];
        
        // Seed 3 to 6 reviews per product
        const numReviews = getRandomInt(3, 6);
        
        for (let i = 0; i < numReviews; i++) {
            // Decide review type: 35% English, 35% Hinglish, 30% Low-effort
            let comment = '';
            const rand = Math.random();
            if (rand < 0.35) {
                comment = englishReviews[getRandomInt(0, englishReviews.length - 1)];
            } else if (rand < 0.70) {
                comment = hinglishReviews[getRandomInt(0, hinglishReviews.length - 1)];
            } else {
                comment = lowEffortReviews[getRandomInt(0, lowEffortReviews.length - 1)];
            }

            const reviewDoc: any = {
                _type: 'review',
                product: {
                    _type: 'reference',
                    _ref: p._id
                },
                author: authors[getRandomInt(0, authors.length - 1)],
                rating: getRandomInt(4, 5), // Premium brand patrons mostly leave 4-5 stars
                comment: comment,
                status: 'Approved',
                createdAt: getRandomDate()
            };

            // Associate uploaded images if available
            // If we have multiple images, distribute them: e.g. review 0 gets image 0, review 1 gets image 1, etc.
            if (assets.length > 0 && i < assets.length) {
                const assetId = assets[i];
                reviewDoc.images = [{
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: assetId
                    }
                }];
                console.log(`📸 Attached review photo (${i+1}/${assets.length}) to review for product "${p.title}"`);
            }

            reviewDocs.push(reviewDoc);
        }
    }

    console.log(`\n📦 Submitting ${reviewDocs.length} review documents to Sanity in batches of 100...`);
    const batchSize = 100;
    for (let offset = 0; offset < reviewDocs.length; offset += batchSize) {
        const batch = reviewDocs.slice(offset, offset + batchSize);
        try {
            const tx = client.transaction();
            batch.forEach(doc => tx.create(doc));
            await tx.commit();
            console.log(`Successfully committed batch ${offset / batchSize + 1} (${offset + batch.length}/${reviewDocs.length})`);
        } catch (err: any) {
            console.error(`❌ Failed to commit batch starting at offset ${offset}:`, err.message);
        }
    }

    console.log(`\n✅ Completed! Successfully seeded reviews in Sanity.`);
}

seedReviews().catch(console.error);
