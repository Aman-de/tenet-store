"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
    const scrollToCollection = () => {
        const section = document.getElementById("new-arrivals");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col">
            {/* Background Image - Responsive Positioning */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-main.webp"
                    alt="The Winter Heritage Collection"
                    fill
                    className="object-cover object-[60%_80%] scale-110 lg:scale-100 lg:object-center" // Mobile/Tablet: Scaled up & focused lower. Desktop: Centered.
                    priority
                    quality={100}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:via-black/10 lg:to-transparent" />
            </div>

            {/* Content Container */}
            {/* Mobile: Bottom positioned just above Discover. Desktop: Left Aligned. */}
            <div className="absolute inset-0 z-10 w-full h-full max-w-7xl mx-auto px-6 pointer-events-none lg:pointer-events-auto flex flex-col justify-end pb-48 lg:justify-center lg:pb-0 lg:items-start text-center lg:text-left">

                <div className="pointer-events-auto w-full lg:w-auto"> {/* Wrapper for button clicks & width control */}
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
                        {/* Mobile Button: Solid White (Touch Optimized) */}
                        <button
                            onClick={scrollToCollection}
                            className="lg:hidden w-full max-w-xs bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-xl"
                        >
                            Shop Collection
                        </button>

                        {/* Desktop Button: Glass + Slide Animation (Mouse Optimized) */}
                        <button
                            onClick={scrollToCollection}
                            className="hidden lg:block group px-10 py-4 border border-white/80 text-white transition-all duration-300 tracking-[0.2em] text-sm font-bold uppercase backdrop-blur-sm relative overflow-hidden active:scale-95 shadow-lg"
                        >
                            <span className="relative z-10 group-hover:text-[#1A1A1A] transition-colors duration-300">Shop Collection</span>
                            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0" />
                        </button>
                    </motion.div>
                </div>
            </div>
            {/* Scroll Hint */}
            <ScrollIndicator />
        </section>
    );
}
