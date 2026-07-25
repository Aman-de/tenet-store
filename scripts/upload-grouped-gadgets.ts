import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const MOBILES_DIR = '/Users/amansharma/Downloads/mobiles_optimized';
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
        console.error(`Failed to upload ${filePath}:`, err.message || err);
        return null;
    }
}

// Color Hex map
const COLOR_HEX_MAP: Record<string, string> = {
    "Cosmic Orange": "#E86A33",
    "Deep Blue": "#1E3A8A",
    "Silver": "#E5E7EB",
    "Natural Titanium": "#938E85",
    "White Titanium": "#F8FAFC",
    "Titanium": "#64748B",
    "Black": "#1E293B",
    "Black Titanium": "#1E293B",
    "Lavender": "#C084FC",
    "Mist Blue": "#7DD3FC",
    "Sage": "#84A98C",
    "White": "#FFFFFF",
    "Pink Gold": "#F43F5E",
    "Coral Red": "#EF4444",
    "Blue Black": "#0F172A",
    "Silver Shadow": "#94A3B8",
    "Blue": "#2563EB",
    "Green": "#10B981",
    "Almond Silver": "#CBD5E1",
    "Aston Blue": "#0284C7",
    "Cool Blue": "#7DD3FC",
    "Iron Gray": "#475569",
    "Midnight": "#0F172A",
    "Starlight": "#FEF08A",
    "Purple": "#A855F7",
    "Yellow": "#EAB308",
    "Orange": "#F97316",
    "Navy": "#1E3A8A",
    "Craft Black": "#1E293B",
    "Space Gray": "#475569",
    "Space Black": "#1E293B",
    "Solo Knit": "#E5E7EB",
    "Standard": "#1E293B"
};

