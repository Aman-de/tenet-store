"use client";

import { Truck, RefreshCw, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustBar() {
    const pillars = [
        {
            icon: <Truck className="w-4 h-4 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "COMPLIMENTARY",
            title2: "SHIPPING",
            subtext: "Free on all orders"
        },
        {
            icon: <RefreshCw className="w-4 h-4 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "EASY RETURNS",
            title2: "",
            subtext: "Hassle-free\nexchanges"
        },
        {
            icon: <ShieldCheck className="w-4 h-4 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "SECURE PAYMENTS",
            title2: "",
            subtext: "100% protected\ncheckout"
        },
        {
            icon: <Leaf className="w-4 h-4 lg:w-8 lg:h-8 text-[#1A1A1A] dark:text-[#F4F1ED] stroke-[1]" />,
            title: "CRAFTED",
            title2: "RESPONSIBLY",
            subtext: "Thoughtfully made"
        }
    ];

    return (
        <section className="bg-transparent lg:bg-[#F8F5EF] lg:dark:bg-[#0A0A0A] py-3 lg:py-24 border-y lg:border-t lg:border-b-0 border-neutral-200/50 dark:border-white/5 my-2 lg:my-0 lg:mt-0 overflow-hidden">
            <div className="max-w-[2000px] w-full mx-auto px-0 lg:px-12">
                
                {/* Desktop Grid Layout */}
                <div className="hidden lg:grid grid-cols-4 gap-12 divide-x divide-neutral-200/50 dark:divide-white/5">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="flex flex-col items-center justify-start text-center space-y-3 px-4"
                        >
                            <div className="p-4">
                                {pillar.icon}
                            </div>
                            <div className="space-y-2 flex flex-col items-center">
                                <h3 className="font-sans text-xs font-bold tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED] uppercase leading-[1.1] scale-x-95 origin-center">
                                    {pillar.title}<br />{pillar.title2}
                                </h3>
                                <p className="font-sans text-[11px] font-normal text-neutral-500 whitespace-pre-line leading-relaxed">
                                    {pillar.subtext}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Static Layout (Always Visible) */}
                <div className="lg:hidden w-full px-4 pt-2 pb-1">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                        {pillars.map((pillar, index) => (
                            <div key={index} className="flex items-center gap-2.5">
                                <div className="shrink-0">{pillar.icon}</div>
                                <h3 className="font-sans text-[9px] font-bold tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED] uppercase leading-[1.15]">
                                    {pillar.title}<br />{pillar.title2}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
