"use client";

import { useState, useEffect } from "react";
import { X, Share, MoreVertical, PlusSquare, Smartphone } from "lucide-react";
import { useGender } from "@/context/GenderContext";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const { gender } = useGender();
    const accentColor = "var(--accent-color)";

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowInstructions(true);
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsVisible(false);
            }
            setDeferredPrompt(null);
        } else {
            // Fallback: Show beautiful modal instead of ugly alert
            setShowInstructions(true);
        }
    };

    if (!isVisible && !showInstructions) return null;

    return (
        <>
            {/* The Compact Install Pill */}
            <AnimatePresence>
                {isVisible && !showInstructions && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[90] flex items-center gap-1.5 p-1.5 pr-2 bg-white/80 dark:bg-[#141414]/80 backdrop-blur-[20px] saturate-[180%] border border-[#1A1A1A]/10 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full"
                    >
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-sm border border-neutral-100 dark:border-neutral-800">
                            <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full object-cover saturate-[1.5] contrast-[1.1]" />
                        </div>
                        
                        <span className="text-[9.5px] font-bold tracking-wide text-[#1A1A1A] dark:text-[#F4F1ED] px-1 whitespace-nowrap">
                            TENET APP
                        </span>
                        
                        <button 
                            onClick={handleInstallClick}
                            className="ml-1 px-3 py-1.5 text-[9px] font-bold text-white rounded-full transition-transform active:scale-95 shadow-sm"
                            style={{ backgroundColor: accentColor }}
                        >
                            GET
                        </button>
                        
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors shrink-0"
                            aria-label="Close"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Custom Instructions Modal (Fallback) */}
            <AnimatePresence>
                {showInstructions && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowInstructions(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-[#141414] rounded-t-3xl p-6 shadow-2xl pb-safe pt-8"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800">
                                        <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white leading-tight">Install TENET App</h3>
                                        <p className="text-xs text-neutral-500">Fast, offline & seamless</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowInstructions(false)} className="p-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors rounded-full">
                                    <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                </button>
                            </div>
                            
                            {isIOS ? (
                                <div className="space-y-6 pb-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Share className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <p className="text-[15px] text-neutral-600 dark:text-neutral-300">Tap the <strong className="text-black dark:text-white font-semibold">Share</strong> icon at the bottom of Safari.</p>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                            <PlusSquare className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                        </div>
                                        <p className="text-[15px] text-neutral-600 dark:text-neutral-300">Scroll down and select <strong className="text-black dark:text-white font-semibold">Add to Home Screen</strong>.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pb-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                            <MoreVertical className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                        </div>
                                        <p className="text-[15px] text-neutral-600 dark:text-neutral-300">Tap the <strong className="text-black dark:text-white font-semibold">3-dot menu</strong> in your browser's toolbar.</p>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                            <Smartphone className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                        </div>
                                        <p className="text-[15px] text-neutral-600 dark:text-neutral-300">Select <strong className="text-black dark:text-white font-semibold">Install App</strong> or <strong className="text-black dark:text-white font-semibold">Add to Home screen</strong>.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
