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
    const topClicker = allUsers.sort((a,b) => (b.unsafeMetadata?.referralClicks || 0) - (a.unsafeMetadata?.referralClicks || 0))[0];
    
    console.log("Top Clicker Details:");
    console.log("Name:", topClicker.firstName, topClicker.lastName);
    console.log("Email:", topClicker.emailAddresses[0]?.emailAddress);
    console.log("Referral Code:", topClicker.unsafeMetadata?.referralCode);
    console.log("Clicks:", topClicker.unsafeMetadata?.referralClicks);
    console.log("Joins:", topClicker.unsafeMetadata?.referralJoins);
    console.log("Revenue:", topClicker.unsafeMetadata?.referralRevenue);
    console.log("Wallet:", topClicker.unsafeMetadata?.walletBalance);
}
run().catch(console.error);