// Define product sub-model specs & image directories in MOBILES_DIR
interface SubModelDef {
    name: string;
    folderPath: string; // Relative to MOBILES_DIR
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
    sizeType: 'clothing' | 'onesize';
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
                name: "iPhone 17e",
                folderPath: "Smartphones/Apple/iPhone 17e",
                price: 49900,
                originalPrice: 59900,
                discountLabel: "17% OFF",
                description: "Essential flagship performance with Apple Intelligence, A19 chip, and durable aluminium body."
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
                description: "Expansive 6.7-inch QHD+ Dynamic AMOLED 2X display with 4900mAh battery and Armor Aluminum frame."
            },
            {
                name: "Galaxy S25",
                folderPath: "Smartphones/Samsung/Galaxy S25",
                price: 67900,
                originalPrice: 79900,
                discountLabel: "15% OFF",
                description: "Compact flagship design with Galaxy AI live translate, Circle to Search, and pro-grade nightography."
            }
        ]
    },
    {
        id: "gadget-galaxy-z-fold-series",
        title: "Samsung Galaxy Z Fold Series",
        slug: "samsung-galaxy-z-fold-series",
        description: "Ultra-thin foldable powerhouse with dual AMOLED displays, Flex Mode multi-tasking, Galaxy AI features, and reinforced Armor Aluminum hinge.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB", "1TB"],
        models: [
            {
                name: "Galaxy Z Fold6",
                folderPath: "Smartphones/Samsung/Galaxy Z Fold6",
                price: 144900,
                originalPrice: 164900,
                discountLabel: "12% OFF",
                description: "Dual screen foldable design with 7.6-inch main screen, S-Pen compatibility, and IP48 water resistance."
            }
        ]
    },
    {
        id: "gadget-oneplus-12-series",
        title: "OnePlus 12 Series",
        slug: "oneplus-12-series",
        description: "Smooth Beyond Belief flagship performance with 4th Gen Hasselblad Camera for Mobile, 100W SUPERVOOC fast charging, and 2K 120Hz ProXDR display.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB", "1TB"],
        models: [
            {
                name: "OnePlus 12",
                folderPath: "Smartphones/OnePlus/OnePlus 12",
                price: 54900,
                originalPrice: 64900,
                discountLabel: "15% OFF",
                description: "Snapdragon 8 Gen 3, 50MP Sony LYT-808 main sensor, 64MP periscope telephoto, and 5400mAh battery."
            },
            {
                name: "OnePlus 12R",
                folderPath: "Smartphones/OnePlus/OnePlus 12R",
                price: 33900,
                originalPrice: 39900,
                discountLabel: "15% OFF",
                description: "Performance powerhouse with 4th-gen LTPO 120Hz display, Snapdragon 8 Gen 2, and 5500mAh battery."
            }
        ]
    },
    {
        id: "gadget-xiaomi-14-ultra-series",
        title: "Xiaomi 14 Ultra",
        slug: "xiaomi-14-ultra",
        description: "Co-engineered with Leica. Quad 50MP camera array with stepless variable aperture, 1-inch sensor, 8K video, and Snapdragon 8 Gen 3 performance.",
        sizeType: "clothing",
        sizes: ["256GB", "512GB"],
        models: [
            {
                name: "Xiaomi 14 Ultra",
                folderPath: "Smartphones/Xiaomi/Xiaomi 14 Ultra",
                price: 79900,
                originalPrice: 99900,
                discountLabel: "20% OFF",
                description: "Leica Summilux optical lens, 1-inch LYT-900 sensor, 90W HyperCharge, and WQHD+ AMOLED screen."
            }
        ]
    },
    {
        id: "gadget-mac-lineup",
        title: "Apple Mac Lineup",
        slug: "apple-mac-lineup",
        description: "High-performance Apple Silicon workstations and laptops powered by M3/M4 chips, Liquid Retina XDR displays, silent fanless thermal design, and all-day battery life.",
        sizeType: "clothing",
        sizes: ["256GB Unified", "512GB Unified", "1TB Unified", "2TB Unified"],
        models: [
            {
                name: "MacBook Pro",
                folderPath: "Other Electronic Devices/Apple Computers/MacBook Pro",
                price: 149900,
                originalPrice: 169900,
                discountLabel: "12% OFF",
                description: "Liquid Retina XDR display, up to 22 hours battery life, HDMI, SDXC, and MagSafe 3 connectivity."
            },
            {
                name: "MacBook Air",
                folderPath: "Other Electronic Devices/Apple Computers/MacBook Air",
                price: 94900,
                originalPrice: 114900,
                discountLabel: "17% OFF",
                description: "Ultra-thin 11.3mm fanless aluminium design, M3 chip speed, Liquid Retina display, and 18-hour battery."
            },
            {
                name: "iMac 24\"",
                folderPath: "Other Electronic Devices/Apple Computers/iMac",
                price: 119900,
                originalPrice: 134900,
                discountLabel: "11% OFF",
                description: "All-in-one desktop featuring 4.5K Retina display, 1080p FaceTime HD camera, and 6-speaker sound system."
            },
            {
                name: "Mac Studio",
                folderPath: "Other Electronic Devices/Apple Computers/Mac Studio",
                price: 189900,
                originalPrice: 209900,
                discountLabel: "10% OFF",
                description: "Compact desktop workstation with massive thermal headroom, Thunderbolt 4 ports, and M2 Max/Ultra power."
            },
            {
                name: "Mac mini",
                folderPath: "Other Electronic Devices/Apple Computers/Mac mini",
                price: 49900,
                originalPrice: 59900,
                discountLabel: "17% OFF",
                description: "Ultra-compact 5x5 inch desktop design with front USB-C ports, HDMI, and M4 processing power."
            }
        ]
    },
    {
        id: "gadget-ipad-lineup",
        title: "Apple iPad Lineup",
        slug: "apple-ipad-lineup",
        description: "Versatile iPad ecosystem featuring Ultra Retina XDR Tandem OLED screens, M2/M4 chip performance, Apple Pencil Pro support, and thin lightweight unibody enclosure.",
        sizeType: "clothing",
        sizes: ["128GB", "256GB", "512GB", "1TB"],
        models: [
            {
                name: "iPad Pro",
                folderPath: "Other Electronic Devices/Apple Tablets/iPad Pro",
                price: 87900,
                originalPrice: 99900,
                discountLabel: "12% OFF",
                description: "Thinnest Apple product ever with Ultra Retina XDR OLED screen, M4 chip, and Apple Pencil Pro support."
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
    }
];

async function main() {
    console.log('🚀 Starting Grouped Gadgets Catalog Refresher...');

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
        let mainFallbackImageId: string | null = null;

        for (const sub of lineup.models) {
            console.log(`  -> Processing sub-model: "${sub.name}" (${sub.folderPath})`);
            const subFullPath = path.join(MOBILES_DIR, sub.folderPath);
            const colorsPath = path.join(subFullPath, 'Colors');
            const genPath = path.join(subFullPath, 'General & Features');

            // Find sub-model option image
            let subModelImageId: string | null = null;

            // Process Sub-Model Color Variants
            const subVariants = [];
            if (fs.existsSync(colorsPath)) {
                const cEntries = fs.readdirSync(colorsPath, { withFileTypes: true });
                for (const cEntry of cEntries) {
                    if (cEntry.name.startsWith('.')) continue;
                    const cFullPath = path.join(colorsPath, cEntry.name);
                    if (cEntry.isDirectory()) {
                        const imgs = fs.readdirSync(cFullPath)
                            .filter(f => !f.startsWith('.') && /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
                            .map(f => path.join(cFullPath, f));

                        const selectedImgs = imgs.slice(0, 4);
                        const uploadedIds = (await Promise.all(selectedImgs.map(p => uploadImageToSanity(p)))).filter((id): id is string => id !== null);
                        for (const id of uploadedIds) {
                            if (!subModelImageId) subModelImageId = id;
                            if (!mainFallbackImageId) mainFallbackImageId = id;
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

            // Feature images for sub-model fallback
            const featureIds: string[] = [];
            if (fs.existsSync(genPath)) {
                const genFiles = fs.readdirSync(genPath)
                    .filter(f => !f.startsWith('.') && /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
                    .map(f => path.join(genPath, f));
                const cleanGenFiles = genFiles.filter(f => !f.includes('-mo.') && !f.includes('-tb.') && !f.includes('_small')).slice(0, 5);
                const toUpload = cleanGenFiles.length > 0 ? cleanGenFiles : genFiles.slice(0, 5);

                const featureIds = (await Promise.all(toUpload.map(p => uploadImageToSanity(p)))).filter((id): id is string => id !== null);
                for (const id of featureIds) {
                    if (!subModelImageId) subModelImageId = id;
                    if (!mainFallbackImageId) mainFallbackImageId = id;
                }
            }

            // Fallback variant if no colors found
            if (subVariants.length === 0 && featureIds.length > 0) {
                subVariants.push({
                    colorName: "Standard",
                    colorHex: { _type: 'color', hex: "#1E293B" },
                    images: featureIds.slice(0, 4).map(id => ({ _type: 'image', _key: Math.random().toString(36).substring(2, 9), asset: { _type: 'reference', _ref: id } }))
                });
                if (!lineupVariantsMap.has("Standard")) {
                    lineupVariantsMap.set("Standard", { colorName: "Standard", colorHex: "#1E293B", images: featureIds });
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
            gadgetModels: sanityGadgetModels
        };

        try {
            await client.createOrReplace(doc);
            console.log(`  ✅ Successfully published Lineup: "${lineup.title}" (${sanityGadgetModels.length} models)`);
        } catch (e: any) {
            console.error(`  ❌ Failed to save lineup ${lineup.title}:`, e.message || e);
        }
    }

    console.log('\n🎉 ALL GROUPED GADGET LINEUPS PUBLISHED TO SANITY!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
