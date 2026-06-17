"use client";

import { Product, Variant } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useGender } from "@/context/GenderContext";
import { cn } from "@/lib/utils";

interface MobileStickyBarProps {
    product: Product;
    selectedVariant?: Variant;
    onAddToCart: () => void;
    onBuyNow: () => void;
    displayPrice?: number;
}

export default function MobileStickyBar({ product, selectedVariant, onAddToCart, onBuyNow, displayPrice }: MobileStickyBarProps) {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    const { gender } = useGender();

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show only when scrolled deep into reviews/recommendations (past the sticky CTA DOM position)
        if (latest >= 1400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    const activePrice = displayPrice !== undefined ? displayPrice : product.price;
    const priceText = activePrice.toLocaleString('en-IN');
    const isWoman = gender === "woman";
    const accentColor = isWoman ? "#FF4D6D" : "#3B82F6";

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "150%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "150%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#141414] border-t border-neutral-200 dark:border-white/10 p-3 pb-safe lg:landscape:hidden xl:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-1.5">
                                <span className="font-sans text-sm font-bold text-[#1A1A1A] dark:text-[#F4F1ED]">₹{priceText}</span>
                                {activePrice >= 499 && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">Free Delivery</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={onAddToCart}
                                disabled={product.isOutOfStock}
                                className={cn(
                                    "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-all rounded-lg border",
                                    product.isOutOfStock
                                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border-neutral-200 dark:border-neutral-700 cursor-not-allowed"
                                        : "bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F4F1ED] border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 active:scale-95 shadow-sm cursor-pointer"
                                )}
                                style={!product.isOutOfStock ? { color: accentColor, borderColor: `${accentColor}30` } : undefined}
                            >
                                {product.isOutOfStock ? "Sold Out" : "Add to Bag"}
                            </button>
                            <button
                                onClick={onBuyNow}
                                disabled={product.isOutOfStock}
                                className={cn(
                                    "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-all rounded-lg shadow-sm cursor-pointer",
                                    product.isOutOfStock
                                        ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed"
                                        : "text-white active:scale-95 hover:opacity-90"
                                )}
                                style={!product.isOutOfStock ? { backgroundColor: accentColor } : undefined}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
