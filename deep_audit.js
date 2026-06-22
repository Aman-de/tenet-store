require('dotenv').config({ path: '.env.local' });

async function run() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const sanityToken = process.env.SANITY_API_TOKEN;
    const clerkKey = process.env.CLERK_SECRET_KEY;

    // Get ALL Sanity partners
    const pQuery = encodeURIComponent(`*[_type == "partner"]`);
    const pRes = await fetch(`https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${pQuery}`, {
        headers: { 'Authorization': `Bearer ${sanityToken}` }
    });
    const partners = (await pRes.json()).result;

    // Get ALL Clerk users with full metadata
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

    // Check if any current Clerk users share EMAILS with Sanity partners
    console.log("=== EMAIL CROSS-REFERENCE ===");
    const partnerEmails = partners.map(p => p.email?.toLowerCase());
    for (const u of allUsers) {
        const email = u.email_addresses[0]?.email_address?.toLowerCase();
        if (partnerEmails.includes(email)) {
            const matchingPartner = partners.find(p => p.email?.toLowerCase() === email);
            console.log(`MATCH: Clerk user ${u.id} (${email}) <-> Sanity partner clerkId=${matchingPartner.clerkId}`);
            console.log(`  Clerk ID mismatch: ${u.id} !== ${matchingPartner.clerkId} => ${u.id !== matchingPartner.clerkId ? 'YES - IDs DIFFER!' : 'IDs match'}`);
        }
    }

    // Print ALL current Clerk user IDs and emails
    console.log("\n=== ALL CURRENT CLERK USERS ===");
    for (const u of allUsers) {
        const email = u.email_addresses[0]?.email_address;
        const meta = u.unsafe_metadata || {};
        const hasReferralCode = meta.referralCode ? `referralCode=${meta.referralCode}` : 'NO referralCode';
        const hasReferredBy = meta.referredByCode ? `referredByCode=${meta.referredByCode}` : '';
        const isPartner = meta.isPartner ? 'isPartner=true' : '';
        console.log(`  ${u.id} | ${email} | ${hasReferralCode} ${hasReferredBy} ${isPartner} | created: ${u.created_at}`);
    }

    // Check which Clerk users SHOULD be partners but don't have partner docs
    console.log("\n=== CLERK USERS WITH referralCode BUT NO MATCHING SANITY DOC ===");
    for (const u of allUsers) {
        const meta = u.unsafe_metadata || {};
        if (meta.referralCode) {
            const sanityId = `partner-${u.id}`;
            const matchingSanity = partners.find(p => p._id === sanityId);
            if (!matchingSanity) {
                console.log(`  ⚠️ ${u.email_addresses[0]?.email_address} has referralCode=${meta.referralCode} but NO Sanity partner doc with _id=${sanityId}`);
            }
        }
    }
}
run();
