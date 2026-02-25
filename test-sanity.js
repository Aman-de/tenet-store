const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});

async function run() {
  const collections = await client.fetch(`*[_type == "collection"]{ title, slug, filterTag }`);
  console.log("Collections:", collections);

  const products = await client.fetch(`*[_type == "product" && category == "knitwear"]{ title, category }`);
  console.log("Products in Knitwear:", products.length);

  const collectionKnitwear = await client.fetch(`*[_type == "collection" && slug.current == "knitwear"][0]{
    "products": *[_type == "product" && (category == ^.filterTag || _id in ^.products[]._ref)]{ title }
  }`);
  console.log("Collection mapping for Knitwear:", collectionKnitwear);
}
run();
