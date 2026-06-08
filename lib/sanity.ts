import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { Product } from "@/lib/data";

const HIDDEN_PRODUCT_TITLES = new Set([
    "The Alpine Lodge Edit",
    "The Savannah Explorer Edit",
    "The Manhattan Evening Edit",
    "The Paris Flâneur Edit",
    "The Harrington",
    "The Polo Ground Edit",
    "The Riviera Retreat",
    "The Oxford Blue Shirt",
    "The Yacht Club Edit",
    "The Aegean Odyssey Edit",
    "The Quarter-Zip Pullover",
    "The Highland Estate Edit",
    "The Aspen Chalet Edit",
    "The Oxford Scholar Edit",
    "The Country Club Brunch Edit",
    "The Diplomat Overcoat",
    "The Highland Flannel Shirt",
    "The Classic Harrington",
    "Classic Pique Polo",
    "Everyday Chino Trouser",
    "The Artisan Leather Duffel",
    "The Onyx Chronograph",
    "The Weekender",
    "The Heritage Weekender",
    "The Voyager Leather Duffel",
    "The Bali Bamboo Edit",
    "The Heavyweight Hoodie",
    "The Harbour Stripe Swim",
    "The Haven Cashmere Hoodie"
]);

const PRICE_OVERRIDES: Record<string, number> = {
    "essential heavyweight tee": 549,
    "the merino crewneck": 1199,
    "the weekender": 1599,
    "the pleated wool trouser": 1499,
    "the merino turtleneck": 1199,
    "the riviera linen short": 899,
    "the essential jogger": 999,
    "the heavyweight hoodie": 1299,
    "the amalfi stripe": 799
};

const IMAGE_OVERRIDES: Record<string, { main?: string, alt?: string, third?: string }> = {
};

function resolveImages(title: string, defaultMain: string, defaultAlt: string, defaultThird?: string) {
    if (!title) return [defaultMain, defaultAlt, defaultThird].filter(Boolean);
    const titleLower = title.toLowerCase();
    const override = IMAGE_OVERRIDES[titleLower];
    const main = override?.main || defaultMain;
    const alt = override?.alt || defaultAlt;
    const third = override?.third || defaultThird;
    return [main, alt, third].filter(Boolean);
}

function resolveVariantImages(title: string, defaultImages: string[]) {
    if (!title) return defaultImages;
    const titleLower = title.toLowerCase();
    const override = IMAGE_OVERRIDES[titleLower];
    if (!override) return defaultImages || [];
    const result = [...(defaultImages || [])];
    if (override.main) result[0] = override.main;
    if (override.alt) {
        if (result.length > 1) {
            result[1] = override.alt;
        } else {
            result.push(override.alt);
        }
    }
    if (override.third) {
        if (result.length > 2) {
            result[2] = override.third;
        } else {
            while (result.length < 2) {
                result.push("");
            }
            result[2] = override.third;
        }
    }
    return result.filter(Boolean);
}

function getIndianPricing(title: string) {
    if (!title) return { price: 999, originalPrice: null, discountLabel: null };
    
    let price = 0;
    const titleLower = title.toLowerCase();
    
    // Calculate consistent pseudoRandom hash
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const pseudoRandom = Math.abs(hash) / 2147483647; 

    if (PRICE_OVERRIDES[titleLower]) {
        price = PRICE_OVERRIDES[titleLower];
    } else {
        price = 800 + Math.floor(pseudoRandom * 20) * 100 - 1;
    }
    
    const hasDiscount = pseudoRandom > 0.85; // few items have MRP discount
    const originalPrice = hasDiscount ? price + 300 + Math.floor(pseudoRandom * 10) * 100 : null;
    const discountLabel = originalPrice ? `SAVE RS. ${originalPrice - price}` : null;
    return { price, originalPrice, discountLabel };
}

function extractPricing(p: any) {
    if (typeof p.price === 'number' && p.price > 0) {
        const discountLabel = p.originalPrice && p.originalPrice > p.price ? `SAVE RS. ${p.originalPrice - p.price}` : null;
        return { price: p.price, originalPrice: p.originalPrice || null, discountLabel };
    }
    return getIndianPricing(p.title);
}

