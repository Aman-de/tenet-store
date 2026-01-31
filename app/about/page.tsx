"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="bg-[#FDFBF7] min-h-screen">
            <div className="max-w-3xl mx-auto px-6 py-32 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8"
                >
                    About TENET
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-sans text-lg text-neutral-600 space-y-6 leading-relaxed"
                >
                    <p>
                        Redefining modern luxury for the ambitious, TENET exists at the intersection of heritage and innovation. We believe in &quot;Silent Luxury&quot;—clothing that speaks through quality, not logos.
                    </p>
                    <p>
                        Each piece is crafted with meticulous attention to detail, sourcing the finest materials to create a wardrobe that stands the test of time.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
