"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ScrollIndicator from "./ScrollIndicator";
import { Product } from "@/lib/data";

interface HeroProps {
    spotlightProducts?: Product[];
}

export default function Hero({ spotlightProducts = [] }: HeroProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Smooth auto-scroll logic
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollInterval = setInterval(() => {
            // Check if reached the end
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                container.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                // Scroll by roughly the width of one vertical item
                const scrollAmount = window.innerWidth > 1024 
                    ? window.innerWidth * 0.25 // desktop vertical width
                    : window.innerWidth * 0.85; // mobile vertical width
                
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }, 5000); // 5 seconds per slide

        const pauseScroll = () => clearInterval(scrollInterval);
        
        container.addEventListener('mouseenter', pauseScroll);
        container.addEventListener('touchstart', pauseScroll, { passive: true });

        return () => {
            clearInterval(scrollInterval);
            if (container) {
                container.removeEventListener('mouseenter', pauseScroll);
                container.removeEventListener('touchstart', pauseScroll);
            }
        };
    }, []);

    const scrollToCollection = () => {
        const section = document.getElementById("new-arrivals");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative h-[85vh] lg:h-[90vh] w-full overflow-hidden bg-[#FDFBF7]">
            {/* Horizontal Scroll Layout */}
            <div 
                ref={scrollContainerRef}
                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth items-center lg:gap-1 px-0 lg:px-1 py-0 lg:py-1"
            >
                {/* 1. Original Horizontal Hero Image */}
                <div className="relative h-full w-full lg:w-[70vw] shrink-0 snap-center overflow-hidden lg:rounded-sm group">
                    <Image
                        src="/images/hero-main.webp"
                        alt="The Winter Heritage Collection"
                        fill
                        className="object-cover object-[60%_80%] lg:object-center transform scale-105 transition-transform duration-[10s] hover:scale-100"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:via-black/10 lg:to-transparent" />
                    
                    {/* Content Container (Original) */}
                    <div className="absolute inset-0 z-10 w-full h-full p-6 lg:p-16 flex flex-col justify-end pb-32 lg:justify-center lg:pb-0 items-center lg:items-start text-center lg:text-left">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xs uppercase tracking-[0.2em] text-gray-300 mb-2"
                        >
                            The Winter Heritage Collection
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="font-serif text-5xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.9] text-white drop-shadow-lg"
                        >
                            SILENT <br className="hidden lg:block" /> LUXURY
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <button
                                onClick={scrollToCollection}
                                className="lg:hidden w-full max-w-xs bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Shop Collection
                            </button>
                            <button
                                onClick={scrollToCollection}
                                className="hidden lg:block group/btn px-10 py-4 border border-white/80 text-white transition-all duration-300 tracking-[0.2em] text-sm font-bold uppercase backdrop-blur-sm relative overflow-hidden active:scale-95 shadow-lg"
                            >
                                <span className="relative z-10 group-hover/btn:text-[#1A1A1A] transition-colors duration-300">Shop Collection</span>
                                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* 2. Vertical 9:16 Spotlight Products */}
                {spotlightProducts.map((product) => (
                    <Link
                        href={`/product/${product.handle}`}
                        key={product.id}
                        className="relative h-full w-[85vw] md:w-[40vw] lg:w-[30vw] shrink-0 snap-center overflow-hidden lg:rounded-sm group block ml-1 lg:ml-0"
                    >
                        {product.images[0] && (
                            <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover object-top transition-transform duration-[8s] ease-out group-hover:scale-105"
                                quality={90}
                            />
                        )}
                        {/* Subtle Gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                        
                        {/* Simple Text Overlay (No massive buttons) */}
                        <div className="absolute bottom-0 w-full p-8 flex flex-col justify-end text-center">
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/70 mb-3 transform translate-y-2 opacity-80 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                {product.category || 'Featured'}
                            </span>
                            <h3 className="font-serif text-3xl lg:text-4xl text-white tracking-tight drop-shadow-md transform transition-transform duration-300 group-hover:-translate-y-1">
                                {product.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="absolute bottom-6 w-full flex justify-center z-30 pointer-events-none">
                <ScrollIndicator />
            </div>
        </section>
    );
}
