"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollIndicator from "./ScrollIndicator";
import { Product } from "@/lib/data";
import { useGender } from "@/context/GenderContext";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
interface HeroProps {
    spotlightProducts?: Product[];
}

export default function Hero({ spotlightProducts = [] }: HeroProps) {
    const { gender } = useGender();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: true, align: "start", slidesToScroll: "auto" }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [mounted, setMounted] = useState(false);

    const totalSlides = 1 + spotlightProducts.length;

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();
    const scrollToIndex = (index: number) => emblaApi?.scrollTo(index);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        
        const updateSnaps = () => {
            setScrollSnaps(emblaApi.scrollSnapList());
            setActiveIndex(emblaApi.selectedScrollSnap());
        };

        updateSnaps();
        emblaApi.on("select", updateSnaps);
        emblaApi.on("reInit", updateSnaps);
        
        return () => {
            emblaApi.off("select", updateSnaps);
            emblaApi.off("reInit", updateSnaps);
        };
    }, [emblaApi]);

    // Reset scroll position on gender change
    useEffect(() => {
        if (emblaApi) emblaApi.scrollTo(0);
    }, [gender, emblaApi]);

    const scrollToCollection = () => {
        const section = document.getElementById("new-arrivals");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative h-[85vh] lg:h-[90vh] w-full overflow-hidden bg-[#FDFBF7] group/hero">
            {/* Horizontal Scroll Layout */}
            <div 
                ref={emblaRef}
                className="overflow-hidden h-full w-full"
            >
                <div className="flex h-full w-full touch-pan-y items-center lg:gap-1 px-0 py-0 lg:py-1">
                    {/* 1. Original Horizontal Hero Image - Full Width Everywhere */}
                    <div className="relative h-full w-full md:w-[100vw] lg:w-[100vw] shrink-0 overflow-hidden group">
                    <Image
                        key={`hero-bg-${gender}`}
                        src={gender === "man" ? "/images/hero-main.webp" : "/images/hero-women.webp"}
                        alt={gender === "man" ? "The Winter Heritage Collection" : "The Spring Grace Collection"}
                        fill
                        className="object-cover object-[60%_80%] lg:object-center transform scale-105 transition-transform duration-[10s] hover:scale-100"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:via-black/10 lg:to-transparent" />
                    
                    {/* Content Container (Original) */}
                    <motion.div 
                        key={`hero-content-${gender}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-10 w-full h-full p-6 lg:p-16 flex flex-col justify-end pb-32 lg:justify-center lg:pb-0 items-center lg:items-start text-center lg:text-left"
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xs uppercase tracking-[0.2em] text-gray-300 mb-2"
                        >
                            {gender === "man" ? "The Winter Heritage Collection" : "The Spring Grace Collection"}
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="font-serif text-5xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.9] text-white drop-shadow-lg"
                        >
                            {gender === "man" ? (
                                <>SILENT <br className="hidden lg:block" /> LUXURY</>
                            ) : (
                                <>SILENT <br className="hidden lg:block" /> ELEGANCE</>
                            )}
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
                    </motion.div>
                </div>

                {/* 2. Vertical 9:16 Spotlight Products */}
                {spotlightProducts.map((product) => (
                    <Link
                        href={`/product/${product.handle}`}
                        key={product.id}
                        className="relative h-full w-full md:w-[50vw] lg:w-[33.333vw] shrink-0 overflow-hidden lg:rounded-sm group block ml-0 bg-[#f4f4f4]"
                    >
                        {product.images[0] && (
                            <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover object-center transition-transform duration-[8s] ease-out group-hover:scale-105"
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
            </div>

            {/* Navigation Arrows & Dots (PC only) */}
            {totalSlides > 1 && (
                <>
                    <button 
                        onClick={scrollPrev}
                        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full items-center justify-center text-white transition-all duration-300 cursor-pointer border border-white/10 opacity-0 group-hover/hero:opacity-100"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button 
                        onClick={scrollNext}
                        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full items-center justify-center text-white transition-all duration-300 cursor-pointer border border-white/10 opacity-0 group-hover/hero:opacity-100"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Pagination Dots (PC only) */}
                    <div className="hidden lg:flex absolute bottom-8 w-full justify-center gap-3 z-40 pointer-events-auto">
                        {mounted && scrollSnaps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={`transition-all duration-300 rounded-full ${
                                    activeIndex === idx 
                                    ? "bg-white w-8 h-2" 
                                    : "bg-white/50 hover:bg-white/80 w-2 h-2"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="absolute bottom-6 w-full flex justify-center z-30 pointer-events-none">
                <ScrollIndicator />
            </div>
        </section>
    );
}
