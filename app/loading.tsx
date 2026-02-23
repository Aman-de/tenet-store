"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="min-h-[70vh] w-full flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6 text-[#1A1A1A]"
            >
                {/* Minimalist Spinner */}
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                    <div className="absolute inset-0 border border-neutral-200 rounded-full" />
                    <div className="absolute inset-0 border-t-2 border-l-2 border-[#1A1A1A] rounded-full animate-spin" />
                </div>
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium text-neutral-500">
                    Entering
                </p>
            </motion.div>
        </div>
    );
}
