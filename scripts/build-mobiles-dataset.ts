import fs from 'fs';
import path from 'path';

const MOBILES_DIR = '/Users/amansharma/Downloads/mobiles';

// Official pricing dictionary in INR
const PRICING_MAP: Record<string, { price: number; originalPrice: number; discountLabel: string }> = {
    "iPhone 17 Pro": { price: 119900, originalPrice: 134900, discountLabel: "11% OFF" },
    "iPhone 17": { price: 69900, originalPrice: 79900, discountLabel: "13% OFF" },
    "iPhone 17 Air": { price: 89900, originalPrice: 99900, discountLabel: "10% OFF" },
    "iPhone 17e": { price: 49900, originalPrice: 59900, discountLabel: "17% OFF" },
    "iPhone 15 Pro": { price: 109900, originalPrice: 134900, discountLabel: "19% OFF" },
    "iPhone 16 & 16 Pro": { price: 99900, originalPrice: 119900, discountLabel: "17% OFF" },
    "Galaxy S25 Ultra": { price: 112900, originalPrice: 129900, discountLabel: "13% OFF" },
    "Galaxy S25": { price: 67900, originalPrice: 79900, discountLabel: "15% OFF" },
    "Galaxy S25 Plus": { price: 84900, originalPrice: 99900, discountLabel: "15% OFF" },
    "Galaxy Z Fold6": { price: 144900, originalPrice: 164900, discountLabel: "12% OFF" },
    "OnePlus 12": { price: 54900, originalPrice: 64900, discountLabel: "15% OFF" },
    "OnePlus 12R": { price: 33900, originalPrice: 39900, discountLabel: "15% OFF" },
    "Xiaomi 14 Ultra": { price: 79900, originalPrice: 99900, discountLabel: "20% OFF" },
    "MacBook Pro": { price: 149900, originalPrice: 169900, discountLabel: "12% OFF" },
    "MacBook Air": { price: 94900, originalPrice: 114900, discountLabel: "17% OFF" },
    "iMac": { price: 119900, originalPrice: 134900, discountLabel: "11% OFF" },
    "Mac Studio": { price: 189900, originalPrice: 209900, discountLabel: "10% OFF" },
    "Mac mini": { price: 49900, originalPrice: 59900, discountLabel: "17% OFF" },
    "iPad Air": { price: 51900, originalPrice: 59900, discountLabel: "13% OFF" },
    "iPad Pro": { price: 87900, originalPrice: 99900, discountLabel: "12% OFF" },
    "iPad mini": { price: 42900, originalPrice: 49900, discountLabel: "14% OFF" },
    "Vision Pro": { price: 319900, originalPrice: 349900, discountLabel: "9% OFF" },
    "Apple Watch SE": { price: 24900, originalPrice: 29900, discountLabel: "17% OFF" },
    "HomePod": { price: 27900, originalPrice: 32900, discountLabel: "15% OFF" },
    "AirPods Max": { price: 49900, originalPrice: 59900, discountLabel: "17% OFF" },
    "AirPods Pro": { price: 19900, originalPrice: 24900, discountLabel: "20% OFF" },
    "AirPods": { price: 11900, originalPrice: 14900, discountLabel: "20% OFF" },
};

// Hex codes for color names
const COLOR_HEX_MAP: Record<string, string> = {
    "Cosmic Orange": "#E86A33",
    "Deep Blue": "#1E3A8A",
    "Silver": "#E5E7EB",
    "Natural Titanium": "#938E85",
    "White Titanium": "#F8FAFC",
    "Titanium": "#64748B",
    "Black": "#1E293B",
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
    "Midnight": "#0F172A",
    "Starlight": "#FEF08A",
    "Purple": "#A855F7",
    "Yellow": "#EAB308",
    "Orange": "#F97316",
};

interface MappedProduct {
    folderPath: string;
    productName: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number;
    discountLabel: string;
    description: string;
    sizeType: 'clothing' | 'onesize';
    sizes: string[];
    variants: {
        colorName: string;
        colorHex: string;
        imagePaths: string[];
    }[];
    featureImagePaths: string[];
    missingPhotosNote?: string;
}

