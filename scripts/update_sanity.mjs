import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'lib/sanity.ts');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove alt overrides for the 7 items
content = content.replace(/"the archive cable knit zip": { alt: ".*?" },\n\s*/, '');
content = content.replace(/"the tailored gurkha trouser": { alt: ".*?" },\n\s*/, '');
content = content.replace(/"the voyager leather duffel": { alt: ".*?" },\n\s*/, '');
content = content.replace(/"the heritage chronograph": { alt: ".*?" },\n\s*/, '');
content = content.replace(/"the weekender": { alt: ".*?" },\n\s*/, '');
content = content.replace(/"the hamptons weekend edit": { alt: ".*?" },\n\s*/, '');
content = content.replace(/"the amalfi stripe": { alt: ".*?" },\n\s*/, '');

// 2. Add ARTIFICIAL_PRODUCTS array
const artificialProductsCode = `
const ARTIFICIAL_PRODUCTS = [
    {
        id: "art-cable-knit",
        title: "The Alpine Cable Knit",
        handle: "the-alpine-cable-knit",
        price: 2899,
        originalPrice: null,
        category: "knitwear",
        images: ["/images/generated/the_archive_cable_knit_zip_alt_1779785469898.png"],
        colors: ["#8B7355"],
        sizes: ["S", "M", "L", "XL"],
        sizeType: "clothing",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Oatmeal", colorHex: "#8B7355", stock: 10, images: ["/images/generated/the_archive_cable_knit_zip_alt_1779785469898.png"] }]
    },
    {
        id: "art-gurkha",
        title: "The Minimalist Gurkha Trouser",
        handle: "the-minimalist-gurkha-trouser",
        price: 2499,
        originalPrice: null,
        category: "pants",
        images: ["/images/generated/the_tailored_gurkha_trouser_alt_1779785496750.png"],
        colors: ["#4A4A4A"],
        sizes: ["28", "30", "32", "34", "36"],
        sizeType: "pants",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Charcoal", colorHex: "#4A4A4A", stock: 10, images: ["/images/generated/the_tailored_gurkha_trouser_alt_1779785496750.png"] }]
    },
    {
        id: "art-duffel",
        title: "The Artisan Leather Duffel",
        handle: "the-artisan-leather-duffel",
        price: 4999,
        originalPrice: null,
        category: "accessories",
        images: ["/images/generated/the_voyager_leather_duffel_alt_1779785533301.png"],
        colors: ["#5C4033"],
        sizes: ["One Size"],
        sizeType: "onesize",
        gender: "unisex",
        isOutOfStock: false,
        variants: [{ colorName: "Vintage Brown", colorHex: "#5C4033", stock: 10, images: ["/images/generated/the_voyager_leather_duffel_alt_1779785533301.png"] }]
    },
    {
        id: "art-chrono",
        title: "The Onyx Chronograph",
        handle: "the-onyx-chronograph",
        price: 8999,
        originalPrice: null,
        category: "accessories",
        images: ["/images/generated/the_heritage_chronograph_alt_1779785550608.png"],
        colors: ["#000000"],
        sizes: ["One Size"],
        sizeType: "onesize",
        gender: "unisex",
        isOutOfStock: false,
        variants: [{ colorName: "Silver/Black", colorHex: "#000000", stock: 10, images: ["/images/generated/the_heritage_chronograph_alt_1779785550608.png"] }]
    },
    {
        id: "art-weekender",
        title: "The Heritage Weekender",
        handle: "the-heritage-weekender",
        price: 3499,
        originalPrice: null,
        category: "accessories",
        images: ["/images/generated/the_weekender_alt_1779785663583.png"],
        colors: ["#6B8E23"],
        sizes: ["One Size"],
        sizeType: "onesize",
        gender: "unisex",
        isOutOfStock: false,
        variants: [{ colorName: "Olive", colorHex: "#6B8E23", stock: 10, images: ["/images/generated/the_weekender_alt_1779785663583.png"] }]
    },
    {
        id: "art-hamptons",
        title: "The Weekend Escape Edit",
        handle: "the-weekend-escape-edit",
        price: 4599,
        originalPrice: null,
        category: "sets",
        images: ["/images/generated/the_hamptons_weekend_edit_alt_1779785717300.png"],
        colors: ["#F5F5DC"],
        sizes: ["S", "M", "L", "XL"],
        sizeType: "clothing",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Linen", colorHex: "#F5F5DC", stock: 10, images: ["/images/generated/the_hamptons_weekend_edit_alt_1779785717300.png"] }]
    },
    {
        id: "art-amalfi",
        title: "The Coastal Stripe Resort Shirt",
        handle: "the-coastal-stripe-resort-shirt",
        price: 1999,
        originalPrice: null,
        category: "shirts",
        images: ["/images/generated/the_amalfi_stripe_alt_1779785859994.png"],
        colors: ["#4682B4"],
        sizes: ["S", "M", "L", "XL"],
        sizeType: "clothing",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Blue Stripe", colorHex: "#4682B4", stock: 10, images: ["/images/generated/the_amalfi_stripe_alt_1779785859994.png"] }]
    }
];

`;

content = content.replace(/export const client = createClient\(\{/g, artificialProductsCode + 'export const client = createClient({');

// 3. Inject ARTIFICIAL_PRODUCTS into list functions
content = content.replace(/return \(products \|\| \[\]\)/g, 'return [...ARTIFICIAL_PRODUCTS, ...(products || [])]');

const getProductRegex = /export async function getProduct\(slug: string\) \{[\s\S]*?return \{\s*id: product\._id,[\s\S]*?images: defaultImages,\s*colors: defaultColors,\s*\}\;\s*\}/;

const newGetProduct = `export async function getProduct(slug: string) {
    const art = ARTIFICIAL_PRODUCTS.find(p => p.handle === slug);
    if (art) return art;

    const query = \`*[_type == "product" && slug.current == $slug][0]{
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
    isOutOfStock,
    variants[]{
        colorName,
        colorHex,
        stock,
        "images": images[].asset->url
    }
  }\`;

    const product = await client.fetch(query, { slug });

    if (!product || HIDDEN_PRODUCT_TITLES.has(product.title)) return null;

    const defaultImages = product.variants?.[0]?.images || [];
    const defaultColors = product.variants?.map((v: any) => v.colorHex) || [];

    return {
        id: product._id,
        title: product.title,
        handle: product.slug,
        ...getIndianPricing(product.title),
        category: product.category,

        sizeType: product.sizeType || 'clothing',
        sizes: product.sizes || [],
        variants: product.variants?.map((v: any) => ({
            ...v,
            images: resolveVariantImages(product.title, v.images || [])
        })) || [],
        gender: product.gender,
        isOutOfStock: product.isOutOfStock || false,

        images: resolveVariantImages(product.title, defaultImages),
        colors: defaultColors,
    };
}`;

content = content.replace(getProductRegex, newGetProduct);

fs.writeFileSync(file, content);
console.log("Replaced getProduct and added ARTIFICIAL_PRODUCTS");
