require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        const clerkRes = await fetch(`https://api.clerk.dev/v1/users/user_3EnGv3wKo5vvzRUajE0PV0mvmxt`, {
            headers: { 'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}` }
        });
        const user = await clerkRes.json();
        
        console.log(user);
    } catch (e) {
        console.error(e);
    }
}
run();
