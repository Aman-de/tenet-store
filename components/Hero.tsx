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
    const accentColor = gender === "woman" ? "#E05275" : "#2B6496";
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
                        sizes="100vw"
                        className="object-cover object-[60%_80%] lg:object-center transform scale-110 transition-transform duration-[30s] ease-linear hover:scale-100"
                        priority
                        quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/70 lg:via-black/20 lg:to-transparent" />
                    
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
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[10px] lg:text-sm uppercase tracking-[0.3em] lg:tracking-[0.4em] text-white/80 mb-4 font-medium"
                        >
                            {gender === "man" ? "The Winter Heritage Collection" : "The Spring Grace Collection"}
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif text-6xl xs:text-7xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tight mb-8 leading-[0.85] text-white drop-shadow-2xl"
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
                            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <button
                                onClick={scrollToCollection}
                                className="lg:hidden w-full max-w-xs bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-black active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                            >
                                Explore the Archives
                            </button>
                            <button
                                onClick={scrollToCollection}
                                className="hidden lg:flex items-center justify-center gap-3 group/btn px-12 py-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all duration-500 tracking-[0.2em] text-sm font-bold uppercase overflow-hidden hover:bg-white hover:text-[#1A1A1A] hover:border-transparent active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
                            >
                                <span>Explore the Archives</span>
                            </button>
                        </motion.div>
                        
                        {/* Above the Fold Trust Signals */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="mt-6 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-[9px] xs:text-[10px] md:text-[11px] uppercase tracking-widest text-white/80 font-medium max-w-md lg:max-w-none"
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                Heritage Craftsmanship
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                Free Express Shipping
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                Secure Checkout
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* 2. Vertical 9:16 Spotlight Products */}
                {spotlightProducts.map((product, index) => {
                    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                    const pct = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
                    const showBadge = hasDiscount && pct !== 16 && pct !== 17;

                    return (
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
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index < 2}
                                    className="object-cover object-center transition-transform duration-[8s] ease-out group-hover:scale-105"
                                    quality={90}
                                />
                            )}
                            {/* Discount Badge */}
                            {showBadge && (
                                <div 
                                    className="absolute top-4 left-4 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider z-20 shadow-sm rounded-sm"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    {pct}% OFF
                                </div>
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
                    );
                })}
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
