"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Plus, Heart, Loader2, Check } from "lucide-react";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";


interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [addingState, setAddingState] = useState<'idle' | 'adding' | 'added'>('idle');
    const [altImgError, setAltImgError] = useState(false);
    const { addToCart, openCart, toggleWishlist, isInWishlist } = useStore();

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    const handleViewItem = () => {
        trackViewItem(product);
    };

    const handleQuickAdd = () => {
        if (addingState !== 'idle' || product.isOutOfStock) return;

        setAddingState('adding');

        // Add item and open cart immediately for instant feedback
        addToCart(product, "M", product.colors?.[0]);
        trackAddToCart(product, 1, "M", product.colors?.[0]);
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
            <Link href={`/product/${product.handle}`} onClick={handleViewItem}>
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-2">
                    {product.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover absolute inset-0 z-0 transition-opacity duration-200 ease-in-out group-hover:opacity-0"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs z-0 absolute inset-0 group-hover:opacity-0 transition-opacity duration-200">
                            No Image
                        </div>
                    )}
                    {product.images?.[1] && !altImgError && (
                        <Image
                            src={product.images[1]}
                            alt={product.title}
                            fill
                            className="object-cover absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            onError={() => setAltImgError(true)}
                        />
                    )}


                    {/* Out of Stock Badge */}
                    {product.isOutOfStock && (
                        <div className="absolute top-2 left-2 bg-black/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 uppercase tracking-widest z-20">
                            Out of Stock
                        </div>
                    )}

                    {/* Mobile Wishlist Button - Top Right */}
                    <motion.button
                        whileTap={{ scale: 1.2 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className={`
                            md:hidden absolute top-2 right-2 z-30
                            pointer-events-auto
                            w-8 h-8 bg-white/20 backdrop-blur-md text-[#1A1A1A] rounded-full 
                            flex items-center justify-center
                            active:scale-90 transition-all duration-200
                        `}
                        aria-label="Wishlist"
                    >
                        <Heart
                            size={16}
                            className={`transition-all duration-300 ${isInWishlist(product.id)
                                ? "fill-white stroke-white"
                                : "stroke-white"
                                }`}
                            strokeWidth={1.5}
                        />
                    </motion.button>

                    {/* Quick Add and Wishlist Overlay - Desktop Only */}
                    <div className="absolute bottom-4 left-4 right-4 z-30 hidden md:flex gap-2 justify-center pointer-events-none">
                        {/* Desktop: Full Width Text Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleQuickAdd();
                            }}
                            className={`
                                pointer-events-auto
                                w-full bg-white text-[#1A1A1A] py-3 text-xs font-bold uppercase tracking-widest shadow-lg transition-all duration-300 ease-out rounded-full
                                hover:bg-black hover:text-white
                                opacity-0 group-hover:opacity-100
                                transform ${addingState !== 'idle' && !product.isOutOfStock ? 'translate-y-0 opacity-100' : 'translate-y-[120%] group-hover:translate-y-0'}
                            `}
                            disabled={addingState !== 'idle' || product.isOutOfStock}
                        >
                            {product.isOutOfStock
                                ? "Sold Out"
                                : (addingState === 'idle' ? "Quick Add +" : (addingState === 'adding' ? "Adding..." : "Added"))}
                        </button>
                        
                        {/* Desktop: Wishlist Button */}
                        <motion.button
                            whileTap={{ scale: 1.2 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product);
                            }}
                            className={`
                                pointer-events-auto
                                w-12 h-12 bg-white text-[#1A1A1A] rounded-full 
                                flex items-center justify-center shadow-lg
                                active:scale-90 transition-all duration-300 ease-out
                                opacity-0 group-hover:opacity-100
                            `}
                            aria-label="Wishlist"
                        >
                            <Heart
                                size={20}
                                className={`transition-all duration-300 ${isInWishlist(product.id)
                                    ? "fill-black stroke-black"
                                    : "stroke-black"
                                    }`}
                                strokeWidth={1.5}
                            />
                        </motion.button>
                    </div>



                </div>
            </Link>

            {/* Product Info */}
            <div className="space-y-1 p-3 pt-2"> {/* Added pt-2 for spacing */}
                <Link href={`/product/${product.handle}`} onClick={handleViewItem}>
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
