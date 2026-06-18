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
                        className="fixed bottom-5 left-4 right-4 z-40 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border border-neutral-200/50 dark:border-white/10 py-2.5 px-3.5 lg:landscape:hidden xl:hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-[28px]"
                    >
                        <div className="flex justify-between items-center w-full relative">
                            {/* Floating WhatsApp Logo Above the Button */}
                            <a 
                                href="https://wa.me/917737796817?text=Hello%20Tenet%20Archives%2C%20I%20have%20a%20question%20about%20your%20collection..."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute -top-[56px] right-1 w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-full shadow-md border border-neutral-200/50 dark:border-white/10 opacity-80 hover:opacity-100 transition-all duration-300"
                            >
                                <img src="/whatsapp-logo.svg" className="w-[18px] h-[18px] opacity-80" alt="WhatsApp" />
                            </a>

                            <div className="flex flex-col justify-center pl-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-serif text-[20px] font-bold text-[#1A1A1A] dark:text-[#F4F1ED] leading-none tracking-tight">
                                        ₹{priceText}
                                    </span>
                                    {product.originalPrice && product.originalPrice > activePrice && (
                                        <span className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 px-1 py-[1px] text-[8px] font-bold tracking-[0.1em] uppercase rounded-sm">
                                            {Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                {product.originalPrice && product.originalPrice > activePrice && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] text-neutral-400 line-through decoration-neutral-400/60 font-medium">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={onBuyNow}
                                disabled={product.isOutOfStock}
                                className={cn(
                                    "h-[40px] px-5 flex items-center justify-center shadow-lg active:scale-[0.96] rounded-full transition-all duration-300 cursor-pointer overflow-hidden relative group shrink-0 text-white",
                                    product.isOutOfStock
                                        ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                                        : "hover:brightness-[1.1]"
                                )}
                                style={!product.isOutOfStock ? { 
                                    background: `linear-gradient(135deg, ${accentColor}, ${isWoman ? '#E03154' : '#1D4ED8'})`,
                                    boxShadow: `0 8px 20px -6px ${accentColor}90`
                                } : {}}
                            >
                                {!product.isOutOfStock && (
                                    <div className="absolute inset-0 bg-white/20 dark:bg-white/10 w-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                                )}
                                <div className="relative z-10 flex items-center gap-1.5">
                                    <span className="font-sans uppercase tracking-[0.15em] text-[10px] font-bold leading-none">
                                        {product.isOutOfStock ? "Out of Stock" : "BUY NOW"}
                                    </span>
                                    {!product.isOutOfStock && (
                                        <>
                                            <span className="text-[10px] text-white/40">|</span>
                                            <span className="text-[8px] font-semibold tracking-widest uppercase leading-none text-white/95">
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
