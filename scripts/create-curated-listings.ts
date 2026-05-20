import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing project credentials in env config.');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
});

// Paths to image directories
const CURRENT_BRAIN_DIR = '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f';
const PREV_BRAIN_DIR = '/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0';
const LOCAL_PRODUCTS_DIR = '/Users/uditsharma/tenet-store/public/images/products';

const IMAGES = {
    // New Collection (Front, Back, Details)
    amalfiPopover: path.join(CURRENT_BRAIN_DIR, 'amalfi_popover_flat_1779246640817.png'),
    amalfiPopoverBack: path.join(CURRENT_BRAIN_DIR, 'amalfi_popover_back_1779288908233.png'),
    amalfiPopoverDetail: path.join(CURRENT_BRAIN_DIR, 'amalfi_popover_detail_1779288938199.png'),

    tuscanTrousers: path.join(CURRENT_BRAIN_DIR, 'tuscan_trousers_flat_1779246670578.png'),
    tuscanTrousersBack: path.join(CURRENT_BRAIN_DIR, 'tuscan_trousers_back_1779288964552.png'),

    rivieraShirt: path.join(CURRENT_BRAIN_DIR, 'riviera_shirt_flat_1779246695628.png'),
    rivieraShirtBack: path.join(CURRENT_BRAIN_DIR, 'riviera_shirt_back_1779289012029.png'),

    heritagePolo: path.join(CURRENT_BRAIN_DIR, 'heritage_polo_flat_1779246803183.png'),
    heritagePoloDetail: path.join(CURRENT_BRAIN_DIR, 'heritage_polo_detail_1779289051405.png'),

    chelseaLoafer: path.join(CURRENT_BRAIN_DIR, 'chelsea_loafer_flat_1779246878425.png'),
    chelseaLoaferAngle: path.join(CURRENT_BRAIN_DIR, 'chelsea_loafer_angle_1779289108716.png'),

    voyagerDuffel: path.join(CURRENT_BRAIN_DIR, 'voyager_duffel_flat_1779247010443.png'),
    voyagerDuffelInside: path.join(CURRENT_BRAIN_DIR, 'voyager_duffel_inside_1779289173569.png'),

    // Old Collection (front) + new back/detail views
    cableKnitCream: path.join(PREV_BRAIN_DIR, 'cable_knit_cream_flat_1771028542886.png'),
    cableKnitCreamBack: path.join(CURRENT_BRAIN_DIR, 'cable_knit_cream_back_1779290478632.png'),
    cableKnitNavy: path.join(PREV_BRAIN_DIR, 'cable_knit_navy_flat_v2_1771028568397.png'),
    cableKnitNavyBack: path.join(CURRENT_BRAIN_DIR, 'cable_knit_navy_back_1779290514853.png'),
    quarterZipCharcoal: path.join(PREV_BRAIN_DIR, 'quarter_zip_charcoal_flat_v2_1771028582947.png'),
    quarterZipBack: path.join(CURRENT_BRAIN_DIR, 'quarter_zip_back_1779290562573.png'),
    trouserSand: path.join(PREV_BRAIN_DIR, 'trouser_sand_flat_generic_1771028636473.png'),
    gurkhaBack: path.join(CURRENT_BRAIN_DIR, 'gurkha_trouser_back_1779290599911.png'),
    woolTrouserBack: path.join(CURRENT_BRAIN_DIR, 'wool_trouser_back_1779290652871.png'),
    harringtonNavy: path.join(PREV_BRAIN_DIR, 'harrington_navy_flat_generic_1771028651698.png'),
    harringtonBack: path.join(CURRENT_BRAIN_DIR, 'harrington_back_1779290699671.png'),
    choreCoatOlive: path.join(PREV_BRAIN_DIR, 'chore_coat_olive_flat_generic_1771028667076.png'),
    choreCoatBack: path.join(CURRENT_BRAIN_DIR, 'chore_coat_back_1779290738145.png'),

    // Vintage items (local assets) + new back/detail views
    vintageWhite: path.join(LOCAL_PRODUCTS_DIR, 'white.jpeg'),
    cashmereVestBack: path.join(CURRENT_BRAIN_DIR, 'cashmere_vest_back_1779290779631.png'),
    vintageCombo: path.join(LOCAL_PRODUCTS_DIR, 'combo.jpeg'),
    cableZipBack: path.join(CURRENT_BRAIN_DIR, 'cable_zip_back_1779291191871.png'),
    vintageTurtleneck: path.join(LOCAL_PRODUCTS_DIR, 'turtelneck.jpg'),
    vintageHoodie: path.join(LOCAL_PRODUCTS_DIR, 'hoodie.jpeg'),
    cashmereHoodieBack: path.join(CURRENT_BRAIN_DIR, 'cashmere_hoodie_back_1779291571486.png'),
};

