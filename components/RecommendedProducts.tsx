"use client";

import { Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

interface RecommendedProductsProps {
    products: Product[];
}

export default function RecommendedProducts({ products }: RecommendedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 md:py-24 border-t border-neutral-200">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-8 md:mb-12 text-center">
                You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
