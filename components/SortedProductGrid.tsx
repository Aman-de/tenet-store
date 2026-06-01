"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";
// Framer motion removed for instant rendering
import { ChevronDown } from "lucide-react";

import { useGender } from "@/context/GenderContext";

interface SortedProductGridProps {
    products: Product[];
    sizeType?: string;
    showSizeFilter?: boolean;
    alignFiltersWithTitle?: boolean;
}

type SortOption = "newest" | "price-asc" | "price-desc";

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

    // Filter products dynamically by the active global gender
    const products = rawProducts.filter(p => {
        const g = p.gender ? p.gender.toLowerCase() : 'man';
        return g === activeGender || g === 'unisex';
    });

    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [isSortOpen, setIsSortOpen] = useState(false);
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
        filteredProducts = filteredProducts.filter(p => p.price < 10000);
    } else if (priceFilter === 'mid') {
        filteredProducts = filteredProducts.filter(p => p.price >= 10000 && p.price <= 30000);
    } else if (priceFilter === 'premium') {
        filteredProducts = filteredProducts.filter(p => p.price > 30000);
    }

    // 3. Sort the filtered results
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === "price-asc") {
            return a.price - b.price;
        }
        if (sortOption === "price-desc") {
            return b.price - a.price;
        }
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
                                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                            : "bg-white text-neutral-600 border-gray-200 hover:border-[#1A1A1A]"
                                            }`}
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
                                    className={`h-9 flex-1 lg:flex-none lg:px-4 flex items-center justify-center rounded-sm text-xs font-bold uppercase transition-all border ${priceFilter === tier
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                        : "bg-white text-neutral-600 border-gray-200 hover:border-[#1A1A1A]"
                                        }`}
                                >
                                    {tier === 'all' ? 'All' : tier}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Divider */}
                    <span className="hidden lg:inline-block w-px h-4 bg-neutral-200" />

                    {/* Sort Dropdown */}
                    <div className="relative z-20 w-full lg:w-auto">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="h-9 px-4 flex items-center justify-between lg:justify-start gap-2 rounded-sm text-xs font-bold uppercase transition-all border bg-white text-neutral-600 border-gray-200 hover:border-[#1A1A1A] whitespace-nowrap w-full lg:w-auto"
                        >
                            <span>{sortOption === "newest" ? "Sort: Newest" : sortOption === "price-asc" ? "Sort: Low to High" : "Sort: High to Low"}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isSortOpen && (
                            <div className="absolute right-0 top-full mt-1 w-full lg:w-44 bg-white border border-neutral-100 shadow-xl py-1.5 rounded-sm origin-top-right z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { setSortOption("newest"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "newest" ? "font-bold text-black" : "text-neutral-500"}`}
                                >
                                    Newest
                                </button>
                                <button
                                    onClick={() => { setSortOption("price-asc"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "price-asc" ? "font-bold text-black" : "text-neutral-500"}`}
                                >
                                    Price: Low to High
                                </button>
                                <button
                                    onClick={() => { setSortOption("price-desc"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "price-desc" ? "font-bold text-black" : "text-neutral-500"}`}
                                >
                                    Price: High to Low
                                </button>
                            </div>
                        )}
                    </div>
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
