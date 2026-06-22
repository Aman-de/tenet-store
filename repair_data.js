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
    const clerkKey = process.env.CLERK_SECRET_KEY;

    // 1. Get all Clerk users
    let allUsers = [];
    let offset = 0;
    while (true) {
        const r = await fetch(`https://api.clerk.dev/v1/users?limit=500&offset=${offset}`, {
            headers: { 'Authorization': `Bearer ${clerkKey}` }
        });
        const batch = await r.json();
        if (!Array.isArray(batch) || batch.length === 0) break;
        allUsers.push(...batch);
        if (batch.length < 500) break;
        offset += 500;
    }

    // 2. Get all Sanity partners
    const partners = (await sanityClient.fetch(`*[_type == "partner"]`)) || [];

    console.log("=== PHASE 1: Re-link partners with matching emails ===\n");

    for (const partner of partners) {
        const matchingUser = allUsers.find(u => 
            u.email_addresses[0]?.email_address?.toLowerCase() === partner.email?.toLowerCase()
        );

        if (matchingUser) {
            const oldId = partner._id;
            const newId = `partner-${matchingUser.id}`;
            
            console.log(`MATCH: ${partner.email}`);
            console.log(`  Old Sanity _id: ${oldId}`);
            console.log(`  New Sanity _id: ${newId}`);
            console.log(`  Old clerkId: ${partner.clerkId}`);
            console.log(`  New clerkId: ${matchingUser.id}`);
            
            if (oldId !== newId) {
                // Need to delete old doc and create new one (Sanity _id is immutable)
                const newDoc = {
                    _type: 'partner',
                    _id: newId,
                    clerkId: matchingUser.id,
                    name: partner.name,
                    email: partner.email,
                    referralCode: partner.referralCode,
                    clicks: partner.clicks || 0,
                    joins: partner.joins || 0,
                    carts: partner.carts || 0,
                    revenue: partner.revenue || 0,
                    walletBalance: partner.walletBalance || 0,
                    redeemedAmount: partner.redeemedAmount || 0,
                    spentOnPurchases: partner.spentOnPurchases || 0,
                    payoutDetails: partner.payoutDetails || ''
                };

                await sanityClient.createOrReplace(newDoc);
                if (oldId !== newId) {
                    await sanityClient.delete(oldId);
                }
                console.log(`  ✅ Migrated to new _id: ${newId}`);
            } else {
                console.log(`  ✅ Already correct`);
            }

            // Also ensure Clerk metadata has the referral code
            const meta = matchingUser.unsafe_metadata || {};
            if (meta.referralCode !== partner.referralCode) {
                console.log(`  Updating Clerk metadata: setting referralCode=${partner.referralCode}`);
                await fetch(`https://api.clerk.dev/v1/users/${matchingUser.id}/metadata`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${clerkKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        unsafe_metadata: {
                            ...meta,
                            referralCode: partner.referralCode,
                            referralClicks: partner.clicks || 0,
                            referralJoins: partner.joins || 0,
                            referralCarts: partner.carts || 0,
                            walletBalance: partner.walletBalance || 0,
                            referralRevenue: partner.revenue || 0
                        }
                    })
                });
                console.log(`  ✅ Clerk metadata updated`);
            }
        } else {
            console.log(`ORPHANED: ${partner.email} — no matching Clerk user found`);
            console.log(`  Keeping Sanity record as historical data`);
        }
        console.log('');
    }

    // 3. Verify
    console.log("=== PHASE 2: Verification ===\n");
    const updatedPartners = (await sanityClient.fetch(`*[_type == "partner"]`)) || [];
    for (const p of updatedPartners) {
        const clerkUser = allUsers.find(u => u.id === p.clerkId);
        const status = clerkUser ? '✅ LINKED' : '⚠️ ORPHANED';
        console.log(`${status} | ${p.email} | clerkId=${p.clerkId} | code=${p.referralCode} | clicks=${p.clicks} joins=${p.joins} carts=${p.carts} wallet=₹${p.walletBalance}`);
    }
}

run().catch(console.error);
