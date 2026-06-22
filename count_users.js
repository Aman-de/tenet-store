const { createClerkClient } = require("@clerk/nextjs/server");

async function run() {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const count = await clerk.users.getCount();
    console.log(`Total users in Clerk: ${count}`);
    
    const search = await clerk.users.getUserList({ query: "arpita" });
    console.log("Search 'arpita':", search.data.map(u => u.emailAddresses[0]?.emailAddress));
}
run().catch(console.error);
