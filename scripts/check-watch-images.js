const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function main() {
    console.log("Fetching watch details...");
    const res = await client.fetch('*[_type == "product" && slug.current == "the-heritage-chronograph"][0]{title, variants}');
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
