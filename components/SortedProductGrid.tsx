"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SortedProductGridProps {
    products: Product[];
    sizeType?: string;
}

type SortOption = "newest" | "price-asc" | "price-desc";

const sizeMaps: Record<string, string[]> = {
    clothing: ["XS", "S", "M", "L", "XL", "XXL"],
    footwear: ["6", "7", "8", "9", "10", "11", "12"],
    numeric: ["28", "30", "32", "34", "36"],
    none: []
};

export default function SortedProductGrid({ products, sizeType = "clothing" }: SortedProductGridProps) {
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [priceFilter, setPriceFilter] = useState<'all' | 'standard' | 'mid' | 'premium'>('all');

    // 1. Filter by Size first
    let filteredProducts = selectedSize
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
        // Newest (default) - assuming original order is roughly newest or we don't have a date field
        return 0;
    });

    const sizes = sizeMaps[sizeType] || sizeMaps.clothing;

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
            <div className="flex flex-col gap-6 py-4 border-b border-neutral-100 mb-8">

                {/* Header: Sort & Mobile Labels */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                        {sortedProducts.length} Results
                    </span>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:opacity-70 transition-opacity py-2"
                        >
                            Sort By
                            <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isSortOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-xl z-20 py-2 rounded-sm origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { setSortOption("newest"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "newest" ? "font-bold text-black" : "text-neutral-500"}`}
                                >
                                    Newest
                                </button>
                                <button
                                    onClick={() => { setSortOption("price-asc"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "price-asc" ? "font-bold text-black" : "text-neutral-500"}`}
                                >
                                    Price: Low to High
                                </button>
                                <button
                                    onClick={() => { setSortOption("price-desc"); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "price-desc" ? "font-bold text-black" : "text-neutral-500"}`}
                                >
                                    Price: High to Low
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">

                    {/* Size Filter */}
                    {sizes.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] opacity-60">Size</span>
                            <div className="flex flex-wrap gap-2">
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

                    {/* Divider for mobile visual separation if needed, or just gap */}

                    {/* Price Tier Filter */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] opacity-60">Price Tier</span>
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'standard', 'mid', 'premium'] as const).map((tier) => (
                                <button
                                    key={tier}
                                    onClick={() => setPriceFilter(tier)}
                                    className={`h-9 px-4 flex items-center justify-center rounded-sm text-xs font-bold uppercase transition-all border ${priceFilter === tier
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                        : "bg-white text-neutral-600 border-gray-200 hover:border-[#1A1A1A]"
                                        }`}
                                >
                                    {tier === 'all' ? 'All' : tier}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8"
            >
                <AnimatePresence mode="popLayout">
                    {sortedProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                    {sortedProducts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-20 text-center text-neutral-400 font-sans text-sm"
                        >
                            No products found in this range.
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