const fetchWithRetry = async (url: string | URL, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok && response.status >= 500 && i < retries - 1) {
                console.warn(`⚠️ Fetch failed with status ${response.status}. Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.warn(`⚠️ Fetch error: ${(error as Error).message}. Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error("Fetch failed after all retries");
};


const ARTIFICIAL_PRODUCTS = [
    {
        id: "art-cable-knit",
        title: "The Alpine Cable Knit",
        handle: "the-alpine-cable-knit",
        price: 1799,
        originalPrice: null,
        category: "knitwear",
        images: ["/images/generated/the_archive_cable_knit_zip_alt_1779785469898.webp", "/images/generated/the_alpine_cable_knit_alt_1779835239375.webp"],
        colors: ["#8B7355"],
        sizes: ["S", "M", "L", "XL"],
        sizeType: "clothing",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Oatmeal", colorHex: "#8B7355", stock: 10, images: ["/images/generated/the_archive_cable_knit_zip_alt_1779785469898.webp", "/images/generated/the_alpine_cable_knit_alt_1779835239375.webp"] }]
    },
    {
        id: "art-gurkha",
        title: "The Minimalist Gurkha Trouser",
        handle: "the-minimalist-gurkha-trouser",
        price: 1599,
        originalPrice: null,
        category: "pants",
        images: ["/images/generated/the_tailored_gurkha_trouser_alt_1779785496750.webp", "/images/generated/the_minimalist_gurkha_trouser_alt_1779835253569.webp"],
        colors: ["#4A4A4A"],
        sizes: ["28", "30", "32", "34", "36"],
        sizeType: "pants",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Charcoal", colorHex: "#4A4A4A", stock: 10, images: ["/images/generated/the_tailored_gurkha_trouser_alt_1779785496750.webp", "/images/generated/the_minimalist_gurkha_trouser_alt_1779835253569.webp"] }]
    },
    {
        id: "art-duffel",
        title: "The Artisan Leather Duffel",
        handle: "the-artisan-leather-duffel",
        price: 2999,
        originalPrice: null,
        category: "accessories",
        images: ["/images/generated/the_voyager_leather_duffel_alt_1779785533301.webp", "/images/generated/the_artisan_leather_duffel_alt_1779835289705.webp"],
        colors: ["#5C4033"],
        sizes: ["One Size"],
        sizeType: "onesize",
        gender: "unisex",
        isOutOfStock: false,
        variants: [{ colorName: "Vintage Brown", colorHex: "#5C4033", stock: 10, images: ["/images/generated/the_voyager_leather_duffel_alt_1779785533301.webp", "/images/generated/the_artisan_leather_duffel_alt_1779835289705.webp"] }]
    },
    {
        id: "art-chrono",
        title: "The Onyx Chronograph",
        handle: "the-onyx-chronograph",
        price: 5499,
        originalPrice: null,
        category: "accessories",
        images: ["/images/generated/the_heritage_chronograph_alt_1779785550608.webp", "/images/generated/the_onyx_chronograph_alt_1779835307570.webp"],
        colors: ["#000000"],
        sizes: ["One Size"],
        sizeType: "onesize",
        gender: "unisex",
        isOutOfStock: false,
        variants: [{ colorName: "Silver/Black", colorHex: "#000000", stock: 10, images: ["/images/generated/the_heritage_chronograph_alt_1779785550608.webp", "/images/generated/the_onyx_chronograph_alt_1779835307570.webp"] }]
    },
    {
        id: "art-weekender",
        title: "The Heritage Weekender",
        handle: "the-heritage-weekender",
        price: 2199,
        originalPrice: null,
        category: "accessories",
        images: ["/images/generated/the_weekender_alt_1779785663583.webp"],
        colors: ["#6B8E23"],
        sizes: ["One Size"],
        sizeType: "onesize",
        gender: "unisex",
        isOutOfStock: false,
        variants: [{ colorName: "Olive", colorHex: "#6B8E23", stock: 10, images: ["/images/generated/the_weekender_alt_1779785663583.webp"] }]
    },
    {
        id: "art-hamptons",
        title: "The Weekend Escape Edit",
        handle: "the-weekend-escape-edit",
        price: 2799,
        originalPrice: null,
        category: "sets",
        images: ["/images/generated/the_hamptons_weekend_edit_alt_1779785717300.webp"],
        colors: ["#F5F5DC"],
        sizes: ["S", "M", "L", "XL"],
        sizeType: "clothing",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Linen", colorHex: "#F5F5DC", stock: 10, images: ["/images/generated/the_hamptons_weekend_edit_alt_1779785717300.webp"] }]
    },
    {
        id: "art-amalfi",
        title: "The Coastal Stripe Resort Shirt",
        handle: "the-coastal-stripe-resort-shirt",
        price: 1199,
        originalPrice: null,
        category: "shirts",
        images: ["/images/generated/the_amalfi_stripe_alt_1779785859994.webp"],
        colors: ["#4682B4"],
        sizes: ["S", "M", "L", "XL"],
        sizeType: "clothing",
        gender: "men",
        isOutOfStock: false,
        variants: [{ colorName: "Blue Stripe", colorHex: "#4682B4", stock: 10, images: ["/images/generated/the_amalfi_stripe_alt_1779785859994.webp"] }]
    }
];

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    fetch: fetchWithRetry as any
});

