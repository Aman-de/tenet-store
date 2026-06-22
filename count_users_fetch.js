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
        
        console.log(`Total users in DB: ${allUsers.length}`);

        let arpitaSignups = 0;
        let emails = [];

        for (const u of allUsers) {
            if (u.unsafe_metadata && u.unsafe_metadata.referredByCode === 'ARPITA20') {
                arpitaSignups++;
                emails.push(u.email_addresses[0].email_address);
            }
        }
        
        console.log(`Total users with ARPITA20: ${arpitaSignups}`);
        console.log("Emails:", emails);
    } catch (e) {
        console.error(e);
    }
}
run();
