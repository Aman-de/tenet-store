require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        let allUsers = [];
        let offset = 0;
        const limit = 500;
        
        while (true) {
            const clerkRes = await fetch(`https://api.clerk.dev/v1/users?limit=${limit}&offset=${offset}`, {
                headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` }
            });
            const batch = await clerkRes.json();
            
            if (!Array.isArray(batch)) {
                console.error("Error from Clerk:", batch);
                break;
            }
            
            allUsers.push(...batch);
            if (batch.length < limit) break;
            offset += limit;
        }
        
        for (const u of allUsers) {
            if (u.unsafe_metadata && Object.keys(u.unsafe_metadata).length > 0) {
                console.log(`Email: ${u.email_addresses[0].email_address}`);
                console.log(`Metadata:`, u.unsafe_metadata);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
run();