const COLLECTIONS = [
    { title: "Shirting", slug: "shirting", filterTag: "shirting", description: "Breathable linen popovers and striped resort collar shirts.", sizeType: "clothing", imagePath: IMAGES.amalfiPopover },
    { title: "Knitwear", slug: "knitwear", filterTag: "knitwear", description: "Structured waffle-knit polos, cable-knit sweaters, and fine layers.", sizeType: "clothing", imagePath: IMAGES.heritagePolo },
    { title: "Trousers", slug: "trousers", filterTag: "trousers", description: "Tailored Gurkhas, pleated wool flannels, and relaxed linen drawstrings.", sizeType: "clothing", imagePath: IMAGES.tuscanTrousers },
    { title: "Jackets", slug: "jackets", filterTag: "jackets", description: "Classic water-resistant Harringtons and duck canvas chore coats.", sizeType: "clothing", imagePath: IMAGES.harringtonNavy },
    { title: "Footwear", slug: "footwear", filterTag: "footwear", description: "Handcrafted Italian suede penny loafers built for modern comfort.", sizeType: "numeric", imagePath: IMAGES.chelseaLoafer },
    { title: "Accessories", slug: "accessories", filterTag: "accessories", description: "Full-grain leather weekenders and travel gear built for the long haul.", sizeType: "onesize", imagePath: IMAGES.voyagerDuffel },
    { title: "Lounge", slug: "lounge", filterTag: "lounge", description: "Premium cashmere-merino blend hoodies and comfort-focused separates.", sizeType: "clothing", imagePath: IMAGES.vintageHoodie }
];

