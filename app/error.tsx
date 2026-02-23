"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RefreshCcw, Home } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("App boundary caught error:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] w-full flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-md w-full"
            >
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-[#1A1A1A]">
                        <span className="font-serif italic text-3xl">!</span>
                    </div>
                </div>

                <h1 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] mb-4">
                    Something went wrong
                </h1>

                <p className="text-neutral-500 mb-10 text-sm leading-relaxed">
                    We encountered an unexpected issue. Please try refreshing or return to the main collection.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="w-full sm:w-auto px-8 py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={14} />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-3 bg-white border border-neutral-200 text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={14} />
                        Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
