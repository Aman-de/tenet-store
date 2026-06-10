import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

async function run() {
  const product = await client.fetch(`*[_type == "product" && title match "Chocolate*"][0]`);
  console.log("Apparel Type:", product.apparelType);
  console.log("Enable Set Components:", product.enableSetComponents);
  console.log("Top Name:", product.topName);
  console.log("Top Images:", product.topImages);
}

run();