const PRODUCTS = [
    // --- SHIRTING (NEW COLLECTION) ---
    {
        title: "The Amalfi Linen Popover",
        price: 3800,
        originalPrice: 4800,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "An olive green linen popover shirt with a relaxed camp collar. Cut from premium lightweight European linen, perfect for warm tropical weather. Pre-washed for maximum softness and drape.",
        variants: [
            { colorName: "Olive Green", colorHex: "#556B2F", imagePaths: [IMAGES.amalfiPopover, IMAGES.amalfiPopoverBack, IMAGES.amalfiPopoverDetail] }
        ]
    },
    {
        title: "The Riviera Resort Shirt",
        price: 3600,
        originalPrice: 4500,
        category: "shirting",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Terracotta and cream vertical striped resort shirt, featuring an airy weave and a classic flat camp collar. The perfect companion for beach escapes and casual weekends.",
        variants: [
            { colorName: "Terracotta & Cream", colorHex: "#C05A46", imagePaths: [IMAGES.rivieraShirt, IMAGES.rivieraShirtBack] }
        ]
    },

    // --- KNITWEAR (NEW & OLD & VINTAGE) ---
    {
        title: "The Heritage Structured Polo",
        price: 4900,
        originalPrice: 5900,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Aran cream long-sleeve waffle knit polo. Structured ribbed collar and three-button placket. Warm yet breathable, making it a year-round silent luxury staple.",
        variants: [
            { colorName: "Aran Cream", colorHex: "#FDFBF7", imagePaths: [IMAGES.heritagePolo, IMAGES.heritagePoloDetail] }
        ]
    },
    {
        title: "The Heritage Cable Knit",
        price: 3899,
        originalPrice: 4999,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "A timeless classic inspired by Irish fisherman sweaters. Knit from thick, 5-gauge merino wool for warmth and durability. Feature intricate cable patterns and ribbed trims.",
        variants: [
            { colorName: "Aran Cream", colorHex: "#F5F5DC", imagePaths: [IMAGES.cableKnitCream, IMAGES.cableKnitCreamBack] },
            { colorName: "Deep Navy", colorHex: "#000080", imagePaths: [IMAGES.cableKnitNavy, IMAGES.cableKnitNavyBack] }
        ]
    },
    {
        title: "The Quarter-Zip Pullover",
        price: 3499,
        originalPrice: 4499,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "The ultimate layering piece. Crafted from a dense cotton-cashmere blend. Features a polished metal YKK zipper and a stand collar that looks sharp over a tee or oxford.",
        variants: [
            { colorName: "Charcoal Grey", colorHex: "#36454F", imagePaths: [IMAGES.quarterZipCharcoal, IMAGES.quarterZipBack] },
            { colorName: "Jet Black", colorHex: "#000000", imagePaths: [IMAGES.quarterZipCharcoal, IMAGES.quarterZipBack] }
        ]
    },
    {
        title: "The Sterling Cashmere Vest",
        price: 10600,
        originalPrice: 18600,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Indulge in absolute luxury with our 100% fine-gauge Mongolian cashmere vest. Clean silhouette, ribbed v-neck collar, and lightweight warmth designed for modern layering.",
        variants: [
            { colorName: "Alabaster White", colorHex: "#FDFBF7", imagePaths: [IMAGES.vintageWhite, IMAGES.cashmereVestBack] },
            { colorName: "Off Black", colorHex: "#1A1A1A", imagePaths: [IMAGES.vintageWhite, IMAGES.cashmereVestBack] }
        ]
    },
    {
        title: "The Archive Cable Knit Zip",
        price: 4200,
        originalPrice: 8400,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "A chunky cardigan styled with dynamic cabling and a heavy metal two-way zipper. Perfect for transitioning seasons with structural warmth and versatility.",
        variants: [
            { colorName: "Forest Green", colorHex: "#355E3B", imagePaths: [IMAGES.vintageCombo, IMAGES.cableZipBack] },
            { colorName: "Dark Charcoal", colorHex: "#1A1A1A", imagePaths: [IMAGES.vintageCombo, IMAGES.cableZipBack] }
        ]
    },
    {
        title: "The Scholar Turtleneck",
        price: 4200,
        originalPrice: 6500,
        category: "knitwear",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "A sophisticated turtleneck spun from a soft merino-cotton blend. Snug neck support, ribbed cuffs, and a slim, flattering profile that pairs perfectly under coats.",
        variants: [
            { colorName: "Off Black", colorHex: "#1A1A1A", imagePaths: [IMAGES.vintageTurtleneck] },
            { colorName: "Heather Grey", colorHex: "#808080", imagePaths: [IMAGES.vintageTurtleneck] },
            { colorName: "Aran Cream", colorHex: "#FDFBF7", imagePaths: [IMAGES.vintageTurtleneck] }
        ]
    },

    // --- LOUNGE ---
    {
        title: "The Haven Cashmere Hoodie",
        price: 8400,
        originalPrice: 12500,
        category: "lounge",
        gender: "unisex",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "An ultra-soft cashmere-merino blend loungewear hoodie. Featuring double-lined hood, premium metal aglets on drawstrings, and a cozy front kangaroo pocket.",
        variants: [
            { colorName: "Oatmeal Beige", colorHex: "#F5F5DC", imagePaths: [IMAGES.vintageHoodie, IMAGES.cashmereHoodieBack] },
            { colorName: "Deep Forest", colorHex: "#2F4F4F", imagePaths: [IMAGES.vintageHoodie, IMAGES.cashmereHoodieBack] }
        ]
    },

    // --- TROUSERS (NEW & OLD) ---
    {
        title: "Tuscan Drawstring Trousers",
        price: 4200,
        originalPrice: 5200,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Sand beige drawstring trousers, tailored with a relaxed waist and slightly tapered leg. Crafted from a breathable cotton-linen blend that holds its shape while keeping you cool.",
        variants: [
            { colorName: "Sand Beige", colorHex: "#C2B280", imagePaths: [IMAGES.tuscanTrousers, IMAGES.tuscanTrousersBack] }
        ]
    },
    {
        title: "The Tailored Gurkha Trouser",
        price: 4999,
        originalPrice: 6999,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["30", "32", "34", "36"],
        description: "Sartorial elegance meets military history. High-waisted with the signature double-buckle waistband closure. Cut from heavy cotton drill with single pleats for comfort and style.",
        variants: [
            { colorName: "Sand Beige", colorHex: "#C2B280", imagePaths: [IMAGES.trouserSand, IMAGES.gurkhaBack] },
            { colorName: "Olive Drab", colorHex: "#6B8E23", imagePaths: [IMAGES.trouserSand, IMAGES.gurkhaBack] }
        ]
    },
    {
        title: "The Pleated Wool Trouser",
        price: 5499,
        originalPrice: 7999,
        category: "trousers",
        gender: "man",
        sizeType: "clothing",
        sizes: ["30", "32", "34", "36"],
        description: "Your go-to formal trouser. Made from Super 120s Italian wool flannel. Features a double-pleated front, side adjusters, and a tapered leg for a modern silhouette.",
        variants: [
            { colorName: "Heather Grey", colorHex: "#808080", imagePaths: [IMAGES.trouserSand, IMAGES.woolTrouserBack] },
            { colorName: "Charcoal", colorHex: "#36454F", imagePaths: [IMAGES.trouserSand, IMAGES.woolTrouserBack] }
        ]
    },

    // --- JACKETS / OUTERWEAR (OLD) ---
    {
        title: "The Classic Harrington",
        price: 5999,
        originalPrice: 8999,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "An icon of British style. Water-resistant cotton blend shell with the signature tartan lining. Features a double-button funnel neck, raglan sleeves, and umbrella yoke back.",
        variants: [
            { colorName: "Midnight Navy", colorHex: "#000080", imagePaths: [IMAGES.harringtonNavy, IMAGES.harringtonBack] },
            { colorName: "Stone Beige", colorHex: "#CDC9C9", imagePaths: [IMAGES.harringtonNavy, IMAGES.harringtonBack] }
        ]
    },
    {
        title: "The Canvas Chore Coat",
        price: 4499,
        originalPrice: 6499,
        category: "jackets",
        gender: "man",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        description: "Workwear refined. Built from 12oz duck canvas that gets better with age. Features three patch pockets, reinforced elbows, and shank buttons. Unlined for year-round wear.",
        variants: [
            { colorName: "Field Olive", colorHex: "#556B2F", imagePaths: [IMAGES.choreCoatOlive, IMAGES.choreCoatBack] },
            { colorName: "Workwear Tan", colorHex: "#D2B48C", imagePaths: [IMAGES.choreCoatOlive, IMAGES.choreCoatBack] }
        ]
    },

    // --- FOOTWEAR (NEW) ---
    {
        title: "The Chelsea Suede Loafer",
        price: 8500,
        originalPrice: 11000,
        category: "footwear",
        gender: "man",
        sizeType: "numeric",
        sizes: ["7", "8", "9", "10", "11"],
        description: "Handcrafted penny loafer in rich tobacco suede with authentic leather soles. Features an unlined design that immediately conforms to your foot for custom comfort.",
        variants: [
            { colorName: "Tobacco Suede", colorHex: "#8B5A2B", imagePaths: [IMAGES.chelseaLoafer, IMAGES.chelseaLoaferAngle] }
        ]
    },

    // --- ACCESSORIES (NEW) ---
    {
        title: "The Voyager Leather Duffel",
        price: 15500,
        originalPrice: 18500,
        category: "accessories",
        gender: "unisex",
        sizeType: "onesize",
        sizes: [],
        description: "Full-grain cognac leather weekend travel bag, featuring brass hardware, double carrying handles, and an adjustable, padded shoulder strap. Perfectly sized for short business trips or weekend getaways.",
        variants: [
            { colorName: "Cognac Brown", colorHex: "#8B4513", imagePaths: [IMAGES.voyagerDuffel, IMAGES.voyagerDuffelInside] }
        ]
    }
];

