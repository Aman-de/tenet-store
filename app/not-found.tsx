"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[75vh] w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg w-full relative z-10"
            >
                <h1 className="font-serif text-[8rem] md:text-[14rem] leading-none text-[#1A1A1A] opacity-[0.03] font-bold select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 tracking-tighter">
                    404
                </h1>

                <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] mb-6">
                    Page Not Found
                </h2>

                <p className="text-neutral-500 mb-10 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                    The requested page could not be found. It may have been relocated, or it never existed.
                </p>

                <Link
                    href="/"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300 w-full sm:w-auto"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Collection
                </Link>
            </motion.div>
        </div>
    );
}
