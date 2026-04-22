"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollIndicator from "./ScrollIndicator";
import { Product } from "@/lib/data";

interface HeroProps {
    spotlightProducts?: Product[];
}

export default function Hero({ spotlightProducts = [] }: HeroProps) {
    if (!spotlightProducts || spotlightProducts.length === 0) return null;

    return (
        <section className="relative h-screen w-full overflow-hidden bg-neutral-900 group">
            {/* Horizontal Snap Scroll Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory h-screen w-full scrollbar-none scroll-smooth">
                {spotlightProducts.map((product, idx) => (
                    <div key={product.id} className="relative w-full h-screen shrink-0 snap-center flex flex-col overflow-hidden">
                        
                        {/* Background Image - Responsive Positioning */}
                        <div className="absolute inset-0 z-0">
                            {product.images[0] && (
                                <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    fill
                                    className="object-cover object-[60%_80%] lg:object-center transform scale-105 transition-transform duration-[10s] hover:scale-100"
                                    priority={idx === 0}
                                    quality={100}
                                />
                            )}
                            {/* Gradient Overlays for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/20 lg:to-transparent" />
                        </div>

                        {/* Content Container */}
                        <div className="absolute inset-0 z-10 w-full h-full max-w-[2000px] mx-auto px-6 xl:px-12 pointer-events-none flex flex-col justify-end pb-48 lg:justify-center lg:pb-0 lg:items-start text-center lg:text-left">
                            <div className="pointer-events-auto w-full lg:w-[600px] flex flex-col items-center lg:items-start">
                                
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-white/80 mb-4"
                                >
                                    The Essential • {product.category}
                                </motion.p>
                                
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="font-serif text-4xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 leading-[0.9] text-white drop-shadow-lg"
                                >
                                    {product.title}
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="text-neutral-200 mb-8 max-w-sm font-sans font-light tracking-wide leading-relaxed text-sm lg:text-base text-shadow-sm"
                                >
                                    Crafted for uncompromising quality. Experience the pinnacle of luxury with our signature {product.title.toLowerCase()}. Elevated design meets timeless aesthetics.
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="flex w-full md:w-auto flex-col sm:flex-row gap-4"
                                >
                                    <Link
                                        href={`/product/${product.handle}`}
                                        className="w-full sm:w-auto px-10 py-4 bg-white text-[#1A1A1A] font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95 shadow-xl text-center"
                                    >
                                        Discover Now
                                    </Link>
                                    <Link
                                        href={`/product/${product.handle}`}
                                        className="w-full sm:w-auto px-10 py-4 border border-white/60 text-white font-bold uppercase tracking-widest text-xs backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95 text-center flex items-center justify-center gap-2"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

                        {/* Interactive Swipe Indicator (Visible on Desktop Right edge or Mobile Bottom) */}
                        {idx < spotlightProducts.length - 1 && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity animate-pulse pointer-events-none z-20">
                                <span className="text-white text-[10px] uppercase tracking-widest rotate-90 mb-4 font-bold">Swipe</span>
                                <ArrowRight className="w-6 h-6 text-white" />
                            </div>
                        )}
                        {idx < spotlightProducts.length - 1 && (
                            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 lg:hidden flex gap-2 items-center opacity-70 animate-pulse pointer-events-none z-20">
                                <span className="text-white text-[10px] uppercase tracking-widest font-bold">Swipe</span>
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* Scroll/Down Hint for leaving the Hero Section */}
            <div className="absolute bottom-0 w-full flex justify-center pb-8 z-30 pointer-events-none">
                <ScrollIndicator />
            </div>
        </section>
    );
}
