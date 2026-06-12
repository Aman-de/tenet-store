"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, RefreshCw, ShieldCheck, Leaf } from "lucide-react";
import { useGender } from "@/context/GenderContext";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
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

    // Filter categories to exactly 6
    const coreCategories = ["shirting", "shirts", "trousers", "pants", "footwear", "accessories", "sets", "shorts"];
    let filteredCollections = collections.filter(collection => {
        const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
        return coreCategories.includes(catKey);
    });
    const hasShirts = filteredCollections.some(c => (c.filterTag || c.handle || "").toLowerCase() === "shirts");
    if (hasShirts) {
        filteredCollections = filteredCollections.filter(c => (c.filterTag || c.handle || "").toLowerCase() !== "shirting");
    }
    filteredCollections = filteredCollections.slice(0, 6);

    // Embla Carousel for Hero Images (Spotlights + Main Image)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    const mainHeroSrc = gender === "man" ? "/images/hero-main.webp" : "/images/hero-women.webp";
    const accentColor = gender === "woman" ? "#E67389" : "#5B8CD7";

    const trustPillars = [
        { icon: <Truck className="w-6 h-6 text-[#1A1A1A] stroke-[1]" />, title: "COMPLIMENTARY", title2: "SHIPPING", subtext: "On orders above $250" },
        { icon: <RefreshCw className="w-6 h-6 text-[#1A1A1A] stroke-[1]" />, title: "EASY RETURNS", title2: "", subtext: "Hassle-free\nexchanges" },
        { icon: <ShieldCheck className="w-6 h-6 text-[#1A1A1A] stroke-[1]" />, title: "SECURE PAYMENTS", title2: "", subtext: "100% protected\ncheckout" },
        { icon: <Leaf className="w-6 h-6 text-[#1A1A1A] stroke-[1]" />, title: "CRAFTED", title2: "RESPONSIBLY", subtext: "Thoughtfully made" }
    ];

    return (
        <section className="relative h-[100dvh] w-full bg-[#F8F5EF] flex flex-col lg:flex-row p-0 lg:p-6 gap-1 lg:gap-6 overflow-hidden">
            
            {/* LEFT: Hero Section (Auto Scrolling) */}
            <div className="relative w-full h-[43%] lg:w-7/12 xl:w-2/3 lg:h-full rounded-none lg:rounded-2xl overflow-hidden group bg-neutral-200">
                <div ref={emblaRef} className="overflow-hidden w-full h-full">
                    <div className="flex w-full h-full">
                        {/* Slide 1: Main Editorial */}
                        <div className="relative flex-[0_0_100%] h-full w-full">
                            <Image
                                src={mainHeroSrc}
                                alt="Main Hero"
                                fill
                                priority
                                className="object-cover transform transition-transform duration-[20s] hover:scale-105"
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
                                
                                {/* Slide Indicators (Mobile) */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 lg:hidden">
                                    <div className="w-6 h-1 bg-white rounded-full" />
                                    <div className="w-1 h-1 border border-white rounded-full" />
                                    <div className="w-1 h-1 border border-white rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Slides 2+: Spotlight Products */}
                        {spotlightProducts.slice(0, 4).map((product) => (
                            <Link href={`/product/${product.handle}`} key={product.id} className="relative flex-[0_0_100%] h-full w-full block">
                                {product.images[0] && (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        fill
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
                        ))}
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

            {/* RIGHT: Categories & TrustBar (Mobile) / Categories Only (Desktop) */}
            <div className="w-full h-[57%] lg:w-5/12 xl:w-1/3 lg:h-full flex flex-col gap-1 lg:gap-4 px-1 lg:px-0">
                
                {/* Categories Grid - 78% of the 57% remaining height */}
                <div className="w-full h-[78%] lg:h-full grid grid-cols-2 grid-rows-3 gap-1 lg:gap-4">
                    {filteredCollections.map((collection, index) => {
                        const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                        const coverPhoto = CATEGORY_IMAGES[catKey]?.[gender] || collection.imageUrl;
                        const subtitle = CATEGORY_SUBTITLES[catKey] || "Explore the collection";

                        return (
                            <Link key={collection.id} href={`/collection/${collection.handle}`} className="relative group rounded-md lg:rounded-2xl overflow-hidden bg-neutral-100 block w-full h-full">
                            <Image
                                src={coverPhoto}
                                alt={collection.title}
                                fill
                                sizes="(max-width: 768px) 50vw, 16vw"
                                className="object-cover transform transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                            
                            <div className="absolute inset-0 p-3 lg:p-6 flex flex-row items-end justify-between">
                                <div className="flex flex-col text-left">
                                    <h3 className="font-serif text-white text-[13px] lg:text-2xl drop-shadow-sm leading-tight">
                                        {collection.title}
                                    </h3>
                                    <p className="font-sans text-[7px] lg:text-[10px] text-white/80 mt-0.5 lg:mt-1.5 tracking-wide">
                                        {subtitle}
                                    </p>
                                </div>
                                <div className="w-5 h-5 lg:w-8 lg:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0 transform group-hover:bg-white/30 transition-colors duration-500">
                                    <ArrowRight className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-white" strokeWidth={1.5} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
                </div>

                {/* Mobile Integrated TrustBar - 22% of the 57% remaining height */}
                <div className="w-full h-[22%] lg:hidden grid grid-cols-4 divide-x divide-[#1A1A1A]/10 bg-[#F8F5EF] pb-[54px] pt-0.5">
                    {trustPillars.map((pillar, index) => (
                        <div key={index} className="flex flex-col items-center justify-center text-center px-0.5">
                            <div className="mb-0.5">{pillar.icon}</div>
                            <h3 className="font-sans text-[7px] font-bold tracking-widest text-[#1A1A1A] uppercase leading-tight">
                                {pillar.title}<br/>{pillar.title2}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
            
        </section>
    );
}
