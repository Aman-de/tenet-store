"use client";

import { useState, useRef } from "react";
import { Product } from "@/lib/data";
import CategoryFilter from "./CategoryFilter";
import SortedProductGrid from "./SortedProductGrid";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

interface ProductSectionProps {
    products: Product[];
}

export default function ProductSection({ products }: ProductSectionProps) {
    const [activeGender, setActiveGender] = useState<'man' | 'woman'>('man');
    const [isSticky, setIsSticky] = useState(false);

    // Advanced Scroll tracking
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (!sectionRef.current) return;

        // Get the top position of the section relative to viewport, plus scroll offset
        const sectionTop = sectionRef.current.offsetTop;

        // We want it to become sticky when we scroll PAST the header area
        // roughly 200px into the section
        const stickyThreshold = sectionTop + 150;

        if (latest > stickyThreshold && !isSticky) {
            setIsSticky(true);
        } else if (latest <= stickyThreshold && isSticky) {
            setIsSticky(false);
        }
    });

    // Filter products based on gender
    // Default to 'man' if gender is missing (legacy data safety)
    const filteredProducts = products.filter(p => (p.gender || 'man') === activeGender);

    // Filter Toggle Component
    const FilterToggle = () => (
        <div className={`flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 p-1.5 transition-all duration-300 ${isSticky
                ? 'fixed bottom-[85px] md:bottom-10 left-1/2 -translate-x-1/2 z-[100]'
                : 'relative z-10 mx-auto w-fit mb-8'
            }`}>
            <button
                onClick={() => setActiveGender('man')}
                className={`relative w-28 py-2.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full transition-colors z-10 ${activeGender === 'man' ? 'text-white' : 'text-neutral-500 hover:text-[#1A1A1A]'
                    }`}
            >
                Men
                {activeGender === 'man' && (
                    <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-[#1A1A1A] rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </button>
            <button
                onClick={() => setActiveGender('woman')}
                className={`relative w-28 py-2.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full transition-colors z-10 ${activeGender === 'woman' ? 'text-white' : 'text-neutral-500 hover:text-[#1A1A1A]'
                    }`}
            >
                Women
                {activeGender === 'woman' && (
                    <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-[#1A1A1A] rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </button>
        </div>
    );

    return (
        <section ref={sectionRef} id="new-arrivals" className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-col items-center text-center">
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2">
                    Curated Selection
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-8">
                    New Arrivals
                </h2>

                {/* Regular Inline placement logic: render it here if NOT sticky, to hold space */}
                <div className="min-h-[64px] w-full flex justify-center">
                    <FilterToggle />
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
