const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function run() {
    const docs = await client.fetch('*[_type == "partner" && email match "arpita*"]');
    docs.forEach(d => {
        console.log(`- ${d.email}: Created at ${d._createdAt}, Updated at ${d._updatedAt}`);
    });
}
run().catch(console.error);
