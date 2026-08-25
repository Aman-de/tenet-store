"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Gift, Truck, Check, Copy, ArrowRight, Heart } from "lucide-react";
import { useGender } from "@/context/GenderContext";

export default function RakhiFestiveBanner() {
    const { gender, setGender } = useGender();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("RAKHI30");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="w-full px-4 lg:px-12 py-3 lg:py-6">
            <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C0D11] via-[#120B0D] to-[#1A0E12] border-2 border-[#E0A96D]/50 shadow-[0_10px_40px_rgba(224,169,109,0.15)] text-white p-6 md:p-10">
                {/* Subtle Decorative Golden Festive Accents */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#E0A96D]/20 via-[#D9384E]/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-[#D9384E]/15 via-[#E0A96D]/10 to-transparent blur-3xl pointer-events-none" />

                {/* Festive Header Tag */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0A96D]/15 border border-[#E0A96D]/40 backdrop-blur-md">
                        <span className="text-base leading-none">🪢</span>
                        <span className="text-[10px] sm:text-xs font-sans font-extrabold uppercase tracking-[0.25em] text-[#E0A96D]">
                            Rakhi Festive Gifting Edit • Flat 30% Off
                        </span>
                    </div>

                    {/* Quick Promo Copy Pill */}
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E0A96D] to-[#D9384E] text-[#120B0D] font-mono text-[11px] font-black uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        title="Click to copy promo code"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>COPIED RAKHI30 ✓</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                <span>CODE: RAKHI30 (30% OFF)</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Main Festive Headline & Narrative */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7">
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] text-[#FFF6EE] mb-3">
                            Celebrate the Bond of <span className="italic font-light text-[#E0A96D]">Raksha Bandhan.</span>
                        </h2>
                        <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xl mb-6">
                            Heirloom fabrics, handcrafted festive co-ords, and bespoke tailoring. Curated with love for sisters and brothers across the world.
                        </p>

                        {/* Interactive Festive Gifting Curation Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setGender("woman")}
                                className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md ${
                                    gender === "woman"
                                        ? "bg-white text-black ring-2 ring-[#E0A96D]"
                                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                }`}
                            >
                                <span>✨ The Sister's Edit</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                                onClick={() => setGender("man")}
                                className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md ${
                                    gender === "man"
                                        ? "bg-white text-black ring-2 ring-[#E0A96D]"
                                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                }`}
                            >
                                <span>👔 The Brother's Edit</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <Link
                                href="/#new-arrivals"
                                className="px-5 py-2.5 rounded-full bg-[#E0A96D]/20 text-[#E0A96D] border border-[#E0A96D]/40 text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#E0A96D]/30 transition-all flex items-center gap-1.5"
                            >
                                <span>Explore All</span>
                            </Link>
                        </div>
                    </div>

                    {/* Festive Guarantee & Gifting Value Cards */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold shrink-0">
                                    ⚡
                                </div>
                                <span className="font-serif text-sm font-bold text-[#FFF6EE]">
                                    Guaranteed Delivery
                                </span>
                            </div>
                            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                                Express Air Courier dispatch within 24 hours. Guaranteed arrival in time for Rakhi.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-sm font-bold shrink-0">
                                    🎁
                                </div>
                                <span className="font-serif text-sm font-bold text-[#FFF6EE]">
                                    Complimentary Gift Box
                                </span>
                            </div>
                            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                                Gold foil presentation box, crimson satin ribbon & custom handwritten card included free.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold shrink-0">
                                    🚚
                                </div>
                                <span className="font-serif text-sm font-bold text-[#FFF6EE]">
                                    Free Air Shipping
                                </span>
                            </div>
                            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                                Complimentary express delivery across all pin codes in India.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-sm font-bold shrink-0">
                                    💎
                                </div>
                                <span className="font-serif text-sm font-bold text-[#FFF6EE]">
                                    7-Day Trial & Swap
                                </span>
                            </div>
                            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                                Doorstep size & style exchange for complete peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
