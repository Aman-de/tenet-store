"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, RefreshCw, ShieldCheck, Leaf, Star, Sparkles } from "lucide-react";
import { useGender } from "@/context/GenderContext";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useRef } from "react";
import { Product } from "@/lib/data";

interface Collection {
    id: string;
    title: string;
    handle: string;
    imageUrl: string;
    filterTag?: string;
}

interface BentoHeroProps {
    spotlightProducts: Product[];
    collections: Collection[];
}

// Curated high-aesthetic category cover photos for Men & Women
const CATEGORY_IMAGES: Record<string, { man?: string; woman?: string }> = {
    knitwear: { man: "/images/categories/knitwear-man.jpg", woman: "/images/categories/knitwear-woman.jpg" },
    accessories: { man: "/images/categories/accessories-man.jpg", woman: "/images/categories/accessories-woman.webp" },
    shirts: { man: "/images/categories/shirts-man.webp", woman: "/images/categories/shirts-woman.webp" },
    jackets: { man: "/images/categories/jackets-man.webp", woman: "/images/categories/jackets-woman.webp" },
    footwear: { man: "/images/categories/footwear-man.webp", woman: "/images/categories/footwear-woman.jpg" },
    outerwear: { man: "/images/categories/outerwear-man.webp", woman: "/images/categories/outerwear-woman.webp" },
    trousers: { man: "/images/categories/trousers-man.jpg", woman: "/images/categories/trousers-woman.webp" },
    pants: { man: "/images/categories/pants-man.jpg", woman: "/images/categories/pants-woman.webp" },
    swimwear: { man: "/images/categories/swimwear-man.webp", woman: "/images/categories/swimwear-woman.webp" },
    sets: { man: "/images/categories/sets-man.webp", woman: "/images/categories/sets-woman.webp" },
    shirting: { man: "/images/categories/shirting-man.jpg", woman: "/images/categories/shirting-woman.webp" },
    lounge: { man: "/images/categories/lounge-man.webp", woman: "/images/categories/lounge-woman.webp" },
    shorts: { man: "/images/categories/shorts-man.webp", woman: "/images/categories/shorts-woman.webp" }
};

const CATEGORY_SUBTITLES: Record<string, string> = {
    accessories: "Understated Heirloom Accents",
    shirts: "Bespoke Italian Silhouettes",
    pants: "Effortless Comfort & Poise",
    footwear: "Handcrafted Luxury Soles",
    sets: "Sculpted Co-Ord Perfection",
    shorts: "Chic. Modern. Effortless.",
    knitwear: "Italian Cashmere & Rib Weaves",
    jackets: "Structured Modern Layers",
    outerwear: "Enduring Architecture",
    trousers: "Tailored Gurkha Precision",
    swimwear: "Riviera Resort Luxury",
    shirting: "Timeless Wardrobe Staples",
    lounge: "Pure Unwound Comfort"
};

