import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2026-01-22',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function downloadImage(url: string, dest: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
}

function convertToWebp(inputPath: string, outputPath: string) {
    execSync(`cwebp -lossless -metadata none "${inputPath}" -o "${outputPath}"`, { stdio: 'ignore' });
}

// Global cache to avoid re-uploading the same asset multiple times
const assetCache: Record<string, string> = {}; // oldAssetId -> newAssetId

async function processAsset(assetRef: string): Promise<string | null> {
    if (assetCache[assetRef]) return assetCache[assetRef];

    // Fetch asset details
    const asset = await client.getDocument(assetRef);
    if (!asset) return null;

    if (asset.extension === 'webp') {
        assetCache[assetRef] = assetRef; // No change needed
        return assetRef;
    }

    console.log(`\n  -> Processing asset: ${assetRef} (${asset.originalFilename || asset.url})`);

    const tempDir = path.join(__dirname, '../scratch/temp_images');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const originalExt = asset.extension || 'jpg';
    const inputPath = path.join(tempDir, `${assetRef}.${originalExt}`);
    const outputPath = path.join(tempDir, `${assetRef}.webp`);

    try {
        await downloadImage(asset.url, inputPath);
        convertToWebp(inputPath, outputPath);

        // Upload new webp asset
        const newFilename = asset.originalFilename 
            ? asset.originalFilename.replace(/\.[^/.]+$/, "") + '.webp' 
            : `${assetRef}.webp`;

        const newAsset = await client.assets.upload('image', fs.createReadStream(outputPath), {
            filename: newFilename,
        });

        console.log(`     Uploaded new WebP asset: ${newAsset._id}`);
        assetCache[assetRef] = newAsset._id;

        // Cleanup local files
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        // We can optionally delete the old asset here, but it's safer to do it after all products are patched.
        // Or we can delete it right now to save space, since we are returning the new ID.
        // Wait, other products might still point to it before they are patched. Better keep it around for now.
        
        return newAsset._id;
    } catch (e: any) {
        console.error(`     Error processing asset ${assetRef}:`, e.message);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        return null;
    }
}

async function run() {
    console.log('Starting Sanity WebP Migration...');
    
    // 1. Process Products
    const products = await client.fetch(`*[_type == "product"]{ _id, images, variants }`);
    console.log(`Found ${products.length} products.`);

    for (const product of products) {
        console.log(`\nChecking product: ${product._id}`);
        let mutations: any = {};
        let hasChanges = false;

        // Check main images
        if (product.images && Array.isArray(product.images)) {
            for (let i = 0; i < product.images.length; i++) {
                const img = product.images[i];
                if (!img.asset || !img.asset._ref) continue;

                const newRef = await processAsset(img.asset._ref);
                if (newRef && newRef !== img.asset._ref) {
                    if (img._key) {
                        mutations[`images[_key=="${img._key}"].asset._ref`] = newRef;
                    } else {
                        mutations[`images[${i}].asset._ref`] = newRef;
                    }
                    hasChanges = true;
                }
            }
        }

        // Check variant images
        if (product.variants && Array.isArray(product.variants)) {
            for (let v = 0; v < product.variants.length; v++) {
                const variant = product.variants[v];
                if (variant.images && Array.isArray(variant.images)) {
                    for (let i = 0; i < variant.images.length; i++) {
                        const img = variant.images[i];
                        if (!img.asset || !img.asset._ref) continue;

                        const newRef = await processAsset(img.asset._ref);
                        if (newRef && newRef !== img.asset._ref) {
                            if (variant._key && img._key) {
                                mutations[`variants[_key=="${variant._key}"].images[_key=="${img._key}"].asset._ref`] = newRef;
                            } else {
                                mutations[`variants[${v}].images[${i}].asset._ref`] = newRef;
                            }
                            hasChanges = true;
                        }
                    }
                }
            }
        }

        if (hasChanges) {
            console.log(`  Patching product ${product._id}...`);
            await client.patch(product._id).set(mutations).commit();
            console.log(`  Patched.`);
        }
    }

    // 2. Process Collections
    const collections = await client.fetch(`*[_type == "collection"]{ _id, image }`);
    console.log(`\nFound ${collections.length} collections.`);
    
    for (const collection of collections) {
        if (collection.image && collection.image.asset && collection.image.asset._ref) {
            const newRef = await processAsset(collection.image.asset._ref);
            if (newRef && newRef !== collection.image.asset._ref) {
                console.log(`  Patching collection ${collection._id}...`);
                await client.patch(collection._id).set({ 'image.asset._ref': newRef }).commit();
                console.log(`  Patched.`);
            }
        }
    }

    // 3. Process Reviews
    const reviews = await client.fetch(`*[_type == "review"]{ _id, images }`);
    console.log(`\nFound ${reviews.length} reviews.`);

    for (const review of reviews) {
        let mutations: any = {};
        let hasChanges = false;

        if (review.images && Array.isArray(review.images)) {
            for (let i = 0; i < review.images.length; i++) {
                const img = review.images[i];
                if (!img.asset || !img.asset._ref) continue;

                const newRef = await processAsset(img.asset._ref);
                if (newRef && newRef !== img.asset._ref) {
                    if (img._key) {
                        mutations[`images[_key=="${img._key}"].asset._ref`] = newRef;
                    } else {
                        mutations[`images[${i}].asset._ref`] = newRef;
                    }
                    hasChanges = true;
                }
            }
        }

        if (hasChanges) {
            console.log(`  Patching review ${review._id}...`);
            await client.patch(review._id).set(mutations).commit();
            console.log(`  Patched.`);
        }
    }

    console.log('\nMigration complete! Wait, let us delete the old unreferenced assets to clean up space.');
    // To be perfectly safe, we won't mass delete automatically in this script unless specifically requested, 
    // to avoid deleting assets that might be in use by drafts or other types. 
    // We can just log them or safely delete ones we know we migrated.
    console.log('Old assets replaced:', Object.keys(assetCache).filter(k => assetCache[k] !== k).length);
}

run().catch(console.error);
