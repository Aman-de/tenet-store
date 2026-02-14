import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
});

// Real Image Sources (Pexels/Unsplash)
const IMAGES = {
    tee: {
        black: [
            'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Front/Lifestyle
            'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Detail/Back
        ],
        white: [
            'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ],
        navy: [
            'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Substitute with dark tee
            'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ],
        olive: [
            'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ]
    },
    polo: {
        white: [
            'https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ],
        black: [
            'https://images.pexels.com/photos/3760610/pexels-photo-3760610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Dark top
            'https://images.pexels.com/photos/4890733/pexels-photo-4890733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ],
        navy: [
            'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ]
    },
    chino: {
        beige: [
            'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder generic pants
        ],
        navy: [
            'https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Jeans but works for general look
        ],
        olive: [
            'https://images.pexels.com/photos/2343661/pexels-photo-2343661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ]
    },
    denim: {
        blue: [
            'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/603022/pexels-photo-603022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ],
        indigo: [
            'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ]
    },
    linen: {
        white: [
            'https://images.pexels.com/photos/1963236/pexels-photo-1963236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        ],
        blue: [
            'https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        ]
    }
};

async function uploadImage(url: string) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
        const buffer = await res.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(buffer), {
            filename: path.basename(url).split('?')[0] + '.jpg',
        });
        return asset._id;
    } catch (error) {
        console.error(`Error uploading image ${url}:`, error);
        return null;
    }
}

const PRODUCTS = [
    {
        title: "Essential Heavyweight Tee",
        price: 1999,
        originalPrice: 2499,
        category: "shirting",
        gender: "man",
        description: "The only t-shirt you'll ever need. Crafted from 280 GSM heavyweight cotton for a structured drape that doesn't cling. Pre-shrunk and garment-dyed for lasting color and a broken-in feel from day one.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL", "XXL"],
        variants: [
            { colorName: "Midnight Black", colorHex: "#000000", imageKeys: ["tee", "black"] },
            { colorName: "Optic White", colorHex: "#FFFFFF", imageKeys: ["tee", "white"] },
            { colorName: "Navy Blue", colorHex: "#000080", imageKeys: ["tee", "navy"] },
            { colorName: "Olive Green", colorHex: "#556B2F", imageKeys: ["tee", "olive"] },
        ]
    },
    {
        title: "Classic Pique Polo",
        price: 2499,
        originalPrice: 3299,
        category: "shirting",
        gender: "man",
        description: "A modern update to the classic polo. Made from premium combed cotton pique with a hint of stretch. Features a structured collar that stays crisp and genuine mother-of-pearl buttons.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL", "XXL"],
        variants: [
            { colorName: "Classic White", colorHex: "#FFFFFF", imageKeys: ["polo", "white"] },
            { colorName: "Jet Black", colorHex: "#000000", imageKeys: ["polo", "black"] },
            { colorName: "Royal Navy", colorHex: "#000080", imageKeys: ["polo", "navy"] },
        ]
    },
    {
        title: "Everyday Chino Trouser",
        price: 3499,
        originalPrice: 4999,
        category: "trousers",
        gender: "man",
        description: "Versatile chinos cut for a relaxed yet tailored fit. Constructed from mid-weight cotton twill with 2% elastane for all-day comfort. Perfect for both office hours and weekend wanderings.",
        sizeType: "numeric",
        sizes: ["28", "30", "32", "34", "36", "38"],
        variants: [
            { colorName: "Sand Beige", colorHex: "#F5F5DC", imageKeys: ["chino", "beige"] },
            { colorName: "True Navy", colorHex: "#000080", imageKeys: ["chino", "navy"] },
            { colorName: "Olive Drab", colorHex: "#6B8E23", imageKeys: ["chino", "olive"] },
        ]
    },
    {
        title: "Vintage Wash Selvedge Denim",
        price: 4999,
        originalPrice: 6999,
        category: "trousers",
        gender: "man",
        description: "Authentic japanese selvedge denim, rinsed for a softer feel. Features classic 5-pocket styling and antique copper hardware. A wardrobe staple that gets better with every wear.",
        sizeType: "numeric",
        sizes: ["28", "30", "32", "34", "36", "38"],
        variants: [
            { colorName: "Light Wash", colorHex: "#ADD8E6", imageKeys: ["denim", "blue"] },
            { colorName: "Indigo Rinse", colorHex: "#4B0082", imageKeys: ["denim", "indigo"] },
        ]
    },
    {
        title: "Breezy Linen Resort Shirt",
        price: 2999,
        originalPrice: 3999,
        category: "shirting",
        gender: "man",
        description: "100% French linen, stone-washed for incredible softness. Designed with a relaxed camp collar and distinct texture. The ultimate summer staple for effortless style.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        variants: [
            { colorName: "Crisp White", colorHex: "#FFFFFF", imageKeys: ["linen", "white"] },
            { colorName: "Sky Blue", colorHex: "#87CEEB", imageKeys: ["linen", "blue"] },
        ]
    }
];

async function main() {
    console.log('Starting import of generic bestsellers...');

    for (const productDef of PRODUCTS) {
        console.log(`Processing ${productDef.title}...`);

        // 1. Process Variants
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedVariants: any[] = [];
        const allImages: string[] = []; // Collect all images for main product images

        for (const variant of productDef.variants) {
            console.log(`  - Processing variant: ${variant.colorName}`);
            // @ts-ignore
            const urlKeys = variant.imageKeys;
            // @ts-ignore
            const urls = IMAGES[urlKeys[0]][urlKeys[1]] || [];

            const variantImageRefs = [];

            for (const url of urls) {
                // Upload image
                const assetId = await uploadImage(url);
                if (assetId) {
                    variantImageRefs.push({
                        _type: 'image',
                        asset: { _type: "reference", _ref: assetId }
                    });
                }
            }

            // Add to main images list if not already (first image of variant usually)
            if (variantImageRefs.length > 0) {
                // @ts-ignore
                allImages.push(...variantImageRefs);
            }

            processedVariants.push({
                colorName: variant.colorName,
                colorHex: variant.colorHex,
                images: variantImageRefs,
                stock: 50 // High stock for bestsellers
            });
        }

        // 2. Create Product Document
        const productDoc = {
            _type: 'product',
            title: productDef.title,
            slug: {
                _type: 'slug',
                current: productDef.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            },
            price: productDef.price,
            originalPrice: productDef.originalPrice,
            description: productDef.description,
            category: productDef.category,
            gender: productDef.gender,
            sizeType: productDef.sizeType,
            sizes: productDef.sizes,
            variants: processedVariants,
            images: allImages, // Populate main images with all variant images for fallback
            discountLabel: (productDef.originalPrice && productDef.originalPrice > productDef.price)
                ? `SAVE ₹${productDef.originalPrice - productDef.price}`
                : undefined
        };

        try {
            const createdProduct = await client.create(productDoc);
            console.log(`✅ Created product: ${createdProduct.title} (${createdProduct._id})`);
        } catch (err) {
            console.error(`❌ Failed to create product ${productDef.title}:`, err);
        }
    }

    console.log('Import complete!');
}

main().catch(console.error);
