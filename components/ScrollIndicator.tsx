"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
    const scrollToContent = () => {
        const section = document.getElementById("new-arrivals");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <button
            onClick={scrollToContent}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 group"
            aria-label="Scroll to content"
        >
            <span className="text-white text-[10px] uppercase tracking-[0.2em] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                Discover
            </span>

            <div className="relative h-16 w-[1px] bg-white/20 overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 w-full bg-white"
                    initial={{ height: "0%", opacity: 0 }}
                    animate={{
                        height: ["0%", "100%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.2
                    }}
                />
            </div>
        </button>
    );
}
