require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@clerk/clerk-sdk-node');

const clerk = createClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function run() {
    try {
        let allUsers = [];
        let offset = 0;
        const limit = 500;
        
        while (true) {
            const batch = await clerk.users.getUserList({ limit, offset });
            allUsers.push(...batch);
            if (batch.length < limit) break;
            offset += limit;
        }
        
        console.log(`Total users in DB: ${allUsers.length}`);

        let arpitaSignups = 0;
        let emails = [];

        for (const u of allUsers) {
            if (u.unsafeMetadata && u.unsafeMetadata.referredByCode === 'ARPITA20') {
                arpitaSignups++;
                emails.push(u.emailAddresses[0].emailAddress);
            }
        }
        
        console.log(`Total users with ARPITA20: ${arpitaSignups}`);
        console.log("Emails:", emails);
    } catch (e) {
        console.error(e);
    }
}
run();
