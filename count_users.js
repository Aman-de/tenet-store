require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        const clerkRes = await fetch('https://api.clerk.dev/v1/users?limit=500', {
            headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` }
        });
        const users = await clerkRes.json();
        
        let arpitaSignups = 0;
        let emails = [];

        for (const u of users) {
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
