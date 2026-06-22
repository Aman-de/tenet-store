const { createClerkClient } = require("@clerk/nextjs/server");

async function run() {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const res = await clerk.users.getUserList({ limit: 50 });
    res.data.sort((a,b) => b.createdAt - a.createdAt).forEach(u => {
        console.log(`- ${u.emailAddresses[0]?.emailAddress} (Joined: ${new Date(u.createdAt).toISOString()})`);
    });
}
run().catch(console.error);
