import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';

dotenv.config({ path: '.env.local' });

const HIDDEN_PRODUCT_TITLES = new Set([
    "The Alpine Lodge Edit",
    "The Savannah Explorer Edit",
    "The Manhattan Evening Edit",
    "The Paris Flâneur Edit",
    "The Harrington",
    "The Polo Ground Edit",
    "The Riviera Retreat",
    "The Oxford Blue Shirt",
    "The Yacht Club Edit",
    "The Aegean Odyssey Edit",
    "The Quarter-Zip Pullover",
    "The Highland Estate Edit",
    "The Aspen Chalet Edit",
    "The Oxford Scholar Edit",
    "The Country Club Brunch Edit",
    "The Diplomat Overcoat",
    "The Highland Flannel Shirt",
    "The Classic Harrington",
    "Classic Pique Polo",
    "Everyday Chino Trouser",
    "The Artisan Leather Duffel",
    "The Onyx Chronograph",
    "The Weekender",
    "The Heritage Weekender",
    "The Voyager Leather Duffel",
    "The Bali Bamboo Edit",
    "The Heavyweight Hoodie",
    "The Harbour Stripe Swim",
    "The Haven Cashmere Hoodie"
]);

const ARTIFICIAL_PRODUCTS = [
    {
        id: "art-cable-knit",
        title: "The Alpine Cable Knit",
        handle: "the-alpine-cable-knit",
        category: "knitwear",
        images: ["/images/generated/the_archive_cable_knit_zip_alt_1779785469898.webp", "/images/generated/the_alpine_cable_knit_alt_1779835239375.webp"],
        colors: ["#8B7355"],
        variants: [{ colorName: "Oatmeal", colorHex: "#8B7355", images: ["/images/generated/the_archive_cable_knit_zip_alt_1779785469898.webp", "/images/generated/the_alpine_cable_knit_alt_1779835239375.webp"] }]
    },
    {
        id: "art-gurkha",
        title: "The Minimalist Gurkha Trouser",
        handle: "the-minimalist-gurkha-trouser",
        category: "pants",
        images: ["/images/generated/the_tailored_gurkha_trouser_alt_1779785496750.webp", "/images/generated/the_minimalist_gurkha_trouser_alt_1779835253569.webp"],
        colors: ["#4A4A4A"],
        variants: [{ colorName: "Charcoal", colorHex: "#4A4A4A", images: ["/images/generated/the_tailored_gurkha_trouser_alt_1779785496750.webp", "/images/generated/the_minimalist_gurkha_trouser_alt_1779835253569.webp"] }]
    },
    {
        id: "art-duffel",
        title: "The Artisan Leather Duffel",
        handle: "the-artisan-leather-duffel",
        category: "accessories",
        images: ["/images/generated/the_voyager_leather_duffel_alt_1779785533301.webp", "/images/generated/the_artisan_leather_duffel_alt_1779835289705.webp"],
        colors: ["#5C4033"],
        variants: [{ colorName: "Vintage Brown", colorHex: "#5C4033", images: ["/images/generated/the_voyager_leather_duffel_alt_1779785533301.webp", "/images/generated/the_artisan_leather_duffel_alt_1779835289705.webp"] }]
    },
    {
        id: "art-chrono",
        title: "The Onyx Chronograph",
        handle: "the-onyx-chronograph",
        category: "accessories",
        images: ["/images/generated/the_heritage_chronograph_alt_1779785550608.webp", "/images/generated/the_onyx_chronograph_alt_1779835307570.webp"],
        colors: ["#000000"],
        variants: [{ colorName: "Silver/Black", colorHex: "#000000", images: ["/images/generated/the_heritage_chronograph_alt_1779785550608.webp", "/images/generated/the_onyx_chronograph_alt_1779835307570.webp"] }]
    },
    {
        id: "art-weekender",
        title: "The Heritage Weekender",
        handle: "the-heritage-weekender",
        category: "accessories",
        images: ["/images/generated/the_weekender_alt_1779785663583.webp"],
        colors: ["#6B8E23"],
        variants: [{ colorName: "Olive", colorHex: "#6B8E23", images: ["/images/generated/the_weekender_alt_1779785663583.webp"] }]
    },
    {
        id: "art-hamptons",
        title: "The Weekend Escape Edit",
        handle: "the-weekend-escape-edit",
        category: "sets",
        images: ["/images/generated/the_hamptons_weekend_edit_alt_1779785717300.webp"],
        colors: ["#F5F5DC"],
        variants: [{ colorName: "Linen", colorHex: "#F5F5DC", images: ["/images/generated/the_hamptons_weekend_edit_alt_1779785717300.webp"] }]
    },
    {
        id: "art-amalfi",
        title: "The Coastal Stripe Resort Shirt",
        handle: "the-coastal-stripe-resort-shirt",
        category: "shirts",
        images: ["/images/generated/the_amalfi_stripe_alt_1779785859994.webp"],
        colors: ["#4682B4"],
        variants: [{ colorName: "Blue Stripe", colorHex: "#4682B4", images: ["/images/generated/the_amalfi_stripe_alt_1779785859994.webp"] }]
    }
];

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('Missing env vars');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const BASE_DOWNLOAD_DIR = '/Users/uditsharma/Downloads/tenet_collection';
const HIGHLIGHTS_DIR = path.join(BASE_DOWNLOAD_DIR, 'highlights');
const CAROUSELS_DIR = path.join(BASE_DOWNLOAD_DIR, 'carousels');

