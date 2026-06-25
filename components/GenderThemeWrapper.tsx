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

    const accentColor = isWoman ? settings.womanAccentColor : settings.manAccentColor;
    const lightBg = isWoman 
        ? (settings.womanBgColorLight === '#FDFBF7' ? '#FCF0F2' : settings.womanBgColorLight)
        : (settings.manBgColorLight === '#F4F6F9' ? '#F0F4F8' : settings.manBgColorLight);
    const darkBg = isWoman ? settings.womanBgColorDark : settings.manBgColorDark;

    return (
        <div className="min-h-screen transition-colors duration-500">
            <style>{`
                :root {
                    --accent-color: ${accentColor};
                    --theme-bg-light: ${lightBg};
                    --theme-bg-dark: ${darkBg};
                }
                body {
                    background-color: var(--theme-bg-light) !important;
                    transition: background-color 0.5s ease, color 0.3s ease;
                }
                .dark body {
                    background-color: var(--theme-bg-dark) !important;
                }
            `}</style>
            {children}
        </div>
    );
}