const PREMIUM_NAMES: Record<string, string> = {
    // Knitwear
    "the 0438 cashmere mockneck": "Cashmere Mockneck",
    "the bori wool-cashmere knit": "Bori Knit",
    "the capri evening edit": "Capri Edit",
    "the cashmere polo": "Cashmere Polo",
    "the heritage cable knit": "Heritage Knit",
    "the heritage structured polo": "Structured Polo",
    "the mediterranean retreat edit": "Mediterranean Edit",
    "the merino crewneck": "Merino Crewneck",
    "the merino turtleneck": "Merino Turtleneck",
    "the monaco grand prix edit": "Monaco Edit",
    "the noir quarter-zip": "Noir Quarter-Zip",
    "the scholar turtleneck": "Scholar Turtleneck",
    "the sterling cashmere vest": "Sterling Vest",
    "the textured knit polo": "Textured Polo",
    "the alpine cable knit": "Alpine Knit",

    // Accessories
    "the bridle leather belt": "Bridle Belt",
    "the heritage chronograph": "Heritage Chronograph",

    // Shirts
    "the amalfi linen popover": "Amalfi Popover",
    "the riviera resort shirt": "Riviera Shirt",
    "the venetian gondola edit": "Venetian Edit",
    "breezy linen resort shirt": "Linen Resort Shirt",
    "the amalfi stripe": "Amalfi Stripe",
    "the classic chic shirt": "Chic Shirt",
    "the daily oxford": "Daily Oxford",
    "the havana lounge edit": "Havana Edit",
    "the ibiza boho edit": "Ibiza Edit",
    "the oxford button-down": "Oxford Button-Down",
    "the riviera linen shirt": "Linen Shirt",
    "the riviera resort chic shirt": "Resort Shirt",
    "the savannah sunset edit": "Savannah Edit",
    "the signature tee": "Signature Tee",
    "the tulum eco-luxe edit": "Tulum Edit",
    "the coastal stripe resort shirt": "Coastal Stripe",

    // Jackets
    "the canvas chore coat": "Chore Coat",
    "the santorini sunset edit": "Santorini Edit",

    // Footwear
    "the chelsea boot": "Chelsea Boot",
    "the chelsea suede loafer": "Suede Loafer",
    "the desert boot": "Desert Boot",
    "the penny loafer": "Penny Loafer",

    // Outerwear
    "the 0215 structured overcoat": "Structured Overcoat",
    "the projectink structured blazer": "Structured Blazer",

    // Trousers
    "the 0438 tailored pleated trouser": "Tailored Trouser",
    "the gurkha trouser": "Gurkha Trouser",
    "the pleated chino": "Pleated Chino",
    "the pleated wool trouser": "Wool Trouser",
    "the tailored gurkha trouser": "Tailored Gurkha",
    "tuscan drawstring trousers": "Tuscan Drawstring",
    "vintage wash selvedge denim": "Selvedge Denim",
    "the minimalist gurkha trouser": "Gurkha Trouser",

    // Swimwear
    "the mykonos day club edit": "Mykonos Edit",
    "the sunset swim edit": "Sunset Edit",

    // Sets
    "the aegean odyssey": "Aegean Odyssey",
    "the amalfi aperitivo": "Amalfi Aperitivo",
    "the cabana terry set": "Cabana Set",
    "the lake como villa edit": "Como Edit",
    "the weekend escape edit": "Escape Edit",

    // Lounge
    "the essential jogger": "Essential Jogger",

    // Shorts
    "the amalfi day edit": "Amalfi Edit",
    "the hamptons weekend edit": "Hamptons Edit",
    "the maldives resort edit": "Maldives Edit",
    "the -riviera linen short": "Linen Short",
    "the st. tropez promenade edit": "St. Tropez Edit",
    "the urban explorer edit": "Urban Edit"
};

