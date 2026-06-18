"use client";

import { useGender } from "@/context/GenderContext";
import { useEffect, useState } from "react";

export default function GenderThemeWrapper({ children }: { children: React.ReactNode }) {
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Pink theme for women, blue theme for men
    const lightBg = isWoman ? "#FCF0F2" : "#F0F4F8";
    const darkBg = isWoman ? "#160F11" : "#0E1217";

    return (
        <div className="min-h-screen transition-colors duration-500">
            <style>{`
                :root {
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
