const { createClerkClient } = require("@clerk/nextjs/server");

async function run() {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    let allUsers = [];
    let offset = 0;
    while(true) {
        const batch = await clerk.users.getUserList({ limit: 500, offset });
        allUsers.push(...batch.data);
        if (batch.data.length < 500) break;
        offset += 500;
    }
    
    console.log(`Total live users: ${allUsers.length}`);
    
    const cutoff = new Date("2026-06-17T00:00:00Z").getTime();
    const recent = allUsers.filter(u => new Date(u.createdAt).getTime() > cutoff);
    
    console.log(`\nUsers created after June 17: ${recent.length}`);
    recent.forEach(r => {
        console.log(`- ${r.emailAddresses[0]?.emailAddress} (Joined: ${new Date(r.createdAt).toISOString()}) (ReferredBy: ${r.unsafeMetadata.referredByCode || 'none'})`);
    });
    
    const arpita = allUsers.find(u => u.emailAddresses[0]?.emailAddress === "arpitagamer09@gmail.com");
    if (arpita) {
        console.log("\nArpita found in LIVE db:");
        console.log("ID:", arpita.id);
        console.log("Clicks:", arpita.unsafeMetadata.referralClicks);
        console.log("Joins:", arpita.unsafeMetadata.referralJoins);
        console.log("Wallet:", arpita.unsafeMetadata.walletBalance);
    }
}
run().catch(console.error);