function renameProductTitle(title: string): string {
    if (!title) return title;
    const titleLower = title.toLowerCase();
    
    if (titleLower === "the archive cable knit zip") {
        return "Linen Combo";
    }

    if (PREMIUM_NAMES[titleLower]) {
        return PREMIUM_NAMES[titleLower];
    }
    
    // Fallback: strip leading "The " if present
    if (title.startsWith("The ")) {
        return title.substring(4);
    }
    return title;
}

function mapProduct(p: any): Product {
    const titleLower = p.title?.toLowerCase();
    
    let title = renameProductTitle(p.title);
    
    let images = p.images || resolveImages(p.title, p.imageUrl, p.hoverImageUrl);
    let colors = p.colors || [];
    
    if (titleLower === "the amalfi stripe") {
        const originalMain = p.imageUrl || "/images/original_mains/the_amalfi_stripe_main.webp";
        const originalAlt = "/images/generated/the_amalfi_stripe_real_alt_matching.webp";
        const originalThird = "/images/generated/the_amalfi_stripe_third.webp";
        images = [originalMain, originalAlt, originalThird];
        colors = ["#556B2F", "#4682B4"];
    }

    if (titleLower === "the hamptons weekend edit") {
        const originalMain = p.imageUrl || "/images/original_mains/the_hamptons_weekend_edit_main.webp";
        const originalAlt = "/images/generated/the_hamptons_weekend_edit_blue_red_alt_1779882261092.webp";
        images = [originalMain, originalAlt];
        colors = ["#CD5C5C", "#F5F5DC"];
    }

    return {
        id: p._id || p.id,
        title,
        handle: p.slug || p.handle,
        ...extractPricing(p),
        category: p.category,
        images,
        colors,
        sizes: p.sizes || [],
        sizeType: p.sizeType || 'clothing',
        gender: p.gender,
        isOutOfStock: p.isOutOfStock || false,
        apparelType: p.apparelType,
        enableSetComponents: p.enableSetComponents,
        topPrice: p.topPrice,
        topOriginalPrice: p.topOriginalPrice,
        bottomPrice: p.bottomPrice,
        bottomOriginalPrice: p.bottomOriginalPrice,
        setPrice: p.setPrice,
        setOriginalPrice: p.setOriginalPrice,
    };
}

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
    sizes,
    sizeType,
    gender,
    isOutOfStock,
    apparelType,
    enableSetComponents,
    topPrice,
    topOriginalPrice,
    bottomPrice,
    bottomOriginalPrice,
    setPrice,
    setOriginalPrice
  }`;

    const products = await client.fetch(query, {}, { cache: 'no-store' });

    return [...ARTIFICIAL_PRODUCTS, ...(products || [])]
        .filter((p: any) => p && !HIDDEN_PRODUCT_TITLES.has(p.title))
        .map(mapProduct);
}

export async function getProduct(slug: string) {
    const art = ARTIFICIAL_PRODUCTS.find(p => p.handle === slug);
    if (art) {
        if (HIDDEN_PRODUCT_TITLES.has(art.title)) return null;
        return {
            ...art,
            title: renameProductTitle(art.title)
        };
    }

    const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    price,
    originalPrice,
    category,
    sizeType,
    sizes,
    gender,
    isOutOfStock,
    apparelType,
    enableSetComponents,
    topPrice,
    topOriginalPrice,
    bottomPrice,
    bottomOriginalPrice,
    setPrice,
    setOriginalPrice,
    variants[]{
        colorName,
        colorHex,
        stock,
        "images": images[].asset->url
    }
  }`;

    const product = await client.fetch(query, { slug });

    if (!product || HIDDEN_PRODUCT_TITLES.has(product.title)) return null;

    const defaultImages = product.variants?.[0]?.images || [];
    const defaultColors = product.variants?.map((v: any) => v.colorHex) || [];

    let title = renameProductTitle(product.title);
    if (product.title?.toLowerCase() === "the amalfi stripe") {
        const originalMain = defaultImages[0] || "/images/original_mains/the_amalfi_stripe_main.webp";
        const originalAlt = "/images/generated/the_amalfi_stripe_real_alt_matching.webp";
        const originalThird = "/images/generated/the_amalfi_stripe_third.webp";
        const blueImage = "/images/generated/the_amalfi_stripe_alt_1779836744521.webp";
        const blueAlt = "/images/generated/the_amalfi_stripe_blue_alt_1779882813282.webp";

        const variants = [
            {
                colorName: "Olive & White",
                colorHex: "#556B2F",
                stock: 15,
                images: [originalMain, originalAlt, originalThird]
            },
            {
                colorName: "Blue & White",
                colorHex: "#4682B4",
                stock: 15,
                images: [blueImage, blueAlt]
            }
        ];

        return {
            id: product._id,
            title,
            handle: product.slug,
            ...extractPricing(product),
            category: product.category,
            sizeType: product.sizeType || 'clothing',
            sizes: product.sizes || [],
            variants,
            gender: product.gender,
            isOutOfStock: product.isOutOfStock || false,
            images: [originalMain, originalAlt, originalThird, blueImage],
            colors: ["#556B2F", "#4682B4"],
            apparelType: product.apparelType,
            enableSetComponents: product.enableSetComponents,
            topPrice: product.topPrice,
            topOriginalPrice: product.topOriginalPrice,
            bottomPrice: product.bottomPrice,
            bottomOriginalPrice: product.bottomOriginalPrice,
            setPrice: product.setPrice,
            setOriginalPrice: product.setOriginalPrice,
        };
    }

    if (product.title?.toLowerCase() === "the hamptons weekend edit") {
        const originalMain = defaultImages[0] || "/images/original_mains/the_amalfi_stripe_main.webp"; // Fallback to main
        const originalAlt = "/images/generated/the_hamptons_weekend_edit_blue_red_alt_1779882261092.webp";
        const beigeModel = "/images/generated/the_hamptons_weekend_edit_alt_1779836712724.webp";
        const beigeAlt = "/images/generated/the_hamptons_weekend_edit_beige_alt_1779882353962.webp";

        const variants = [
            {
                colorName: "Blue & Red",
                colorHex: "#CD5C5C",
                stock: 15,
                images: [defaultImages[0] || originalMain, originalAlt]
            },
            {
                colorName: "Beige Linen",
                colorHex: "#F5F5DC",
                stock: 15,
                images: [beigeModel, beigeAlt]
            }
        ];

        return {
            id: product._id,
            title,
            handle: product.slug,
            ...extractPricing(product),
            category: product.category,
            sizeType: product.sizeType || 'clothing',
            sizes: product.sizes || [],
            variants,
            gender: product.gender,
            isOutOfStock: product.isOutOfStock || false,
            images: [defaultImages[0] || originalMain, originalAlt, beigeModel, beigeAlt],
            colors: ["#CD5C5C", "#F5F5DC"],
            apparelType: product.apparelType,
            enableSetComponents: product.enableSetComponents,
            topPrice: product.topPrice,
            topOriginalPrice: product.topOriginalPrice,
            bottomPrice: product.bottomPrice,
            bottomOriginalPrice: product.bottomOriginalPrice,
            setPrice: product.setPrice,
            setOriginalPrice: product.setOriginalPrice,
        };
    }

    return {
        id: product._id,
        title,
        handle: product.slug,
        ...extractPricing(product),
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
        apparelType: product.apparelType,
        enableSetComponents: product.enableSetComponents,
        topPrice: product.topPrice,
        topOriginalPrice: product.topOriginalPrice,
        bottomPrice: product.bottomPrice,
        bottomOriginalPrice: product.bottomOriginalPrice,
        setPrice: product.setPrice,
        setOriginalPrice: product.setOriginalPrice,
    };
}