export default function BentoHero({ spotlightProducts, collections }: BentoHeroProps) {
    const { gender } = useGender();
    const isWoman = gender === "woman";

    // Filter categories to exactly 4, prioritizing high-converting collections for the active gender
    const coreCategories = isWoman 
        ? ["sets", "accessories", "footwear", "pants"]
        : ["shirts", "trousers", "footwear", "accessories"];

    let filteredCollections = collections.filter(collection => {
        const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
        return coreCategories.includes(catKey);
    });

    // Sort according to gender-specific priority order
    filteredCollections.sort((a, b) => {
        const keyA = (a.filterTag || a.handle || "").toLowerCase();
        const keyB = (b.filterTag || b.handle || "").toLowerCase();
        return coreCategories.indexOf(keyA) - coreCategories.indexOf(keyB);
    });
    filteredCollections = filteredCollections.slice(0, 4);

    // Embla Carousel for Hero Images (Spotlights + Main Image)
    const desktopAutoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
    const mobileAutoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
    const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({ loop: true }, [desktopAutoplay.current]);
    const [mobileEmblaRef] = useEmblaCarousel({ loop: true }, [mobileAutoplay.current]);
    const scrollPrev = () => desktopEmblaApi?.scrollPrev();
    const scrollNext = () => desktopEmblaApi?.scrollNext();

    const mainHeroSrc = gender === "man" ? "/images/hero-main.webp" : "/images/hero-women.webp";
    const accentColor = "var(--accent-color)";
    const cardBg = isWoman ? "bg-[#FCF0F2] dark:bg-[#160F11]" : "bg-[#F0F4F8] dark:bg-[#0E1217]";
    const cardGradientFrom = isWoman ? "from-[#FCF0F2] dark:from-[#160F11]" : "from-[#F0F4F8] dark:from-[#0E1217]";
    const cardGradientVia = isWoman ? "via-[#FCF0F2]/70 dark:via-[#160F11]/70" : "via-[#F0F4F8]/70 dark:via-[#0E1217]/70";
    const cardGradientTo = isWoman ? "to-[#FCF0F2]/0 dark:to-[#160F11]/0" : "to-[#F0F4F8]/0 dark:to-[#0E1217]/0";

    return (
        <section className="relative w-full p-0 lg:p-6 overflow-hidden bg-transparent lg:h-[95dvh]">
            
            {/* DESKTOP LAYOUT (hidden lg:flex) */}
            <div className="hidden lg:flex w-full h-full gap-6">
                {/* LEFT: Hero Section (Auto Scrolling) */}
                <div className="relative w-full h-[65vh] lg:w-7/12 xl:w-2/3 lg:h-full rounded-none lg:rounded-3xl overflow-hidden group bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm">
                    <div ref={desktopEmblaRef} className="overflow-hidden w-full h-full">
                        <div className="flex w-full h-full">
                            {/* Slide 1: Main Editorial */}
                            <div className="relative flex-[0_0_100%] h-full w-full">
                                <Image
                                    src={mainHeroSrc}
                                    alt="Main Hero Editorial"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                    priority
                                    className="object-cover object-[85%_center] transform transition-transform duration-[20s] hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                                <div className="absolute inset-0 p-8 lg:p-14 flex flex-col justify-end items-start">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-white mb-4">
                                        <Sparkles className="w-3 h-3 text-[#E0A96D]" />
                                        {isWoman ? "AUTUMN / FESTIVE CAPSULE" : "SIGNATURE ARCHIVAL COLLECTION"}
                                    </span>
                                    <h1 className="font-serif text-4xl lg:text-7xl xl:text-[5.5rem] font-normal tracking-tight text-white leading-[1.05] drop-shadow-lg mb-3">
                                        {isWoman ? (
                                            <>Effortless<br/><span className="italic font-light">Elegance.</span></>
                                        ) : (
                                            <>Quiet<br/><span className="italic font-light">Luxury.</span></>
                                        )}
                                    </h1>
                                    <p className="text-neutral-200 text-xs lg:text-base font-sans max-w-md leading-relaxed mb-6 font-light drop-shadow-sm">
                                        {isWoman 
                                            ? "Spun from breathable Italian linen and organic threads. Tailored for timeless grace across every occasion." 
                                            : "Structured Gurkha trousers, Italian knitwear, and breathable popovers built for refined distinction."}
                                    </p>
                                    <Link href="/#new-arrivals" className="inline-flex items-center justify-between gap-4 bg-white text-black dark:bg-[#F4F1ED] dark:text-black px-7 py-3.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white transition-all duration-300 shadow-xl group/btn hover:scale-[1.02] active:scale-[0.98]">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Explore Collection</span>
                                        <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
                                    </Link>
                                </div>
                            </div>

                            {/* Slides 2+: Spotlight Products */}
                            {spotlightProducts.slice(0, 8).map((product) => {
                                const heroImage = product.images[0] || product.images[1];
                                return (
                                    <Link href={`/product/${product.handle}`} key={product.id} className="relative flex-[0_0_100%] h-full w-full block">
                                        {heroImage && (
                                            <Image
                                                src={heroImage}
                                                alt={product.title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 66vw"
                                                loading="lazy"
                                                quality={80}
                                                unoptimized={heroImage.startsWith("http")}
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-8 left-8 lg:bottom-14 lg:left-14">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] uppercase font-bold tracking-[0.25em] text-[#E0A96D] mb-3">
                                                ★ Archival Spotlight
                                            </span>
                                            <h2 className="font-serif italic text-3xl lg:text-5xl text-white drop-shadow-md mb-2">
                                                {product.title}
                                            </h2>
                                            <p className="font-sans font-bold text-sm lg:text-lg text-white/90">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hero Controls */}
                    <button onClick={scrollPrev} aria-label="Previous Slide" className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95 cursor-pointer">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={scrollNext} aria-label="Next Slide" className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95 cursor-pointer">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* RIGHT: Categories Grid (Desktop) */}
                <div className="w-full lg:w-5/12 xl:w-1/3 lg:h-full flex flex-col gap-4">
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
                        {filteredCollections.map((collection) => {
                            const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                            const lookupGender = (gender === "woman" || gender === "man") ? gender : "woman";
                            const coverPhoto = CATEGORY_IMAGES[catKey]?.[lookupGender] || collection.imageUrl;
                            const subtitle = CATEGORY_SUBTITLES[catKey] || "Explore the curation";

                            return (
                                <Link key={collection.id} href={`/collection/${collection.handle}`} className="relative group rounded-3xl overflow-hidden bg-neutral-100 dark:bg-[#141414] block w-full h-full border border-black/5 dark:border-white/10 shadow-xs">
                                    <Image
                                        src={coverPhoto}
                                        alt={collection.title}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 16vw"
                                        unoptimized={coverPhoto.startsWith("http")}
                                        className="object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />
                                    
                                    <div className="absolute inset-0 p-5 flex flex-row items-end justify-between">
                                        <div className="flex flex-col text-left">
                                            <h3 className="font-serif text-white text-xl lg:text-2xl drop-shadow-sm leading-tight font-medium">
                                                {collection.title}
                                            </h3>
                                            <p className="font-sans text-[10px] text-neutral-300 mt-1 tracking-wide font-light">
                                                {subtitle}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 transform group-hover:bg-white group-hover:text-black transition-all duration-300">
                                            <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-black transition-colors" strokeWidth={2} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MOBILE LAYOUT (lg:hidden) */}
            <div className="lg:hidden flex flex-col w-full gap-2 px-3 pt-0 pb-1">
                {/* 1. Hero Banner Carousel */}
                <div ref={mobileEmblaRef} className="overflow-hidden w-full rounded-2xl border border-black/5 dark:border-white/10 shadow-xs">
                    <div className="flex w-full">
                        {/* Slide 1: Main Static Hero */}
                        <div className={`relative flex-[0_0_100%] w-full aspect-[16/9] overflow-hidden ${cardBg} flex items-center`}>
                            <div className="absolute right-0 top-0 bottom-0 w-[60%] h-full overflow-hidden">
                                <Image
                                    src={mainHeroSrc}
                                    alt="Main Hero"
                                    fill
                                    sizes="60vw"
                                    priority
                                    className="object-cover object-[85%_center]"
                                />
                                <div className={`absolute inset-y-0 -left-6 w-32 bg-gradient-to-r ${cardGradientFrom} ${cardGradientVia} ${cardGradientTo}`} />
                            </div>
                            
                            <div className="relative z-10 w-[55%] pl-4 flex flex-col items-start justify-center pointer-events-none">
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#E0A96D] mb-0.5">
                                    {isWoman ? "Festive Edition" : "Classic Edit"}
                                </span>
                                <h1 className="font-serif text-[14px] sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-[#F4F1ED] leading-[1.2] mb-1 pointer-events-auto">
                                    {isWoman ? (
                                        <>Artisanal Kurtis &<br/>Linen Co-Ords</>
                                    ) : (
                                        <>Italian Linen &<br/>Tailored Silhouettes</>
                                    )}
                                </h1>
                                <div className="flex items-center gap-1 mb-2 text-[8px] text-neutral-600 dark:text-neutral-400">
                                    <span className="text-[#E0A96D]">★★★★★</span>
                                    <span className="font-bold text-neutral-800 dark:text-neutral-200">4.9</span>
                                    <span>•</span>
                                    <span>Verified Patrons</span>
                                </div>
                                <Link 
                                    href="/#new-arrivals" 
                                    className="flex items-center justify-between gap-2 bg-[#1A1A1A] dark:bg-[#F4F1ED] text-white dark:text-[#1A1A1A] px-3.5 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm pointer-events-auto"
                                >
                                    <span className="text-[8px] font-bold uppercase tracking-wider">
                                        Explore
                                    </span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Product Spotlight Slides */}
                        {spotlightProducts.slice(0, 6).map((product) => {
                            const heroImage = product.images[0] || product.images[1];
                            return (
                                <div key={product.id} className={`relative flex-[0_0_100%] w-full aspect-[16/9] overflow-hidden ${cardBg} flex items-center`}>
                                    <div className="absolute right-0 top-0 bottom-0 w-[60%] h-full overflow-hidden">
                                        {heroImage && (
                                            <Image
                                                src={heroImage}
                                                alt={product.title}
                                                fill
                                                sizes="60vw"
                                                className="object-cover object-[85%_center]"
                                                unoptimized={heroImage.startsWith("http")}
                                            />
                                        )}
                                        <div className={`absolute inset-y-0 -left-6 w-32 bg-gradient-to-r ${cardGradientFrom} ${cardGradientVia} ${cardGradientTo}`} />
                                    </div>
                                    
                                    <div className="relative z-10 w-[55%] pl-4 flex flex-col items-start justify-center pointer-events-none">
                                        <span className="text-[8px] uppercase font-bold tracking-widest text-[#E0A96D] mb-0.5">
                                            Curated Spotlight
                                        </span>
                                        <h2 className="font-serif text-[13px] sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-[#F4F1ED] leading-[1.2] mb-1 pointer-events-auto line-clamp-1">
                                            {product.title}
                                        </h2>
                                        <div className="flex items-center gap-1.5 font-sans mb-2 pointer-events-auto">
                                            <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
                                        </div>
                                        <Link 
                                            href={`/product/${product.handle}`} 
                                            className="flex items-center justify-between gap-2 bg-[#1A1A1A] dark:bg-[#F4F1ED] text-white dark:text-[#1A1A1A] px-3.5 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm pointer-events-auto"
                                        >
                                            <span className="text-[8px] font-bold uppercase tracking-wider">
                                                Acquire
                                            </span>
                                            <ArrowRight className="w-2.5 h-2.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Trust Ribbon */}
                <div className={`w-full ${cardBg} border border-black/5 dark:border-white/10 rounded-2xl py-2.5 px-2 flex justify-between items-center shadow-xs divide-x divide-neutral-200/60 dark:divide-white/10`}>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-1">
                        <Star className="w-3 h-3 text-[#E0A96D]" fill="#E0A96D" />
                        <span className="font-bold text-[8.5px] text-neutral-800 dark:text-[#F4F1ED] tracking-wide">4.9 / 5 Rating</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-1">
                        <Truck className="w-3 h-3 text-neutral-700 dark:text-neutral-300" strokeWidth={2} />
                        <span className="font-bold text-[8.5px] text-neutral-800 dark:text-[#F4F1ED] tracking-wide">Free Shipping</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-1">
                        <ShieldCheck className="w-3 h-3 text-neutral-700 dark:text-neutral-300" strokeWidth={2} />
                        <span className="font-bold text-[8.5px] text-neutral-800 dark:text-[#F4F1ED] tracking-wide">100% Genuine</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-1">
                        <RefreshCw className="w-3 h-3 text-neutral-700 dark:text-neutral-300" strokeWidth={2} />
                        <span className="font-bold text-[8.5px] text-neutral-800 dark:text-[#F4F1ED] tracking-wide">7-Day Return</span>
                    </div>
                </div>

                {/* 3. Shop By Category Section */}
                <div className="w-full mt-1">
                    <h2 className="font-serif text-[11px] font-bold tracking-wider text-neutral-800 dark:text-[#F4F1ED] uppercase mb-2">
                        Curated Collections
                    </h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                        {filteredCollections.map((collection) => {
                            const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                            const lookupGender = (gender === "woman" || gender === "man") ? gender : "woman";
                            const coverPhoto = CATEGORY_IMAGES[catKey]?.[lookupGender] || collection.imageUrl;
                            
                            return (
                                <Link 
                                    key={collection.id} 
                                    href={`/collection/${collection.handle}`} 
                                    className="flex flex-col items-center gap-1.5 flex-shrink-0 snap-align-start w-[76px]"
                                >
                                    <div className="relative w-[64px] h-[64px] rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xs active:scale-95 transition-transform duration-200">
                                        <Image
                                            src={coverPhoto}
                                            alt={collection.title}
                                            fill
                                            sizes="64px"
                                            unoptimized={coverPhoto.startsWith("http")}
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-sans text-[9px] font-bold text-center tracking-wider text-neutral-800 dark:text-neutral-200 uppercase truncate w-full">
                                        {collection.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            
        </section>
    );
}
