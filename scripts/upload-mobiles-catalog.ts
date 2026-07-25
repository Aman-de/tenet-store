import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { buildCatalogDataset } from './build-mobiles-dataset';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

// Cache for uploaded image paths to avoid re-uploading identical files
const assetCache = new Map<string, string>();

async function uploadImageToSanity(filePath: string): Promise<string | null> {
    if (assetCache.has(filePath)) {
        return assetCache.get(filePath)!;
    }

    if (!fs.existsSync(filePath)) {
        console.warn(`File does not exist: ${filePath}`);
        return null;
    }

    try {
        const buffer = fs.readFileSync(filePath);
        const filename = path.basename(filePath);
        const asset = await client.assets.upload('image', buffer, { filename });
        assetCache.set(filePath, asset._id);
        return asset._id;
    } catch (err: any) {
        console.error(`Failed to upload image ${filePath}:`, err.message || err);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting Mobiles Catalog Upload & Refresh Script...');

    // 1. Delete existing gadget/electronics products from Sanity
    console.log('\n🧹 Step 1: Removing old gadgets/electronics products from Sanity...');
    const existingGadgets = await client.fetch<Array<{ _id: string; title: string }>>('*[_type == "product" && (category == "gadgets" || category == "electronics")]{_id, title}');
    
    console.log(`Found ${existingGadgets.length} existing gadget products to remove.`);
    for (const prod of existingGadgets) {
        try {
            await client.delete(prod._id);
            console.log(`  Deleted old product: ${prod.title} (${prod._id})`);
        } catch (e: any) {
            console.error(`  Failed to delete product ${prod.title}:`, e.message);
        }
    }

    // 2. Build local catalog dataset
    console.log('\n📦 Step 2: Parsing products from Downloads/mobiles directory...');
    const catalogData = buildCatalogDataset();
    console.log(`Prepared ${catalogData.length} total products for upload.`);

    const createdProducts: Array<{ id: string; title: string; variantsCount: number; price: number; originalPrice: number; discount: string; missingNote?: string }> = [];

    // 3. Upload images and save products in Sanity
    console.log('\n📸 Step 3: Uploading images and creating new product documents...');

    for (let i = 0; i < catalogData.length; i++) {
        const item = catalogData[i];
        console.log(`\n[${i + 1}/${catalogData.length}] Processing product: "${item.productName}" (${item.brand})`);

        // Upload variant images
        const sanityVariants = [];
        for (const variant of item.variants) {
            console.log(`  -> Uploading photos for color variant: ${variant.colorName} (${variant.imagePaths.length} photos)...`);
            const variantAssetIds: string[] = [];

            for (const imgPath of variant.imagePaths) {
                const assetId = await uploadImageToSanity(imgPath);
                if (assetId) {
                    variantAssetIds.push(assetId);
                }
            }

            // Also upload a couple of non-generic feature photos to enrich the variant gallery if needed
            if (item.featureImagePaths.length > 0 && variantAssetIds.length < 3) {
                for (const fPath of item.featureImagePaths.slice(0, 3 - variantAssetIds.length)) {
                    const assetId = await uploadImageToSanity(fPath);
                    if (assetId && !variantAssetIds.includes(assetId)) {
                        variantAssetIds.push(assetId);
                    }
                }
            }

            if (variantAssetIds.length > 0) {
                sanityVariants.push({
                    colorName: variant.colorName,
                    colorHex: {
                        _type: 'color',
                        hex: variant.colorHex
                    },
                    images: variantAssetIds.map(id => ({
                        _type: 'image',
                        _key: Math.random().toString(36).substring(2, 9),
                        asset: {
                            _type: 'reference',
                            _ref: id
                        }
                    })),
                    stock: 25
                });
            }
        }

        // Upload main feature images for top-level product fallback
        const mainFeatureAssetIds: string[] = [];
        for (const fPath of item.featureImagePaths) {
            const assetId = await uploadImageToSanity(fPath);
            if (assetId) {
                mainFeatureAssetIds.push(assetId);
            }
        }

        // Slug creation
        const cleanSlug = item.productName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const productId = `gadget-${cleanSlug}`;

        const productDoc = {
            _id: productId,
            _type: 'product',
            title: item.productName,
            slug: {
                _type: 'slug',
                current: cleanSlug
            },
            price: item.price,
            originalPrice: item.originalPrice,
            discountLabel: item.discountLabel,
            category: 'gadgets',
            gender: 'unisex',
            isBestSeller: i < 6, // Feature top 6 products as best sellers
            bestSellerRank: i < 6 ? i + 1 : undefined,
            isOutOfStock: false,
            description: item.description,
            sizeType: item.sizeType,
            sizes: item.sizes,
            variants: sanityVariants
        };

        try {
            await client.createOrReplace(productDoc);
            console.log(`  ✅ Successfully created product: "${item.productName}" (ID: ${productId})`);
            createdProducts.push({
                id: productId,
                title: item.productName,
                variantsCount: sanityVariants.length,
                price: item.price,
                originalPrice: item.originalPrice,
                discount: item.discountLabel,
                missingNote: item.missingPhotosNote
            });
        } catch (err: any) {
            console.error(`  ❌ Failed to save product "${item.productName}":`, err.message || err);
        }
    }

    console.log('\n🎉 ALL PRODUCTS IMPORTED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log(`SUMMARY OF UPLOADED CATALOG (${createdProducts.length} PRODUCTS):`);
    console.log('='.repeat(60));
    createdProducts.forEach((p, idx) => {
        console.log(`${idx + 1}. ${p.title}`);
        console.log(`   Price: ₹${p.price.toLocaleString('en-IN')} (Original: ₹${p.originalPrice.toLocaleString('en-IN')} - ${p.discount})`);
        console.log(`   Variants Loaded: ${p.variantsCount}`);
        if (p.missingNote) {
            console.log(`   ⚠️ Missing Photos Note: ${p.missingNote}`);
        }
        console.log('-'.repeat(40));
    });
}

main().catch(err => {
    console.error('Fatal error running import:', err);
    process.exit(1);
});
