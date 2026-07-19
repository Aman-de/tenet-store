"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
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
    const [mounted, setMounted] = useState(false);
    const [emblaRef] = useEmblaCarousel({ loop: true });
    const { addToCart, openCart, toggleWishlist, isInWishlist } = useStore();
    
    useEffect(() => {
        setMounted(true);
    }, []);
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const accentColor = "var(--accent-color)";
    const isWishlisted = mounted ? isInWishlist(product.id) : false;
    
    // Stable random seed for ratings and review count
    const rating = 4.5 + (product.title.charCodeAt(0) % 5) * 0.1;
    const reviewCount = 200 + (product.title.charCodeAt(1) % 80) * 15;

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

    const primaryImage = product.images?.[0];
    const secondaryImage = product.images?.[1] || null;

    return (
        <div
            className="group relative cursor-pointer bg-transparent transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-[#111111] mb-3 rounded-2xl">
                {/* Embla Carousel for swiping */}
                <div className="overflow-hidden w-full h-full touch-pan-y" ref={emblaRef}>
                    <div className="flex w-full h-full">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, index) => (
                                <div key={index} className="flex-[0_0_100%] min-w-0 w-full h-full relative">
                                    <Link href={`/product/${product.handle}`} onClick={handleViewItem} className="absolute inset-0 z-0 block w-full h-full">
                                        {index === 0 && isImg1Loading && (
                                            <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-10" />
                                        )}
                                        <Image
                                            src={img}
                                            alt={`${product.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover absolute inset-0 z-0"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                            unoptimized={img.startsWith("http")}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            onLoad={() => {
                                                if (index === 0) setIsImg1Loading(false);
                                            }}
                                        />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="flex-[0_0_100%] min-w-0 w-full h-full relative">
                                <Link href={`/product/${product.handle}`} onClick={handleViewItem} className="absolute inset-0 z-0 block w-full h-full">
                                    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs">
                                        No Image
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover overlay for Desktop */}
                <div className="hidden lg:block pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {product.images && product.images.length > 1 && !altImgError && (
                        <>
                            {isImg2Loading && isHovered && (
                                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                            )}
                            <Image
                                src={product.images[1]}
                                alt={`${product.title} Alternate`}
                                fill
                                className="object-cover absolute inset-0"
                                sizes="(max-width: 768px) 50vw, 33vw"
                                unoptimized={product.images[1].startsWith("http")}
                                loading="lazy"
                                onError={() => setAltImgError(true)}
                                onLoad={() => setIsImg2Loading(false)}
                            />
                        </>
                    )}
                </div>

                {/* Out of Stock Badge */}
                    {product.isOutOfStock ? (
                        <div className="absolute top-2.5 left-2.5 bg-black/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 uppercase tracking-widest z-20 rounded-md">
                            Out of Stock
                        </div>
                    ) : (
                        hasDiscount && discountPercentage !== 16 && discountPercentage !== 17 && (
                            <div 
                                className="absolute top-2.5 left-2.5 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider z-20 shadow-sm rounded-md"
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
                        className="md:hidden absolute top-2.5 right-2.5 z-30 pointer-events-auto w-8 h-8 bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#F4F1ED] rounded-full flex items-center justify-center shadow-md border border-neutral-100/50 dark:border-white/10 active:scale-90 transition-all duration-200"
                        aria-label="Wishlist"
                    >
                        <Heart
                            size={16}
                            className="transition-all duration-300"
                            style={isWishlisted ? { fill: accentColor, stroke: accentColor } : { stroke: "currentColor" }}
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
                            className="md:hidden absolute bottom-2 right-2 z-30 w-8 h-8 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-sm text-[#1A1A1A] dark:text-[#F4F1ED] rounded-full flex items-center justify-center shadow-md border border-neutral-200/50 dark:border-white/10 active:scale-95 transition-all duration-200"
                        >
                            <Plus size={16} style={{ color: accentColor }} />
                        </motion.button>
                    )}

                    {/* Desktop Wishlist Button - Top Right of Image */}
                    <motion.button
                        whileTap={{ scale: 1.2 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className="hidden md:flex absolute top-4 right-4 z-30 pointer-events-auto w-8 h-8 bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#F4F1ED] rounded-full items-center justify-center shadow-md border border-neutral-100/50 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                        aria-label="Wishlist"
                    >
                        <Heart
                            size={16}
                            className="transition-all duration-300"
                            style={isWishlisted ? { fill: accentColor, stroke: accentColor } : { stroke: "currentColor" }}
                            strokeWidth={2}
                        />
                    </motion.button>

                    {/* Quick Add Overlay - Desktop Only */}
                    <div className="absolute bottom-4 left-4 right-4 z-30 hidden md:block pointer-events-none">
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
                                w-full bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-sm text-[#1A1A1A] dark:text-[#F4F1ED] py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-out border-t border-[#1A1A1A]/10 dark:border-white/10
                                hover:bg-[#1A1A1A] dark:hover:bg-white dark:bg-[#111111] hover:text-white dark:hover:text-[#1A1A1A] dark:text-[#F4F1ED]
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
                    </div>

                    {/* Size Selector Popup Overlay */}
                    <AnimatePresence>
                        {isSizeSelectorOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-2 left-2 right-2 z-40 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border border-neutral-200/80 dark:border-white/10 p-3 rounded-lg shadow-xl flex flex-col items-center gap-2 text-center pointer-events-auto"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
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
                                            className="w-8 h-8 border rounded-full flex items-center justify-center font-sans text-[10px] font-bold transition-all border-neutral-200 dark:border-neutral-700 text-[#1A1A1A] dark:text-[#F4F1ED] hover:border-[#1A1A1A] dark:hover:border-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-[#141414] dark:bg-[#0A0A0A] dark:hover:bg-white/10 active:scale-95"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-1 w-full mt-1 border-t border-neutral-100 dark:border-white/10 pt-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsSizeSelectorOpen(false);
                                        }}
                                        className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

            {/* Product Info */}
            <div className="space-y-1.5 p-1 pt-1.5 flex flex-col items-start text-left w-full">
                <Link href={`/product/${product.handle}`} onClick={handleViewItem} className="block w-full">
                    <h3 className="font-sans text-xs md:text-[13px] font-normal tracking-wide text-neutral-800 dark:text-[#F4F1ED] truncate hover:text-black dark:hover:text-white transition-colors w-full">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-baseline gap-2 text-xs md:text-sm">
                    <span className="font-sans font-extrabold text-[13px] text-[#1A1A1A] dark:text-[#F4F1ED]">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                        <span className="text-neutral-400 dark:text-neutral-500 line-through decoration-neutral-300 dark:decoration-neutral-600 font-sans text-[10px]">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Rating & Review Count */}
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-neutral-500 dark:text-neutral-400">
                    <div className="flex text-amber-500">
                        {"★".repeat(Math.floor(rating))}
                    </div>
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">{rating.toFixed(1)}</span>
                    <span>({reviewCount.toLocaleString()})</span>
                </div>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-1 pt-0.5">
                        {product.colors.map((color, idx) => (
                            <div
                                key={idx}
                                className="w-2.5 h-2.5 rounded-full border border-neutral-200 dark:border-neutral-700"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
