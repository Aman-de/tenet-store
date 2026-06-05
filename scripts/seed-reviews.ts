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
    "My new favorite! Can't wait to see what else they release."
];

const authors = [
    "Sarah M.", "Jessica T.", "Emily R.", "Amanda K.", "Olivia C.", 
    "Sophia L.", "Isabella W.", "Mia H.", "Charlotte D.", "Amelia P.",
    "Harper G.", "Evelyn B.", "Abigail M.", "Elizabeth F.", "Sofia S.",
    "Avery V.", "Ella N.", "Scarlett J.", "Grace A.", "Chloe Y."
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

async function seedReviews() {
    // Delete existing reviews first to avoid duplicates
    console.log("Deleting existing reviews...");
    await client.delete({ query: '*[_type == "review"]' });

    const products = await client.fetch(`*[_type == "product"]{ _id }`);
    
    console.log(`Found ${products.length} products. Seeding new review documents...`);

    let reviewDocs = [];
    for (const product of products) {
        const numReviews = getRandomInt(2, 5);
        for (let i = 0; i < numReviews; i++) {
            reviewDocs.push({
                _type: 'review',
                product: {
                    _type: 'reference',
                    _ref: product._id
                },
                author: authors[getRandomInt(0, authors.length - 1)],
                rating: getRandomInt(4, 5),
                comment: reviewTexts[getRandomInt(0, reviewTexts.length - 1)],
                status: 'Approved',
                createdAt: getRandomDate()
            });
        }
    }

    console.log(`Creating ${reviewDocs.length} review documents...`);
    let i = 0;
    for (const doc of reviewDocs) {
        try {
            await client.create(doc);
            i++;
            if (i % 20 === 0) console.log(`Created ${i}/${reviewDocs.length} reviews`);
        } catch (error: any) {
            console.error(`Failed to create review:`, error.message);
        }
    }
    
    console.log("Finished seeding review documents!");
}

seedReviews();
