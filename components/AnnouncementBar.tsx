"use client";

import React, { useState } from "react";
import { Sparkles, Truck, ShieldCheck, Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementBar() {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const announcements = [
        {
            icon: <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />,
            text: "LIMITED FESTIVE EDIT • GET 30% OFF FIRST ORDER",
            code: "WELCOME30",
        },
        {
            icon: <Truck className="w-3.5 h-3.5 text-[#E0A96D]" />,
            text: "COMPLIMENTARY EXPRESS SHIPPING & DOORSTEP EXCHANGES",
        },
        {
            icon: <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />,
            text: "SIGNATURE BESPOKE PACKAGING INCLUDED ON ALL ACQUISITIONS",
        },
        {
            icon: <ShieldCheck className="w-3.5 h-3.5 text-[#E0A96D]" />,
            text: "100% ARTISANAL AUTHENTICITY & 7-DAY HASSLE-FREE RETURNS",
        },
    ];

    return (
        <div className="w-full bg-[#110D0A] text-[#F3E5D8] border-b border-[#E0A96D]/20 overflow-hidden py-2 px-3 relative z-50 text-[10.5px] font-sans tracking-widest uppercase flex items-center shadow-sm">
            <div className="flex shrink-0 animate-marquee whitespace-nowrap items-center gap-10">
                {announcements.map((item, idx) => (
                    <span key={`a-${idx}`} className="inline-flex items-center gap-2.5">
                        {item.icon}
                        <span className="font-medium text-neutral-200">{item.text}</span>
                        {item.code && (
                            <button
                                onClick={() => handleCopyCode(item.code!)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E0A96D]/20 text-[#E0A96D] border border-[#E0A96D]/30 hover:bg-[#E0A96D]/30 transition-all cursor-pointer font-mono text-[9.5px] font-bold"
                                title="Click to copy promo code"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                                        <span>COPIED!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-2.5 h-2.5 opacity-70" />
                                        <span>{item.code}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </span>
                ))}
            </div>

            <div className="flex shrink-0 animate-marquee whitespace-nowrap items-center gap-10 aria-hidden:true">
                {announcements.map((item, idx) => (
                    <span key={`b-${idx}`} className="inline-flex items-center gap-2.5">
                        {item.icon}
                        <span className="font-medium text-neutral-200">{item.text}</span>
                        {item.code && (
                            <button
                                onClick={() => handleCopyCode(item.code!)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E0A96D]/20 text-[#E0A96D] border border-[#E0A96D]/30 hover:bg-[#E0A96D]/30 transition-all cursor-pointer font-mono text-[9.5px] font-bold"
                                title="Click to copy promo code"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                                        <span>COPIED!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-2.5 h-2.5 opacity-70" />
                                        <span>{item.code}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}
