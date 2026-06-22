require('dotenv').config({ path: '.env.local' });

async function run() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const sanityToken = process.env.SANITY_API_TOKEN;
    const clerkKey = process.env.CLERK_SECRET_KEY;

    // 1. Get ALL Sanity partners
    const pQuery = encodeURIComponent(`*[_type == "partner"] | order(clicks desc)`);
    const pRes = await fetch(`https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${pQuery}`, {
        headers: { 'Authorization': `Bearer ${sanityToken}` }
    });
    const partners = (await pRes.json()).result;

    // 2. Get ALL Clerk users
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

    // 3. Get ALL Sanity orders
    const oQuery = encodeURIComponent(`*[_type == "order"] { referralCode, email, totalPrice, status, createdAt }`);
    const oRes = await fetch(`https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${oQuery}`, {
        headers: { 'Authorization': `Bearer ${sanityToken}` }
    });
    const orders = (await oRes.json()).result || [];

    console.log("=== FULL SYSTEM AUDIT ===");
    console.log(`Total Clerk Users: ${allUsers.length}`);
    console.log(`Total Sanity Partners: ${partners.length}`);
    console.log(`Total Orders: ${orders.length}`);
    console.log("");

    // For each partner, cross-check
    for (const p of partners) {
        console.log(`--- Partner: ${p.name} (${p.email}) ---`);
        console.log(`  Referral Code: ${p.referralCode}`);
        console.log(`  Sanity Stats: clicks=${p.clicks || 0}, joins=${p.joins || 0}, carts=${p.carts || 0}, wallet=₹${p.walletBalance || 0}, redeemed=₹${p.redeemedAmount || 0}, spentOnPurchases=₹${p.spentOnPurchases || 0}`);
        
        // Find their Clerk account
        const clerkUser = allUsers.find(u => u.id === p.clerkId);
        if (clerkUser) {
            const meta = clerkUser.unsafe_metadata || {};
            console.log(`  Clerk Stats: clicks=${meta.referralClicks || 0}, joins=${meta.referralJoins || 0}, carts=${meta.referralCarts || 0}, wallet=₹${meta.walletBalance || 0}, redeemed=₹${meta.redeemedAmount || 0}`);
            console.log(`  Clerk referralCode: ${meta.referralCode || 'NOT SET'}`);
            
            // Check for mismatches
            if ((meta.referralClicks || 0) !== (p.clicks || 0)) console.log(`  ⚠️ MISMATCH: Clerk clicks (${meta.referralClicks || 0}) != Sanity clicks (${p.clicks || 0})`);
            if ((meta.referralJoins || 0) !== (p.joins || 0)) console.log(`  ⚠️ MISMATCH: Clerk joins (${meta.referralJoins || 0}) != Sanity joins (${p.joins || 0})`);
        } else {
            console.log(`  ⚠️ CLERK USER NOT FOUND (clerkId=${p.clerkId})`);
        }
        
        // Count actual referred users in Clerk
        const actualReferred = allUsers.filter(u => 
            u.unsafe_metadata && u.unsafe_metadata.referredByCode === p.referralCode
        );
        console.log(`  Actual Referred Users in Clerk: ${actualReferred.length}`);
        if (actualReferred.length !== (p.joins || 0)) {
            console.log(`  ⚠️ JOINS MISMATCH: Sanity shows ${p.joins || 0} joins but Clerk has ${actualReferred.length} users with this code`);
        }
        actualReferred.forEach(u => {
            console.log(`    -> ${u.email_addresses[0].email_address} (joined: ${new Date(u.created_at).toISOString()})`);
        });

        // Count orders with this referral code
        const refOrders = orders.filter(o => o.referralCode === p.referralCode);
        console.log(`  Orders with this referral code: ${refOrders.length}`);
        refOrders.forEach(o => {
            console.log(`    -> ₹${o.totalPrice} | status: ${o.status} | ${o.email} | ${o.createdAt}`);
        });

        console.log("");
    }

    // Check for orphaned referrals - users who have referredByCode but no matching partner
    console.log("=== ORPHANED REFERRALS ===");
    for (const u of allUsers) {
        const meta = u.unsafe_metadata || {};
        if (meta.referredByCode) {
            const matchingPartner = partners.find(p => p.referralCode === meta.referredByCode);
            if (!matchingPartner) {
                console.log(`  ⚠️ User ${u.email_addresses[0].email_address} has referredByCode="${meta.referredByCode}" but NO matching partner exists!`);
            }
        }
    }
    
    // Check for users who signed up after June 17 (the date user mentioned)
    console.log("\n=== USERS SIGNED UP AFTER JUNE 17 ===");
    const cutoff = new Date("2026-06-17T00:00:00Z").getTime();
    for (const u of allUsers) {
        const created = new Date(u.created_at).getTime();
        if (created > cutoff) {
            const meta = u.unsafe_metadata || {};
            console.log(`  ${u.email_addresses[0].email_address} | joined: ${new Date(u.created_at).toISOString()} | referredByCode: ${meta.referredByCode || 'NONE'}`);
        }
    }
}
run();
