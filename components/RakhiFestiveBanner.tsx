"use client";

import React, { useState } from "react";
import { Check, Copy, ArrowRight, Sparkles } from "lucide-react";
import { useGender } from "@/context/GenderContext";

export default function RakhiFestiveBanner() {
    const { gender, setGender } = useGender();
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText("RAKHI30");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="w-full px-3 sm:px-4 lg:px-12 py-1.5 sm:py-2">
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#1C0D11] via-[#140C0E] to-[#1C0D11] border border-[#E0A96D]/40 text-white p-3 sm:p-3.5 shadow-sm">
                
                {/* Subtle Decorative Golden Festive Glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-radial from-[#E0A96D]/20 to-transparent blur-2xl pointer-events-none" />

                {/* DESKTOP VIEW (hidden lg:flex) */}
                <div className="hidden lg:flex items-center justify-between gap-4 relative z-10">
                    {/* Left: Festive Title + Copy Coupon */}
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xl leading-none">🪢</span>
                        <div className="flex flex-col">
                            <span className="font-serif text-sm font-bold tracking-tight text-[#FFF6EE]">
                                Rakhi Festive Special • <span className="text-[#E0A96D]">Flat 30% Off</span>
                            </span>
                            <span className="text-[10px] text-neutral-400 font-sans">
                                Guaranteed Delivery Before Rakhi • Free Gift Packaging
                            </span>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#E0A96D] to-[#D9384E] text-[#120B0D] font-mono text-[10.5px] font-black uppercase tracking-wider shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                            {copied ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? "COPIED RAKHI30 ✓" : "RAKHI30"}</span>
                        </button>
                    </div>

                    {/* Middle: Key Trust Bullets */}
                    <div className="flex items-center gap-4 text-[11px] font-semibold text-neutral-300">
                        <span className="flex items-center gap-1.5">
                            <span className="text-amber-400">⚡</span> Guaranteed Rakhi Delivery
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-rose-400">🎁</span> Free Gift Box & Card
                        </span>
                        <span className="text-neutral-600">•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400">🚚</span> Free Express Air Shipping
                        </span>
                    </div>

                    {/* Right: Quick Sister/Brother Switchers */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setGender("woman")}
                            className={`px-3 py-1 rounded-full text-[10.5px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                gender === "woman"
                                    ? "bg-white text-black ring-1 ring-[#E0A96D]"
                                    : "bg-white/10 text-neutral-300 hover:bg-white/20"
                            }`}
                        >
                            ✨ Sister's Edit
                        </button>
                        <button
                            onClick={() => setGender("man")}
                            className={`px-3 py-1 rounded-full text-[10.5px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                gender === "man"
                                    ? "bg-white text-black ring-1 ring-[#E0A96D]"
                                    : "bg-white/10 text-neutral-300 hover:bg-white/20"
                            }`}
                        >
                            👔 Brother's Edit
                        </button>
                    </div>
                </div>

                {/* MOBILE VIEW (lg:hidden) - Ultra-Compact & Clean */}
                <div className="lg:hidden flex flex-col gap-2 relative z-10">
                    {/* Row 1: Header + 1-Tap Coupon Button */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-base leading-none shrink-0">🪢</span>
                            <span className="font-serif text-xs font-bold text-[#FFF6EE] truncate">
                                Rakhi Edit <span className="text-[#E0A96D] font-mono">• 30% OFF</span>
                            </span>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#E0A96D] to-[#D9384E] text-[#120B0D] font-mono text-[9.5px] font-black uppercase tracking-wider shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                        >
                            {copied ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Copy className="w-2.5 h-2.5" />}
                            <span>{copied ? "COPIED ✓" : "RAKHI30"}</span>
                        </button>
                    </div>

                    {/* Row 2: Micro Value Chips & Sister/Brother Switches */}
                    <div className="flex items-center justify-between gap-1 text-[9.5px] text-neutral-300 pt-0.5 border-t border-white/10">
                        <div className="flex items-center gap-1.5 truncate">
                            <span className="text-amber-400">⚡ Guaranteed Delivery</span>
                            <span>•</span>
                            <span className="text-rose-400">🎁 Free Gift Box</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-1">
                            <button
                                onClick={() => setGender("woman")}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase transition-all ${
                                    gender === "woman"
                                        ? "bg-white text-black"
                                        : "bg-white/10 text-neutral-300"
                                }`}
                            >
                                Sister
                            </button>
                            <button
                                onClick={() => setGender("man")}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase transition-all ${
                                    gender === "man"
                                        ? "bg-white text-black"
                                        : "bg-white/10 text-neutral-300"
                                }`}
                            >
                                Brother
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
