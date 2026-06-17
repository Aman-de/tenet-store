"use client";

import { Truck, RefreshCw, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustBar() {
    const pillars = [
        {
            icon: <Truck className="w-6 h-6 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "COMPLIMENTARY",
            title2: "SHIPPING",
            subtext: "On orders above $250"
        },
        {
            icon: <RefreshCw className="w-6 h-6 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "EASY RETURNS",
            title2: "",
            subtext: "Hassle-free\nexchanges"
        },
        {
            icon: <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "SECURE PAYMENTS",
            title2: "",
            subtext: "100% protected\ncheckout"
        },
        {
            icon: <Leaf className="w-6 h-6 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "CRAFTED",
            title2: "RESPONSIBLY",
            subtext: "Thoughtfully made"
        }
    ];

    return (
        <section className="hidden lg:block bg-[#F8F5EF] py-12 lg:py-24 border-t border-[#1A1A1A]/5 mt-4 lg:mt-0">
            <div className="max-w-[2000px] w-full mx-auto px-2 lg:px-12">
                <div className="grid grid-cols-4 gap-2 lg:gap-12 divide-x divide-[#1A1A1A]/10">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center text-center space-y-3 px-1 lg:px-4"
                        >
                            <div className="p-2 lg:p-4">
                                {pillar.icon}
                            </div>
                            <div className="space-y-1 lg:space-y-2">
                                <h3 className="font-sans text-[7px] lg:text-xs font-bold tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED] uppercase leading-tight">
                                    {pillar.title}<br/>{pillar.title2}
                                </h3>
                                <p className="font-sans text-[8px] lg:text-[11px] font-normal text-neutral-500 whitespace-pre-line leading-relaxed">
                                    {pillar.subtext}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
