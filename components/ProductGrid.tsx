"use client";

import { Product } from "@/lib/data";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGridProps {
    products: Product[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2, // Wait for hero to finish a bit
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const
        }
    },
};

import { useState } from "react";
import { cn } from "@/lib/utils";

// ... existing imports ...

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <p className="col-span-full text-center text-neutral-400">Loading collection...</p>
        );
    }

    return (
        <div className="space-y-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12"
            >
                <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={itemVariants}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
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
