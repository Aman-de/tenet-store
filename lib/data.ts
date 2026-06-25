export interface Variant {
    colorName: string;
    colorHex: string;
    secondaryColorHex?: string;
    images: string[];
    stock: number;
}

export interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
    images?: string[];
}

export interface Product {
    id: string;
    title: string;
    handle: string;
    originalPrice?: number | null;
    price: number;
    discountLabel?: string | null;
    category: string;
    images: string[];
    colors: string[];

    // New Fields
    isBestSeller?: boolean;
    bestSellerRank?: number;
    sizeType?: string;
    sizes?: string[];
    variants?: Variant[];
    imagePromptNote?: string;
    gender?: string;
    isOutOfStock?: boolean;
    description?: string;

    // Set Components Fields
    apparelType?: 'top' | 'bottom' | 'set' | 'footwear' | 'accessory';
    enableSetComponents?: boolean;
    topPrice?: number;
    topOriginalPrice?: number;
    bottomPrice?: number;
    bottomOriginalPrice?: number;
    setPrice?: number;
    setOriginalPrice?: number;
    topName?: string;
    topImages?: string[];
    bottomName?: string;
    bottomImages?: string[];
}

export const products: Product[] = [
    {
        id: "prod_01",
        title: "Sterling Vest",
        handle: "sterling-cashmere-vest",
        originalPrice: 18600,
        price: 10600,
        discountLabel: "SAVE RS. 8,000",
        category: "Knitwear",
        images: ["/images/products/white.webp", "/images/products/white.webp", "/images/generated/the_sterling_cashmere_vest_third.webp"],
        colors: ["#FDFBF7", "#1A1A1A"]
    },
    {
        id: "prod_02",
        title: "Linen Combo",
        handle: "archive-cable-knit-zip",
        originalPrice: 8400,
        price: 4200,
        discountLabel: "SAVE RS. 4,200",
        category: "Knitwear",
        images: ["/images/products/combo.webp", "/images/generated/the_archive_cable_knit_zip_real_alt_matching.webp", "/images/generated/the_archive_cable_knit_zip_third.webp"],
        colors: ["#1A1A1A", "#355E3B"]
    },
    {
        id: "prod_03",
        title: "Cashmere Hoodie",
        handle: "haven-cashmere-hoodie",
        originalPrice: 12500,
        price: 8400,
        discountLabel: "SAVE RS. 4,100",
        category: "Lounge",
        images: ["/images/products/hoodie.webp", "/images/products/hoodie.webp"],
        colors: ["#F5F5DC", "#2F4F4F"]
    },
    {
        id: "prod_04",
        title: "Scholar Turtleneck",
        handle: "scholar-turtleneck",
        originalPrice: 6500,
        price: 4200,
        discountLabel: "SAVE RS. 2,300",
        category: "Knitwear",
        images: ["/images/products/turtelneck.webp", "/images/products/turtelneck.webp", "/images/generated/the_scholar_turtleneck_third.webp"],
        colors: ["#1A1A1A", "#808080", "#FDFBF7"]
    }
];
