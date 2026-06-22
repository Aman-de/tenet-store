const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function run() {
    const partners = await client.fetch('*[_type == "partner"]');
    console.log(`Found ${partners.length} partners in Sanity.`);
    partners.forEach(p => {
        console.log(`- ${p.email} (Code: ${p.referralCode}, Clicks: ${p.clicks}, Joins: ${p.joins})`);
    });
}
run().catch(console.error);
