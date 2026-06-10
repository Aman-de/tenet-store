import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9zyx0aef',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-01-22',
  token: 'skCcTvg0XHGkMNKviW1hySyaw2TkR8zM72NQnK73o2fV8qARVC0h6eP3Qo4l9sSLzzHUAldgJFcGddGxoZdhcOyPQNYQXRbhXnN6zJFCQXlJ8bRccbH27EerVOEliiKVhJubhOKfInRyeW8YUEEGslmLaDw0U7Uj27PqcodOagja1TW8OWtb'
});

async function run() {
  try {
    // Find the product
    const query = "*[_type == 'product' && title match 'Chocolate*']";
    const products = await client.fetch(query);
    
    console.log(`Found ${products.length} matching products.`);
    for (const p of products) {
      console.log(`- ${p.title} (${p._id})`);
      
      // Update the product to be a component-based set
      const updated = await client.patch(p._id)
        .set({
          apparelType: 'set',
          enableSetComponents: true,
          topPrice: Math.round(p.price * 0.4), // example split
          bottomPrice: Math.round(p.price * 0.6),
          setPrice: p.price
        })
        .commit();
        
      console.log(`Updated ${updated.title}`);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
