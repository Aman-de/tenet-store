require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        const clerkRes = await fetch('https://api.clerk.dev/v1/users?query=arpita', {
            headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` }
        });
        const users = await clerkRes.json();
        
        if (!users || users.length === 0) {
            console.log("No users matching 'arpita' found in Clerk");
            return;
        }
        
        for (const user of users) {
            console.log(`\nEmail: ${user.email_addresses[0].email_address}`);
            console.log("Clerk Metadata:");
            console.log(JSON.stringify(user.unsafe_metadata, null, 2));

            const sanityToken = process.env.SANITY_API_TOKEN;
            const query = encodeURIComponent(`*[_type == "partner" && clerkId == "${user.id}"][0]`);
            const sanityRes = await fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}?query=${query}`, {
                headers: { 'Authorization': `Bearer ${sanityToken}` }
            });
            
            const sanityData = await sanityRes.json();
            console.log("Sanity Document:");
            console.log(JSON.stringify(sanityData.result, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}
run();
