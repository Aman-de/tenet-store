require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2023-05-03',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
});

async function run() {
    try {
        const arpitaDoc = await sanityClient.fetch(`*[_type == "partner" && email == "arpitagamer09@gmail.com"][0]`);
        if (arpitaDoc) {
            console.log("Found Arpita:", arpitaDoc);
            const joins = arpitaDoc.joins || 0;
            const targetBalance = joins * 10;
            
            if (arpitaDoc.walletBalance !== targetBalance) {
                const updated = await sanityClient
                    .patch(arpitaDoc._id)
                    .set({ walletBalance: targetBalance, revenue: targetBalance })
                    .commit();
                console.log("Updated Arpita:", updated);
            } else {
                console.log("Balance is already correct.");
            }
        }
    } catch (e) {
        console.error(e);
    }
}
run();
