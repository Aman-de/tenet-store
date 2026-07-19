"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGender } from "@/context/GenderContext";

export default function WomenRedirect() {
    const { setGender } = useGender();
    const router = useRouter();

    useEffect(() => {
        setGender("woman");
        router.replace("/");
    }, [setGender, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-[#0A0A0A]">
            <div className="animate-pulse text-[10px] font-sans tracking-widest uppercase font-bold text-neutral-400">
                Loading Women's Collection...
            </div>
        </div>
    );
}
