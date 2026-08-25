"use client";

import { Product, Variant } from "@/lib/data";
import { useGender } from "@/context/GenderContext";
import { cn } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

interface MobileStickyBarProps {
    product: Product;
    selectedVariant?: Variant;
    onAddToCart: () => void;
    onBuyNow: () => void;
    displayPrice?: number;
}

export default function MobileStickyBar({ product, selectedVariant, onAddToCart, onBuyNow, displayPrice }: MobileStickyBarProps) {
    const activePrice = displayPrice !== undefined ? displayPrice : product.price;
    const priceText = activePrice.toLocaleString('en-IN');
    const { gender } = useGender();

    const isWoman = gender === "woman";
    const accentColor = "var(--accent-color)";
    const heroImage = selectedVariant?.images?.[0] || product.images?.[0];

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-45 px-3 py-2.5 md:py-3 border-t md:border md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:max-w-[700px] md:rounded-2xl pb-[max(env(safe-area-inset-bottom,8px),10px)] shadow-[0_-8px_30px_rgba(0,0,0,0.16)] backdrop-blur-2xl saturate-[180%] dark:saturate-100 transition-all",
                isWoman
                    ? "bg-[#FCF0F2]/95 dark:bg-[#160F11]/95 border-rose-300/70 dark:border-rose-900/50 shadow-rose-950/10"
                    : "bg-[#F0F4F8]/95 dark:bg-[#0E1217]/95 border-blue-300/70 dark:border-blue-900/50 shadow-blue-950/10"
            )}
        >
            <div className="flex justify-between items-center w-full max-w-[650px] mx-auto gap-2.5 sm:gap-4 h-[46px] sm:h-[50px]">
                {/* Product Thumbnail & Price Section */}
                <div className="flex items-center gap-2.5 min-w-0 pl-0.5">
                    {heroImage && (
                        <div className="relative w-9 h-11 sm:w-11 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800 border border-black/10 dark:border-white/10 hidden xs:block">
                            <Image
                                src={heroImage}
                                alt={product.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex flex-col justify-center shrink-0">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-serif text-[20px] sm:text-[23px] font-black text-[#1A1A1A] dark:text-[#F4F1ED] leading-none tracking-tight">
                                ₹{priceText}
                            </span>
                            {product.originalPrice && product.originalPrice > activePrice && (
                                <span className="text-[10px] text-neutral-400 line-through font-medium">
                                    ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-amber-800 dark:text-amber-300 text-[8.5px] sm:text-[9.5px] font-extrabold tracking-wide uppercase flex items-center gap-0.5">
                                <span>🪢</span> RAKHI30 (-30%)
                            </span>
                            <span className="text-neutral-400 text-[8px] hidden sm:inline">• Guaranteed Delivery</span>
                        </div>
                    </div>
                </div>
                
                {/* Actions Section */}
                <div className="flex items-center gap-2 flex-1 max-w-[260px] sm:max-w-[290px] ml-auto justify-end">
                    <button
                        onClick={onAddToCart}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "h-[42px] sm:h-[46px] px-3 sm:px-4 flex items-center justify-center border shrink-0 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.94] shadow-sm font-sans text-xs font-bold gap-1.5",
                            product.isOutOfStock
                                ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700 cursor-not-allowed"
                                : "bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F4F1ED] border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white"
                        )}
                        title="Add to Cart"
                        aria-label="Add to Cart"
                    >
                        <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                        <span className="text-[10px] uppercase tracking-wider font-extrabold hidden sm:inline">BAG</span>
                    </button>

                    <button
                        onClick={onBuyNow}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "h-[42px] sm:h-[46px] flex-1 min-w-[125px] sm:min-w-[150px] flex items-center justify-center active:scale-[0.96] rounded-full transition-all duration-200 cursor-pointer overflow-hidden relative group text-white font-sans text-xs sm:text-[13px] font-black uppercase tracking-wider shadow-lg",
                            product.isOutOfStock
                                ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                                : "hover:brightness-110"
                        )}
                        style={!product.isOutOfStock ? { 
                            background: `linear-gradient(135deg, ${accentColor}, ${isWoman ? '#E03154' : '#1D4ED8'})`,
                            boxShadow: `0 4px 20px -2px ${accentColor}95`
                        } : {}}
                    >
                        {!product.isOutOfStock && (
                            <div className="absolute inset-0 bg-white/20 dark:bg-white/10 w-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                        )}
                        <span className="relative z-10 drop-shadow-sm flex items-center gap-1.5">
                            {product.isOutOfStock ? "OUT OF STOCK" : (
                                <>
                                    <span>BUY NOW</span>
                                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
