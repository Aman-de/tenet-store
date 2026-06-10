import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing project credentials in .env.local (NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN).');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
    console.log('✨ Welcome to the Tenet Archives Interactive Garment Uploader ✨\n');

    try {
        const title = await askQuestion('👕 Product Title (e.g. The Linen Club Shirt): ');
        if (!title.trim()) throw new Error('Title is required.');

        const priceInput = await askQuestion('💰 Price (INR, e.g. 4500): ');
        const price = parseFloat(priceInput);
        if (isNaN(price)) throw new Error('Price must be a valid number.');

        const originalPriceInput = await askQuestion('🏷️ Original Price / MRP (Optional, press Enter to skip): ');
        const originalPrice = originalPriceInput ? parseFloat(originalPriceInput) : price;

        const description = await askQuestion('📝 Description: ');

        console.log('\nApparel Type options:');
        console.log('1. Top');
        console.log('2. Bottom');
        console.log('3. Set');
        console.log('4. Footwear');
        console.log('5. Accessory');
        const typeOption = await askQuestion('Select Apparel Type (1-5): ');
        let apparelType = 'top';
        if (typeOption === '2') apparelType = 'bottom';
        else if (typeOption === '3') apparelType = 'set';
        else if (typeOption === '4') apparelType = 'footwear';
        else if (typeOption === '5') apparelType = 'accessory';

        console.log('\nCategory options:');
        const categories = ['knitwear', 'shirting', 'trousers', 'shorts', 'swimwear', 'outerwear', 'footwear', 'accessories', 'jackets', 'sets', 'shirts', 'exclusive'];
        categories.forEach((cat, idx) => console.log(`${idx + 1}. ${cat}`));
        const catOption = await askQuestion('Select Category (1-12): ');
        const catIdx = parseInt(catOption) - 1;
        const category = categories[catIdx] || 'shirts';

        console.log('\nSize Type:');
        console.log('1. Clothing (S/M/L/XL)');
        console.log('2. Numeric (40/41/42)');
        console.log('3. One Size');
        const sizeOption = await askQuestion('Select Size Type (1-3): ');
        let sizeType = 'clothing';
        let sizes = ['S', 'M', 'L', 'XL'];
        if (sizeOption === '2') {
            sizeType = 'numeric';
            sizes = ['40', '41', '42', '43', '44'];
        } else if (sizeOption === '3') {
            sizeType = 'onesize';
            sizes = [];
        }

        const colorName = await askQuestion('\n🎨 Color Name (e.g. Ivory, Sage Green): ');
        const colorHex = await askQuestion('🎨 Color Hex Code (e.g. #FDFBF7, #5F9EA0): ');
        if (colorHex && !colorHex.startsWith('#')) throw new Error('Hex code must start with #');

        const imagePathsInput = await askQuestion('\n📸 Image File Path(s) (comma separated local paths to upload): ');
        const imagePaths = imagePathsInput.split(',').map(p => p.trim()).filter(Boolean);

        console.log('\n🚀 Uploading images to Sanity and linking to product...');
        const imageRefs: any[] = [];
        
        for (const filePath of imagePaths) {
            const resolvedPath = path.resolve(filePath);
            if (!fs.existsSync(resolvedPath)) {
                console.warn(`⚠️ Warning: Image file not found at ${resolvedPath}, skipping.`);
                continue;
            }
            console.log(`   Uploading ${path.basename(resolvedPath)}...`);
            const buffer = fs.readFileSync(resolvedPath);
            const asset = await client.assets.upload('image', buffer, {
                filename: path.basename(resolvedPath)
            });
            imageRefs.push({
                _type: 'image',
                _key: Math.random().toString(36).substring(2, 9),
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            });
            console.log(`   ✅ Uploaded image asset: ${asset._id}`);
        }

        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        const productDoc = {
            _type: 'product',
            title,
            slug: { _type: 'slug', current: slug },
            price,
            originalPrice,
            description,
            apparelType,
            category,
            sizeType,
            sizes,
            gender: 'unisex',
            variants: [
                {
                    _key: 'var_' + Math.random().toString(36).substring(2, 9),
                    colorName,
                    colorHex,
                    images: imageRefs,
                    stock: 20
                }
            ]
        };

        console.log('\n💾 Creating product document in Sanity...');
        const createdProduct = await client.create(productDoc);
        console.log(`\n🎉 Success! Product "${title}" created with ID: ${createdProduct._id}`);
        console.log(`🔗 Purchase URL: https://tenetarchives.com/product/${slug}`);

    } catch (err: any) {
        console.error(`\n❌ Error: ${err.message}`);
    } finally {
        rl.close();
    }
}

main();