export async function getRecommendedProducts(category: string, currentSlug: string, gender?: string) {
    const genderFilter = gender ? `&& gender == $gender` : "";
    const params: any = { category, currentSlug };
    if (gender) params.gender = gender;

    // Better algorithm: First try to fetch 12 items from the exact same category
    const query = `*[_type == "product" && category == $category && slug.current != $currentSlug ${genderFilter}][0...12]{
    _id,
    title,
    "slug": slug.current,
    price,
    originalPrice,
    "imageUrl": variants[0].images[0].asset->url,
    "hoverImageUrl": variants[0].images[1].asset->url,
    category,
    "colors": variants[].colorHex,
    gender,
    isOutOfStock
  }`;

    let products = await client.fetch(query, params, { cache: 'no-store' });
    products = (products || []).filter((p: any) => p && !HIDDEN_PRODUCT_TITLES.has(p.title));

    // Fallback: If we couldn't find at least 4 items, pad with general products to keep the grid full
    if (products.length < 4) {
        const fallbackLimit = 24;
        const fallbackQuery = `*[_type == "product" && category != $category && slug.current != $currentSlug ${genderFilter}][0...${fallbackLimit}]{
        _id,
        title,
        "slug": slug.current,
        price,
        originalPrice,
        "imageUrl": variants[0].images[0].asset->url,
        "hoverImageUrl": variants[0].images[1].asset->url,
        category,
        "colors": variants[].colorHex,
        gender,
        isOutOfStock
      }`;
        let fallbackProducts = await client.fetch(fallbackQuery, params, { cache: 'no-store' });
        fallbackProducts = (fallbackProducts || []).filter((p: any) => p && !HIDDEN_PRODUCT_TITLES.has(p.title));
        
        const needed = 12 - products.length;
        products = [...products, ...fallbackProducts.slice(0, needed)];
    }

    return products.map(mapProduct);
}

