import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('Missing env vars')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const standardSizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "4XL"];

const sortSizes = (sizesList: string[]) => {
    return [...sizesList].sort((a, b) => {
        const indexA = standardSizeOrder.indexOf(a.toUpperCase());
        const indexB = standardSizeOrder.indexOf(b.toUpperCase());
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });
};

async function migrateSizes() {
    try {
        console.log("Fetching products from Sanity...")
        const products = await client.fetch(`*[_type == "product"]{_id, title, category, sizes, sizeType}`)
        console.log(`Fetched ${products.length} products.`)

        // Filter products that use letter sizes
        // We consider a product as having letter sizes if:
        // 1. sizeType is 'clothing'
        // 2. Or it already has sizes like XS, S, M, L, XL, XXL, 2XL (case insensitive)
        const letterSizeProducts = products.filter((p: any) => {
            if (p.sizeType === 'clothing') return true;
            if (Array.isArray(p.sizes)) {
                const hasLetter = p.sizes.some((s: string) => {
                    const clean = s.trim().toUpperCase();
                    return ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "XXS"].includes(clean);
                });
                // Avoid numeric sizes (like shoes 7, 8, 9)
                const hasNumeric = p.sizes.some((s: string) => /^\d+$/.test(s.trim()));
                return hasLetter && !hasNumeric;
            }
            return false;
        });

        // Sort by title for deterministic split
        letterSizeProducts.sort((a: any, b: any) => a.title.localeCompare(b.title));

        console.log(`Found ${letterSizeProducts.length} products using alphabetical letter sizes.`)

        let updatedCount = 0;

        for (let idx = 0; idx < letterSizeProducts.length; idx++) {
            const p = letterSizeProducts[idx];
            
            // 33% of the products will have 2XL unavailable (e.g. index % 3 === 0)
            const make2XLUnavailable = (idx % 3 === 0);

            // Start with existing sizes or default to ["S", "M", "L", "XL"] if null
            let originalSizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL"];
            
            // Convert to uppercase, map XXL to 2XL, and deduplicate
            let uniqueSizes = Array.from(new Set(
                originalSizes.map((s: string) => {
                    const clean = s.trim().toUpperCase();
                    return clean === "XXL" ? "2XL" : clean;
                })
            ));

            // Ensure XS is always present
            if (!uniqueSizes.includes("XS")) {
                uniqueSizes.push("XS");
            }

            if (make2XLUnavailable) {
                // Remove 2XL and XXL
                uniqueSizes = uniqueSizes.filter(s => s !== "2XL" && s !== "XXL");
                console.log(`Updating "${p.title}": 2XL UNAVAILABLE. New sizes: ${JSON.stringify(sortSizes(uniqueSizes))}`);
            } else {
                // Ensure 2XL is present
                if (!uniqueSizes.includes("2XL")) {
                    uniqueSizes.push("2XL");
                }
                console.log(`Updating "${p.title}": 2XL AVAILABLE. New sizes: ${JSON.stringify(sortSizes(uniqueSizes))}`);
            }

            const finalSizes = sortSizes(uniqueSizes);

            // Update in Sanity
            try {
                await client.patch(p._id)
                    .set({ sizes: finalSizes, sizeType: "clothing" }) // ensure sizeType is 'clothing'
                    .commit();
                updatedCount++;
            } catch (err: any) {
                console.error(`Error patching ${p.title} (${p._id}):`, err.message);
            }
        }

        console.log(`\nMigration completed. Successfully updated sizes for ${updatedCount}/${letterSizeProducts.length} products.`);
    } catch (err) {
        console.error("Migration error:", err);
    }
}

migrateSizes();
