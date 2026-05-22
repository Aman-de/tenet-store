import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

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

const dirs: Record<string, string> = {
    d39e: "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b",
    e2ad: "/Users/uditsharma/.gemini/antigravity/brain/e2adc946-4afc-4cb4-a6fc-6fea5425392a",
    ace5: "/Users/uditsharma/.gemini/antigravity/brain/ace51c03-e5ea-4e4c-a6fe-1a891674d2c1",
    c55b: "/Users/uditsharma/.gemini/antigravity/brain/55be8c19-23dd-46d2-b41c-edeb421b7252",
    c3de: "/Users/uditsharma/.gemini/antigravity/brain/3de14e97-48ea-4cc8-b527-efaf85fe934a",
    current: "/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f",
    a209: "/Users/uditsharma/.gemini/antigravity/brain/a20920b9-3b5e-45ac-bc5f-9dc69fa1aaa0",
};

// 22 Products definition (20 outfit sets + 2 luxury basics)
const PRODUCTS_TO_RESTORE = [
    // d39e Products
    {
        title: "The Alpine Lodge Edit",
        slug: "the-alpine-lodge-edit",
        price: 55000,
        originalPrice: 62000,
        category: "knitwear",
        color: "Cream & Brown",
        colorHex: "#F5F5DC",
        description: "Après-ski luxury defined. Features a Chunky Cream Roll-neck Sweater, Chocolate Brown Corduroy Trousers, and Leather Hiking Boots.",
        image_prompt: "Chunky cream roll-neck sweater, chocolate brown corduroy trousers, leather hiking boots, vintage ski goggles.",
        dir: "d39e",
        heroImage: "hero_alpine_lodge_1770240393686.png",
        flatImage: "flat_alpine_lodge_1770240376904.png"
    },
    {
        title: "The Savannah Explorer Edit",
        slug: "the-savannah-explorer-edit",
        price: 48000,
        originalPrice: 58000,
        category: "jackets",
        color: "Beige & White",
        colorHex: "#F5F5DC",
        description: "Vintage adventure luxury. Features a Beige Linen Safari Jacket, White Trousers, Brown Loafers, and a Silk Scarf.",
        image_prompt: "Beige linen safari jacket, white trousers, brown loafers, silk scarf.",
        dir: "d39e",
        heroImage: "hero_savannah_explorer_1770240457660.png",
        flatImage: "flat_savannah_explorer_1770240440949.png"
    },
    {
        title: "The Manhattan Evening Edit",
        slug: "the-manhattan-evening-edit",
        price: 62000,
        originalPrice: 75000,
        category: "jackets",
        color: "Charcoal & Black",
        colorHex: "#36454F",
        description: "Urban noir for the city night. Features a Charcoal Wool Overcoat, Black Mock Neck Sweater, Grey Flannel Trousers, and Chelsea Boots.",
        image_prompt: "Charcoal wool overcoat, black mock neck sweater, grey flannel trousers, black leather Chelsea boots.",
        dir: "d39e",
        heroImage: "hero_manhattan_evening_1770240522517.png",
        flatImage: "flat_manhattan_evening_1770240506927.png"
    },
    {
        title: "The Country Club Brunch Edit",
        slug: "the-country-club-brunch-edit",
        price: 36000,
        originalPrice: 42000,
        category: "knitwear",
        color: "Navy & Beige",
        colorHex: "#000080",
        description: "Relaxed sophistication. Features a Navy Shawl Collar Cardigan, Blue Striped Oxford Shirt, Beige Chinos, and Suede Loafers.",
        image_prompt: "Navy shawl-collar cardigan, blue striped oxford shirt, beige chinos, suede loafers.",
        dir: "d39e",
        heroImage: "hero_country_club_1770240588432.png",
        flatImage: "flat_country_club_1770240572451.png"
    },

    // e2ad Products
    {
        title: "The Savannah Sunset Edit",
        slug: "the-savannah-sunset-edit",
        price: 45000,
        originalPrice: 52000,
        category: "shirting",
        color: "Khaki & Cream",
        colorHex: "#F0E68C",
        description: "Luxury safari, warm evening wear. Features a lightweight khaki field jacket, cream linen trousers, white t-shirt, and leather sandals.",
        image_prompt: "Man standing in an open-top safari jeep at sunset, khaki field jacket, cream linen trousers.",
        dir: "e2ad",
        heroImage: "hero_savannah_m_1_1770663312853.png",
        flatImage: "flat_savannah_m_1_1770663328357.png"
    },

    // ace5 Products
    {
        title: "The Paris Flâneur Edit",
        slug: "the-paris-flaneur-edit",
        price: 58000,
        originalPrice: 69600,
        category: "jackets",
        color: "Beige & Black",
        colorHex: "#F5F5DC",
        description: "Cinematic urban sophistication. Features a Beige Trench Coat, Black Merino Turtleneck, and Charcoal Trousers.",
        image_prompt: "Beige trench coat, black turtleneck, charcoal trousers.",
        dir: "ace5",
        heroImage: "hero_paris_flaneur_1770836558589.png",
        flatImage: "hero_paris_flaneur_1770836558589.png" // Hero used for both slots
    },
    {
        title: "The Bali Bamboo Edit",
        slug: "the-bali-bamboo-edit",
        price: 36000,
        originalPrice: 43200,
        category: "shirting",
        color: "Olive & Black",
        colorHex: "#556B2F",
        description: "Tropical luxury. Features an Olive Linen Kimono Shirt, Black Linen Shorts, and Leather Slides.",
        image_prompt: "Olive linen kimono shirt, black linen shorts, leather slides.",
        dir: "ace5",
        heroImage: "hero_bali_bamboo_1770836894353.png",
        flatImage: "flat_bali_bamboo_1770836926427.png"
    },

    // c55b Products (Summer Collection Round 1-3)
    {
        title: "The Amalfi Day Edit",
        slug: "the-amalfi-day-edit",
        price: 38000,
        originalPrice: 43000,
        category: "shirting",
        color: "Blue & White",
        colorHex: "#87CEEB",
        description: "Light Blue Linen Shirt, White Tailored Shorts, Suede Loafers.",
        image_prompt: "Light blue linen shirt, white tailored shorts, tan suede loafers.",
        dir: "c55b",
        heroImage: "hero_amalfi_day_1770318559833.png",
        flatImage: "flat_amalfi_day_1770318544560.png"
    },
    {
        title: "The Santorini Sunset Edit",
        slug: "the-santorini-sunset-edit",
        price: 42000,
        originalPrice: 47000,
        category: "jackets",
        color: "Sand & White",
        colorHex: "#F4A460",
        description: "Sand Structured Blazer, White Linen Trousers, Espadrilles.",
        image_prompt: "Sand structured blazer, white linen trousers, beige espadrilles.",
        dir: "c55b",
        heroImage: "hero_santorini_sunset_1770318643232.png",
        flatImage: "flat_santorini_sunset_1770318621391.png"
    },
    {
        title: "The Capri Evening Edit",
        slug: "the-capri-evening-edit",
        price: 45000,
        originalPrice: 50000,
        category: "knitwear",
        color: "Navy & Charcoal",
        colorHex: "#000080",
        description: "Navy Silk Polo, Charcoal Trousers, Black Loafers.",
        image_prompt: "Navy silk polo, charcoal trousers, black loafers.",
        dir: "c55b",
        heroImage: "hero_capri_evening_1770318678698.png",
        flatImage: "flat_capri_evening_1770318663684.png"
    },
    {
        title: "The Havana Lounge Edit",
        slug: "the-havana-lounge-edit",
        price: 38000,
        originalPrice: 43000,
        category: "shirting",
        color: "White & Tobacco",
        colorHex: "#8B4513",
        description: "White Guayabera Shirt, Tobacco Linen Trousers, Leather Slides.",
        image_prompt: "White guayabera-style linen shirt, tobacco brown linen trousers, dark brown leather slides.",
        dir: "c55b",
        heroImage: "hero_havana_lounge_1770318908401.png",
        flatImage: "flat_havana_lounge_1770318891540.png"
    },
    {
        title: "The Mykonos Day Club Edit",
        slug: "the-mykonos-day-club-edit",
        price: 40000,
        originalPrice: 45000,
        category: "knitwear",
        color: "Cream & Olive",
        colorHex: "#F5F5DC",
        description: "Cream Open-Knit Polo, Olive Swim Shorts, Espadrilles.",
        image_prompt: "Cream open-knit polo shirt, olive green swim shorts, beige canvas espadrilles.",
        dir: "c55b",
        heroImage: "hero_mykonos_day_club_1770318942498.png",
        flatImage: "flat_mykonos_day_club_1770318927017.png"
    },
    {
        title: "The St. Tropez Promenade Edit",
        slug: "the-st-tropez-promenade-edit",
        price: 36000,
        originalPrice: 41000,
        category: "shirting",
        color: "Navy & White",
        colorHex: "#000080",
        description: "Breton Stripe Tee, Navy Tailored Shorts, White Sneakers.",
        image_prompt: "Navy and white Breton stripe long-sleeve tee, navy blue tailored shorts, crisp white leather sneakers.",
        dir: "c55b",
        heroImage: "hero_st_tropez_promenade_1770318973891.png",
        flatImage: "flat_st_tropez_promenade_1770318957196.png"
    },
    {
        title: "The Hamptons Weekend Edit",
        slug: "the-hamptons-weekend-edit",
        price: 42000,
        originalPrice: 47000,
        category: "shirting",
        color: "Blue & Red",
        colorHex: "#CD5C5C",
        description: "Blue Seersucker Shirt, Nantucket Red Shorts, Boat Shoes.",
        image_prompt: "Blue and white seersucker shirt, Nantucket red chino shorts, brown leather boat shoes.",
        dir: "c55b",
        heroImage: "hero_hamptons_weekend_1770322031527.png",
        flatImage: "flat_hamptons_weekend_1770322015557.png"
    },

    // current Products (Monaco & Tulum generated images)
    {
        title: "The Monaco Grand Prix Edit",
        slug: "the-monaco-grand-prix-edit",
        price: 48000,
        originalPrice: 53000,
        category: "knitwear",
        color: "White & Navy",
        colorHex: "#000080",
        description: "White Tipped Knit Polo, Navy Trousers, Suede Loafers.",
        image_prompt: "White knit polo with navy tipping, navy blue tailored trousers, navy suede loafers.",
        dir: "current",
        heroImage: "monaco_hero_1779428682995.png",
        flatImage: "monaco_flat_1779428709567.png"
    },
    {
        title: "The Tulum Eco-Luxe Edit",
        slug: "the-tulum-eco-luxe-edit",
        price: 39000,
        originalPrice: 44000,
        category: "shirting",
        color: "Beige & Olive",
        colorHex: "#808000",
        description: "Beige Linen Shirt, Olive Drawstring Trousers, Leather Sandals.",
        image_prompt: "Beige linen shirt, olive green drawstring linen trousers, dark brown leather gladiator sandals.",
        dir: "current",
        heroImage: "tulum_hero_1779428732004.png",
        flatImage: "tulum_flat_1779428757773.png"
    },

    // c3de Products (Summer Collection Round 4 & Lounge Expansion)
    {
        title: "The Lake Como Villa Edit",
        slug: "the-lake-como-villa-edit",
        price: 52000,
        originalPrice: 57000,
        category: "shirting",
        color: "Stone & White",
        colorHex: "#D2B48C",
        description: "Stone Linen Suit, White Dress Shirt, Loafers.",
        image_prompt: "Stone-colored linen suit (blazer and trousers), crisp white dress shirt, dark brown leather loafers.",
        dir: "c3de",
        heroImage: "hero_lake_como_villa_1770413155250.png",
        flatImage: "flat_lake_como_villa_1770413170290.png"
    },
    {
        title: "The Ibiza Boho Edit",
        slug: "the-ibiza-boho-edit",
        price: 35000,
        originalPrice: 40000,
        category: "shirting",
        color: "White & Beige",
        colorHex: "#F5F5DC",
        description: "White Kurta Shirt, Beige Linen Drawstring Pants, Sandals.",
        image_prompt: "White kurta-style shirt, beige linen drawstring pants, leather sandals.",
        dir: "c3de",
        heroImage: "hero_ibiza_boho_1770413188530.png",
        flatImage: "flat_ibiza_boho_1770413203113.png"
    },
    {
        title: "The Maldives Resort Edit",
        slug: "the-maldives-resort-edit",
        price: 37000,
        originalPrice: 42000,
        category: "shirting",
        color: "Multi & White",
        colorHex: "#00CED1",
        description: "Tropical Print Silk Shirt, White Tailored Shorts, Slides.",
        image_prompt: "Tropical print silk shirt, white tailored shorts, slides.",
        dir: "c3de",
        heroImage: "hero_maldives_resort_1770413220425.png",
        flatImage: "flat_maldives_resort_1770413236714.png"
    },
    {
        title: "The Cabana Terry Set",
        slug: "the-cabana-terry-set",
        price: 28000,
        originalPrice: 33000,
        category: "lounge",
        color: "Navy Monochrome",
        colorHex: "#000080",
        description: "Navy Blue Terry Cloth Polo, Navy Terry Shorts, Video Leather Sneakers.",
        image_prompt: "Navy Blue Terry Cloth Polo, Navy Terry Cloth Shorts, and white leather sneakers.",
        dir: "c3de",
        heroImage: "hero_cabana_terry_1770419773167.png",
        flatImage: "flat_cabana_terry_1770419786098.png"
    },
    {
        title: "The Sunset Swim Edit",
        slug: "the-sunset-swim-edit",
        price: 32000,
        originalPrice: 37000,
        category: "lounge",
        color: "Multi & White",
        colorHex: "#FF4500",
        description: "Geometric Print Swim Trunks, White Linen Shirt, Slides.",
        image_prompt: "Geometric Print Swim Trunks, White Linen Shirt, and slides.",
        dir: "c3de",
        heroImage: "hero_sunset_swim_1770420486367.png",
        flatImage: "flat_sunset_swim_1770420462243.png"
    },
    {
        title: "The Urban Explorer Edit",
        slug: "the-urban-explorer-edit",
        price: 24000,
        originalPrice: 29000,
        category: "lounge",
        color: "White & Olive",
        colorHex: "#556B2F",
        description: "Heavyweight White Cotton Tee, Olive Green Cargo Shorts, Chunky Sneakers.",
        image_prompt: "Heavyweight White Cotton Tee, Olive Green Cargo Shorts, and chunky sneakers.",
        dir: "c3de",
        heroImage: "hero_urban_explorer_1770420505052.png",
        flatImage: "flat_urban_explorer_1770420521489.png"
    }
];

