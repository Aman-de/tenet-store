"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollIndicator from "./ScrollIndicator";
import { Product } from "@/lib/data";

interface HeroProps {
    spotlightProducts?: Product[];
}

export default function Hero({ spotlightProducts = [] }: HeroProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = 1 + spotlightProducts.length;

    // Handle scroll to update active dot
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const children = Array.from(container.children) as HTMLElement[];
            const slides = children.filter(child => child.tagName === 'DIV' || child.tagName === 'A');
            
            const isAtEnd = Math.abs(container.scrollWidth - container.clientWidth - container.scrollLeft) < 5;
            if (isAtEnd) {
                setActiveIndex(slides.length - 1);
                return;
            }
            
            let closestIndex = 0;
            let minDistance = Infinity;

            slides.forEach((child, index) => {
                const distance = Math.abs(container.scrollLeft - child.offsetLeft);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollInterval = setInterval(() => {
            const isAtEnd = Math.abs(container.scrollWidth - container.clientWidth - container.scrollLeft) < 5;
            if (isAtEnd) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const children = Array.from(container.children) as HTMLElement[];
                const slides = children.filter(child => child.tagName === 'DIV' || child.tagName === 'A');
                for (let i = 0; i < slides.length; i++) {
                    if (slides[i].offsetLeft > container.scrollLeft + 10) {
                        container.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
                        break;
                    }
                }
            }
        }, 5000);

        const pauseScroll = () => clearInterval(scrollInterval);
        
        container.addEventListener('mouseenter', pauseScroll);
        container.addEventListener('touchstart', pauseScroll, { passive: true });

        return () => {
            clearInterval(scrollInterval);
            container.removeEventListener('mouseenter', pauseScroll);
            container.removeEventListener('touchstart', pauseScroll);
        };
    }, [totalSlides]);

    const scrollToIndex = (index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const children = Array.from(container.children) as HTMLElement[];
        const slides = children.filter(child => child.tagName === 'DIV' || child.tagName === 'A');
        
        if (index === slides.length - 1) {
            container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        } else if (slides[index]) {
            container.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        }
    };

    const scrollPrev = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const children = Array.from(container.children) as HTMLElement[];
        const slides = children.filter(child => child.tagName === 'DIV' || child.tagName === 'A');
        
        if (container.scrollLeft <= 5) {
            // We are at the start, loop to end
            container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
            return;
        }

        for (let i = slides.length - 1; i >= 0; i--) {
            if (slides[i].offsetLeft < container.scrollLeft - 10) {
                container.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
                return;
            }
        }
    };

    const scrollNext = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const isAtEnd = Math.abs(container.scrollWidth - container.clientWidth - container.scrollLeft) < 5;
        if (isAtEnd) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }

        const children = Array.from(container.children) as HTMLElement[];
        const slides = children.filter(child => child.tagName === 'DIV' || child.tagName === 'A');
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].offsetLeft > container.scrollLeft + 10) {
                container.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
                break;
            }
        }
    };

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
                ref={scrollContainerRef}
                className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth items-center lg:gap-1 px-0 py-0 lg:py-1"
            >
                {/* 1. Original Horizontal Hero Image - Full Width Everywhere */}
                <div className="relative h-full w-full md:w-[100vw] lg:w-[100vw] shrink-0 snap-start overflow-hidden group">
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
                        className="relative h-full w-full md:w-[48vw] lg:w-[30vw] portrait:!w-full shrink-0 snap-start overflow-hidden lg:rounded-sm group block ml-0"
                    >
                        {(product.images[1] || product.images[0]) && (
                            <Image
                                src={product.images[1] || product.images[0]}
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
                        {Array.from({ length: totalSlides }).map((_, idx) => (
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
