import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function main() {
    console.log("Fetching target products from Sanity to update prices...");
    
    const products = await client.fetch(`*[_type == "product"] { _id, title }`);
    
    for (const p of products) {
        const title = p.title.toLowerCase();
        let price = null;
        let originalPrice = null;
        
        if (title.includes("chocolate set")) {
            // Chocolate set: 400 to 900
            price = 899;
            originalPrice = 1499;
        } else if (title.includes("pink block print")) {
            // Pink kurti: 400 to 900
            price = 699;
            originalPrice = 1199;
        } else if (title.includes("chikankari")) {
            // White/Ivory Chikankari kurti/suit: 400 to 900
            price = 799;
            originalPrice = 1299;
        } else if (title.includes("jaipur print")) {
            // Jaipur kurti: 400 to 900
            price = 599;
            originalPrice = 999;
        } else if (title.includes("orange paisley")) {
            // Kurti/Tunic: 400 to 900
            price = 499;
            originalPrice = 899;
        } else if (title.includes("embroidered ethnic")) {
            // Kurti/Tunic: 400 to 900
            price = 599;
            originalPrice = 999;
        } else if (title.includes("dhoti")) {
            // Dhoti set: 800 to 2000
            price = 1299;
            originalPrice = 2199;
        } else if (title.includes("saree") || title.includes("sari")) {
            // Saree: 800 to 2000
            price = 1899;
            originalPrice = 2999;
        } else if (title.includes("banarasi lehenga")) {
            // Premium Silk Lehenga/Saree: 3k to 5k
            price = 3999;
            originalPrice = 6999;
        } else if (title.includes("rattan tote") || title.includes("bag")) {
            // Bag: mid tier (1299)
            price = 1299;
            originalPrice = 2199;
        }
        
        if (price !== null && originalPrice !== null) {
            console.log(`Updating "${p.title}" -> Price: ₹${price}, Original: ₹${originalPrice}`);
            await client.patch(p._id).set({ price, originalPrice }).commit();
        }
    }
    
    console.log("Pricing update successfully complete!");
}

main().catch(console.error);
