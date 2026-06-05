"use client";

import { Product, Variant } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileStickyBarProps {
    product: Product;
    selectedVariant?: Variant;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function MobileStickyBar({ product, selectedVariant, onAddToCart, onBuyNow }: MobileStickyBarProps) {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show after scrolling past roughly the first viewport (hero image area)
        // Adjust threshold as needed, typically 450px is past the main CTA
        if (latest > 450) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "150%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "150%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-4 pb-safe lg:landscape:hidden xl:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBuyNow}
                            disabled={product.isOutOfStock}
                            className={cn(
                                "flex-grow py-3.5 font-sans uppercase tracking-widest transition-all text-xs font-bold shadow-md",
                                product.isOutOfStock
                                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                    : "bg-[#1A1A1A] text-white hover:bg-black active:scale-[0.99]"
                            )}
                        >
                            {product.isOutOfStock ? "Out of Stock" : "Buy Now"}
                        </button>
                        
                        <button
                            onClick={onAddToCart}
                            disabled={product.isOutOfStock}
                            className={cn(
                                "w-[48px] h-[48px] flex items-center justify-center border transition-all shrink-0",
                                product.isOutOfStock
                                    ? "bg-neutral-100 text-[#A3A3A3] border-neutral-200 cursor-not-allowed"
                                    : "bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-neutral-50 active:scale-[0.99]"
                            )}
                            title="Add to Cart"
                            aria-label="Add to Cart"
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
