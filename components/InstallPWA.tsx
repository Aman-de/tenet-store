"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useGender } from "@/context/GenderContext";

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const { gender } = useGender();
    const accentColor = gender === "woman" ? "#FF4D6D" : "#3B82F6";

    useEffect(() => {
        // Run only on client side
        if (typeof window === "undefined") return;

        // Detect if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        // Detect iOS (Safari doesn't support beforeinstallprompt)
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Show banner automatically after 1 second if not installed
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
            alert("To install the app on iOS:\n\n1. Tap the Share icon at the bottom of Safari\n2. Scroll down and tap 'Add to Home Screen'\n3. Confirm by tapping 'Add'");
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
            // Fallback if prompt isn't ready or unsupported
            alert("To install the app natively:\n\n• On iOS/Mac Safari: Click the Share icon, then 'Add to Home Screen' or 'Add to Dock'.\n• On Chrome/Android: Tap the 3-dot menu and select 'Install app'.\n\n(Note: The 1-click install button only works on the live production site, not on localhost!)");
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[100] flex items-center gap-1.5 p-1.5 pr-2 bg-white/80 dark:bg-[#141414]/80 backdrop-blur-[20px] saturate-[180%] border border-[#1A1A1A]/10 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-sm border border-neutral-100 dark:border-neutral-800">
                <img src="/icon-192x192.png" alt="App Icon" className="w-full h-full object-cover" />
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
        </div>
    );
}
