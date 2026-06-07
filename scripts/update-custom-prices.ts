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
            // Chocolate set: lowered for maximum buyers
            price = 499;
            originalPrice = 1299;
        } else if (title.includes("pink block print")) {
            // Pink kurti: lowered
            price = 399;
            originalPrice = 899;
        } else if (title.includes("chikankari")) {
            // White/Ivory Chikankari kurti/suit: lowered
            price = 599;
            originalPrice = 1499;
        } else if (title.includes("jaipur print")) {
            // Jaipur kurti: lowered
            price = 499;
            originalPrice = 1199;
        } else if (title.includes("orange paisley")) {
            // Kurti/Tunic: lowered
            price = 399;
            originalPrice = 899;
        } else if (title.includes("embroidered ethnic")) {
            // Kurti/Tunic: lowered
            price = 399;
            originalPrice = 899;
        } else if (title.includes("dhoti")) {
            // Dhoti set: lowered
            price = 899;
            originalPrice = 1999;
        } else if (title.includes("saree") || title.includes("sari")) {
            // Saree: lowered
            price = 1199;
            originalPrice = 2499;
        } else if (title.includes("banarasi lehenga")) {
            // Premium Silk Lehenga/Saree: lowered
            price = 2499;
            originalPrice = 4999;
        } else if (title.includes("rattan tote") || title.includes("bag")) {
            // Bag: lowered
            price = 999;
            originalPrice = 1799;
        }
        
        if (price !== null && originalPrice !== null) {
            console.log(`Updating "${p.title}" -> Price: ₹${price}, Original: ₹${originalPrice}`);
            await client.patch(p._id).set({ price, originalPrice }).commit();
        }
    }
    
    console.log("Pricing update successfully complete!");
}

main().catch(console.error);
