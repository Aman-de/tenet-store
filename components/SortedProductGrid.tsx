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

    // 1. Filter by Size first
    const filteredBySize = selectedSize
        ? products.filter(p => p.sizes?.some(s => s.trim().toLowerCase() === selectedSize.toLowerCase()))
        : products;

    // 2. Sort the filtered results
    const sortedProducts = [...filteredBySize].sort((a, b) => {
        if (sortOption === "price-asc") {
            return a.price - b.price;
        }
        if (sortOption === "price-desc") {
            return b.price - a.price;
        }
        return 0; // Default
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
            {/* Compact Utility Bar - Size & Sort on same row */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-4">

                {/* Left: Size Filter */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                    {sizes.length > 0 ? (
                        <>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] shrink-0">Size</span>
                            <div className="flex items-center gap-1.5">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-sm text-[10px] font-bold transition-all border shrink-0 ${selectedSize === size
                                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                            : "bg-white text-neutral-500 border-gray-200 hover:border-[#1A1A1A]"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                                {selectedSize && (
                                    <button
                                        onClick={() => setSelectedSize(null)}
                                        className="text-[10px] uppercase font-bold text-neutral-400 hover:text-[#1A1A1A] ml-1 shrink-0"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </>
                    ) : <div />}
                </div>

                {/* Right: Sort Dropdown */}
                <div className="relative shrink-0 ml-4">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:opacity-70 transition-opacity"
                    >
                        Sort By
                        <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isSortOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-xl z-20 py-2 rounded-sm origin-top-right animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => { setSortOption("newest"); setIsSortOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "newest" ? "font-bold text-black" : "text-neutral-500"}`}
                            >
                                Newest
                            </button>
                            <button
                                onClick={() => { setSortOption("price-asc"); setIsSortOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "price-asc" ? "font-bold text-black" : "text-neutral-500"}`}
                            >
                                Price: Low to High
                            </button>
                            <button
                                onClick={() => { setSortOption("price-desc"); setIsSortOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50 ${sortOption === "price-desc" ? "font-bold text-black" : "text-neutral-500"}`}
                            >
                                Price: High to Low
                            </button>
                        </div>
                    )}
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
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
