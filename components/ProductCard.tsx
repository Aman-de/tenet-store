"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Plus, Heart, Loader2, Check } from "lucide-react";
import ShareButton from "./ShareButton";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [addingState, setAddingState] = useState<'idle' | 'adding' | 'added'>('idle');
    const { addToCart, openCart, toggleWishlist, isInWishlist } = useStore();


    const handleQuickAdd = () => {
        if (addingState !== 'idle') return;

        setAddingState('adding');

        // Add item and open cart immediately for instant feedback
        addToCart(product, "M", product.colors?.[0]);
        openCart();

        // Simulate processing state then success
        setTimeout(() => {
            setAddingState('added');
            setTimeout(() => {
                setAddingState('idle');
            }, 1000);
        }, 600);
    };

    return (
        <div
            className="group relative cursor-pointer rounded-xl overflow-hidden bg-white border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link href={`/product/${product.handle}`}>
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-4">
                    <AnimatePresence mode="wait">
                        {isHovered && product.images[1] ? (
                            <motion.div
                                key="back"
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Image
                                    src={product.images[1]}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="front"
                                className="absolute inset-0"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Discount Badge - Minimalist */}
                    {product.discountLabel && (
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-black text-[10px] font-medium px-2 py-1 uppercase tracking-widest z-20">
                            {product.discountLabel.replace("SAVE RS. ", "-").replace(" off", "")}
                        </div>
                    )}

                    {/* Quick Add Overlay Button - Responsive */}
                    <div className="absolute bottom-4 left-4 right-4 z-30 flex justify-end md:justify-center overflow-hidden pointer-events-none">
                        {/* Mobile: Small Icon Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleQuickAdd();
                            }}
                            className="
                                md:hidden pointer-events-auto
                                w-10 h-10 bg-white text-[#1A1A1A] rounded-full 
                                flex items-center justify-center 
                                active:scale-90 transition-all duration-200
                            "
                            aria-label="Add to cart"
                            disabled={addingState !== 'idle'}
                        >
                            {addingState === 'idle' && <Plus size={20} strokeWidth={1.5} />}
                            {addingState === 'adding' && <Loader2 size={18} className="animate-spin" />}
                            {addingState === 'added' && <Check size={18} />}
                        </button>

                        {/* Desktop: Full Width Text Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleQuickAdd();
                            }}
                            className={`
                                hidden md:block pointer-events-auto
                                w-full bg-white text-[#1A1A1A] py-3 text-xs font-bold uppercase tracking-widest shadow-lg transition-all duration-300 ease-out rounded-full
                                hover:bg-black hover:text-white
                                transform ${addingState !== 'idle' ? 'translate-y-0' : 'translate-y-[120%] group-hover:translate-y-0'}
                            `}
                            disabled={addingState !== 'idle'}
                        >
                            {addingState === 'idle' ? "Quick Add +" : (addingState === 'adding' ? "Adding..." : "Added")}
                        </button>
                    </div>

                    {/* Share Button */}
                    <div
                        className="
                            absolute top-2 right-12 z-10 
                            transition-all duration-300 
                            opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                        "
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <ShareButton
                            title={product.title}
                            url={typeof window !== 'undefined' ? `${window.location.origin}/product/${product.handle}` : ''}
                            className="
                                text-[#1A1A1A] 
                                w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full
                                bg-white/10 backdrop-blur-sm lg:bg-white/50
                                hover:bg-white transition-colors
                             "
                            iconSize={18}
                        />
                    </div>

                    {/* Wishlist Button */}
                    <motion.button
                        whileTap={{ scale: 1.2 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className="
                            absolute top-2 right-2 z-10 
                            flex items-center justify-center
                            w-8 h-8 lg:w-10 lg:h-10 rounded-full
                            bg-white/10 backdrop-blur-sm lg:bg-transparent
                            lg:hover:scale-110
                            transition-all duration-300 
                            opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                        "
                    >
                        <Heart
                            size={18}
                            className={`transition-all duration-300 ${isInWishlist(product.id)
                                ? "fill-black stroke-black"
                                : "stroke-black"
                                }`}
                            strokeWidth={1.5}
                        />
                    </motion.button>

                </div>
            </Link>

            {/* Product Info */}
            <div className="space-y-1 p-3 pt-2"> {/* Added pt-2 for spacing */}
                <Link href={`/product/${product.handle}`}>
                    <h3 className="font-sans text-xs md:text-sm font-medium tracking-wide text-[#1A1A1A] uppercase truncate hover:underline underline-offset-4 decoration-1">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 text-xs md:text-sm">
                    <span className="font-medium text-[#1A1A1A] text-lg">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                        <span className="text-gray-400 line-through decoration-gray-300 text-sm ml-2">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-1 pt-1">
                        {product.colors.map((color, idx) => (
                            <div
                                key={idx}
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