async function uploadImage(filePath: string) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Image file not found: ${filePath}`);
            return null;
        }
        const buffer = fs.readFileSync(filePath);
        const asset = await client.assets.upload('image', buffer, {
            filename: path.basename(filePath),
        });
        return asset._id;
    } catch (error) {
        console.error(`❌ Error uploading image ${filePath}:`, error);
        return null;
    }
}

async function main() {
    console.log('🚀 Initiating Clean Luxury Seeding (Restoring Old & New Collections)...');

    // 1. Delete dependent collections to prevent dangling reference errors
    console.log('🗑️ Wiping Order history and customer Reviews...');
    await client.delete({ query: '*[_type == "order"]' });
    await client.delete({ query: '*[_type == "review"]' });

    // 2. Wipe Collections completely
    console.log('🗑️ Wiping existing collections...');
    await client.delete({ query: '*[_type == "collection"]' });

    // 3. Delete existing products
    console.log('🗑️ Deleting all previous products...');
    await client.delete({ query: '*[_type == "product"]' });
    console.log('✅ Sanity DB catalog cleared.');

    // 4. Create and upload collection headers
    console.log('📂 Seeding collections...');
    const seededCollections: Record<string, string> = {};
    for (const coll of COLLECTIONS) {
        console.log(`   - Uploading header for collection: ${coll.title}`);
        const assetId = await uploadImage(coll.imagePath);
        const collectionDoc = {
            _type: 'collection',
            title: coll.title,
            slug: { _type: 'slug', current: coll.slug },
            description: coll.description,
            filterTag: coll.filterTag,
            sizeType: coll.sizeType,
            image: assetId ? {
                _type: 'image',
                asset: { _type: "reference", _ref: assetId }
            } : undefined
        };
        const createdColl = await client.create(collectionDoc);
        seededCollections[coll.filterTag] = createdColl._id;
        console.log(`   ✅ Created collection: ${createdColl.title}`);
    }

    // 5. Create products with multi-image variant support
    const assetCache: Record<string, string> = {};

    for (const productDef of PRODUCTS) {
        console.log(`📦 Processing product: ${productDef.title}...`);

        const processedVariants: any[] = [];
        const allImages: any[] = [];

        for (const variant of productDef.variants) {
            console.log(`   - Processing variant: ${variant.colorName}`);
            const variantImageRefs: any[] = [];

            for (const imgPath of variant.imagePaths) {
                let assetId = assetCache[imgPath];
                if (!assetId) {
                    const id = await uploadImage(imgPath);
                    if (id) {
                        assetId = id;
                        assetCache[imgPath] = id;
                    }
                }

                if (assetId) {
                    const imgRef = {
                        _type: 'image',
                        _key: Math.random().toString(36).substring(2, 9),
                        asset: { _type: "reference", _ref: assetId }
                    };
                    variantImageRefs.push(imgRef);
                    // Add to allImages if not already present
                    if (!allImages.some(img => img.asset._ref === assetId)) {
                        allImages.push(imgRef);
                    }
                }
            }

            processedVariants.push({
                colorName: variant.colorName,
                colorHex: variant.colorHex,
                images: variantImageRefs,
                stock: 45
            });
        }

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
            images: allImages,
            discountLabel: `SAVE ₹${productDef.originalPrice - productDef.price}`
        };

        try {
            const created = await client.create(productDoc);
            console.log(`✅ Created product: ${created.title} (${created._id})`);
        } catch (err) {
            console.error(`❌ Failed to publish ${productDef.title}:`, err);
        }
    }

    console.log('✨ Clean Seeding complete! All product listings and collections updated.');
}

main().catch(console.error);