// Special Basics Products (a209)
const BASICS_TO_RESTORE = [
    {
        title: "The Heavyweight Hoodie",
        slug: "the-heavyweight-hoodie",
        price: 3499,
        originalPrice: 4999,
        category: "knitwear",
        description: "Constructed from ultra-heavy 500 GSM loopback cotton fleece. Featuring a double-lined hood and a structured fit that holds its shape. No drawstrings for a clean, minimalist silhouette.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL", "XXL"],
        dir: "a209",
        variants: [
            { colorName: "Jet Black", colorHex: "#000000", imageFile: "heavyweight_hoodie_black_flat_1771028111881.png" },
            { colorName: "Heather Grey", colorHex: "#808080", imageFile: "heavyweight_hoodie_grey_flat_1771028125055.png" }
        ]
    },
    {
        title: "The Textured Knit Polo",
        slug: "the-textured-knit-polo",
        price: 2899,
        originalPrice: 3999,
        category: "knitwear",
        description: "A sophisticated take on casual. Knit from a premium cotton-silk blend with a distinct waffle texture. The open johnny collar adds a relaxed elegance perfect for evening layering.",
        sizeType: "clothing",
        sizes: ["S", "M", "L", "XL"],
        dir: "a209",
        variants: [
            { colorName: "Rich Cream", colorHex: "#F5F5DC", imageFile: "knit_polo_cream_flat_v2_1771028149807.png" },
            { colorName: "Deep Navy", colorHex: "#000080", imageFile: "knit_polo_navy_flat_v2_1771028167164.png" }
        ]
    }
];

