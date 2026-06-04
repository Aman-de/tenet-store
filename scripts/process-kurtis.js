const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2023-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function main() {
    const kurtiDir = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads', 'kurti ');
    
    if (!fs.existsSync(kurtiDir)) {
        console.error('Kurti directory not found at', kurtiDir);
        return;
    }

    const files = fs.readdirSync(kurtiDir)
        .filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'))
        .map(f => path.join(kurtiDir, f));

    console.log(`Found ${files.length} images.`);

    const assets = [];
    console.log('Uploading images to Sanity...');
    for (let i = 0; i < Math.min(20, files.length); i++) {
        try {
            const asset = await client.assets.upload('image', fs.createReadStream(files[i]), {
                filename: path.basename(files[i])
            });
            assets.push(asset._id);
            console.log(`Uploaded ${i + 1}/${Math.min(20, files.length)}: ${asset._id}`);
        } catch (e) {
            console.error('Failed to upload', files[i], e.message);
        }
    }

    if (assets.length === 0) {
        console.error('No assets uploaded.');
        return;
    }

    const createProduct = async (title, price, category, assetIds, isCombo = false, originalPrice = null) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const doc = {
            _type: 'product',
            title,
            slug: { _type: 'slug', current: slug },
            price,
            originalPrice,
            category,
            sizeType: 'clothing',
            sizes: ['S', 'M', 'L', 'XL'],
            gender: 'woman',
            isOutOfStock: false,
            variants: [{
                _key: 'var-1',
                colorName: 'Default',
                colorHex: '#000000',
                stock: 50,
                images: assetIds.map((id, index) => ({
                    _type: 'image',
                    _key: `img-${index}`,
                    asset: { _type: 'reference', _ref: id }
                }))
            }]
        };
        try {
            const result = await client.create(doc);
            console.log('Created product:', result.title);
        } catch (e) {
            console.error('Failed to create product:', title, e.message);
        }
    };

    console.log('Creating individual products...');
    for (let i = 0; i < 10; i++) {
        if (assets[i]) {
            await createProduct(
                `Premium Designer Kurti ${i + 1}`,
                1999 + (i * 100),
                'exclusive',
                [assets[i]]
            );
        }
    }

    console.log('Creating Combos...');
    if (assets.length >= 10) {
        // Pack of 3
        await createProduct('Kurti Combo - Pack of 3', 4499, 'sets', [assets[10], assets[11], assets[12]], true, 5997);
        // Pack of 5
        await createProduct('Kurti Mega Combo - Pack of 5', 6999, 'sets', [assets[13], assets[14], assets[15]], true, 9995);
        // Pack of 10
        await createProduct('Kurti Ultimate Reseller Pack of 10', 11999, 'sets', [assets[16], assets[17], assets[18]], true, 19990);
    }

    console.log('Creating Accessories (using placehold since gen limit reached)...');
    
    // We will download a couple of placeholder images for accessories to upload.
    const placeholdUrls = [
        'https://placehold.co/800x1200.png?text=Womens+Heels',
        'https://placehold.co/800x1200.png?text=Gold+Necklace'
    ];
    
    for (let i=0; i<placeholdUrls.length; i++) {
        try {
            const res = await fetch(placeholdUrls[i]);
            const buffer = await res.arrayBuffer();
            const asset = await client.assets.upload('image', Buffer.from(buffer), { filename: `accessory-${i}.png` });
            await createProduct(
                i === 0 ? 'Elegant Evening Heels' : 'Royal Gold Necklace Set',
                i === 0 ? 2499 : 3499,
                i === 0 ? 'footwear' : 'accessories',
                [asset._id]
            );
        } catch(e) {
            console.error('Failed to create accessory', e.message);
        }
    }

    console.log('Done!');
}

main();
