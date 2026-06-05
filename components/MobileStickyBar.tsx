"use client";

import { Product, Variant } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useGender } from "@/context/GenderContext";

interface MobileStickyBarProps {
    product: Product;
    selectedVariant?: Variant;
    onAddToCart: () => void;
}

export default function MobileStickyBar({ product, selectedVariant, onAddToCart }: MobileStickyBarProps) {
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

    const imageToUse = selectedVariant?.images?.[0] || product.images[0];
    const price = product.price.toLocaleString('en-IN');
    const targetGender = product.gender ? product.gender.toLowerCase() : gender;
    const isWoman = targetGender === "woman" || (targetGender === "unisex" && gender === "woman");
    const accentColor = isWoman ? "#E05275" : "#2B6496";

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "150%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "150%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 pb-safe lg:landscape:hidden xl:hidden"
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
                                    : "text-white hover:opacity-90 active:scale-95"
                            }`}
                            style={!product.isOutOfStock ? { backgroundColor: accentColor } : undefined}
                        >
                            {product.isOutOfStock ? "Sold Out" : "ADD"}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