function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

async function fetchWithRetry(url: string, dest: string, retries = 3, delay = 1000): Promise<void> {
    for (let i = 0; i < retries; i++) {
        try {
            await new Promise<void>((resolve, reject) => {
                const file = fs.createWriteStream(dest);
                https.get(url, (response) => {
                    if (response.statusCode !== 200) {
                        reject(new Error(`Failed to download: Status ${response.statusCode}`));
                        return;
                    }
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                }).on('error', (err) => {
                    fs.unlink(dest, () => {});
                    reject(err);
                });
            });
            return;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.warn(`⚠️ Failed to download ${url}. Retrying in ${delay}ms... (Error: ${(error as Error).message})`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

async function handleImage(imageSource: string, targetPath: string) {
    if (imageSource.startsWith('/images/')) {
        // Local file copy
        const sourcePath = path.join('/Users/uditsharma/tenet-store/public', imageSource);
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Copied local: ${path.basename(targetPath)}`);
        } else {
            console.warn(`⚠️ Local file not found: ${sourcePath}`);
        }
    } else if (imageSource.startsWith('http')) {
        // HTTP download
        await fetchWithRetry(imageSource, targetPath);
        console.log(`Downloaded CDN: ${path.basename(targetPath)}`);
    } else {
        console.warn(`⚠️ Unknown image source style: ${imageSource}`);
    }
}

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

async function main() {
    try {
        ensureDir(BASE_DOWNLOAD_DIR);
        ensureDir(HIGHLIGHTS_DIR);
        ensureDir(CAROUSELS_DIR);

        // Check for --type argument (options: top, bottom, set, all)
        const typeArg = process.argv.find(arg => arg.startsWith('--type='));
        const filterType = typeArg ? typeArg.split('=')[1].toLowerCase() : 'all';

        console.log(`Filter mode: downloading type "${filterType}"`);

        console.log('Fetching products from Sanity...');
        const sanityProducts = await client.fetch(`*[_type == "product"]{
            _id,
            title,
            "slug": slug.current,
            category,
            apparelType,
            variants[]{
                colorName,
                colorHex,
                "images": images[].asset->url
            }
        }`);

        console.log(`Found ${sanityProducts.length} products in Sanity.`);

        // Combine Sanity products and ARTIFICIAL_PRODUCTS
        const allProducts = [...ARTIFICIAL_PRODUCTS, ...sanityProducts];

        // Filter based on selected apparel type
        const matchesFilter = (product: any) => {
            if (filterType === 'all') return true;
            if (product.apparelType === filterType) return true;

            const cat = (product.category || '').toLowerCase();
            const title = (product.title || '').toLowerCase();

            if (filterType === 'top') {
                return ['knitwear', 'shirting', 'shirts', 'outerwear', 'jackets'].includes(cat) || 
                       title.includes('shirt') || title.includes('knit') || title.includes('jacket') || title.includes('coat') || title.includes('turtleneck') || title.includes('pullover') || title.includes('hoodie');
            }
            if (filterType === 'bottom') {
                return ['trousers', 'pants', 'shorts', 'swimwear'].includes(cat) || 
                       title.includes('trouser') || title.includes('chino') || title.includes('pants') || title.includes('shorts') || title.includes('swim');
            }
            if (filterType === 'set') {
                return cat === 'sets' || title.includes('set') || title.includes('edit');
            }
            return false;
        };

        const filteredProducts = allProducts.filter(matchesFilter);
        console.log(`Filtering complete: downloading ${filteredProducts.length} of ${allProducts.length} products.`);

        let processedCount = 0;
        let imageCount = 0;

        for (const p of filteredProducts) {
            if (HIDDEN_PRODUCT_TITLES.has(p.title)) {
                console.log(`Skipping hidden product: ${p.title}`);
                continue;
            }

            console.log(`Processing: ${p.title}...`);

            // Apply overrides for Amalfi and Hamptons
            let variants = p.variants || [];
            const titleLower = p.title.toLowerCase();

            if (titleLower === "the amalfi stripe") {
                const defaultImages = variants[0]?.images || [];
                const originalMain = defaultImages[0] || "/images/original_mains/the_amalfi_stripe_main.webp";
                const originalAlt = "/images/generated/the_amalfi_stripe_real_alt_matching.webp";
                const originalThird = "/images/generated/the_amalfi_stripe_third.webp";
                const blueImage = "/images/generated/the_amalfi_stripe_alt_1779836744521.webp";
                const blueAlt = "/images/generated/the_amalfi_stripe_blue_alt_1779882813282.webp";

                variants = [
                    {
                        colorName: "Olive & White",
                        colorHex: "#556B2F",
                        images: [originalMain, originalAlt, originalThird]
                    },
                    {
                        colorName: "Blue & White",
                        colorHex: "#4682B4",
                        images: [blueImage, blueAlt]
                    }
                ];
            } else if (titleLower === "the hamptons weekend edit") {
                const defaultImages = variants[0]?.images || [];
                const originalMain = defaultImages[0] || "/images/original_mains/the_amalfi_stripe_main.webp"; // Fallback to main
                const originalAlt = "/images/generated/the_hamptons_weekend_edit_blue_red_alt_1779882261092.webp";
                const beigeModel = "/images/generated/the_hamptons_weekend_edit_alt_1779836712724.webp";
                const beigeAlt = "/images/generated/the_hamptons_weekend_edit_beige_alt_1779882353962.webp";

                variants = [
                    {
                        colorName: "Blue & Red",
                        colorHex: "#CD5C5C",
                        images: [originalMain, originalAlt]
                    },
                    {
                        colorName: "Beige Linen",
                        colorHex: "#F5F5DC",
                        images: [beigeModel, beigeAlt]
                    }
                ];
            }

            // If a product has no variants (e.g. some collections or accessories), fall back to top-level fields
            if (variants.length === 0) {
                // If it has images
                if (p.images && p.images.length > 0) {
                    variants = [{
                        colorName: "Default",
                        colorHex: "#000000",
                        images: p.images
                    }];
                } else if (p.imageUrl) {
                    variants = [{
                        colorName: "Default",
                        colorHex: "#000000",
                        images: [p.imageUrl, p.hoverImageUrl].filter(Boolean)
                    }];
                }
            }

            const productSlug = p.slug || slugify(p.title);

            for (const variant of variants) {
                const colorSlug = slugify(variant.colorName || 'default');
                const images = variant.images || [];

                if (images.length === 0) continue;

                // 1. Save Highlight (First image)
                const mainImage = images[0];
                const ext = path.extname(mainImage).split('?')[0] || '.webp';
                const highlightFileName = `${productSlug}-${colorSlug}${ext}`;
                const highlightDest = path.join(HIGHLIGHTS_DIR, highlightFileName);

                try {
                    await handleImage(mainImage, highlightDest);
                    imageCount++;
                } catch (err) {
                    console.error(`Error saving highlight image for ${p.title} (${variant.colorName}): ${(err as Error).message}`);
                }

                // 2. Save Carousel Folder (All images)
                const carouselProductDir = path.join(CAROUSELS_DIR, `${productSlug}-${colorSlug}`);
                ensureDir(carouselProductDir);

                for (let idx = 0; idx < images.length; idx++) {
                    const imgUrl = images[idx];
                    const imgExt = path.extname(imgUrl).split('?')[0] || '.webp';
                    const carouselDest = path.join(carouselProductDir, `${idx + 1}${imgExt}`);
                    try {
                        await handleImage(imgUrl, carouselDest);
                        imageCount++;
                    } catch (err) {
                        console.error(`Error saving carousel image ${idx + 1} for ${p.title} (${variant.colorName}): ${(err as Error).message}`);
                    }
                }
            }

            processedCount++;
        }

        console.log(`\n🎉 Success! Processed ${processedCount} products.`);
        console.log(`📂 Saved photos inside: ${BASE_DOWNLOAD_DIR}`);
        console.log(`🌟 Highlights directory: ${HIGHLIGHTS_DIR}`);
        console.log(`🎠 Carousels directory: ${CAROUSELS_DIR}`);
        console.log(`🖼️ Total files copied/downloaded: ${imageCount}`);

    } catch (error) {
        console.error("Error in main process:", error);
    }
}

main();
