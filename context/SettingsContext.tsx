"use client";

import React, { createContext, useContext } from "react";
import { SiteSettings } from "@/lib/sanity";

const SettingsContext = createContext<SiteSettings | undefined>(undefined);

export function SettingsProvider({ children, settings }: { children: React.ReactNode, settings: SiteSettings }) {
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
