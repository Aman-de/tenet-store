"use client";

import { Product, Variant } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MobileStickyBarProps {
    product: Product;
    selectedVariant?: Variant;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function MobileStickyBar({ product, selectedVariant, onAddToCart, onBuyNow }: MobileStickyBarProps) {
    const { scrollY } = useScroll();
    const [mode, setMode] = useState<"hidden" | "cta" | "mini">("hidden");

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest < 450) {
            setMode("hidden");
        } else if (latest >= 450 && latest < 1100) {
            setMode("cta");
        } else {
            setMode("mini");
        }
    });

    const imageToUse = selectedVariant?.images?.[0] || product.images[0];
    const price = product.price.toLocaleString('en-IN');

    return (
        <AnimatePresence mode="wait">
            {mode === "cta" && (
                <motion.div
                    key="cta-bar"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
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

            {mode === "mini" && (
                <motion.div
                    key="mini-card"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
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