async function uploadImage(dirKey: string, filename: string) {
    try {
        const dirPath = dirs[dirKey];
        if (!dirPath) throw new Error(`Unknown directory key: ${dirKey}`);
        const filePath = path.join(dirPath, filename);

        if (!fs.existsSync(filePath)) {
            console.error(`   ❌ Image file not found: ${filePath}`);
            return null;
        }

        const buffer = fs.readFileSync(filePath);
        const asset = await client.assets.upload('image', buffer, { filename });
        return asset._id;
    } catch (e) {
        console.error(`   ❌ Failed to upload image ${filename}:`, e);
        return null;
    }
}

async function restoreOutfits() {
    console.log("🚀 Restoring 20 outfit sets...");
    for (const p of PRODUCTS_TO_RESTORE) {
        console.log(`\n♻️ Processing Outfit: "${p.title}"`);

        try {
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: p.slug });
            if (existing) {
                console.log(`   ⏭️ Product already exists. Skipping...`);
                continue;
            }
        } catch (e) {
            console.error(`   ❌ Failed to check existence for ${p.title}:`, e);
        }

        // 1. Upload images
        console.log(`   Uploading Hero...`);
        const heroId = await uploadImage(p.dir, p.heroImage);
        console.log(`   Uploading Flat...`);
        const flatId = await uploadImage(p.dir, p.flatImage);

        if (!heroId || !flatId) {
            console.warn(`   ⚠️ Missing images for ${p.title}. Skipping...`);
            continue;
        }

        const discountLabel = `SAVE ₹${p.originalPrice - p.price}`;

        const doc: any = {
            _type: 'product',
            title: p.title,
            slug: { _type: 'slug', current: p.slug },
            price: p.price,
            originalPrice: p.originalPrice,
            description: p.description,
            category: p.category,
            gender: 'man',
            sizeType: 'clothing',
            sizes: ['S', 'M', 'L', 'XL'],
            variants: [
                {
                    _key: 'var1',
                    colorName: p.color,
                    colorHex: p.colorHex,
                    stock: 45,
                    images: [
                        { _type: 'image', asset: { _type: 'reference', _ref: heroId } },
                        { _type: 'image', asset: { _type: 'reference', _ref: flatId } }
                    ]
                }
            ],
            imagePromptNote: p.image_prompt,
            discountLabel
        };

        try {
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: p.slug });
            if (existing) {
                console.log(`   ⚠️ Document exists. Updating...`);
                await client.createOrReplace({ ...doc, _id: existing._id });
            } else {
                console.log(`   ✅ Creating new document...`);
                await client.create(doc);
            }
            console.log(`   ✨ Successfully processed: "${p.title}"`);
        } catch (e) {
            console.error(`   ❌ Failed to save "${p.title}":`, e);
        }
    }
}

