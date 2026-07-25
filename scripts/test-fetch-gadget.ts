import { getProduct } from '../lib/sanity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yudexes6';

async function test() {
    const product = await getProduct('iphone-17-series');
    console.log('Product Title:', product?.title);
    console.log('Category:', product?.category);
    console.log('Models count:', product?.gadgetModels?.length);
    console.log('Sub-models:', JSON.stringify(product?.gadgetModels?.map((m: any) => ({ name: m.name, price: m.price, colors: m.variants?.map((v: any) => v.colorName) })), null, 2));
}

test().catch(console.error);
