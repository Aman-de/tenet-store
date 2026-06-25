"use client";

import Link from "next/link";
import { Instagram, Check } from "lucide-react";
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
            setError("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email");
            return;
        }

        // Simulate subscribe
        setIsSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="bg-[#0A0A0A] text-white pt-24 pb-8 overflow-hidden">
            <div className="max-w-[2000px] w-full mx-auto px-6 xl:px-12">

                {/* Top Section: Newsletter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-10 mb-10 gap-12">
                    <div className="max-w-lg">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C7A379] block mb-2.5">Exclusive Access</span>
                        <h2 className="font-serif text-3xl md:text-5xl mb-4 leading-tight font-medium">Join the Club.</h2>
                        <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                            Subscribe to receive updates, access to exclusive deals, and more.
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
                                    className="w-full md:w-[400px]"
                                >
                                    <div className="flex w-full relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError("");
                                            }}
                                            placeholder="Enter your email"
                                            className="flex-1 bg-transparent border-b border-white/20 py-4 pr-12 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-all text-sm font-sans"
                                        />
                                        <button 
                                            type="submit" 
                                            className="absolute right-0 bottom-0 bg-white/10 border-l border-white/20 text-white px-6 py-[15px] text-[10px] font-bold tracking-widest uppercase hover:bg-white/20 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
                                        >
                                            Join
                                        </button>
                                    </div>
                                    {error && (
                                        <motion.p 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 0.8, height: "auto" }}
                                            className="text-xs text-red-400 mt-2 font-sans"
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
                                    className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-5 md:w-[400px] shadow-lg backdrop-blur-sm"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black dark:text-white shrink-0">
                                        <Check className="w-4 h-4" strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-sm font-semibold text-white">Welcome to the Ambassador Club</h3>
                                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5 leading-snug">You have successfully subscribed to our list.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Section: Links & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="block group w-fit">
                            <span className="font-serif text-2xl tracking-widest group-hover:text-neutral-300 transition-colors">TENET ARCHIVES</span>
                        </Link>
                        <div className="flex gap-4">
                            <a 
                                href={settings.instagramUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2.5 border border-white/10 rounded-full hover:bg-white hover:text-black dark:hover:text-white transition-all hover:scale-105 active:scale-95 text-neutral-400 hover:border-white"
                                title="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a 
                                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2.5 border border-white/10 rounded-full hover:bg-white hover:text-black dark:hover:text-white transition-all hover:scale-105 active:scale-95 text-neutral-400 hover:border-white"
                                title="WhatsApp"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3 lg:pl-32">

                        {/* Shop */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">Shop</h3>
                            <ul className="space-y-4 text-xs font-medium tracking-wider text-neutral-400">
                                <li>
                                    <Link href="/#new-arrivals" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        New Arrivals
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#new-arrivals" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Best Sellers
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#new-arrivals" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Accessories
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Brand */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">Brand</h3>
                            <ul className="space-y-4 text-xs font-medium tracking-wider text-neutral-400">
                                <li>
                                    <Link href="/about" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        About Tenet
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/editorial" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Editorial Campaign
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Sustainability
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Careers
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">Support</h3>
                            <ul className="space-y-4 text-xs font-medium tracking-wider text-neutral-400">
                                <li>
                                    <Link href="/circle" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        The Circle (Referrals)
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/support" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Contact Us
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shipping" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Shipping
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-and-cancellation" className="hover:text-white transition-colors relative group py-0.5 block w-fit">
                                        Returns & Refunds
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] text-neutral-500 font-sans tracking-wide">
                    <p>© 2026 TENET. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>

                {/* SEO Footer */}
                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <p className="text-[9px] text-neutral-600 tracking-wide font-sans">
                        Popular: <span className="hover:text-neutral-400 transition-colors cursor-pointer">Linen Shirts</span> | <span className="hover:text-neutral-400 transition-colors cursor-pointer">Polo T-Shirts</span> | <span className="hover:text-neutral-400 transition-colors cursor-pointer">Old Money Aesthetic</span> | <span className="hover:text-neutral-400 transition-colors cursor-pointer">Luxury Knitwear</span> | <span className="hover:text-neutral-400 transition-colors cursor-pointer">Cashmere Sweaters</span> | <span className="hover:text-neutral-400 transition-colors cursor-pointer">Quiet Luxury</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}
