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
    const products = await client.fetch(`*[_type == "product" && title == "Chocolate & Denim Set"]{variants}`);
    const blue = products[0].variants.find((v: any) => v.colorName === 'Blue');
    console.log(JSON.stringify(blue.images, null, 2));
    console.log("BOTTOM:", JSON.stringify(blue.bottomImages, null, 2));
}

main();
