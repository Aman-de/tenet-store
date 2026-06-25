"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function WhatsAppWidget() {
    const settings = useSettings();
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`;
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show only after scrolling down a bit (approx 30% of first fold)
        if (latest >= 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 0.25, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-32 lg:bottom-12 right-4 lg:right-6 z-40 flex flex-col items-end"
                >
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
                        aria-label="Contact support on WhatsApp"
                    >
                        <img 
                            src="/whatsapp-logo.svg" 
                            className="w-full h-full object-contain filter drop-shadow-md" 
                            alt="WhatsApp" 
                        />
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
