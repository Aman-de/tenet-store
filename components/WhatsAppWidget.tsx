"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function WhatsAppWidget() {
    const settings = useSettings();
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 0.7, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-40 flex flex-col items-end"
                >
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
                        aria-label="Contact support on WhatsApp"
                    >
                        <img 
                            src="/whatsapp-logo.svg" 
                            className="w-full h-full object-contain filter drop-shadow-md" 
                            alt="WhatsApp" 
                        />
                    </a>
                </motion.div>
        </AnimatePresence>
    );
}
