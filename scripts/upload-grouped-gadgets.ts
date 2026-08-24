import { createClient } from 'next-sanity';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MOBILES_DIR = '/Users/amansharma/Downloads/mobiles_transparent';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9zyx0aef',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

// Hex color mapping — comprehensive list of all color folder names
const COLOR_HEX_MAP: Record<string, string> = {
    "Black": "#1C1C1E",
    "Desert Titanium": "#C5B29D",
    "Natural Titanium": "#A09E9B",
    "White Titanium": "#E8E6E1",
    "White": "#F2F2F2",
    "Dark Blue": "#192841",
    "Deep Blue": "#1B3A5C",
    "Sky Blue": "#7BA7D7",
    "Mist Blue": "#B0C4D8",
    "Aston Blue": "#3B5998",
    "Blue": "#4A7FBF",
    "Mint Green": "#A8D8C8",
    "Green": "#5A8A5C",
    "Sage": "#9CAF88",
    "Lavender": "#D6C7E8",
    "Purple": "#7B5EA7",
    "Silver": "#E3E4E5",
    "Silver Shadow": "#C0C0C0",
    "Almond Silver": "#D5C9B8",
    "Pink": "#F4C2C2",
    "Pink Gold": "#E8C5B0",
    "Light Gold": "#E8D5B7",
    "Coral Red": "#E0534C",
    "Cosmic Orange": "#D97A3E",
    "Orange": "#E8873D",
    "Blue Black": "#1A2332",
    "Icy Blue": "#A2C4D9",
    "Titanium": "#8E8E93",
    "Yellow": "#F9E076",
    "Ultramarine": "#34495E",
    "Teal": "#20B2AA",
    "Space Gray": "#4A4A4A",
    "Space Black": "#111111",
    "Starlight": "#F5F2EB",
    "Midnight": "#171E27",
    "Gold": "#E5D3B3",
    "Deep Purple": "#4B3859"
};

// Filename patterns to EXCLUDE from product images & feature banners
// These are Apple Store marketing / exchange / trade-in / accessory images
const EXCLUDED_PATTERNS = [
    'trade_in', 'trade-in', 'tradein',
    'exchange',
    'incentive',
    'compare',
    'witb',               // "what's in the box"
    'what_in_box', 'whats_in_box',
    'techwoven',          // case accessory
    'silicone_case', 'clear_case', 'wallet',
    'case_techwoven', 'case_silicone', 'case_clear',
    'specs_loader',       // loading placeholder
    'loader__',
    'personal_session',
    'apple_store',
    'store_app',
    'education',
    'incentive_card',
    'incentive_support',
    'incentive_setup',
    'incentive_customize',
    'delivery_and_pickup',
    'apps_amazon',        // third-party app screenshots
    'finish-white-202409', // tiny swatch dots
    'finish-black-202409',
    'swatch',
    '_small',
];

/** Returns true if the file should be EXCLUDED from upload */
function shouldExcludeImage(filePath: string): boolean {
    const lower = path.basename(filePath).toLowerCase();
    
    // Size check: Exclude tiny swatch dots / icon thumbnails (< 20KB)
    try {
        if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            if (stat.size < 20 * 1024) return true; // Less than 20KB
        }
    } catch (e) {}

    return EXCLUDED_PATTERNS.some(pat => lower.includes(pat));
}

const assetCache = new Map<string, string>();

async function uploadImageToSanity(filePath: string): Promise<string | null> {
    if (!fs.existsSync(filePath)) return null;

    if (assetCache.has(filePath)) {
        return assetCache.get(filePath)!;
    }

    try {
        const fileBuffer = fs.readFileSync(filePath);
        const asset = await client.assets.upload('image', fileBuffer, {
            filename: path.basename(filePath)
        });

        if (asset && (asset as any)._id) {
            assetCache.set(filePath, (asset as any)._id);
            return (asset as any)._id;
        }
        return null;
    } catch (e: any) {
        console.error(`Failed to upload ${path.basename(filePath)}:`, e.message || e);
        return null;
    }
}

interface SubModelDef {
    name: string;
    folderPath: string;
    price: number;
    originalPrice: number;
    discountLabel: string;
    description: string;
}

interface GroupedLineupDef {
    id: string;
    title: string;
    slug: string;
    description: string;
    sizeType: string;
    sizes: string[];
    models: SubModelDef[];
}

