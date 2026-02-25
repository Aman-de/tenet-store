const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});

async function run() {
  const shorts = await client.fetch(`*[_type == "product" && category == "shorts"]{ title }`);
  console.log("Shorts:", shorts);

  const swimwear = await client.fetch(`*[_type == "product" && category == "swimwear"]{ title }`);
  console.log("Swimwear:", swimwear);
}
run();