export async function getReviews(productId: string) {
    // Only fetch Approved reviews
    const query = `*[_type == "review" && product._ref == $productId && status == "Approved"] | order(_createdAt desc){
    _id,
    author,
    rating,
    comment,
    _createdAt,
    "images": images[].asset->url
  }`;

    const reviews = await client.fetch(query, { productId }, { cache: 'no-store' });

     
    return reviews.map((r: any) => ({
        id: r._id,
        name: r.author, // Map author -> name
        rating: r.rating,
        comment: r.comment,
        date: r._createdAt,
        images: r.images || []
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
        sizes,
        sizeType,
        gender,
        isOutOfStock
    }
  }`;

    const collection = await client.fetch(query, { slug }, { cache: 'no-store' });

    if (!collection) return null;

    const products = (collection.products || [])
        .filter((p: any) => p && !HIDDEN_PRODUCT_TITLES.has(p.title))
        .map(mapProduct);

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
    sizeType,
    sizes,
    gender,
    isOutOfStock
  }`;

    const products = await client.fetch(query, { cartProductIds }, { cache: 'no-store' });

    // Filter out nulls, hidden products, and deduplicate
    const validProducts = (products || []).filter((p: any) => p && p._id && !HIDDEN_PRODUCT_TITLES.has(p.title));
    const uniqueProducts = Array.from(new Map(validProducts.map((p: any) => [p._id, p])).values());

     
    return uniqueProducts.map(mapProduct);
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
    sizeType,
    sizes,
    gender,
    isOutOfStock
  }`;

    const products = await client.fetch(query, { searchTerm }, { cache: 'no-store' });

    return [...ARTIFICIAL_PRODUCTS, ...(products || [])]
        .filter((p: any) => p && !HIDDEN_PRODUCT_TITLES.has(p.title))
        .map(mapProduct);
}
