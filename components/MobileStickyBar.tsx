"use client";

import { Product, Variant } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useGender } from "@/context/GenderContext";
import { cn } from "@/lib/utils";

import { ShoppingBag } from "lucide-react";

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
                            "fixed bottom-0 left-0 right-0 z-40 px-3 py-2 border-t pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[20px] saturate-[180%] dark:saturate-100 lg:landscape:hidden xl:hidden",
                            isWoman
                                ? "bg-[#FCF0F2]/95 dark:bg-[#160F11]/95 border-rose-100/50 dark:border-rose-950/20"
                                : "bg-[#F0F4F8]/95 dark:bg-[#0E1217]/95 border-blue-100/50 dark:border-blue-950/20"
                        )}
                    >
                        <div className="flex justify-between items-center w-full relative gap-2.5 h-[48px]">
                            {/* Price Section */}
                            <div className="flex flex-col justify-center shrink-0 pl-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-serif text-[20px] sm:text-[22px] font-extrabold text-[#1A1A1A] dark:text-[#F4F1ED] leading-none tracking-tight">
                                        ₹{priceText}
                                    </span>
                                </div>
                                {product.originalPrice && product.originalPrice > activePrice ? (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] text-neutral-400 line-through font-medium">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-rose-600 dark:text-rose-400 text-[9px] font-bold uppercase">
                                            {Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100)}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[9px] text-neutral-400 font-medium tracking-wider uppercase mt-0.5">INCL. TAXES</span>
                                )}
                            </div>
                            
                            {/* Actions Section */}
                            <div className="flex items-center gap-2 flex-1 max-w-[240px] ml-auto">
                                <button
                                    onClick={onAddToCart}
                                    disabled={product.isOutOfStock}
                                    className={cn(
                                        "h-[42px] px-3.5 flex items-center justify-center border shrink-0 rounded-full transition-all duration-300 cursor-pointer active:scale-[0.94] shadow-sm font-sans text-xs font-bold gap-1.5",
                                        product.isOutOfStock
                                            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700 cursor-not-allowed"
                                            : "bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F4F1ED] border-neutral-300 dark:border-neutral-700"
                                    )}
                                    title="Add to Cart"
                                    aria-label="Add to Cart"
                                >
                                    <ShoppingBag className="w-4 h-4 stroke-[2]" />
                                    <span className="text-[11px] uppercase tracking-wider hidden xs:inline">ADD</span>
                                </button>

                                <button
                                    onClick={onBuyNow}
                                    disabled={product.isOutOfStock}
                                    className={cn(
                                        "h-[42px] flex-1 flex items-center justify-center active:scale-[0.96] rounded-full transition-all duration-300 cursor-pointer overflow-hidden relative group text-white font-sans text-xs font-extrabold uppercase tracking-widest shadow-md",
                                        product.isOutOfStock
                                            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                                            : "hover:brightness-[1.1]"
                                    )}
                                    style={!product.isOutOfStock ? { 
                                        background: `linear-gradient(135deg, ${accentColor}, ${isWoman ? '#E03154' : '#1D4ED8'})`,
                                        boxShadow: `0 4px 16px -4px ${accentColor}90`
                                    } : {}}
                                >
                                    {!product.isOutOfStock && (
                                        <div className="absolute inset-0 bg-white/20 dark:bg-white/10 w-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                                    )}
                                    <span className="relative z-10 drop-shadow-sm">
                                        {product.isOutOfStock ? "OUT OF STOCK" : "BUY NOW"}
                                    </span>
                                </button>
                            </div>
                        </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
