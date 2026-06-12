"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { useGender } from "@/context/GenderContext";
import { Plus, Heart, Loader2, Check } from "lucide-react";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";


interface ProductCardProps {
    product: Product;
    isRecommended?: boolean;
}

export default function ProductCard({ product, isRecommended = false }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [addingState, setAddingState] = useState<'idle' | 'adding' | 'added'>('idle');
    const [altImgError, setAltImgError] = useState(false);
    const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
    const [isImg1Loading, setIsImg1Loading] = useState(true);
    const [isImg2Loading, setIsImg2Loading] = useState(true);
    const { addToCart, openCart, toggleWishlist, isInWishlist } = useStore();
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const accentColor = isWoman ? "#FF4D6D" : "#3B82F6";

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    const handleViewItem = () => {
        trackViewItem(product);
    };

    const handleSelectSize = (size: string) => {
        setIsSizeSelectorOpen(false);
        setAddingState('adding');

        addToCart(product, size, product.colors?.[0]);
        trackAddToCart(product, 1, size, product.colors?.[0]);
        openCart();

        setTimeout(() => {
            setAddingState('added');
            setTimeout(() => {
                setAddingState('idle');
            }, 1000);
        }, 600);
    };

    return (
        <div
            className="group relative cursor-pointer bg-transparent transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-3 rounded-sm">
                <Link href={`/product/${product.handle}`} onClick={handleViewItem} className="absolute inset-0 z-0 block w-full h-full">
                    {product.images?.[0] ? (
                        <>
                            {isImg1Loading && (
                                <div className="absolute inset-0 bg-neutral-200 animate-pulse z-10" />
                            )}
                            <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover absolute inset-0 z-0 transition-opacity duration-200 ease-in-out group-hover:opacity-0"
                                sizes="(max-width: 768px) 50vw, 33vw"
                                onLoad={() => setIsImg1Loading(false)}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs z-0 absolute inset-0 group-hover:opacity-0 transition-opacity duration-200">
                            No Image
                        </div>
                    )}
                    {product.images?.[1] && !altImgError && (
                        <>
                            {isImg2Loading && isHovered && (
                                <div className="absolute inset-0 bg-neutral-200 animate-pulse z-10" />
                            )}
                            <Image
                                src={product.images[1]}
                                alt={product.title}
                                fill
                                className="object-cover absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
                                sizes="(max-width: 768px) 50vw, 33vw"
                                onError={() => setAltImgError(true)}
                                onLoad={() => setIsImg2Loading(false)}
                            />
                        </>
                    )}
                </Link>

                {/* Out of Stock Badge */}
                    {product.isOutOfStock ? (
                        <div className="absolute top-2 left-2 bg-black/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 uppercase tracking-widest z-20">
                            Out of Stock
                        </div>
                    ) : (
                        hasDiscount && discountPercentage !== 16 && discountPercentage !== 17 && (
                            <div 
                                className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-20 shadow-sm rounded-sm"
                                style={{ backgroundColor: accentColor }}
                            >
                                {discountPercentage}% OFF
                            </div>
                        )
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
                            size={18}
                            className="transition-all duration-300"
                            style={isInWishlist(product.id) ? { fill: accentColor, stroke: accentColor } : { stroke: "white" }}
                            strokeWidth={2}
                        />
                    </motion.button>

                    {/* Mobile Quick Add Button - Bottom Right of Image */}
                    {!product.isOutOfStock && (
                        <motion.button
                            whileTap={{ scale: 1.1 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsSizeSelectorOpen(true);
                            }}
                            className="md:hidden absolute bottom-2 right-2 z-30 w-8 h-8 bg-white/90 backdrop-blur-sm text-[#1A1A1A] rounded-full flex items-center justify-center shadow-md border border-neutral-200/50 active:scale-95 transition-all duration-200"
                        >
                            <Plus size={16} style={{ color: accentColor }} />
                        </motion.button>
                    )}

                    {/* Quick Add and Wishlist Overlay - Desktop Only */}
                    <div className="absolute bottom-4 left-4 right-4 z-30 hidden md:flex gap-2 justify-center pointer-events-none">
                        {/* Desktop: Full Width Text Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (addingState !== 'idle' || product.isOutOfStock) return;
                                setIsSizeSelectorOpen(true);
                            }}
                            className={`
                                pointer-events-auto
                                w-full bg-white/95 backdrop-blur-sm text-[#1A1A1A] py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-out border-t border-[#1A1A1A]/10
                                hover:bg-[#1A1A1A] hover:text-white
                                opacity-0 group-hover:opacity-100
                                transform ${addingState !== 'idle' && !product.isOutOfStock ? 'translate-y-0 opacity-100' : 'translate-y-[120%] group-hover:translate-y-0'}
                            `}
                            style={{ '--accent-color': accentColor } as React.CSSProperties}
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
                                absolute top-4 right-4 pointer-events-auto
                                w-8 h-8 text-[#1A1A1A]
                                flex items-center justify-center
                                active:scale-90 transition-all duration-500 ease-out
                                opacity-0 group-hover:opacity-100
                            `}
                            aria-label="Wishlist"
                        >
                            <Heart
                                size={22}
                                className="transition-all duration-300"
                                style={isInWishlist(product.id) ? { fill: accentColor, stroke: accentColor } : { stroke: "black" }}
                                strokeWidth={2}
                            />
                        </motion.button>
                    </div>

                    {/* Size Selector Popup Overlay */}
                    <AnimatePresence>
                        {isSizeSelectorOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-2 left-2 right-2 z-40 bg-white/95 backdrop-blur-md border border-neutral-200/80 p-3 rounded-lg shadow-xl flex flex-col items-center gap-2 text-center pointer-events-auto"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">
                                    Select Size
                                </span>
                                <div className="flex gap-1.5 flex-wrap justify-center my-1">
                                    {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => (
                                        <button
                                            key={size}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSelectSize(size);
                                            }}
                                            className="w-8 h-8 border rounded-full flex items-center justify-center font-sans text-[10px] font-bold transition-all border-neutral-200 hover:border-[#1A1A1A] hover:bg-neutral-50 active:scale-95"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-1 w-full mt-1 border-t border-neutral-100 pt-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsSizeSelectorOpen(false);
                                        }}
                                        className="text-[9px] uppercase tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

            {/* Product Info */}
            <div className="space-y-1.5 p-1 pt-2 flex flex-col items-center text-center">
                <Link href={`/product/${product.handle}`} onClick={handleViewItem}>
                    <h3 className="font-serif text-sm md:text-base font-normal tracking-wide text-[#1A1A1A] truncate hover:text-[#1A1A1A]/70 transition-colors">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-center gap-3 text-xs md:text-sm">
                    {product.originalPrice && (
                        <span className="text-neutral-400 line-through decoration-neutral-300 font-sans text-xs">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                    <span className="font-sans font-medium text-[#1A1A1A] tracking-wider text-xs">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>
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
