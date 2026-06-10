import { createClient } from 'next-sanity';

export const client = createClient({
    projectId: '9zyx0aef',
    dataset: 'production',
    apiVersion: '2026-01-22',
    useCdn: false,
    token: 'skCcTvg0XHGkMNKviW1hySyaw2TkR8zM72NQnK73o2fV8qARVC0h6eP3Qo4l9sSLzzHUAldgJFcGddGxoZdhcOyPQNYQXRbhXnN6zJFCQXlJ8bRccbH27EerVOEliiKVhJubhOKfInRyeW8YUEEGslmLaDw0U7Uj27PqcodOagja1TW8OWtb'
});

async function run() {
    const query = `*[_type == "product" && title match "Chocolate*"][0]{
        _id,
        title,
        "slug": slug.current,
        price,
        apparelType,
        enableSetComponents,
        topPrice,
        bottomPrice,
        setPrice
    }`;
    const product = await client.fetch(query, {}, { cache: 'no-store' });
    console.log("SANITY DB DATA:", product);
}

run();
