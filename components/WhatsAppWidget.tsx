"use client";

import { motion } from "framer-motion";

export default function WhatsAppWidget() {
    const whatsappUrl = "https://wa.me/917737796817?text=Hello%20Tenet%20Archives%2C%20I%20have%20a%20question%20about%20your%20collection...";

    return (
        <div className="fixed bottom-24 lg:bottom-6 right-6 z-40 flex flex-col items-end">
            {/* Main Floating Button */}
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
                aria-label="Contact support on WhatsApp"
            >
                {/* Official Icon loaded directly from public assets */}
                <img 
                    src="/whatsapp-logo.svg" 
                    className="w-full h-full object-contain filter drop-shadow-md" 
                    alt="WhatsApp" 
                />
            </motion.a>
        </div>
    );
}
