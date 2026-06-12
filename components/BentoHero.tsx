"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

    return (
        <section className="relative h-[100dvh] w-full bg-[#F8F5EF] flex flex-col lg:flex-row p-2 lg:p-6 gap-2 lg:gap-6 overflow-hidden">
            
            {/* LEFT: Hero Section (45% Mobile, 60% Desktop) */}
            <div className="relative w-full h-[45%] lg:w-7/12 xl:w-2/3 lg:h-full rounded-xl lg:rounded-2xl overflow-hidden group bg-neutral-200">
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
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute inset-0 p-6 lg:p-12 flex flex-col justify-end items-start">
                                <h1 className="font-serif text-5xl lg:text-7xl xl:text-[6rem] font-normal tracking-wide text-white leading-[0.9] drop-shadow-md">
                                    {isWoman ? "Silent Elegance." : "Quiet Luxury."}
                                </h1>
                                <Link href="/#new-arrivals" className="mt-8 w-fit border-b border-white pb-1 text-white text-xs font-medium uppercase tracking-[0.2em] hover:text-white/70 hover:border-white/70 transition-colors duration-500">
                                    Discover Collection
                                </Link>
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

            {/* RIGHT: Categories Grid (55% Mobile, 40% Desktop) */}
            <div className="w-full h-[55%] lg:w-5/12 xl:w-1/3 lg:h-full grid grid-cols-2 grid-rows-3 gap-2 lg:gap-4">
                {filteredCollections.map((collection, index) => {
                    const catKey = (collection.filterTag || collection.handle || "").toLowerCase();
                    const coverPhoto = CATEGORY_IMAGES[catKey]?.[gender] || collection.imageUrl;

                    return (
                        <Link key={collection.id} href={`/collection/${collection.handle}`} className="relative group rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-100 block">
                            <Image
                                src={coverPhoto}
                                alt={collection.title}
                                fill
                                sizes="(max-width: 768px) 50vw, 16vw"
                                className="object-cover transform transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
                            
                            <div className="absolute inset-0 p-4 lg:p-6 flex flex-col justify-end items-center text-center">
                                <h3 className="font-serif italic text-white text-xl lg:text-2xl tracking-widest drop-shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 leading-tight">
                                    {collection.title}
                                </h3>
                            </div>
                        </Link>
                    );
                })}
            </div>
            
        </section>
    );
}
