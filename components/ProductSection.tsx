"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "@/lib/data";
import CategoryFilter from "./CategoryFilter";
import SortedProductGrid from "./SortedProductGrid";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useGender } from "@/context/GenderContext";

interface ProductSectionProps {
    products: Product[];
}

export default function ProductSection({ products }: ProductSectionProps) {
    const { gender: activeGender, setGender: setActiveGender } = useGender();
    const [isSticky, setIsSticky] = useState(false);

    // Advanced Scroll tracking
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (!sectionRef.current) return;

        // Get the top position of the section relative to viewport, plus scroll offset
        const sectionTop = sectionRef.current.offsetTop;

        // We want it to be sticky WHEN WE ARE ABOVE the section (e.g. in the Hero)
        // And un-stick (become relative) once we scroll down INTO the New Arrivals section
        // We'll unstick it shortly before the title hits the top to make it look like it docks
        const stickyThreshold = sectionTop - 100;

        if (latest < stickyThreshold && !isSticky) {
            setIsSticky(true);
        } else if (latest >= stickyThreshold && isSticky) {
            setIsSticky(false);
        }
    });

    // On initial mount, check if we should be sticky
    // (In case they reload halfway down the page)
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        if (sectionRef.current) {
            const sectionTop = sectionRef.current.offsetTop;
            const stickyThreshold = sectionTop - 100;
            setIsSticky(window.scrollY < stickyThreshold);
        }
    }, []);

    // Filter products based on gender
    // Default to 'man' if gender is missing (legacy data safety)
    const filteredProducts = products.filter(p => {
        const g = p.gender ? p.gender.toLowerCase() : 'man';
        return g === activeGender || g === 'unisex';
    });


    return (
        <section ref={sectionRef} id="new-arrivals" className="relative max-w-[2000px] w-full mx-auto px-6 xl:px-12 py-4 lg:py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 pb-0 gap-6">
                <div className="flex items-baseline gap-3 md:gap-6 flex-1">
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]">
                        New Arrivals
                    </h2>
                    {/* Results count shown inline on mobile only */}
                    <span className="md:hidden text-[10px] font-bold tracking-widest text-neutral-400 uppercase self-end pb-1">
                        {filteredProducts.length} Results
                    </span>
                    <span className="hidden md:inline-block text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">
                        Curated Selection
                    </span>
                </div>
            </div>

            <div className="min-h-[100px]">
                {filteredProducts.length > 0 ? (
                    <SortedProductGrid key={activeGender} products={filteredProducts} showSizeFilter={false} alignFiltersWithTitle={true} />
                ) : (
                    <div
                        key="empty"
                        className="flex flex-col items-center justify-center h-[200px] text-center"
                    >
                        <p className="font-serif text-2xl text-neutral-400 mb-2">Coming Soon</p>
                        <p className="text-sm text-neutral-500 tracking-wide uppercase">
                            {activeGender === 'woman' ? "Women's Collection Launching Fall 2025" : "New Styles Arriving Weekly"}
                        </p>
                    </div>
                )}
            </div>
        </section >
    );
}