const LINEUPS: GroupedLineupDef[] = [
    {
        id: "gadget-iphone-17-series",
        title: "iPhone 17 Series",
        slug: "iphone-17-series",
        description: "Next-generation Apple flagship smartphone lineup featuring the A19 & A19 Pro chip, ultra-durable Titanium / Ceramic Shield build, Action & Camera Control buttons, and advanced Pro camera system.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB", "1TB"],
        models: [
            {
                name: "iPhone 17 Pro",
                folderPath: "Smartphones/Apple/iPhone 17 Pro",
                price: 119900,
                originalPrice: 134900,
                discountLabel: "11% OFF",
                description: "Aerospace-grade titanium design with A19 Pro chip, 48MP Fusion Camera system, and ProMotion 120Hz display."
            },
            {
                name: "iPhone 17 Air",
                folderPath: "Smartphones/Apple/iPhone 17 Air",
                price: 89900,
                originalPrice: 99900,
                discountLabel: "10% OFF",
                description: "Ultrathin luxury profile with lightweight titanium enclosure and Ceramic Shield front cover."
            },
            {
                name: "iPhone 17",
                folderPath: "Smartphones/Apple/iPhone 17",
                price: 69900,
                originalPrice: 79900,
                discountLabel: "13% OFF",
                description: "Vibrant color-infused glass back, dual camera system with 2x Telephoto, and all-day battery life."
            },
            {
                name: "iPhone 17 Pro Max",
                folderPath: "Smartphones/Apple/iPhone 17 Pro Max",
                price: 144900,
                originalPrice: 159900,
                discountLabel: "9% OFF",
                description: "The largest Pro display — 6.9-inch Super Retina XDR, A19 Pro chip, advanced 48MP camera system, and all-day battery life."
            }
        ]
    },
    {
        id: "gadget-iphone-pro-series",
        title: "iPhone Pro & Premium Series",
        slug: "iphone-pro-series",
        description: "Flagship titanium iPhone lineup with Super Retina XDR ProMotion, A17/A18 Pro silicon, Pro camera video recording, and USB-C USB 3 speeds.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB", "1TB"],
        models: [
            {
                name: "iPhone 16 Pro",
                folderPath: "Smartphones/Apple/iPhone 16 & 16 Pro",
                price: 99900,
                originalPrice: 119900,
                discountLabel: "17% OFF",
                description: "Pro camera system with 5x Telephoto optical zoom, 4K 120 fps Dolby Vision, and Action Button."
            },
            {
                name: "iPhone 15 Pro",
                folderPath: "Smartphones/Apple/iPhone 15 Pro",
                price: 109900,
                originalPrice: 134900,
                discountLabel: "19% OFF",
                description: "Strong and lightweight titanium design with A17 Pro chip and customizable Action button."
            }
        ]
    },
    {
        id: "gadget-galaxy-s25-series",
        title: "Samsung Galaxy S25 Series",
        slug: "samsung-galaxy-s25-series",
        description: "Ultimate AI-powered flagship smartphones with Snapdragon 8 Elite, ProVisual Engine 200MP camera system, built-in S-Pen, and Armor Aluminum / Titanium frame.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB", "1TB"],
        models: [
            {
                name: "Galaxy S25 Ultra",
                folderPath: "Smartphones/Samsung/Galaxy S25 Ultra",
                price: 112900,
                originalPrice: 129900,
                discountLabel: "13% OFF",
                description: "200MP camera with ProVisual AI Engine, built-in S Pen, Titanium frame, and Snapdragon 8 Elite."
            },
            {
                name: "Galaxy S25 Plus",
                folderPath: "Smartphones/Samsung/Galaxy S25 Plus",
                price: 84900,
                originalPrice: 99900,
                discountLabel: "15% OFF",
                description: "Dynamic AMOLED 2X QHD+ 120Hz display, Galaxy AI suite, 4900mAh battery, and Armor Aluminum 2.0."
            },
            {
                name: "Galaxy S25",
                folderPath: "Smartphones/Samsung/Galaxy S25",
                price: 64900,
                originalPrice: 74900,
                discountLabel: "13% OFF",
                description: "Compact flagship with Snapdragon 8 Elite, Circle to Search AI, 50MP triple camera system."
            }
        ]
    },
    {
        id: "gadget-galaxy-z-fold-series",
        title: "Samsung Galaxy Z Fold Series",
        slug: "samsung-galaxy-z-fold-series",
        description: "Next-generation foldable innovation featuring dual Dynamic AMOLED 2X displays, FlexMode multitasking, S-Pen support, and Armor Aluminum hinges.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB", "1TB"],
        models: [
            {
                name: "Galaxy Z Fold6",
                folderPath: "Smartphones/Samsung/Galaxy Z Fold6",
                price: 139900,
                originalPrice: 164900,
                discountLabel: "15% OFF",
                description: "Ultra-slim foldable display with Ray Tracing gaming performance, Galaxy AI Note Assist, and 50MP FlexCam."
            }
        ]
    },
    {
        id: "gadget-oneplus-12-series",
        title: "OnePlus 12 Series",
        slug: "oneplus-12-series",
        description: "Flagship performance powerhouse with Snapdragon 8 Gen 3, Hasselblad 4th Gen Camera for Mobile, 2K 120Hz ProXDR display, and 100W SUPERVOOC charging.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB"],
        models: [
            {
                name: "OnePlus 12",
                folderPath: "Smartphones/OnePlus/OnePlus 12",
                price: 54900,
                originalPrice: 64900,
                discountLabel: "15% OFF",
                description: "Hasselblad Camera system with 64MP Periscope Telephoto, Snapdragon 8 Gen 3, and Dual Cryo-velocity VC cooling."
            },
            {
                name: "OnePlus 12R",
                folderPath: "Smartphones/OnePlus/OnePlus 12R",
                price: 35900,
                originalPrice: 42900,
                discountLabel: "16% OFF",
                description: "Performance king with 5500mAh largest OnePlus battery, 4th Gen LTPO 120Hz display, and 50MP Sony IMX890 camera."
            }
        ]
    },
    {
        id: "gadget-xiaomi-14-ultra-series",
        title: "Xiaomi 14 Ultra",
        slug: "xiaomi-14-ultra",
        description: "Professional photography flagship with Leica Quad Camera system, 1-inch Sony LYT-900 sensor, All-Around Liquid Display, and Xiaomi Guardian Structure.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB"],
        models: [
            {
                name: "Xiaomi 14 Ultra",
                folderPath: "Smartphones/Xiaomi/Xiaomi 14 Ultra",
                price: 89900,
                originalPrice: 99900,
                discountLabel: "10% OFF",
                description: "Leica Summilux optical lens, stepless variable aperture f/1.63-f/4.0, Snapdragon 8 Gen 3, and 90W HyperCharge."
            }
        ]
    },
    {
        id: "gadget-mac-lineup",
        title: "Apple Mac Lineup",
        slug: "apple-mac-lineup",
        description: "Ultimate workstation lineup powered by Apple M3, M3 Pro, M3 Max & M4 silicon, Liquid Retina XDR displays, and up to 22-hour battery life.",
        sizeType: "clothing",
        sizes: ["256GB Unified", "512GB Unified", "1TB Unified", "2TB Unified"],
        models: [
            {
                name: "MacBook Pro",
                folderPath: "Other Electronic Devices/Apple Computers/MacBook Pro",
                price: 149900,
                originalPrice: 169900,
                discountLabel: "12% OFF",
                description: "M3 Pro/Max chip performance, Liquid Retina XDR screen, 6-speaker sound system, and Studio-quality mics."
            },
            {
                name: "MacBook Air",
                folderPath: "Other Electronic Devices/Apple Computers/MacBook Air",
                price: 94900,
                originalPrice: 104900,
                discountLabel: "10% OFF",
                description: "Incredibly thin fanless design with M3 chip, 13.6-inch or 15.3-inch Liquid Retina display, and MagSafe charging."
            },
            {
                name: "iMac 24\"",
                folderPath: "Other Electronic Devices/Apple Computers/iMac",
                price: 119900,
                originalPrice: 134900,
                discountLabel: "11% OFF",
                description: "Striking 24-inch 4.5K Retina display all-in-one desktop with M3 chip and matching Magic Keyboard/Mouse."
            },
            {
                name: "Mac Studio",
                folderPath: "Other Electronic Devices/Apple Computers/Mac Studio",
                price: 189900,
                originalPrice: 209900,
                discountLabel: "10% OFF",
                description: "Extremely compact pro desktop with M2 Max / M2 Ultra chip, extensive connectivity, and whisper-quiet cooling."
            },
            {
                name: "Mac mini",
                folderPath: "Other Electronic Devices/Apple Computers/Mac mini",
                price: 54900,
                originalPrice: 59900,
                discountLabel: "8% OFF",
                description: "Versatile mini desktop powered by M4 silicon, Thunderbolt 5 ports, and compact square footprint."
            }
        ]
    },
    {
        id: "gadget-ipad-lineup",
        title: "Apple iPad Lineup",
        slug: "apple-ipad-lineup",
        description: "Versatile iPad tablet lineup featuring Ultra Retina XDR Tandem OLED, M4 performance, Apple Pencil Pro support, and thin aluminum unibody.",
        sizeType: "clothing",
        sizes: ["128GB", "256GB", "512GB", "1TB"],
        models: [
            {
                name: "iPad Pro",
                folderPath: "Other Electronic Devices/Apple Tablets/iPad Pro",
                price: 89900,
                originalPrice: 99900,
                discountLabel: "10% OFF",
                description: "Breakthrough M4 processor, Ultra Retina XDR Tandem OLED screen, thin 5.1mm chassis, and Thunderbolt USB 4."
            },
            {
                name: "iPad Air",
                folderPath: "Other Electronic Devices/Apple Tablets/iPad Air",
                price: 51900,
                originalPrice: 59900,
                discountLabel: "13% OFF",
                description: "Powered by M2 chip, Liquid Retina display, landscape 12MP front camera, and Touch ID."
            },
            {
                name: "iPad mini",
                folderPath: "Other Electronic Devices/Apple Tablets/iPad mini",
                price: 42900,
                originalPrice: 49900,
                discountLabel: "14% OFF",
                description: "Ultra-portable 8.3-inch Liquid Retina screen, A17 Pro chip, Apple Pencil Pro, and USB-C port."
            }
        ]
    },
    {
        id: "gadget-airpods-audio-lineup",
        title: "Apple AirPods & HomePod Audio",
        slug: "apple-airpods-audio-lineup",
        description: "Immersive spatial audio ecosystem with Active Noise Cancellation, Transparency mode, Custom H2 acoustic chips, and precision room-tuning audio drivers.",
        sizeType: "onesize",
        sizes: [],
        models: [
            {
                name: "AirPods Max",
                folderPath: "Other Electronic Devices/Apple Audio & Wearables/AirPods Max",
                price: 49900,
                originalPrice: 59900,
                discountLabel: "17% OFF",
                description: "Over-ear luxury headphones with custom acoustic design, H1 chips, active noise cancellation, and Spatial Audio."
            },
            {
                name: "AirPods Pro",
                folderPath: "Other Electronic Devices/Apple Audio & Wearables/AirPods Pro",
                price: 19900,
                originalPrice: 24900,
                discountLabel: "20% OFF",
                description: "In-ear wireless earbuds with 2x Active Noise Cancellation, Adaptive Audio, and MagSafe USB-C charging case."
            },
            {
                name: "AirPods 4",
                folderPath: "Other Electronic Devices/Apple Audio & Wearables/AirPods",
                price: 11900,
                originalPrice: 14900,
                discountLabel: "20% OFF",
                description: "Open-ear acoustic architecture with Personalized Spatial Audio, H2 chip, and sweat/water resistance."
            },
            {
                name: "HomePod",
                folderPath: "Other Electronic Devices/Apple Audio & Wearables/HomePod",
                price: 27900,
                originalPrice: 32900,
                discountLabel: "15% OFF",
                description: "High-fidelity smart speaker with room-sensing technology, spatial audio, and deep bass woofer."
            }
        ]
    },
    {
        id: "gadget-vision-watch-lineup",
        title: "Apple Vision Pro & Watch",
        slug: "apple-vision-watch-lineup",
        description: "Revolutionary spatial computing headset and advanced fitness/health smartwatches with high-resolution micro-OLED displays, eye/gesture tracking, and S9 SiP.",
        sizeType: "onesize",
        sizes: [],
        models: [
            {
                name: "Vision Pro",
                folderPath: "Other Electronic Devices/Apple Audio & Wearables/Vision Pro",
                price: 319900,
                originalPrice: 349900,
                discountLabel: "9% OFF",
                description: "Spatial computer seamlessly blending digital content with physical space using 23 million micro-OLED pixels."
            },
            {
                name: "Apple Watch SE",
                folderPath: "Other Electronic Devices/Apple Audio & Wearables/Apple Watch SE",
                price: 24900,
                originalPrice: 29900,
                discountLabel: "17% OFF",
                description: "Fitness tracking, heart rate notifications, Crash Detection, and Retina display in a lightweight aluminum case."
            }
        ]
    },
    {
        id: "gadget-apple-accessories",
        title: "Apple & Smartphone Accessories",
        slug: "apple-smartphone-accessories",
        description: "Official fast charging adapters, MagSafe wireless chargers, and premium protective cases for your smartphone and Apple devices.",
        sizeType: "onesize",
        sizes: [],
        models: [
            {
                name: "Apple 30W USB-C Power Adapter & Cable",
                folderPath: "Smartphones/Apple/iPhone 16 & 16 Pro",
                price: 1900,
                originalPrice: 2490,
                discountLabel: "24% OFF",
                description: "Fast charge your iPhone, iPad, or Mac up to 50% in 30 minutes with official Apple USB-C power delivery."
            },
            {
                name: "Apple MagSafe 15W Wireless Charger",
                folderPath: "Smartphones/Apple/iPhone 17 Air",
                price: 2900,
                originalPrice: 3900,
                discountLabel: "26% OFF",
                description: "Perfectly aligned magnetic wireless charging for iPhone with up to 15W fast power transfer."
            },
            {
                name: "Ultra TechWoven MagSafe Protective Case",
                folderPath: "Smartphones/Apple/iPhone 17 Pro",
                price: 1490,
                originalPrice: 2490,
                discountLabel: "40% OFF",
                description: "Durable microtwill woven fabric case with built-in MagSafe magnets and tactile aluminum buttons."
            }
        ]
    }
];

