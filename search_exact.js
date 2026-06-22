const { createClerkClient } = require("@clerk/nextjs/server");

async function run() {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const res = await clerk.users.getUserList({ emailAddress: ["arpitagamer09@gmail.com"] });
    if (res.data.length > 0) {
        const user = res.data[0];
        console.log("Found User:", user.emailAddresses[0].emailAddress);
        console.log("Referral Code:", user.unsafeMetadata.referralCode);
        console.log("Recorded Clicks:", user.unsafeMetadata.referralClicks);
        console.log("Recorded Joins:", user.unsafeMetadata.referralJoins);
        
        const code = user.unsafeMetadata.referralCode;
        if (code) {
            let allUsers = [];
            let offset = 0;
            while(true) {
                const batch = await clerk.users.getUserList({ limit: 500, offset });
                allUsers.push(...batch.data);
                if (batch.data.length < 500) break;
                offset += 500;
            }
            const actualJoins = allUsers.filter(u => u.unsafeMetadata.referredByCode === code);
            console.log(`\nActual Signups Found: ${actualJoins.length}`);
            actualJoins.forEach(j => {
                console.log(`- ${j.emailAddresses[0]?.emailAddress}`);
            });
        }
    } else {
        console.log("User STILL NOT FOUND in the Clerk database.");
    }
}
run().catch(console.error);
