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
    // Fetch product
    const products = await client.fetch(`*[_type == "product" && title == "Chocolate & Denim Set"]{images}`);
    console.log(JSON.stringify(products[0], null, 2));
}

main();
