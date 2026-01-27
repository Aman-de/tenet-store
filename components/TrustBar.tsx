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
        <section className="bg-[#FAFAFA] py-8 border-y border-neutral-200"> {/* Compact Padding & Borders */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200"> {/* Added dividers for structure */}
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
                            <div className="space-y-1">
                                <h3 className="font-serif text-sm font-bold tracking-[0.15em] text-[#1A1A1A] uppercase">{pillar.title}</h3>
                                <p className="font-sans text-[11px] uppercase tracking-wide text-black/80 max-w-[200px] mx-auto hidden md:block">{pillar.subtext}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
