const { createClerkClient } = require("@clerk/nextjs/server");

async function run() {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    let allUsers = [];
    let offset = 0;
    while(true) {
        const res = await clerk.users.getUserList({ limit: 500, offset });
        allUsers.push(...res.data);
        if (res.data.length < 500) break;
        offset += 500;
    }
    
    console.log(`Total users: ${allUsers.length}`);
    const user = allUsers.find(u => 
        u.emailAddresses.some(e => e.emailAddress.toLowerCase().includes("arputgamer09"))
    );
    
    if (user) {
        console.log("Found User:");
        console.log("Email:", user.emailAddresses[0].emailAddress);
        console.log("Referral Code:", user.unsafeMetadata.referralCode);
        console.log("Recorded Clicks:", user.unsafeMetadata.referralClicks);
        console.log("Recorded Joins:", user.unsafeMetadata.referralJoins);
        
        const code = user.unsafeMetadata.referralCode;
        if (code) {
            const actualJoins = allUsers.filter(u => u.unsafeMetadata.referredByCode === code);
            console.log(`\nActual Signups Found (by checking all users' referredByCode): ${actualJoins.length}`);
            console.log("Signed up users:");
            actualJoins.forEach(j => {
                console.log(`- ${j.emailAddresses[0]?.emailAddress} (Joined: ${new Date(j.createdAt).toISOString()})`);
            });
        }
    } else {
        console.log("User not found matching 'arputgamer09'");
        // let's print all users with clicks > 0
        console.log("\nUsers with clicks > 0:");
        const clickers = allUsers.filter(u => (u.unsafeMetadata.referralClicks || 0) > 0);
        clickers.forEach(c => {
            console.log(`- ${c.emailAddresses[0]?.emailAddress}: ${c.unsafeMetadata.referralClicks} clicks`);
        });
    }
}
run().catch(console.error);