export function buildCatalogDataset(): MappedProduct[] {
    const dataset: MappedProduct[] = [];

    function walkDir(currentPath: string) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        const hasColors = entries.some(e => e.isDirectory() && e.name === 'Colors');
        const hasGen = entries.some(e => e.isDirectory() && e.name === 'General & Features');

        if (hasColors || hasGen) {
            const prodName = path.basename(currentPath);
            const relPath = path.relative(MOBILES_DIR, currentPath);
            const parts = relPath.split(path.sep);
            const brand = parts.length > 1 ? parts[parts.length - 2] : "Apple";

            // Pricing
            const pricing = PRICING_MAP[prodName] || { price: 69900, originalPrice: 79900, discountLabel: "13% OFF" };

            // Determine sizeType and sizes
            let sizeType: 'clothing' | 'onesize' = 'clothing';
            let sizes = ['128GB', '256GB', '512GB', '1TB'];

            if (prodName.includes('MacBook') || prodName.includes('iMac') || prodName.includes('Studio')) {
                sizes = ['256GB Unified', '512GB Unified', '1TB Unified', '2TB Unified'];
            } else if (prodName.includes('Watch') || prodName.includes('AirPods') || prodName.includes('HomePod') || prodName.includes('Vision Pro')) {
                sizeType = 'onesize';
                sizes = [];
            }

            // Colors
            const colorsPath = path.join(currentPath, 'Colors');
            const genPath = path.join(currentPath, 'General & Features');

            const variants: { colorName: string; colorHex: string; imagePaths: string[] }[] = [];
            const missingNotes: string[] = [];

            if (fs.existsSync(colorsPath)) {
                const colorEntries = fs.readdirSync(colorsPath, { withFileTypes: true });
                for (const cEntry of colorEntries) {
                    if (cEntry.name.startsWith('.')) continue;
                    const cFullPath = path.join(colorsPath, cEntry.name);

                    if (cEntry.isDirectory()) {
                        const imgs = fs.readdirSync(cFullPath)
                            .filter(f => !f.startsWith('.') && /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
                            .map(f => path.join(cFullPath, f));

                        if (imgs.length > 0) {
                            variants.push({
                                colorName: cEntry.name,
                                colorHex: COLOR_HEX_MAP[cEntry.name] || "#64748B",
                                imagePaths: imgs.slice(0, 4) // Max 4 per variant
                            });
                        } else {
                            missingNotes.push(`Empty color folder: "${cEntry.name}"`);
                        }
                    }
                }
            }

            // General & Features images
            let featureImagePaths: string[] = [];
            if (fs.existsSync(genPath)) {
                const genFiles = fs.readdirSync(genPath)
                    .filter(f => !f.startsWith('.') && /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
                    .map(f => path.join(genPath, f));

                // Filter out small thumbnails or mobile duplicates if possible, pick top high quality images
                const nonMobile = genFiles.filter(f => !f.includes('-mo.') && !f.includes('-tb.') && !f.includes('_small'));
                const chosen = nonMobile.length > 0 ? nonMobile : genFiles;
                featureImagePaths = chosen.slice(0, 6); // Top 6 feature images
            }

            // Fallback for variants if empty (e.g. Z Fold6, iPad Pro, AirPods Pro, Mac mini)
            if (variants.length === 0) {
                missingNotes.push(`No specific color variant photos in folder. Used hero images from General & Features.`);
                if (featureImagePaths.length > 0) {
                    variants.push({
                        colorName: "Standard",
                        colorHex: "#1E293B",
                        imagePaths: featureImagePaths.slice(0, 3)
                    });
                }
            }

            // Description
            const description = `${prodName} - Official flagship product featuring premium design, advanced processor performance, ultra-responsive display technology, and industry-leading build quality. Fully covered by standard manufacturer warranty and global support.`;

            dataset.push({
                folderPath: relPath,
                productName: prodName,
                brand,
                category: "gadgets",
                price: pricing.price,
                originalPrice: pricing.originalPrice,
                discountLabel: pricing.discountLabel,
                description,
                sizeType,
                sizes,
                variants,
                featureImagePaths,
                missingPhotosNote: missingNotes.length > 0 ? missingNotes.join(" | ") : undefined
            });
        } else {
            for (const entry of entries) {
                if (entry.isDirectory() && !entry.name.startsWith('.')) {
                    walkDir(path.join(currentPath, entry.name));
                }
            }
        }
    }

    walkDir(MOBILES_DIR);
    return dataset;
}

if (require.main === module) {
    const data = buildCatalogDataset();
    console.log(`Prepared dataset for ${data.length} products:`);
    data.forEach(p => {
        console.log(`- ${p.productName} (${p.brand}): ${p.variants.length} color variants, ${p.featureImagePaths.length} feature photos. Price: ₹${p.price}`);
        if (p.missingPhotosNote) console.log(`  ⚠️ Note: ${p.missingPhotosNote}`);
    });
}
