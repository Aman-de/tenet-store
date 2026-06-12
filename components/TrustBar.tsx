"use client";

import { Factory, ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustBar() {
    const pillars = [
        {
            icon: <Factory className="w-6 h-6 text-[#1A1A1A] stroke-[1.5]" />, // Larger Icon
            title: "MADE IN INDIA",
            subtext: "Crafted locally with global standards."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-[#1A1A1A] stroke-[1.5]" />, // Larger Icon
            title: "SECURE UPI PAYMENTS",
            subtext: "Encrypted transactions for complete peace of mind."
        },
        {
            icon: <RefreshCw className="w-6 h-6 text-[#1A1A1A] stroke-[1.5]" />, // Larger Icon
            title: "EASY 7-DAY RETURNS",
            subtext: "Hassle-free returns. No questions asked."
        }
    ];

    return (
        <section className="bg-transparent py-16 md:py-24 border-t border-[#1A1A1A]/10"> {/* Expansive Padding & Borders */}
            <div className="max-w-[2000px] w-full mx-auto px-6 xl:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4"> {/* Removed vertical dividers for cleaner look */}
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center text-center space-y-3 py-4 md:py-0"
                        >
                            <div className="p-3">
                                {pillar.icon}
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-serif text-sm font-normal tracking-[0.2em] text-[#1A1A1A] uppercase">{pillar.title}</h3>
                                <p className="font-sans text-[11px] font-light tracking-wide text-[#1A1A1A]/70 max-w-[200px] mx-auto hidden md:block">{pillar.subtext}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
