"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { useStore } from "@/lib/store";
import { useGender } from "@/context/GenderContext";
import { Plus, Heart, Loader2, Check, Star } from "lucide-react";
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
    
    // Stable seed for ratings and review count
    const rating = 4.8 + ((product.title.charCodeAt(0) % 3) * 0.1);
    const reviewCount = 120 + ((product.title.charCodeAt(1) % 50) * 12);

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;
    const savingsAmount = hasDiscount ? product.originalPrice! - product.price : 0;

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
        }, 500);
    };

    const isGadget = product.category === 'gadgets' || product.category === 'electronics';

    return (
        <div
            className="group relative cursor-pointer bg-transparent transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-[#141414] border border-black/5 dark:border-white/10 mb-2.5 rounded-2xl md:rounded-3xl shadow-xs">
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
                                            className={`absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-105 ${isGadget ? "object-contain p-4" : "object-cover"}`}
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

                {/* Out of Stock / Rakhi Festive Discount Badge */}
                {product.isOutOfStock ? (
                    <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest z-20 rounded-full">
                        Sold Out
                    </div>
                ) : (
                    <div 
                        className="absolute top-2.5 left-2.5 text-white text-[8.5px] sm:text-[9.5px] font-black px-2.5 py-1 uppercase tracking-wider z-20 shadow-md rounded-full bg-gradient-to-r from-[#1E0D11] via-[#140C0E] to-[#1E0D11] backdrop-blur-md border border-[#E0A96D]/50 flex items-center gap-1"
                    >
                        <span className="text-xs leading-none">🪢</span>
                        <span className="text-[#E0A96D]">RAKHI 30% OFF</span>
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
                    className="md:hidden absolute top-2.5 right-2.5 z-30 pointer-events-auto w-8 h-8 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md text-neutral-800 dark:text-[#F4F1ED] rounded-full flex items-center justify-center shadow-md border border-neutral-100/50 dark:border-white/10 active:scale-90 transition-all duration-200"
                    aria-label="Wishlist"
                >
                    <Heart
                        size={15}
                        className="transition-all duration-300"
                        style={isWishlisted ? { fill: "#E0A96D", stroke: "#E0A96D" } : { stroke: "currentColor" }}
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
                        className="md:hidden absolute bottom-2.5 right-2.5 z-30 w-8 h-8 bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F4F1ED] rounded-full flex items-center justify-center shadow-lg border border-neutral-200/50 dark:border-white/10 active:scale-95 transition-all duration-200"
                    >
                        <Plus size={16} className="text-[#1A1A1A] dark:text-[#F4F1ED]" strokeWidth={2.5} />
                    </motion.button>
                )}

                {/* Desktop Wishlist Button - Top Right */}
                <motion.button
                    whileTap={{ scale: 1.2 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className="hidden md:flex absolute top-3.5 right-3.5 z-30 pointer-events-auto w-9 h-9 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md text-neutral-800 dark:text-[#F4F1ED] rounded-full items-center justify-center shadow-md border border-neutral-100/50 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Wishlist"
                >
                    <Heart
                        size={16}
                        className="transition-all duration-300"
                        style={isWishlisted ? { fill: "#E0A96D", stroke: "#E0A96D" } : { stroke: "currentColor" }}
                        strokeWidth={2}
                    />
                </motion.button>

                {/* Quick Add Overlay - Desktop Only */}
                <div className="absolute bottom-3 left-3 right-3 z-30 hidden md:block pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (addingState !== 'idle' || product.isOutOfStock) return;
                            setIsSizeSelectorOpen(true);
                        }}
                        className={`
                            pointer-events-auto
                            w-full bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md text-[#1A1A1A] dark:text-[#F4F1ED] py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ease-out border border-black/10 dark:border-white/15
                            hover:bg-[#1A1A1A] hover:text-white dark:hover:bg-white dark:hover:text-black shadow-lg
                            opacity-0 group-hover:opacity-100
                            transform ${addingState !== 'idle' && !product.isOutOfStock ? 'translate-y-0 opacity-100' : 'translate-y-3 group-hover:translate-y-0'}
                        `}
                        disabled={addingState !== 'idle' || product.isOutOfStock}
                    >
                        {product.isOutOfStock
                            ? "Sold Out"
                            : (addingState === 'idle' ? "+ Quick Add to Bag" : (addingState === 'adding' ? "Adding..." : "Added to Bag ✓"))}
                    </button>
                </div>

                {/* Size Selector Popup Overlay */}
                <AnimatePresence>
                    {isSizeSelectorOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute inset-x-2 bottom-2 z-40 bg-white/95 dark:bg-[#161616]/95 backdrop-blur-xl border border-black/10 dark:border-white/15 p-3.5 rounded-2xl shadow-2xl flex flex-col items-center gap-2 text-center pointer-events-auto"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <span className="text-[9.5px] uppercase font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
                                Select Size for Bag
                            </span>
                            <div className="flex gap-2 flex-wrap justify-center my-1.5">
                                {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => (
                                    <button
                                        key={size}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSelectSize(size);
                                        }}
                                        className="min-w-[34px] h-[34px] px-2 border rounded-full flex items-center justify-center font-sans text-[11px] font-bold transition-all border-neutral-300 dark:border-neutral-700 text-[#1A1A1A] dark:text-[#F4F1ED] hover:border-black dark:hover:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black active:scale-95 cursor-pointer shadow-xs"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <div className="w-full border-t border-neutral-100 dark:border-white/10 pt-1.5">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsSizeSelectorOpen(false);
                                    }}
                                    className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Product Info */}
            <div className="space-y-1 p-1 flex flex-col items-start text-left w-full">
                <Link href={`/product/${product.handle}`} onClick={handleViewItem} className="block w-full">
                    <h3 className="font-sans text-xs md:text-sm font-medium tracking-wide text-neutral-900 dark:text-[#F4F1ED] truncate hover:text-neutral-600 dark:hover:text-white transition-colors w-full">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 flex-wrap text-xs md:text-sm pt-0.5">
                    <span className="font-sans font-extrabold text-[13px] md:text-sm text-[#1A1A1A] dark:text-[#F4F1ED]">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                        <span className="text-neutral-400 dark:text-neutral-500 line-through font-sans text-[11px]">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Rating & Review Count & Rakhi Delivery Tag */}
                <div className="flex items-center justify-between w-full pt-0.5">
                    <div className="flex items-center gap-1.5 text-[9.5px] text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{rating.toFixed(1)}</span>
                        <span className="text-neutral-400">({reviewCount})</span>
                    </div>
                    <span className="text-[8.5px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                        ⚡ Rakhi Express
                    </span>
                </div>
            </div>
        </div>
    );
}
