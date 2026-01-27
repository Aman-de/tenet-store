"use client";

import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useStore } from "@/lib/store";

export default function Navbar() {
    const { openCart, openWishlist, cart, wishlist } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        useStore.persist.rehydrate();
        setMounted(true);
    }, []);

    // Prevent hydration mismatch for badge
    const cartCount = mounted ? cart.length : 0;
    const wishlistCount = mounted ? wishlist.length : 0;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMobileMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
            setIsSearchOpen(false);
        }
    };

    // Fixed Style: Always Glass/White with Dark Text for readability
    const navBackground = "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm";
    const textColor = "text-[#1A1A1A]";
    const logoColor = "text-[#1A1A1A]";

    return (
        <>
            <nav
                className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${navBackground}`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-50">
                    {/* Mobile Menu & Search (Left) */}
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className={`w-6 h-6 transition-colors ${textColor}`} />
                        </button>

                        {/* Mobile Search Icon Trigger */}
                        <button className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <Search className={`w-6 h-6 hover:opacity-70 transition-all ${textColor}`} />
                        </button>

                        {/* Desktop Inline Search Bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center border-b border-gray-300 pb-2 group focus-within:border-black transition-colors w-96">
                            <Search className={`w-5 h-5 mr-3 text-gray-400 group-focus-within:text-black transition-colors`} strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="SEARCH"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent outline-none text-sm font-medium tracking-wide w-full placeholder:text-gray-400 ${textColor}`}
                            />
                        </form>
                    </div>

                    {/* Logo (Center) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="block group">
                            <span className={`text-3xl md:text-4xl font-serif font-medium tracking-[0.2em] uppercase group-hover:opacity-80 transition-colors ${logoColor}`}>
                                TENET
                            </span>
                        </Link>
                    </div>

                    {/* Navigation & Cart (Right) */}
                    <div className="flex items-center gap-6 md:gap-8">
                        <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-wide transition-colors ${textColor}`}>
                            <Link href="/support" className="hover:underline underline-offset-4 decoration-current transition-all decoration-1">
                                SUPPORT
                            </Link>
                            <Link href="/#new-arrivals" className="hover:underline underline-offset-4 decoration-current transition-all decoration-1">
                                COLLECTIONS
                            </Link>
                            <Link href="/about" className="hover:underline underline-offset-4 decoration-current transition-all decoration-1">
                                ABOUT
                            </Link>
                        </div>

                        {/* Wishlist Icon */}
                        <button className="relative" onClick={openWishlist}>
                            <motion.div
                                key={wishlistCount}
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart className={`w-5 h-5 transition-colors ${textColor}`} />
                            </motion.div>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full" />
                            )}
                        </button>

                        {/* Cart Icon */}
                        <button className="relative" onClick={openCart}>
                            <motion.div
                                key={cartCount}
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.3 }}
                            >
                                <ShoppingBag className={`w-5 h-5 transition-colors ${textColor}`} />
                            </motion.div>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-800 rounded-full animate-pulse" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar Slide Down (Mobile Only primarily) */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-gray-100 bg-white"
                        >
                            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-6 py-4 flex items-center">
                                <Search className="w-4 h-4 text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 outline-none text-sm font-sans text-[#1A1A1A] placeholder:text-gray-400"
                                    autoFocus
                                />
                                <button type="button" onClick={() => setIsSearchOpen(false)}>
                                    <X className="w-4 h-4 text-gray-400 hover:text-black" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-[#FDFBF7] flex flex-col"
                    >
                        <div className="flex justify-end p-6">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-neutral-100 rounded-full">
                                <X className="w-6 h-6 text-[#1A1A1A]" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1 space-y-8">
                            <Link
                                href="/support"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="font-serif text-3xl text-[#1A1A1A] hover:text-neutral-500 transition-colors"
                            >
                                Support
                            </Link>
                            <Link
                                href="/#new-arrivals"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="font-serif text-3xl text-[#1A1A1A] hover:text-neutral-500 transition-colors"
                            >
                                Collections
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="font-serif text-3xl text-[#1A1A1A] hover:text-neutral-500 transition-colors"
                            >
                                About
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
