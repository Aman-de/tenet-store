import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

const IMAGE_MAPPING = [
    {
        slug: "iphone-15-pro-max",
        localPath: "/Users/amansharma/.gemini/antigravity/brain/c659481e-f328-4c5f-872b-3c8828c953ff/iphone_15_pro_max_premium_1784446923979.jpg",
        colorName: "Natural Titanium",
        colorHex: "#A6A6A6",
    },
    {
        slug: "galaxy-s24-ultra",
        localPath: "/Users/amansharma/.gemini/antigravity/brain/c659481e-f328-4c5f-872b-3c8828c953ff/galaxy_s24_ultra_premium_1784446950084.jpg",
        colorName: "Titanium Gray",
        colorHex: "#8E8E93",
    },
    {
        slug: "macbook-air-13-m3",
        localPath: "/Users/amansharma/.gemini/antigravity/brain/c659481e-f328-4c5f-872b-3c8828c953ff/macbook_air_m3_premium_1784446977802.jpg",
        colorName: "Midnight Navy",
        colorHex: "#1D232A",
    },
    {
        slug: "apple-watch-ultra-2",
        localPath: "/Users/amansharma/.gemini/antigravity/brain/c659481e-f328-4c5f-872b-3c8828c953ff/apple_watch_ultra_premium_1784447001451.jpg",
        colorName: "Orange Alpine Loop",
        colorHex: "#FF5A00",
    },
    {
        slug: "galaxy-z-fold-6",
        localPath: "/Users/amansharma/.gemini/antigravity/brain/c659481e-f328-4c5f-872b-3c8828c953ff/galaxy_z_fold_premium_1784447023618.jpg",
        colorName: "Silver Shadow",
        colorHex: "#C0C0C0",
    },
    {
        slug: "airpods-pro-2nd-gen",
        localPath: "/Users/amansharma/.gemini/antigravity/brain/c659481e-f328-4c5f-872b-3c8828c953ff/airpods_pro_premium_1784447046357.jpg",
        colorName: "White",
        colorHex: "#FFFFFF",
    }
];

async function updateImages() {
    console.log('🚀 Starting to upload premium generated photos to Sanity...');

    for (const item of IMAGE_MAPPING) {
        console.log(`\nProcessing: ${item.slug}...`);

        try {
            // 1. Read file
            if (!fs.existsSync(item.localPath)) {
                console.error(`   ❌ File not found: ${item.localPath}`);
                continue;
            }
            const buffer = fs.readFileSync(item.localPath);

            // 2. Upload asset to Sanity
            console.log(`   Uploading local file to Sanity...`);
            const asset = await client.assets.upload('image', buffer, {
                filename: `${item.slug}-premium.jpg`
            });
            console.log(`   ✅ Uploaded asset ID: ${asset._id}`);

            // 3. Patch the product document in Sanity
            const docId = `brand-product-${item.slug}`;
            console.log(`   Patching product document ${docId}...`);
            
            await client.patch(docId)
                .set({
                    variants: [
                        {
                            _key: `${item.slug}-var1`,
                            colorName: item.colorName,
                            colorHex: item.colorHex,
                            stock: 50,
                            images: [
                                {
                                    _type: 'image',
                                    _key: `${item.slug}-img1`,
                                    asset: {
                                        _type: 'reference',
                                        _ref: asset._id
                                    }
                                }
                            ]
                        }
                    ]
                })
                .commit();

            console.log(`   ✅ Successfully updated ${item.slug} with premium image!`);
        } catch (error) {
            console.error(`   ❌ Failed to update ${item.slug}:`, error);
        }
    }

    console.log('\n✨ Premium gadget image update finished successfully!');
}

updateImages();
