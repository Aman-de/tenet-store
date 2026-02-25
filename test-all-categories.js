const { createClient } = require('@sanity/client');
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false
});

async function run() {
    const products = await client.fetch(`*[_type == "product"]{ title, category }`);
    console.log("All Products Categories:");
    const categories = [...new Set(products.map(p => p.category))];
    console.log(categories);

    const collections = await client.fetch(`*[_type == "collection"]{ title, filterTag }`);
    console.log("\nAll Collections:");
    console.log(collections.map(c => c.title + " (" + c.filterTag + ")"));
}
run();
