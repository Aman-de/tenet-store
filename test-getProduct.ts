import { getProduct } from './lib/sanity';

async function run() {
    const product = await getProduct('chocolate-set');
    console.log("MAPPED PRODUCT:", product);
}

run();
