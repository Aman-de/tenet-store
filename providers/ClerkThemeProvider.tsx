"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

export default function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            const darkActive = document.documentElement.classList.contains("dark");
            setIsDark(darkActive);
        };

        checkDark();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    checkDark();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <ClerkProvider
            appearance={{
                baseTheme: isDark ? dark : undefined,
                layout: {
                    socialButtonsPlacement: "top",
                    socialButtonsVariant: "blockButton",
                },
                variables: {
                    colorPrimary: isDark ? "#F4F1ED" : "#1A1A1A",
                    colorBackground: isDark ? "#141414" : "#F8F5EF",
                    colorText: isDark ? "#F4F1ED" : "#1A1A1A",
                    colorTextSecondary: isDark ? "#A3A3A3" : "#737373",
                    colorInputBackground: isDark ? "#1A1A1A" : "#FFFFFF",
                    colorInputText: isDark ? "#F4F1ED" : "#1A1A1A",
                    colorBorder: isDark ? "#262626" : "#E5E5E5",
                },
            }}
        >
            {children}
        </ClerkProvider>
    );
}
