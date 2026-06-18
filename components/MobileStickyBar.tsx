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
                        className="fixed bottom-4 left-3 right-3 z-40 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-2xl border border-neutral-200/60 dark:border-white/10 p-2 lg:landscape:hidden xl:hidden shadow-[0_16px_40px_-10px_rgba(0,0,0,0.25)] rounded-full"
                    >
                        <div className="flex items-center w-full gap-2">
                            {/* Price Section */}
                            <div className="flex flex-col justify-center shrink-0 pl-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-serif text-[19px] sm:text-[21px] font-bold text-[#1A1A1A] dark:text-[#F4F1ED] leading-none tracking-tight">
                                        ₹{priceText}
                                    </span>
                                </div>
                                {product.originalPrice && product.originalPrice > activePrice ? (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] text-neutral-400 line-through decoration-neutral-400/60 font-medium">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-rose-600 dark:text-rose-400 text-[9px] font-bold tracking-wider uppercase">
                                            {Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100)}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-transparent mt-0.5 select-none">No discount</span> // Spacer to maintain height
                                )}
                            </div>
                            
                            {/* Actions Section */}
                            <div className="flex items-center gap-2 w-full justify-end ml-auto">
                                <a 
                                    href="https://wa.me/917737796817?text=Hello%20Tenet%20Archives%2C%20I%20have%20a%20question%20about%20your%20collection..."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[42px] h-[42px] flex items-center justify-center bg-[#25D366]/10 dark:bg-[#25D366]/20 border border-[#25D366]/20 dark:border-[#25D366]/30 rounded-full shrink-0 shadow-sm transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
                                >
                                    <img src="/whatsapp-logo.svg" className="w-[20px] h-[20px]" alt="WhatsApp" />
                                </a>
                                
                                <button
                                    onClick={onBuyNow}
                                    disabled={product.isOutOfStock}
                                    className={cn(
                                        "h-[42px] flex-1 max-w-[180px] sm:max-w-[220px] flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] active:scale-[0.96] rounded-full transition-all duration-300 cursor-pointer overflow-hidden relative group shrink-0 text-white",
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
                                        <span className="font-sans uppercase tracking-[0.15em] text-[12px] font-bold leading-none mb-[2px]">
                                            {product.isOutOfStock ? "Out of Stock" : "BUY NOW"}
                                        </span>
                                        {!product.isOutOfStock && (
                                            <span className="text-[8px] font-semibold tracking-widest uppercase leading-none text-white/90">
                                                FREE SHIPPING
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
