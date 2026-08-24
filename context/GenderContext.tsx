"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Gender = "man" | "woman" | "gadget" | "all";

interface GenderContextType {
    gender: Gender;
    setGender: (gender: Gender) => void;
}

const GenderContext = createContext<GenderContextType | undefined>(undefined);

export function GenderProvider({ children }: { children: React.ReactNode }) {
    const [gender, setGenderState] = useState<Gender>("woman");

    useEffect(() => {
        // Default to women's collection for Rakhi festival edit
        try {
            const savedGender = localStorage.getItem("tenet-active-gender") as Gender | null;
            if (savedGender === "woman") {
                setGenderState("woman");
            } else {
                setGenderState("woman");
                localStorage.setItem("tenet-active-gender", "woman");
            }
        } catch (error) {
            console.error("Failed to read from localStorage:", error);
        }
    }, []);

    const setGender = (newGender: Gender) => {
        setGenderState(newGender);
        try {
            localStorage.setItem("tenet-active-gender", newGender);
        } catch (error) {
            console.error("Failed to write to localStorage:", error);
        }
    };

    return (
        <GenderContext.Provider value={{ gender, setGender }}>
            {children}
        </GenderContext.Provider>
    );
}

export function useGender() {
    const context = useContext(GenderContext);
    if (context === undefined) {
        throw new Error("useGender must be used within a GenderProvider");
    }
    return context;
}
