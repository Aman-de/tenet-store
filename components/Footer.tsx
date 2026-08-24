"use client";

import Link from "next/link";
import { Instagram, Check, ShieldCheck, Lock, Sparkles, CreditCard } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
);

export default function Footer() {
    const settings = useSettings();
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please provide an email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="bg-[#0D0A08] text-white pt-14 md:pt-20 pb-28 lg:pb-10 overflow-hidden border-t border-white/10">
            <div className="max-w-[2000px] w-full mx-auto px-6 xl:px-12">

                {/* Top Section: Luxury Newsletter & Inner Circle Invitation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-12 mb-12 gap-10">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.25em] text-[#E0A96D] mb-3">
                            <Sparkles className="w-3 h-3" />
                            The Inner Circle & Gazette
                        </span>
                        <h2 className="font-serif text-3xl md:text-5xl mb-3 leading-tight font-normal">
                            Private Archival Access.
                        </h2>
                        <p className="text-neutral-400 font-sans text-xs md:text-sm leading-relaxed font-light">
                            Receive private seasonal invitations, capsule previews, and unlock 15% off your initial acquisition.
                        </p>
                    </div>
                    
                    <div className="w-full md:w-auto min-h-[85px] flex flex-col justify-end">
                        <AnimatePresence mode="wait">
                            {!isSubscribed ? (
                                <motion.form 
                                    key="subscribe-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleSubscribe} 
                                    className="w-full md:w-[420px]"
                                >
                                    <div className="flex w-full relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError("");
                                            }}
                                            placeholder="Enter your email address"
                                            className="flex-1 bg-white/5 border border-white/15 rounded-full py-3.5 pl-5 pr-28 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#E0A96D] transition-all text-xs font-sans"
                                        />
                                        <button 
                                            type="submit" 
                                            className="absolute right-1 top-1 bottom-1 bg-[#E0A96D] text-black px-6 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white active:scale-95 transition-all cursor-pointer shadow-md"
                                        >
                                            Join
                                        </button>
                                    </div>
                                    {error && (
                                        <motion.p 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 0.8, height: "auto" }}
                                            className="text-xs text-red-400 mt-2 font-sans pl-2"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success-message"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3.5 bg-white/10 border border-[#E0A96D]/30 rounded-2xl p-4 md:w-[420px] shadow-lg backdrop-blur-md"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#E0A96D] flex items-center justify-center text-black shrink-0">
                                        <Check className="w-4 h-4 stroke-[2.5]" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-sm font-semibold text-white">Welcome to the Inner Circle</h3>
                                        <p className="text-[11px] text-neutral-300 font-sans mt-0.5 leading-snug">Use code <span className="font-mono font-bold text-[#E0A96D]">WELCOME15</span> at checkout for 15% off.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Middle Section: Sitemaps & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">

                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-5">
                        <Link href="/" className="block group w-fit">
                            <span className="font-serif text-2xl tracking-[0.2em] group-hover:text-[#E0A96D] transition-colors font-medium">TENET ARCHIVES</span>
                        </Link>
                        <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-xs">
                            Quiet luxury & timeless aesthetics. Crafted with master artisan precision and natural fibers.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a 
                                href={settings.instagramUrl || "https://instagram.com/tenetarchives"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2.5 border border-white/15 rounded-full hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 text-neutral-300"
                                title="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a 
                                href={`https://wa.me/${settings.whatsappNumber || "918590958131"}?text=${encodeURIComponent(settings.whatsappMessage || "Hi TENET Concierge, I would like assistance with an order.")}`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2.5 border border-white/15 rounded-full hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 text-neutral-300"
                                title="WhatsApp Concierge"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3 lg:pl-20">

                        {/* Collections */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E0A96D]">Collections</h3>
                            <ul className="space-y-3 text-xs font-light tracking-wide text-neutral-300">
                                <li>
                                    <Link href="/women" className="hover:text-white transition-colors block w-fit">
                                        Women's Edit
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/men" className="hover:text-white transition-colors block w-fit">
                                        Men's Archival
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/gadgets" className="hover:text-white transition-colors block w-fit">
                                        Gadgets & Design
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#new-arrivals" className="hover:text-white transition-colors block w-fit">
                                        New Arrivals
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Atelier & Maison */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E0A96D]">Maison</h3>
                            <ul className="space-y-3 text-xs font-light tracking-wide text-neutral-300">
                                <li>
                                    <Link href="/about" className="hover:text-white transition-colors block w-fit">
                                        About The House
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/editorial" className="hover:text-white transition-colors block w-fit">
                                        Editorial Campaigns
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/circle" className="hover:text-white transition-colors block w-fit">
                                        The Partner Circle
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Client Relations & Concierge */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E0A96D]">Concierge</h3>
                            <ul className="space-y-3 text-xs font-light tracking-wide text-neutral-300">
                                <li>
                                    <Link href="/orders" className="hover:text-white transition-colors block w-fit font-medium text-white">
                                        Track Your Order →
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-and-cancellation" className="hover:text-white transition-colors block w-fit">
                                        7-Day Returns & Exchanges
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shipping" className="hover:text-white transition-colors block w-fit">
                                        Shipping Information
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/support" className="hover:text-white transition-colors block w-fit">
                                        Concierge Support
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>

                {/* Trust & Security Badge Strip */}
                <div className="py-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-neutral-400 text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-300">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>256-bit SSL Encrypted & Protected Checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10.5px] tracking-wider uppercase font-mono text-neutral-400">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">UPI</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">Cards</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">NetBanking</span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">COD</span>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[11px] text-neutral-500 font-sans tracking-wide">
                    <p>© 2026 TENET ARCHIVES. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
