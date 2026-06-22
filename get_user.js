const { createClerkClient } = require("@clerk/backend");

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function run() {
    let allUsers = [];
    let offset = 0;
    while(true) {
        const res = await clerk.users.getUserList({ limit: 500, offset });
        allUsers.push(...res.data);
        if (res.data.length < 500) break;
        offset += 500;
    }
    const user = allUsers.find(u => u.emailAddresses[0]?.emailAddress === "arputgamer09@gmail.com");
    if (user) {
        console.log("User:", user.emailAddresses[0].emailAddress);
        console.log("Clicks:", user.unsafeMetadata.referralClicks);
        console.log("Joins:", user.unsafeMetadata.referralJoins);
        console.log("Wallet:", user.unsafeMetadata.walletBalance);
    } else {
        console.log("User not found");
    }
}
run().catch(console.error);
