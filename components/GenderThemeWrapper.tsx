"use client";

import { useGender } from "@/context/GenderContext";
import { useEffect, useState } from "react";

interface SiteSettings {
    title: string;
    womanAccentColor: string;
    manAccentColor: string;
    womanBgColorLight: string;
    womanBgColorDark: string;
    manBgColorLight: string;
    manBgColorDark: string;
    whatsappNumber?: string;
    whatsappMessage?: string;
    instagramUrl?: string;
}

export default function GenderThemeWrapper({ 
    children, 
    settings 
}: { 
    children: React.ReactNode;
    settings: SiteSettings;
}) {
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const accentColor = gender === "woman" 
        ? settings.womanAccentColor 
        : gender === "man"
            ? settings.manAccentColor
            : gender === "gadget"
                ? "#7C3AED" // Vibrant tech purple
                : "#1A1A1A"; // Sleek premium charcoal for 'all'

    const lightBg = gender === "woman" 
        ? (settings.womanBgColorLight === '#FDFBF7' ? '#FCF0F2' : settings.womanBgColorLight)
        : gender === "man"
            ? (settings.manBgColorLight === '#F4F6F9' ? '#F0F4F8' : settings.manBgColorLight)
            : gender === "gadget"
                ? "#FAF9F6" // Minimalist off-white for gadgets
                : "#FAF9F6"; // Elegant warm-white for 'all'

    const darkBg = gender === "woman" 
        ? settings.womanBgColorDark 
        : gender === "man"
            ? settings.manBgColorDark
            : gender === "gadget"
                ? "#0B0F19" // Deep tech navy/black
                : "#0A0A0A"; // Solid deep black for 'all'

    return (
        <div className="min-h-screen transition-colors duration-500">
            <style>{`
                :root {
                    --accent-color: ${accentColor};
                    --theme-bg-light: ${lightBg};
                    --theme-bg-dark: ${darkBg};
                }
                html, body {
                    background-color: var(--theme-bg-light) !important;
                    transition: background-color 0.5s ease, color 0.3s ease;
                }
                .dark html, .dark body {
                    background-color: var(--theme-bg-dark) !important;
                }
            `}</style>
            {children}
        </div>
    );
}
