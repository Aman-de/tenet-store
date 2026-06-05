"use client";

import { Product, Variant } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface MobileStickyBarProps {
    product: Product;
    selectedVariant?: Variant;
    onAddToCart: () => void;
}

export default function MobileStickyBar({ product, selectedVariant, onAddToCart }: MobileStickyBarProps) {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show only when scrolled deep into reviews/recommendations (past the sticky CTA DOM position)
        if (latest >= 1400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    const imageToUse = selectedVariant?.images?.[0] || product.images[0];
    const price = product.price.toLocaleString('en-IN');

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "150%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "150%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 z-40 bg-white border border-neutral-200 p-3 rounded-xl lg:landscape:hidden xl:hidden shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 bg-neutral-100 shrink-0">
                            {imageToUse ? (
                                <Image
                                    src={imageToUse}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-200" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-sm text-[#1A1A1A] truncate">{product.title}</h3>
                            <p className="text-xs font-bold text-neutral-500">₹{price}</p>
                        </div>
                        <button
                            onClick={onAddToCart}
                            disabled={product.isOutOfStock}
                            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                                product.isOutOfStock
                                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                    : "bg-[#1A1A1A] text-white hover:bg-black active:scale-95"
                            }`}
                        >
                            {product.isOutOfStock ? "Sold Out" : "ADD"}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
