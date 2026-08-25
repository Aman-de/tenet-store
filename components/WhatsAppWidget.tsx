"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export default function WhatsAppWidget() {
    const settings = useSettings();
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber || "918590958131"}?text=${encodeURIComponent(settings.whatsappMessage || "Hi Shreya! I'd like to place an express Rakhi order directly. (I can also share a photo for personalized size & fit advice!)")}`;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.4 }}
                className="fixed bottom-[74px] sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5"
            >
                {/* Desktop Tooltip Badge */}
                <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white text-[11px] font-sans font-semibold border border-white/10 shadow-lg pointer-events-none opacity-90">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                    💬 Express Orders & Photo Sizing
                </span>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-[50px] h-[50px] lg:w-[58px] lg:h-[58px] rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer border-2 border-white dark:border-neutral-900"
                    aria-label="Contact concierge on WhatsApp"
                >
                    {/* Pulsing Outer Ping Ring */}
                    <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>

                    {/* WhatsApp Icon */}
                    <img 
                        src="/whatsapp-logo.svg" 
                        className="w-[28px] h-[28px] lg:w-[34px] lg:h-[34px] object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" 
                        alt="WhatsApp Concierge" 
                    />
                </a>
            </motion.div>
        </AnimatePresence>
    );
}
