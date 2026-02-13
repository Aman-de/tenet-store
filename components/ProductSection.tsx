"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import CategoryFilter from "./CategoryFilter";
import SortedProductGrid from "./SortedProductGrid";
import { motion, AnimatePresence } from "framer-motion";

interface ProductSectionProps {
    products: Product[];
}

export default function ProductSection({ products }: ProductSectionProps) {
    const [activeGender, setActiveGender] = useState<'man' | 'woman'>('man');

    // Filter products based on gender
    // Default to 'man' if gender is missing (legacy data safety)
    const filteredProducts = products.filter(p => (p.gender || 'man') === activeGender);

    return (
        <section id="new-arrivals" className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-col items-center mb-12 text-center">
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2">
                    Curated Selection
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">
                    New Arrivals
                </h2>

                {/* Gender Filter Tabs */}
                <div className="flex items-center gap-8 mb-8 border-b border-neutral-200">
                    <button
                        onClick={() => setActiveGender('man')}
                        className={`text-sm tracking-[0.2em] uppercase pb-4 transition-colors relative ${activeGender === 'man'
                            ? 'text-[#1A1A1A] font-medium'
                            : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                    >
                        Men
                        {activeGender === 'man' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A]"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveGender('woman')}
                        className={`text-sm tracking-[0.2em] uppercase pb-4 transition-colors relative ${activeGender === 'woman'
                            ? 'text-[#1A1A1A] font-medium'
                            : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                    >
                        Women
                        {activeGender === 'woman' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A1A1A]"
                            />
                        )}
                    </button>
                </div>
            </div>

            <motion.div layout className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {filteredProducts.length > 0 ? (
                        <SortedProductGrid key={activeGender} products={filteredProducts} />
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[400px] text-center"
                        >
                            <p className="font-serif text-2xl text-neutral-400 mb-2">Coming Soon</p>
                            <p className="text-sm text-neutral-500 tracking-wide uppercase">
                                {activeGender === 'woman' ? "Women's Collection Launching Fall 2025" : "New Styles Arriving Weekly"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section >
    );
}
