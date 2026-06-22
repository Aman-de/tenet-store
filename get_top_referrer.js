require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        const sanityToken = process.env.SANITY_API_TOKEN;
        const query = encodeURIComponent(`*[_type == "partner"] | order(clicks desc)[0...5]`);
        const sanityRes = await fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}?query=${query}`, {
            headers: { 'Authorization': `Bearer ${sanityToken}` }
        });
        
        const sanityData = await sanityRes.json();
        console.log("Top 5 Partners by Clicks:");
        console.log(JSON.stringify(sanityData.result, null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