async function restoreBasics() {
    console.log("\n🚀 Restoring 2 luxury basics...");
    for (const p of BASICS_TO_RESTORE) {
        console.log(`\n♻️ Processing Basic: "${p.title}"`);

        try {
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: p.slug });
            if (existing) {
                console.log(`   ⏭️ Product already exists. Skipping...`);
                continue;
            }
        } catch (e) {
            console.error(`   ❌ Failed to check existence for ${p.title}:`, e);
        }

        const processedVariants: any[] = [];
        const allImages: any[] = [];

        for (const variant of p.variants) {
            console.log(`   Uploading image for ${variant.colorName}: ${variant.imageFile}`);
            const assetId = await uploadImage(p.dir, variant.imageFile);

            if (!assetId) {
                console.warn(`   ⚠️ Missing image for variant ${variant.colorName}. Skipping variant.`);
                continue;
            }

            const imageRef = {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
            };

            processedVariants.push({
                colorName: variant.colorName,
                colorHex: variant.colorHex,
                stock: 75,
                images: [imageRef]
            });

            allImages.push(imageRef);
        }

        if (processedVariants.length === 0) {
            console.warn(`   ⚠️ No valid variants created for ${p.title}. Skipping...`);
            continue;
        }

        const discountLabel = `SAVE ₹${p.originalPrice - p.price}`;

        const doc: any = {
            _type: 'product',
            title: p.title,
            slug: { _type: 'slug', current: p.slug },
            price: p.price,
            originalPrice: p.originalPrice,
            description: p.description,
            category: p.category,
            gender: 'man',
            sizeType: p.sizeType,
            sizes: p.sizes,
            variants: processedVariants,
            images: allImages,
            discountLabel
        };

        try {
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: p.slug });
            if (existing) {
                console.log(`   ⚠️ Document exists. Updating...`);
                await client.createOrReplace({ ...doc, _id: existing._id });
            } else {
                console.log(`   ✅ Creating new document...`);
                await client.create(doc);
            }
            console.log(`   ✨ Successfully processed: "${p.title}"`);
        } catch (e) {
            console.error(`   ❌ Failed to save "${p.title}":`, e);
        }
    }
}

async function main() {
    console.log("🏁 Starting Restoration Process...");
    await restoreOutfits();
    await restoreBasics();
    console.log("\n🎉 All 22 items processed successfully!");
}

main().catch(console.error);
