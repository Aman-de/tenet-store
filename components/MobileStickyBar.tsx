"use client";

import { Product, Variant } from "@/lib/data";
import { useGender } from "@/context/GenderContext";
import { cn } from "@/lib/utils";
import { ShoppingBag, ArrowRight } from "lucide-react";

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

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-45 px-3.5 py-2.5 border-t pb-[max(env(safe-area-inset-bottom,8px),8px)] shadow-[0_-6px_25px_rgba(0,0,0,0.12)] backdrop-blur-2xl saturate-[180%] dark:saturate-100 lg:hidden",
                isWoman
                    ? "bg-[#FCF0F2]/95 dark:bg-[#160F11]/95 border-rose-200/60 dark:border-rose-950/40"
                    : "bg-[#F0F4F8]/95 dark:bg-[#0E1217]/95 border-blue-200/60 dark:border-blue-950/40"
            )}
        >
            <div className="flex justify-between items-center w-full max-w-[600px] mx-auto gap-3 h-[48px]">
                {/* Price Section */}
                <div className="flex flex-col justify-center shrink-0 pl-0.5">
                    <div className="flex items-center gap-1.5">
                        <span className="font-serif text-[21px] sm:text-[24px] font-black text-[#1A1A1A] dark:text-[#F4F1ED] leading-none tracking-tight">
                            ₹{priceText}
                        </span>
                    </div>
                    {product.originalPrice && product.originalPrice > activePrice ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10.5px] text-neutral-400 line-through font-medium">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-rose-600 dark:text-rose-400 text-[9.5px] font-extrabold uppercase">
                                {Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100)}% OFF
                            </span>
                        </div>
                    ) : (
                        <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold tracking-wider uppercase mt-0.5">INCL. TAXES</span>
                    )}
                </div>
                
                {/* Actions Section */}
                <div className="flex items-center gap-2 flex-1 max-w-[260px] ml-auto justify-end">
                    <button
                        onClick={onAddToCart}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "h-[44px] px-3.5 flex items-center justify-center border shrink-0 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.94] shadow-sm font-sans text-xs font-bold gap-1.5",
                            product.isOutOfStock
                                ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 border-neutral-300 dark:border-neutral-700 cursor-not-allowed"
                                : "bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F4F1ED] border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white"
                        )}
                        title="Add to Cart"
                        aria-label="Add to Cart"
                    >
                        <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                        <span className="text-[10px] uppercase tracking-wider font-extrabold hidden xs:inline">BAG</span>
                    </button>

                    <button
                        onClick={onBuyNow}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "h-[44px] flex-1 min-w-[120px] flex items-center justify-center active:scale-[0.96] rounded-full transition-all duration-200 cursor-pointer overflow-hidden relative group text-white font-sans text-xs font-black uppercase tracking-wider shadow-md",
                            product.isOutOfStock
                                ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                                : "hover:brightness-110"
                        )}
                        style={!product.isOutOfStock ? { 
                            background: `linear-gradient(135deg, ${accentColor}, ${isWoman ? '#E03154' : '#1D4ED8'})`,
                            boxShadow: `0 4px 18px -3px ${accentColor}90`
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
