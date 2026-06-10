import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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
        price: 1799,
        category: "knitwear",
        gender: "men",
        sizes: ["S", "M", "L", "XL"],
        variants: [{ colorName: "Oatmeal", colorHex: "#8B7355" }]
    },
    {
        id: "art-gurkha",
        title: "The Minimalist Gurkha Trouser",
        handle: "the-minimalist-gurkha-trouser",
        price: 1599,
        category: "pants",
        gender: "men",
        sizes: ["28", "30", "32", "34", "36"],
        variants: [{ colorName: "Charcoal", colorHex: "#4A4A4A" }]
    },
    {
        id: "art-duffel",
        title: "The Artisan Leather Duffel",
        handle: "the-artisan-leather-duffel",
        price: 2999,
        category: "accessories",
        gender: "unisex",
        sizes: ["One Size"],
        variants: [{ colorName: "Vintage Brown", colorHex: "#5C4033" }]
    },
    {
        id: "art-chrono",
        title: "The Onyx Chronograph",
        handle: "the-onyx-chronograph",
        price: 5499,
        category: "accessories",
        gender: "unisex",
        sizes: ["One Size"],
        variants: [{ colorName: "Silver/Black", colorHex: "#000000" }]
    },
    {
        id: "art-weekender",
        title: "The Heritage Weekender",
        handle: "the-heritage-weekender",
        price: 2199,
        category: "accessories",
        gender: "unisex",
        sizes: ["One Size"],
        variants: [{ colorName: "Olive", colorHex: "#6B8E23" }]
    },
    {
        id: "art-hamptons",
        title: "The Weekend Escape Edit",
        handle: "the-weekend-escape-edit",
        price: 2799,
        category: "sets",
        gender: "men",
        sizes: ["S", "M", "L", "XL"],
        variants: [{ colorName: "Linen", colorHex: "#F5F5DC" }]
    },
    {
        id: "art-amalfi",
        title: "The Coastal Stripe Resort Shirt",
        handle: "the-coastal-stripe-resort-shirt",
        price: 1199,
        category: "shirts",
        gender: "men",
        sizes: ["S", "M", "L", "XL"],
        variants: [{ colorName: "Blue Stripe", colorHex: "#4682B4" }]
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

async function main() {
    try {
        console.log('Fetching products from Sanity...');
        const sanityProducts = await client.fetch(`*[_type == "product"]{
            _id,
            title,
            "slug": slug.current,
            price,
            originalPrice,
            category,
            sizes,
            sizeType,
            gender,
            isOutOfStock,
            variants[]{
                colorName,
                colorHex
            }
        }`);

        const allProducts = [...ARTIFICIAL_PRODUCTS, ...sanityProducts];
        
        let output = `# PRODUCT CATALOG - TENET ARCHIVES\n\n`;
        output += `This file serves as your internal knowledge base for all products available on https://tenetarchives.com.\n`;
        output += `Use this information to answer user questions, recommend sizes/styles, and provide exact links to purchase.\n\n`;
        output += `**Direct Product Link Format:** \`https://tenetarchives.com/product/[slug]\`\n\n`;

        const categories: Record<string, any[]> = {};

        for (const p of allProducts) {
            if (HIDDEN_PRODUCT_TITLES.has(p.title)) continue;

            const category = p.category || 'other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(p);
        }

        for (const [catName, prodList] of Object.entries(categories)) {
            output += `## CATEGORY: ${catName.toUpperCase()}\n\n`;
            for (const p of prodList) {
                const productSlug = p.slug || p.handle;
                const buyUrl = `https://tenetarchives.com/product/${productSlug}`;
                
                // Setup overrides for specific items
                let variants = p.variants || [];
                const titleLower = p.title.toLowerCase();
                if (titleLower === "the amalfi stripe") {
                    variants = [
                        { colorName: "Olive & White" },
                        { colorName: "Blue & White" }
                    ];
                } else if (titleLower === "the hamptons weekend edit") {
                    variants = [
                        { colorName: "Blue & Red" },
                        { colorName: "Beige Linen" }
                    ];
                }

                const colorsList = variants.map((v: any) => v.colorName).filter(Boolean).join(', ') || 'Default';
                const sizesList = (p.sizes || []).join(', ') || 'N/A';

                output += `### ${p.title}\n`;
                output += `- **Price:** ₹${p.price}\n`;
                if (p.originalPrice && p.originalPrice > p.price) {
                    output += `- **Original Price (MRP):** ₹${p.originalPrice}\n`;
                }
                output += `- **Link:** ${buyUrl}\n`;
                output += `- **Colors:** ${colorsList}\n`;
                output += `- **Sizes:** ${sizesList}\n`;
                output += `- **Gender:** ${p.gender || 'unisex'}\n`;
                if (p.isOutOfStock) {
                    output += `- **Status:** OUT OF STOCK\n`;
                } else {
                    output += `- **Status:** In Stock\n`;
                }
                output += `\n`;
            }
            output += `\n---\n\n`;
        }

        const targetFilePath = '/Users/uditsharma/.openclaw/workspace/PRODUCTS.md';
        fs.writeFileSync(targetFilePath, output, 'utf-8');
        console.log(`Successfully generated Catalog file at: ${targetFilePath}`);

    } catch (error) {
        console.error("Error in catalog generation:", error);
    }
}

main();
