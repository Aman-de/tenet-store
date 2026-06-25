import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '../sanity/env';

const token = process.env.SANITY_API_TOKEN;

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token
});

async function main() {
    try {
        const products = await client.fetch(`*[_type == "product" && title == "Chocolate & Denim Set"]{_id}`);
        const productId = products[0]._id;
        
        // Fetch document at a time before my script ran (e.g., 2026-06-25T11:00:00Z)
        const history = await client.request({
            uri: `/data/history/${dataset}/documents/${productId}?time=2026-06-25T11:00:00Z`
        });
        
        console.log(JSON.stringify(history.documents[0].variants, null, 2));
    } catch (err) {
        console.error(err);
    }
}

main();
