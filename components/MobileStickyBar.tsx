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
    const [isVisible, setIsVisible] = useState(true);
    const activePrice = displayPrice !== undefined ? displayPrice : product.price;
    const priceText = activePrice.toLocaleString('en-IN');
    const { gender } = useGender();

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
                        className="fixed bottom-5 left-4 right-4 z-40 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border border-neutral-200/50 dark:border-white/10 py-3 px-4 lg:landscape:hidden xl:hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-2xl"
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="font-serif text-[22px] font-bold text-[#1A1A1A] dark:text-[#F4F1ED] leading-none tracking-tight">
                                        ₹{priceText}
                                    </span>
                                    {product.originalPrice && product.originalPrice > activePrice && (
                                        <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 px-1.5 py-0.5 text-[8.5px] font-bold tracking-wider uppercase rounded">
                                            {Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    {product.originalPrice && product.originalPrice > activePrice && (
                                        <span className="text-[11px] text-neutral-400 line-through decoration-neutral-400/60 font-medium">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onBuyNow}
                                disabled={product.isOutOfStock}
                                className={cn(
                                    "h-[44px] px-6 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.97] rounded-xl transition-all duration-300 cursor-pointer overflow-hidden relative group shrink-0 text-white",
                                    product.isOutOfStock
                                        ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                                        : "hover:opacity-95"
                                )}
                                style={!product.isOutOfStock ? { backgroundColor: accentColor } : {}}
                            >
                            {!product.isOutOfStock && (
                                <div className="absolute inset-0 bg-white/10 dark:bg-black/5 w-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                            )}
                            <div className="relative z-10 flex items-center gap-2">
                                <span className="font-sans uppercase tracking-[0.15em] text-[11px] font-bold leading-none">
                                    {product.isOutOfStock ? "Out of Stock" : "ADD TO CART"}
                                </span>
                                {!product.isOutOfStock && (
                                    <>
                                        <span className="text-[11px] text-white/40">|</span>
                                        <span className="text-[9px] font-semibold tracking-widest uppercase leading-none text-white/95">
                                            Free Shipping
                                        </span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
