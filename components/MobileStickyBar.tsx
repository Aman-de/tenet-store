"use client";

import { useStore } from "@/lib/store";
import { Product, Variant } from "@/lib/data";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface MobileStickyBarProps {
    product: Product;
    selectedVariant?: Variant;
}

export default function MobileStickyBar({ product, selectedVariant }: MobileStickyBarProps) {
    const { addToCart, openCart } = useStore();
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show after scrolling past roughly the first viewport (hero image area)
        // Adjust threshold as needed, typically 600px is past the main CTA
        if (latest > 600) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    const handleAddToCart = () => {
        // Use selected variant or default
        const color = selectedVariant ? selectedVariant.colorHex : product.colors?.[0];
        addToCart(product, "M", color); // Default to M for quick add, or open modal in v2
        openCart();
    };

    const imageToUse = selectedVariant?.images?.[0] || product.images[0];
    const price = product.price.toLocaleString('en-IN');

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 p-4 pb-8 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 bg-neutral-100 shrink-0">
                            <Image
                                src={imageToUse}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-sm text-[#1A1A1A] truncate">{product.title}</h3>
                            <p className="text-xs font-bold text-neutral-500">₹{price}</p>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="bg-[#1A1A1A] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black active:scale-95 transition-all"
                        >
                            Add
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
