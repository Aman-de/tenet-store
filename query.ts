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
    const query = "*[_type == 'product' && title match 'Choc*']";
    const products = await client.fetch(query);
    console.log(products.map((p: any) => p.title));
  } catch (err) {
    console.error(err);
  }
}

run();
