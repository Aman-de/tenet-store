import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing environment variables NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const GADGETS_DATA = [
    {
        title: "Apple iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        price: 139900,
        originalPrice: 159900,
        description: "Sleek aerospace-grade titanium design, A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever. Experience photography with a 48MP main sensor and 5x optical telephoto lens.",
        colorName: "Natural Titanium",
        colorHex: "#A6A6A6",
        imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Samsung Galaxy S24 Ultra",
        slug: "galaxy-s24-ultra",
        price: 129900,
        originalPrice: 149900,
        description: "Galaxy AI is here. Meet the new Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat screen. Experience unmatched photography with 200MP sensor and AI zoom.",
        colorName: "Titanium Gray",
        colorHex: "#8E8E93",
        imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Apple MacBook Air 13\" M3",
        slug: "macbook-air-13-m3",
        price: 114900,
        originalPrice: 129900,
        description: "Supercharged by the next-generation M3 chip, the incredibly thin and fast MacBook Air is designed for ultimate work and play portability. Up to 18 hours of battery life and support for up to two external displays.",
        colorName: "Midnight Navy",
        colorHex: "#1D232A",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Apple Watch Ultra 2",
        slug: "apple-watch-ultra-2",
        price: 89900,
        originalPrice: 99900,
        description: "The ultimate sports and adventure watch. Featuring a lightweight corrosion-resistant titanium case, extra-long battery life, and the brightest always-on Retina display ever. Perfect for extreme athletes and divers.",
        colorName: "Orange Alpine Loop",
        colorHex: "#FF5A00",
        imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Samsung Galaxy Z Fold 6",
        slug: "galaxy-z-fold-6",
        price: 164900,
        originalPrice: 184900,
        description: "The next-generation foldables are here. Slimmer, lighter, and packed with Galaxy AI tools to maximize your daily productivity. Use the expansive 7.6-inch folding main screen to multitask with up to three open apps.",
        colorName: "Silver Shadow",
        colorHex: "#C0C0C0",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Apple AirPods Pro (2nd Gen)",
        slug: "airpods-pro-2nd-gen",
        price: 24900,
        originalPrice: 26900,
        description: "Rebuilt from the sound up. AirPods Pro features up to 2x more Active Noise Cancellation, plus Adaptive Audio and Personalized Spatial Audio for a truly custom theater-like listening experience.",
        colorName: "White",
        colorHex: "#FFFFFF",
        imageUrl: "https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=600&auto=format&fit=crop"
    }
];

async function runScraper() {
    console.log('🚀 Running Brand Gadgets Scraper & Importer...');

    for (const gadget of GADGETS_DATA) {
        console.log(`\nImporting: ${gadget.title}...`);

        try {
            // 1. Download image from URL
            console.log(`   Downloading product photo from CDN...`);
            const response = await fetch(gadget.imageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const buffer = Buffer.from(await response.arrayBuffer());

            // 2. Upload asset to Sanity
            console.log(`   Uploading asset to Sanity database...`);
            const asset = await client.assets.upload('image', buffer, {
                filename: `${gadget.slug}.jpg`
            });
            console.log(`   Uploaded asset ID: ${asset._id}`);

            // 3. Prepare Product Document
            const docId = `brand-product-${gadget.slug}`;
            const doc = {
                _type: 'product',
                _id: docId,
                title: gadget.title,
                slug: {
                    _type: 'slug',
                    current: gadget.slug
                },
                price: gadget.price,
                originalPrice: gadget.originalPrice,
                description: gadget.description,
                category: 'gadgets',
                gender: 'unisex',
                sizeType: 'onesize',
                sizes: [],
                variants: [
                    {
                        _key: `${gadget.slug}-var1`,
                        colorName: gadget.colorName,
                        colorHex: gadget.colorHex,
                        stock: 50,
                        images: [
                            {
                                _type: 'image',
                                _key: `${gadget.slug}-img1`,
                                asset: {
                                    _type: 'reference',
                                    _ref: asset._id
                                }
                            }
                        ]
                    }
                ]
            };

            // 4. Save/Insert into Sanity
            console.log(`   Creating/updating product document: ${docId}...`);
            await client.createOrReplace(doc);
            console.log(`   ✅ Successfully imported: ${gadget.title}`);

        } catch (error) {
            console.error(`   ❌ Failed to import ${gadget.title}:`, error);
        }
    }

    console.log('\n✨ Brand Gadgets Importer finished successfully!');
}

runScraper();
