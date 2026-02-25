import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

export async function getProducts() {
    const query = `*[_type == "product"]{
    _id,
    title,
    "slug": slug.current,
    price,
    originalPrice,
    "imageUrl": variants[0].images[0].asset->url,
    "hoverImageUrl": variants[0].images[1].asset->url,
    category,
    "colors": variants[].colorHex,
    "discountLabel": "SAVE RS. " + (originalPrice - price),
    sizes,
    sizeType,
    gender
  }`;

    const products = await client.fetch(query, {}, { cache: 'no-store' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.map((p: any) => ({
        id: p._id,
        title: p.title,
        handle: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        images: [p.imageUrl, p.hoverImageUrl].filter(Boolean),
        colors: p.colors || [],
        discountLabel: p.discountLabel || (p.originalPrice && p.price ? `SAVE RS. ${p.originalPrice - p.price}` : null),
        sizes: p.sizes || [],
        sizeType: p.sizeType,
        gender: p.gender
    }));
}

export async function getProduct(slug: string) {
    const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    price,
    originalPrice,
    category,
    "discountLabel": "SAVE RS. " + (originalPrice - price),
    sizeType,
    sizeType,
    sizes,
    gender,
    variants[]{
        colorName,
        colorHex,
        stock,
        "images": images[].asset->url
    }
  }`;

    const product = await client.fetch(query, { slug });

    if (!product) return null;

    // Flatten default images for initial compatibility if needed, 
    // but primarily we will use variants[0]
    const defaultImages = product.variants?.[0]?.images || [];
    const defaultColors = product.variants?.map((v: any) => v.colorHex) || [];

    return {
        id: product._id,
        title: product.title,
        handle: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        discountLabel: product.discountLabel || (product.originalPrice && product.price ? `SAVE RS. ${product.originalPrice - product.price}` : null),

        // New Fields
        sizeType: product.sizeType || 'clothing',
        sizes: product.sizes || [],
        variants: product.variants || [],
        gender: product.gender,

        // Legacy compatibility (optional, but good for grid components re-using type)
        images: defaultImages,
        colors: defaultColors,
    };
}

export async function getRecommendedProducts(category: string, currentSlug: string) {
    const query = `*[_type == "product" && slug.current != $currentSlug][0...3]{
    _id,
    title,
    "slug": slug.current,
    price,
    originalPrice,
    "imageUrl": variants[0].images[0].asset->url,
    "hoverImageUrl": variants[0].images[1].asset->url,
    category,
    "colors": variants[].colorHex,
    "discountLabel": "SAVE RS. " + (originalPrice - price),
    gender
  }`;

    const products = await client.fetch(query, { category, currentSlug }, { cache: 'no-store' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.map((p: any) => ({
        id: p._id,
        title: p.title,
        handle: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        images: [p.imageUrl, p.hoverImageUrl].filter(Boolean),
        colors: p.colors || [],
        discountLabel: p.discountLabel || (p.originalPrice && p.price ? `SAVE RS. ${p.originalPrice - p.price}` : null),
        gender: p.gender
    }));
}

export async function getReviews(productId: string) {
    // Only fetch Approved reviews
    const query = `*[_type == "review" && product._ref == $productId && status == "Approved"] | order(_createdAt desc){
    _id,
    author,
    rating,
    comment,
    _createdAt
  }`;

    const reviews = await client.fetch(query, { productId }, { cache: 'no-store' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return reviews.map((r: any) => ({
        id: r._id,
        name: r.author, // Map author -> name
        rating: r.rating,
        comment: r.comment,
        date: r._createdAt
    }));
}

export async function getCollections() {
    const query = `*[_type == "collection"]{
    _id,
    title,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    description,
    filterTag
  }`;

    const collections = await client.fetch(query, {}, { cache: 'no-store' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return collections.map((c: any) => ({
        id: c._id,
        title: c.title,
        handle: c.slug,
        imageUrl: c.imageUrl,
        description: c.description,
        filterTag: c.filterTag
    }));
}

export async function getCollection(slug: string) {
    const query = `*[_type == "collection" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    description,
    sizeType,
    "products": *[_type == "product" && category == ^.filterTag]{
        _id,
        title,
        "slug": slug.current,
        price,
        originalPrice,
        "imageUrl": variants[0].images[0].asset->url,
        "hoverImageUrl": variants[0].images[1].asset->url,
        category,
        "colors": variants[].colorHex,
        "discountLabel": "SAVE RS. " + (originalPrice - price),
        sizes,
        sizeType,
        gender
    }
  }`;

    const collection = await client.fetch(query, { slug }, { cache: 'no-store' });

    if (!collection) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = (collection.products || []).map((p: any) => ({
        id: p._id,
        title: p.title,
        handle: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        images: [p.imageUrl, p.hoverImageUrl].filter(Boolean),
        colors: p.colors || [],
        discountLabel: p.discountLabel || (p.originalPrice && p.price ? `SAVE RS. ${p.originalPrice - p.price}` : null),
        sizes: p.sizes || [],
        sizeType: p.sizeType,
        gender: p.gender
    }));

    return {
        id: collection._id,
        title: collection.title,
        handle: collection.slug,
        imageUrl: collection.imageUrl,
        description: collection.description,
        products,
        sizeType: collection.sizeType || 'clothing'
    };
}

export async function getCartUpsells(cartProductIds: string[]) {
    if (!cartProductIds || cartProductIds.length === 0) return [];

    const query = `*[_type == "product" && _id in $cartProductIds].pairsWellWith[]->{
    _id,
    title,
    "slug": slug.current,
    price,
    originalPrice,
    "imageUrl": variants[0].images[0].asset->url,
    "hoverImageUrl": variants[0].images[1].asset->url,
    category,
    "colors": variants[].colorHex,
    "discountLabel": "SAVE RS. " + (originalPrice - price),
    sizeType,
    sizes,
    gender
  }`;

    const products = await client.fetch(query, { cartProductIds }, { cache: 'no-store' });

    // Filter out nulls and deduplicate
    const validProducts = products.filter((p: any) => p && p._id);
    const uniqueProducts = Array.from(new Map(validProducts.map((p: any) => [p._id, p])).values());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return uniqueProducts.map((p: any) => ({
        id: p._id,
        title: p.title,
        handle: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        images: [p.imageUrl, p.hoverImageUrl].filter(Boolean),
        colors: p.colors || [],
        discountLabel: p.discountLabel || (p.originalPrice && p.price ? `SAVE RS. ${p.originalPrice - p.price}` : null),
        sizeType: p.sizeType,
        sizes: p.sizes,
        gender: p.gender
    }));
}

export async function searchProducts(searchTerm: string) {
    const query = `*[_type == "product" && (
    title match $searchTerm + "*" ||
    category match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    filterTag match $searchTerm + "*" ||
    variants[].colorName match $searchTerm + "*"
  )] | order(_score desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    originalPrice,
    "imageUrl": variants[0].images[0].asset->url,
    "hoverImageUrl": variants[0].images[1].asset->url,
    category,
    "colors": variants[].colorHex,
    "discountLabel": "SAVE RS. " + (originalPrice - price),
    sizeType,
    sizes,
    gender
  }`;

    const products = await client.fetch(query, { searchTerm }, { cache: 'no-store' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.map((p: any) => ({
        id: p._id,
        title: p.title,
        handle: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category,
        images: [p.imageUrl, p.hoverImageUrl].filter(Boolean),
        colors: p.colors || [],
        discountLabel: p.discountLabel || (p.originalPrice && p.price ? `SAVE RS. ${p.originalPrice - p.price}` : null),
        sizeType: p.sizeType,
        sizes: p.sizes,
        gender: p.gender
    }));
}
