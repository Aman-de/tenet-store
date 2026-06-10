import { createClient } from 'next-sanity';

export const client = createClient({
    projectId: '9zyx0aef',
    dataset: 'production',
    apiVersion: '2026-01-22',
    useCdn: false,
    token: 'skCcTvg0XHGkMNKviW1hySyaw2TkR8zM72NQnK73o2fV8qARVC0h6eP3Qo4l9sSLzzHUAldgJFcGddGxoZdhcOyPQNYQXRbhXnN6zJFCQXlJ8bRccbH27EerVOEliiKVhJubhOKfInRyeW8YUEEGslmLaDw0U7Uj27PqcodOagja1TW8OWtb'
});

async function run() {
    try {
        const query = `*[_type == "product" && title match "Chocolate*"]`;
        const products = await client.fetch(query);
        
        for (const p of products) {
            console.log(`Patching ${p._id}`);
            const updated = await client.patch(p._id)
                .set({
                    apparelType: 'set',
                    enableSetComponents: true,
                    topPrice: 360,
                    bottomPrice: 539,
                    setPrice: p.price || 899
                })
                .commit();
            console.log("Updated:", updated);
        }
    } catch (err) {
        console.error(err);
    }
}

run();
