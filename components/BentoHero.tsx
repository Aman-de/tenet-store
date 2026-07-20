"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, RefreshCw, ShieldCheck, Leaf } from "lucide-react";
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

// Curated high-aesthetic category cover photos for Men & Women (Served Locally for Instant Load)
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
    accessories: "Elevate every detail",
    shirts: "Effortless sophistication",
    pants: "Comfort meets style",
    footwear: "Step into luxury",
    sets: "Coordinated to perfection",
    shorts: "Chic. Modern. Effortless.",
    knitwear: "Cozy elegance",
    jackets: "Refined layers",
    outerwear: "Brave the elements",
    trousers: "Tailored perfection",
    swimwear: "Poolside luxury",
    shirting: "Classic staples",
    lounge: "Relaxed luxury"
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
    const desktopAutoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
    const mobileAutoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }));
    const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({ loop: true }, [desktopAutoplay.current]);
    const [mobileEmblaRef] = useEmblaCarousel({ loop: true }, [mobileAutoplay.current]);
    const scrollPrev = () => desktopEmblaApi?.scrollPrev();
    const scrollNext = () => desktopEmblaApi?.scrollNext();

    const mainHeroSrc = gender === "man" ? "/images/hero-main.webp" : "/images/hero-women.webp";
    const accentColor = "var(--accent-color)";
    const cardBg = isWoman ? "bg-[#FFF2F4] dark:bg-[#1C1416]" : "bg-[#F4F8FC] dark:bg-[#12161B]";
    const cardGradientFrom = isWoman ? "from-[#FFF2F4] dark:from-[#1C1416]" : "from-[#F4F8FC] dark:from-[#12161B]";
    const cardGradientVia = isWoman ? "via-[#FFF2F4]/60 dark:via-[#1C1416]/60" : "via-[#F4F8FC]/60 dark:via-[#12161B]/60";
    const cardGradientTo = isWoman ? "to-[#FFF2F4]/0 dark:to-[#1C1416]/0" : "to-[#F4F8FC]/0 dark:to-[#12161B]/0";

    const trustPillars = [
        { icon: <Truck className="w-7 h-7 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />, title: "COMPLIMENTARY", title2: "SHIPPING", subtext: "Free on all orders" },
        { icon: <RefreshCw className="w-7 h-7 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />, title: "EASY RETURNS", title2: "", subtext: "Hassle-free\nexchanges" },
        { icon: <ShieldCheck className="w-7 h-7 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />, title: "SECURE PAYMENTS", title2: "", subtext: "100% protected\ncheckout" },
        { icon: <Leaf className="w-7 h-7 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />, title: "CRAFTED", title2: "RESPONSIBLY", subtext: "Thoughtfully made" }
    ];

    return (
        <section className="relative w-full p-0 lg:p-6 overflow-hidden bg-transparent lg:h-[100dvh]">
            
            {/* DESKTOP LAYOUT (hidden lg:flex) */}
            <div className="hidden lg:flex w-full h-full gap-6">
                {/* LEFT: Hero Section (Auto Scrolling) */}
                <div className="relative w-full h-[65vh] lg:w-7/12 xl:w-2/3 lg:h-full rounded-none lg:rounded-2xl overflow-hidden group bg-neutral-200 dark:bg-neutral-800">
                    <div ref={desktopEmblaRef} className="overflow-hidden w-full h-full">
                        <div className="flex w-full h-full">
                            {/* Slide 1: Main Editorial */}
                            <div className="relative flex-[0_0_100%] h-full w-full">
                                <Image
                                    src={mainHeroSrc}
                                    alt="Main Hero"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                    priority
                                    className="object-cover object-[85%_center] transform transition-transform duration-[20s] hover:scale-105"
                                />
                                {/* Gradient for Navbar Icon Visibility */}
                                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10 lg:hidden pointer-events-none" />
                                <div className="absolute inset-0 bg-black/20 lg:bg-black/10" />
                                <div className="absolute inset-0 p-4 lg:p-12 flex flex-col justify-center lg:justify-end items-start pt-16 lg:pt-0">
                                    <span className="text-[9px] lg:text-xs font-bold uppercase tracking-widest mb-2 lg:mb-4" style={{ color: accentColor }}>
                                        {gender === "man" ? "SPRING 2025" : "FESTIVE 2025"}
                                    </span>
                                    <h1 className="font-serif text-4xl lg:text-7xl xl:text-[6rem] font-normal tracking-wide text-white leading-[1.1] drop-shadow-md">
                                        {isWoman ? (
                                            <>Timeless<br/>Elegance</>
                                        ) : (
                                            <>Quiet<br/>Luxury</>
                                        )}
                                    </h1>
                                    <p className="text-white/90 text-[10px] lg:text-base font-sans mt-2 max-w-[220px] lg:max-w-md leading-relaxed hidden sm:block">
                                        {isWoman 
                                            ? "Exquisite Banarasi Lehengas, crafted for your most cherished celebrations." 
                                            : "Refined essentials, meticulously tailored for the modern gentleman."}
                                    </p>
                                    <Link href="/#new-arrivals" className="mt-4 flex items-center justify-between w-full max-w-[180px] lg:max-w-[260px] bg-[#1A1A1A] text-white px-4 py-3 lg:px-6 lg:py-4 rounded-sm hover:bg-black transition-colors duration-300">
                                        <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em]">Explore</span>
                                        <ArrowRight className="w-4 h-4 text-white/80" strokeWidth={1.5} />
                                    </Link>
                                </div>
                            </div>

                            {/* Slides 2+: Spotlight Products */}
                            {spotlightProducts.slice(0, 10).map((product) => {
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
                                                quality={75}
                                                unoptimized={heroImage.startsWith("http")}
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12">
                                            <span className="text-[9px] uppercase font-medium tracking-[0.3em] text-white/80 mb-3 block">
                                                Editorial Spotlight
                                            </span>
                                            <h2 className="font-serif italic text-3xl lg:text-5xl text-white drop-shadow-sm">
                                                {product.title}
                                            </h2>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hero Controls */}
                    <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* RIGHT: Categories (Desktop) */}
                <div className="w-full lg:w-5/12 xl:w-1/3 lg:h-full flex flex-col gap-4">
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
                        {filteredCollections.map((collection) => {
                            const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                            const lookupGender = (gender === "woman" || gender === "man") ? gender : "man";
                            const coverPhoto = CATEGORY_IMAGES[catKey]?.[lookupGender] || collection.imageUrl;
                            const subtitle = CATEGORY_SUBTITLES[catKey] || "Explore the collection";

                            return (
                                <Link key={collection.id} href={`/collection/${collection.handle}`} className="relative group rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#141414] block w-full h-full">
                                    <Image
                                        src={coverPhoto}
                                        alt={collection.title}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 16vw"
                                        unoptimized={coverPhoto.startsWith("http")}
                                        className="object-cover transform transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                                    
                                    <div className="absolute inset-0 p-6 flex flex-row items-end justify-between">
                                        <div className="flex flex-col text-left">
                                            <h3 className="font-serif text-white text-2xl drop-shadow-sm leading-tight">
                                                {collection.title}
                                            </h3>
                                            <p className="font-sans text-[10px] text-white/80 mt-1.5 tracking-wide">
                                                {subtitle}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0 transform group-hover:bg-white/30 transition-colors duration-500">
                                            <ArrowRight className="w-4 h-4 text-white" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MOBILE LAYOUT (lg:hidden) */}
            <div className="lg:hidden flex flex-col w-full gap-3 px-4 pt-4 pb-1">
                {/* 1. Hero Banner Carousel */}
                <div ref={mobileEmblaRef} className="overflow-hidden w-full rounded-2xl">
                    <div className="flex w-full">
                        {/* Slide 1: Main Static Hero */}
                        <div className={`relative flex-[0_0_100%] w-full aspect-[16/9] overflow-hidden ${cardBg} border border-neutral-200/50 dark:border-white/5 flex items-center`}>
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
                            
                            <div className="relative z-10 w-[55%] pl-5 flex flex-col items-start justify-center pointer-events-none">
                                <h1 className="font-serif text-[13px] sm:text-lg font-bold tracking-tight text-neutral-800 dark:text-[#F4F1ED] leading-[1.25] mb-1 pointer-events-auto">
                                    {isWoman ? (
                                        <>Premium Cotton<br/>Kurtis & Linen<br/>Essentials</>
                                    ) : (
                                        <>Premium Linen<br/>Shirts & Tailored<br/>Essentials</>
                                    )}
                                </h1>
                                <div className="flex items-center gap-1 mb-2.5 text-[8px] text-neutral-500 dark:text-neutral-400">
                                    <span className="text-[#FF9900]">★★★★★</span>
                                    <span className="font-bold text-neutral-700 dark:text-neutral-300">4.8</span>
                                    <span>|</span>
                                    <span>{isWoman ? "6k+ Women" : "4k+ Men"}</span>
                                </div>
                                <Link 
                                    href="#new-arrivals" 
                                    className="flex items-center justify-between gap-2.5 bg-[#1A1A1A] dark:bg-[#F4F1ED] text-white dark:text-[#1A1A1A] px-3.5 py-2 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm pointer-events-auto"
                                >
                                    <span className="text-[8px] font-bold uppercase tracking-wider">
                                        Shop Bestsellers
                                    </span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Product Spotlight Slides */}
                        {(() => {
                            const targetHandles = [
                                'chocolate-tassel-kurti-wide-leg-denim-co-ord-set',
                                'jaipur-print-kurti',
                                'blue-sky-co-ord-set',
                                'aurelia-cotton-kurti',
                                'silk-blend-camp-collar-shirt'
                            ];
                            
                            // Get products that match handles, or fallback to first few spotlights
                            const featuredProducts = targetHandles
                                .map(handle => spotlightProducts.find(p => p.handle === handle))
                                .filter(Boolean) as Product[];
                                
                            const finalProducts = featuredProducts.length > 0 ? featuredProducts : spotlightProducts.slice(0, 5);

                            return finalProducts.map(product => {
                                const heroImage = product.images[0] || product.images[1];
                                return (
                                    <div key={product.id} className={`relative flex-[0_0_100%] w-full aspect-[16/9] overflow-hidden ${cardBg} border border-neutral-200/50 dark:border-white/5 flex items-center`}>
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
                                        
                                        <div className="relative z-10 w-[55%] pl-5 flex flex-col items-start justify-center pointer-events-none">
                                            <span className="text-[8px] uppercase font-bold tracking-widest text-[#FF9900] mb-0.5">
                                                Featured
                                            </span>
                                            <h1 className="font-serif text-[13px] sm:text-lg font-bold tracking-tight text-neutral-800 dark:text-[#F4F1ED] leading-[1.25] mb-2 pointer-events-auto line-clamp-2">
                                                {product.title}
                                            </h1>
                                            <div className="flex items-center gap-1.5 font-sans mb-3 pointer-events-auto">
                                                <span className="font-bold text-xs sm:text-sm" style={{ color: accentColor }}>₹{product.price.toLocaleString('en-IN')}</span>
                                            </div>
                                            <Link 
                                                href={`/product/${product.handle}`} 
                                                className="flex items-center justify-between gap-2.5 bg-[#1A1A1A] dark:bg-[#F4F1ED] text-white dark:text-[#1A1A1A] px-3.5 py-2 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm pointer-events-auto w-fit"
                                            >
                                                <span className="text-[8px] font-bold uppercase tracking-wider">
                                                    Buy Now
                                                </span>
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* 2. Trust Ribbon (Pill) */}
                <div className={`w-full ${cardBg} border border-neutral-200/50 dark:border-white/5 rounded-2xl py-3 px-2 flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] divide-x divide-neutral-200/60 dark:divide-white/5`}>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-0.5">
                        <span className="text-[10px] text-[#FF9900]">★</span>
                        <span className="font-bold text-[9px] text-neutral-800 dark:text-[#F4F1ED]/95 tracking-wide">4.8 Rating</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-0.5">
                        <Truck className="w-3.5 h-3.5 text-neutral-600 dark:text-[#F4F1ED]/70" strokeWidth={2} />
                        <span className="font-bold text-[9px] text-neutral-800 dark:text-[#F4F1ED]/95 tracking-wide">Free Shipping</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-600 dark:text-[#F4F1ED]/70" strokeWidth={2} />
                        <span className="font-bold text-[9px] text-neutral-800 dark:text-[#F4F1ED]/95 tracking-wide">COD Available</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 px-0.5">
                        <RefreshCw className="w-3.5 h-3.5 text-neutral-600 dark:text-[#F4F1ED]/70" strokeWidth={2} />
                        <span className="font-bold text-[9px] text-neutral-800 dark:text-[#F4F1ED]/95 tracking-wide">Easy Returns</span>
                    </div>
                </div>

                {/* 3. Shop By Category Section */}
                <div className="w-full">
                    <h2 className="font-serif text-[11px] font-bold tracking-wider text-neutral-800 dark:text-[#F4F1ED] uppercase mb-2">
                        Shop By Category
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                        {filteredCollections.map((collection) => {
                            const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                            const lookupGender = (gender === "woman" || gender === "man") ? gender : "man";
                            const coverPhoto = CATEGORY_IMAGES[catKey]?.[lookupGender] || collection.imageUrl;
                            
                            return (
                                <Link 
                                    key={collection.id} 
                                    href={`/collection/${collection.handle}`} 
                                    className="flex flex-col items-center gap-2 flex-shrink-0 snap-align-start w-[72px]"
                                >
                                    <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden border border-neutral-200/60 dark:border-white/10 shadow-xs active:scale-95 transition-transform duration-200">
                                        <Image
                                            src={coverPhoto}
                                            alt={collection.title}
                                            fill
                                            sizes="64px"
                                            unoptimized={coverPhoto.startsWith("http")}
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-sans text-[9px] font-bold text-center tracking-wider text-neutral-700 dark:text-neutral-300 uppercase truncate w-full">
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
