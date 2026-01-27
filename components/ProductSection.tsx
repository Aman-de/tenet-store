"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import CategoryFilter from "./CategoryFilter";
import ProductGrid from "./ProductGrid";
import { motion, AnimatePresence } from "framer-motion";

interface ProductSectionProps {
    products: Product[];
}

export default function ProductSection({ products }: ProductSectionProps) {
    // Filter Logic - Removed Category Filter as requested
    const filteredProducts = products;

    return (
        <section id="new-arrivals" className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-col items-center mb-12 text-center">
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2">
                    Curated Selection
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">
                    New Arrivals
                </h2>
            </div>

            <motion.div layout className="min-h-[400px]">
                <ProductGrid products={filteredProducts} />
            </motion.div>
        </section>
    );
}
