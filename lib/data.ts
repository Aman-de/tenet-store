export interface Variant {
    colorName: string;
    colorHex: string;
    images: string[];
    stock: number;
}

export interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    title: string;
    handle: string;
    originalPrice?: number;
    price: number;
    discountLabel?: string | null;
    category: string;
    images: string[];
    colors: string[];

    // New Fields
    sizeType?: 'clothing' | 'numeric' | 'onesize';
    sizes?: string[];
    variants?: Variant[];
}

export const products: Product[] = [
    {
        id: "prod_01",
        title: "The Sterling Cashmere Vest",
        handle: "sterling-cashmere-vest",
        originalPrice: 18600,
        price: 10600,
        discountLabel: "SAVE RS. 8,000",
        category: "Knitwear",
        images: ["/images/products/white.jpeg", "/images/products/white.jpeg"],
        colors: ["#FDFBF7", "#1A1A1A"]
    },
    {
        id: "prod_02",
        title: "The Archive Cable Knit Zip",
        handle: "archive-cable-knit-zip",
        originalPrice: 8400,
        price: 4200,
        discountLabel: "SAVE RS. 4,200",
        category: "Knitwear",
        images: ["/images/products/combo.jpeg", "/images/products/combo.jpeg"],
        colors: ["#1A1A1A", "#355E3B"]
    },
    {
        id: "prod_03",
        title: "The Haven Cashmere Hoodie",
        handle: "haven-cashmere-hoodie",
        originalPrice: 12500,
        price: 8400,
        discountLabel: "SAVE RS. 4,100",
        category: "Lounge",
        images: ["/images/products/hoodie.jpeg", "/images/products/hoodie.jpeg"],
        colors: ["#F5F5DC", "#2F4F4F"]
    },
    {
        id: "prod_04",
        title: "The Scholar Turtleneck",
        handle: "scholar-turtleneck",
        originalPrice: 6500,
        price: 4200,
        discountLabel: "SAVE RS. 2,300",
        category: "Knitwear",
        images: ["/images/products/turtelneck.jpg", "/images/products/turtelneck.jpg"],
        colors: ["#1A1A1A", "#808080", "#FDFBF7"]
    }
];
