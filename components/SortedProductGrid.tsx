"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";
import { useStore } from "@/lib/store";

import { useGender } from "@/context/GenderContext";

interface SortedProductGridProps {
    products: Product[];
    sizeType?: string;
    showSizeFilter?: boolean;
    alignFiltersWithTitle?: boolean;
}

const standardSizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "3XL", "4XL"];

const sortSizes = (sizesList: string[]) => {
    return [...sizesList].sort((a, b) => {
        const indexA = standardSizeOrder.indexOf(a.toUpperCase());
        const indexB = standardSizeOrder.indexOf(b.toUpperCase());
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
    });
};

export default function SortedProductGrid({ products: rawProducts, showSizeFilter = true, alignFiltersWithTitle = false }: SortedProductGridProps) {
    const { gender: activeGender } = useGender();
    const isWoman = activeGender === "woman";
    const accentColor = isWoman ? "#E05275" : "#2B6496";

    // Filter products dynamically by the active global gender
    const products = rawProducts.filter(p => {
        const g = p.gender ? p.gender.toLowerCase() : 'man';
        return g === activeGender || g === 'unisex';
    });

    const { engagement } = useStore();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [priceFilter, setPriceFilter] = useState<'all' | 'standard' | 'mid' | 'premium'>('all');

    // Dynamically extract unique sizes from products
    const dynamicSizes = showSizeFilter
        ? Array.from(
            new Set(
                products
                    .flatMap(p => p.sizes || [])
                    .filter(Boolean)
                    .map(s => s.trim())
            )
        )
        : [];
    const sizes = sortSizes(dynamicSizes);

    // 1. Filter by Size first
    let filteredProducts = (showSizeFilter && selectedSize)
        ? products.filter(p => p.sizes?.some(s => s.trim().toLowerCase() === selectedSize.toLowerCase()))
        : products;

    // 2. Filter by Price Tier
    if (priceFilter === 'standard') {
        filteredProducts = filteredProducts.filter(p => p.price < 1000);
    } else if (priceFilter === 'mid') {
        filteredProducts = filteredProducts.filter(p => p.price >= 1000 && p.price < 3000);
    } else if (priceFilter === 'premium') {
        filteredProducts = filteredProducts.filter(p => p.price >= 3000);
    }

    // 3. Smart Feed Algorithm
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const catA = (a.category || "").toLowerCase();
        const catB = (b.category || "").toLowerCase();
        const scoreA = engagement[catA] || 0;
        const scoreB = engagement[catB] || 0;

        // Sort by highest engagement score first
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }
        
        // Fallback: Newest first (original array order)
        return 0;
    });

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <h3 className="font-serif text-2xl text-[#1A1A1A] mb-2">This collection is currently being curated.</h3>
                <p className="font-sans text-neutral-400 text-sm">Check back soon for new arrivals.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Utility Bar */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-neutral-100 mb-4 pb-2.5">
                {/* Left side: Results Count and Size Filter */}
                <div className="flex flex-wrap items-center gap-4">
                    <span className="hidden md:flex text-xs font-bold tracking-widest text-neutral-400 uppercase items-center h-9">
                        {sortedProducts.length} Results
                    </span>
                    {showSizeFilter && sizes.length > 0 && (
                        <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] opacity-60 flex items-center h-9">Size</span>
                            <div className="flex items-center gap-1.5">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                        className={`h-9 min-w-[36px] px-3 flex items-center justify-center rounded-sm text-xs font-medium transition-all border ${selectedSize === size
                                            ? "text-white"
                                            : "bg-white text-neutral-600 border-gray-200 hover:border-[#1A1A1A]"
                                            }`}
                                        style={selectedSize === size ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
                                    >
                                        {size}
                                    </button>
                                ))}
                                {selectedSize && (
                                    <button
                                        onClick={() => setSelectedSize(null)}
                                        className="h-9 px-3 flex items-center justify-center text-[10px] uppercase font-bold text-neutral-400 hover:text-[#1A1A1A]"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side: Price Tier and Sort By stacked on mobile, inline on desktop */}
                <div className={`flex flex-col lg:flex-row lg:items-center gap-4 w-full lg:w-auto border-t border-neutral-100 pt-3.5 lg:border-t-0 lg:pt-0 ${
                    alignFiltersWithTitle 
                        ? "lg:absolute lg:top-[56px] lg:right-6 xl:right-12 lg:-translate-y-1/2 z-30" 
                        : ""
                }`}>
                    {/* Price Tier */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 w-full lg:w-auto">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] opacity-60 flex items-center h-5 lg:h-9">Price Tier</span>
                        <div className="flex flex-wrap lg:flex-nowrap gap-1.5 w-full lg:w-auto">
                            {(['all', 'standard', 'mid', 'premium'] as const).map((tier) => (
                                <button
                                    key={tier}
                                    onClick={() => setPriceFilter(tier)}
                                    className={`h-9 flex-1 lg:flex-none lg:px-4 flex items-center justify-center rounded-sm text-xs font-bold uppercase transition-all border cursor-pointer ${priceFilter === tier
                                        ? "text-white"
                                        : "bg-white text-neutral-600 border-gray-200 hover:border-[#1A1A1A]"
                                        }`}
                                    style={priceFilter === tier ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
                                >
                                    {tier === 'all' && 'All'}
                                    {tier === 'standard' && 'Under ₹1K'}
                                    {tier === 'mid' && '₹1K - ₹3K'}
                                    {tier === 'premium' && 'Over ₹3K'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Divider */}
                    <span className="hidden lg:inline-block w-px h-4 bg-neutral-200" />

                    {/* Removed Smart Feed Indicator as per user request */}
                </div>
            </div>

            {/* Grid */}
            <div
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 lg:gap-x-8 lg:gap-y-16"
            >
                {sortedProducts.map((product) => (
                    <div key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
                {sortedProducts.length === 0 && (
                    <div
                        className="col-span-full py-10 text-center text-neutral-400 font-sans text-sm"
                    >
                        No products found in this range.
                    </div>
                )}
            </div>
        </div>
    );
}
