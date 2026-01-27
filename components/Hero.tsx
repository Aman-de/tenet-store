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
                    className="object-cover object-[60%_center] md:object-center" // Mobile: Slightly right. Desktop: Centered.
                    priority
                    quality={100}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/10 md:to-transparent" />
            </div>

            {/* Content Container */}
            {/* Mobile: Absolute Center (top-1/2). Desktop: Left Aligned. */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 pointer-events-none md:pointer-events-auto">
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center md:static md:translate-x-0 md:translate-y-0 md:h-full md:flex md:flex-col md:justify-center md:text-left md:items-start">

                    <div className="pointer-events-auto inline-block"> {/* Wrapper to re-enable clicks on content */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="font-serif text-lg md:text-xl tracking-widest mb-4 italic text-neutral-200 drop-shadow-md"
                        >
                            The Winter Heritage Collection
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="font-serif text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-tight text-white drop-shadow-lg"
                        >
                            SILENT <br className="hidden md:block" /> LUXURY
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <button
                                onClick={scrollToCollection}
                                className="group px-10 py-4 border border-white/80 text-white transition-all duration-300 tracking-[0.2em] text-sm font-bold uppercase backdrop-blur-sm relative overflow-hidden active:scale-95 shadow-lg"
                            >
                                <span className="relative z-10 group-hover:text-[#1A1A1A] transition-colors duration-300">Shop Collection</span>
                                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
            {/* Scroll Hint */}
            <ScrollIndicator />
        </section>
    );
}
