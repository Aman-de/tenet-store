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
    
    const joins = allUsers.filter(u => u.unsafeMetadata.referredByCode === "ARPITA20");
    console.log(`Actual Signups with code ARPITA20: ${joins.length}`);
    joins.forEach(j => {
        console.log(`- ${j.emailAddresses[0]?.emailAddress} (Joined: ${new Date(j.createdAt).toISOString()})`);
    });
}
run().catch(console.error);