async function main() {
    console.log('🚀 Starting Grouped Gadgets Catalog Refresher with Transparent 3:4 Studio Images & Wide Banners...');

    // 1. Wipe current gadgets in Sanity
    console.log('🧹 Wiping old gadgets from Sanity...');
    const existing = await client.fetch<Array<{ _id: string }>>('*[_type == "product" && (category == "gadgets" || category == "electronics")]{_id}');
    for (const item of existing) {
        try {
            await client.delete(item._id);
        } catch (e) {}
    }

    console.log(`Cleared ${existing.length} existing documents.`);

    // 2. Process each Grouped Lineup
    for (let i = 0; i < LINEUPS.length; i++) {
        const lineup = LINEUPS[i];
        console.log(`\n[${i + 1}/${LINEUPS.length}] Creating Lineup: "${lineup.title}"`);

        const sanityGadgetModels = [];
        const lineupVariantsMap = new Map<string, { colorName: string; colorHex: string; images: string[] }>();
        const lineupFeatureImageIds: string[] = [];

        for (const sub of lineup.models) {
            console.log(`  -> Processing sub-model: "${sub.name}" (${sub.folderPath})`);
            const subFullPath = path.join(MOBILES_DIR, sub.folderPath);
            const colorsPath = path.join(subFullPath, 'Colors');
            const genPath = path.join(subFullPath, 'General & Features');

            // Find sub-model option image (prioritize multi-color / full-device lineup images)
            let subModelImageId: string | null = null;
            let heroImageCandidate: string | null = null;

            if (fs.existsSync(genPath)) {
                const genFiles = fs.readdirSync(genPath)
                    .filter(f => !f.startsWith('.') && /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
                    .filter(f => !shouldExcludeImage(f))   // ← EXCLUDE exchange/trade-in/case images
                    .map(f => path.join(genPath, f));

                // Find image showing full device or all colors together
                const multiColorImg = genFiles.find(f => {
                    const l = path.basename(f).toLowerCase();
                    return l.includes('colors') || l.includes('all-colors') || l.includes('lineup') || l.includes('overview') || l.includes('kv') || l.includes('hero');
                });

                if (multiColorImg) {
                    heroImageCandidate = multiColorImg;
                } else if (genFiles.length > 0) {
                    heroImageCandidate = genFiles[0];
                }

                if (heroImageCandidate) {
                    subModelImageId = await uploadImageToSanity(heroImageCandidate);
                }

                // Process wide feature & description banners (exclude small images)
                const bannerFiles = genFiles
                    .filter(f => !path.basename(f).includes('_small'))
                    .slice(0, 8);
                const uploadedBanners: string[] = [];
                for (const p of bannerFiles) {
                    const id = await uploadImageToSanity(p);
                    if (id) uploadedBanners.push(id);
                }
                lineupFeatureImageIds.push(...uploadedBanners);
            }

            // Process Sub-Model Color Variants (3:4 Transparent Studio Cutouts)
            const subVariants = [];
            if (fs.existsSync(colorsPath)) {
                const cEntries = fs.readdirSync(colorsPath, { withFileTypes: true });
                for (const cEntry of cEntries) {
                    if (cEntry.name.startsWith('.')) continue;
                    const cFullPath = path.join(colorsPath, cEntry.name);
                    if (cEntry.isDirectory()) {
                        const imgs = fs.readdirSync(cFullPath)
                            .filter(f => !f.startsWith('.') && /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
                            .filter(f => !shouldExcludeImage(f))   // ← EXCLUDE exchange/trade-in/case images
                            .sort((a, b) => {
                                // Prioritize good product photos: front hero → three-quarter → finish-select → flat-back → gallery
                                const priority = (name: string) => {
                                    const l = name.toLowerCase();
                                    if (l.includes('hero_banner') || l.includes('front-hero') || l.includes('01-front')) return 0;
                                    if (l.includes('three-quarter') || l.includes('05-three') || l.includes('hero_3x4')) return 1;
                                    if (l.includes('finish-select') && !l.includes('_av')) return 2;
                                    if (l.includes('flat_back')) return 3;
                                    if (l.includes('color_static') || l.includes('colors_')) return 4;
                                    if (l.includes('feature_description') && (l.includes('side') || l.includes('back'))) return 5;
                                    if (l.includes('product_gallery')) return 6;
                                    return 10;
                                };
                                return priority(a) - priority(b);
                            })
                            .map(f => path.join(cFullPath, f));

                        const selectedImgs = imgs.slice(0, 4);
                        const uploadedIds: string[] = [];
                        for (const p of selectedImgs) {
                            const id = await uploadImageToSanity(p);
                            if (id) uploadedIds.push(id);
                        }
                        if (!subModelImageId && uploadedIds.length > 0) {
                            subModelImageId = uploadedIds[0];
                        }

                        if (uploadedIds.length > 0) {
                            const hex = COLOR_HEX_MAP[cEntry.name] || "#64748B";
                            subVariants.push({
                                colorName: cEntry.name,
                                colorHex: { _type: 'color', hex },
                                images: uploadedIds.map(id => ({ _type: 'image', _key: Math.random().toString(36).substring(2, 9), asset: { _type: 'reference', _ref: id } }))
                            });

                            if (!lineupVariantsMap.has(cEntry.name)) {
                                lineupVariantsMap.set(cEntry.name, { colorName: cEntry.name, colorHex: hex, images: uploadedIds });
                            }
                        }
                    }
                }
            }

            sanityGadgetModels.push({
                name: sub.name,
                price: sub.price,
                originalPrice: sub.originalPrice,
                discountLabel: sub.discountLabel,
                description: sub.description,
                image: subModelImageId ? { _type: 'image', asset: { _type: 'reference', _ref: subModelImageId } } : undefined,
                variants: subVariants
            });
        }

        // Build top-level lineup variants array
        const lineupVariants = Array.from(lineupVariantsMap.values()).map(v => ({
            colorName: v.colorName,
            colorHex: { _type: 'color', hex: v.colorHex },
            stock: 25,
            images: v.images.map(id => ({ _type: 'image', _key: Math.random().toString(36).substring(2, 9), asset: { _type: 'reference', _ref: id } }))
        }));

        const primaryModel = lineup.models[0];
        const uniqueFeatureIds = Array.from(new Set(lineupFeatureImageIds)).slice(0, 8);

        const doc = {
            _id: lineup.id,
            _type: 'product',
            title: lineup.title,
            slug: { _type: 'slug', current: lineup.slug },
            price: primaryModel.price,
            originalPrice: primaryModel.originalPrice,
            discountLabel: primaryModel.discountLabel,
            category: 'gadgets',
            gender: 'unisex',
            isBestSeller: i < 6,
            bestSellerRank: i < 6 ? i + 1 : undefined,
            isOutOfStock: false,
            description: lineup.description,
            sizeType: lineup.sizeType,
            sizes: lineup.sizes,
            variants: lineupVariants,
            gadgetModels: sanityGadgetModels,
            featureImages: uniqueFeatureIds.map(id => ({ _type: 'image', _key: Math.random().toString(36).substring(2, 9), asset: { _type: 'reference', _ref: id } }))
        };

        try {
            await client.createOrReplace(doc);
            console.log(`  ✅ Successfully published Lineup: "${lineup.title}" (${sanityGadgetModels.length} models, ${uniqueFeatureIds.length} feature banners)`);
        } catch (err: any) {
            console.error(`  ❌ Failed to publish Lineup "${lineup.title}":`, err.message || err);
        }
    }

    console.log('\n🎉 ALL GROUPED GADGET LINEUPS PUBLISHED TO SANITY WITH TRANSPARENT 3:4 STUDIO IMAGES!');
}

main().catch(console.error);
