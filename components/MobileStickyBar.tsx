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
    const accentColor = "var(--accent-color)";

        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: "150%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "150%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed bottom-[18px] left-4 right-4 z-40 py-2.5 px-3 lg:landscape:hidden xl:hidden shadow-xl rounded-2xl",
                            isWoman
                                ? "bg-[#FCF0F2]/90 dark:bg-[#160F11]/90 backdrop-blur-xl border border-rose-100/50 dark:border-rose-950/20 shadow-[0_12px_40px_rgba(252,240,242,0.4)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                                : "bg-[#F0F4F8]/90 dark:bg-[#0E1217]/90 backdrop-blur-xl border border-blue-100/50 dark:border-blue-950/20 shadow-[0_12px_40px_rgba(240,244,248,0.4)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                        )}
                    >
                        <div className="flex justify-between items-center w-full relative gap-3">
                            {/* Price Section */}
                            <div className="flex flex-col justify-center shrink-0 pl-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-serif text-[22px] sm:text-[24px] font-extrabold text-[#1A1A1A] dark:text-[#F4F1ED] leading-none tracking-tight">
                                        ₹{priceText}
                                    </span>
                                </div>
                                {product.originalPrice && product.originalPrice > activePrice ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[11px] text-neutral-400 line-through decoration-neutral-400/60 font-medium">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-rose-600 dark:text-rose-400 text-[9px] font-bold tracking-widest uppercase">
                                            {Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100)}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[11px] text-transparent mt-1 select-none">No discount</span> // Spacer
                                )}
                            </div>
                            
                            {/* Actions Section */}
                            <button
                                onClick={onBuyNow}
                                disabled={product.isOutOfStock}
                                className={cn(
                                    "h-[44px] flex-1 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] active:scale-[0.96] rounded-full transition-all duration-300 cursor-pointer overflow-hidden relative group text-white ml-auto",
                                    product.isOutOfStock
                                        ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                                        : "hover:brightness-[1.1]"
                                )}
                                style={!product.isOutOfStock ? { 
                                    background: `linear-gradient(135deg, ${accentColor}, ${isWoman ? '#E03154' : '#1D4ED8'})`,
                                    boxShadow: `0 8px 24px -6px ${accentColor}90`
                                } : {}}
                            >
                                {!product.isOutOfStock && (
                                    <div className="absolute inset-0 bg-white/20 dark:bg-white/10 w-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                                )}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <span className="font-sans uppercase tracking-[0.15em] text-[13px] font-extrabold leading-none mb-[2px] drop-shadow-sm">
                                        {product.isOutOfStock ? "Out of Stock" : "BUY NOW"}
                                    </span>
                                    {!product.isOutOfStock && (
                                        <span className="text-[8px] font-bold tracking-widest uppercase leading-none text-white/95">
                                            FREE SHIPPING
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
