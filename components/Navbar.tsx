"use client";

import { ShoppingBag, Search, Menu, X, Heart, User, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

import { motion, AnimatePresence } from "framer-motion";

import { useStore } from "@/lib/store";

export default function Navbar() {
    const router = useRouter();
    const { openCart, openWishlist, cart, wishlist } = useStore();
    const [mounted, setMounted] = useState(false);
    const { isSignedIn } = useUser();

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

    // Lock body scroll - REMOVED for small menu
    // useEffect(() => {
    //     if (isMobileMenuOpen) {
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "unset";
    //     }
    // }, [isMobileMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Glassmorphism Style: Translucent with blur for premium feel
    const navBackground = "bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm";
    const textColor = "text-[#1A1A1A]";
    const logoColor = "text-[#1A1A1A]";

    return (
        <>
            <nav
                className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${navBackground}`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-50">
                    {/* Mobile Menu & Search (Left) -> Now mostly Desktop Left Section including Account */}
                    <div className="flex items-center gap-4 lg:gap-6 w-full lg:w-auto">
                        <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <X className={`w-6 h-6 transition-colors ${textColor}`} />
                            ) : (
                                <Menu className={`w-6 h-6 transition-colors ${textColor}`} />
                            )}
                        </button>

                        {/* Mobile Search Icon Trigger */}
                        <button className="lg:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <Search className={`w-6 h-6 hover:opacity-70 transition-all ${textColor}`} />
                        </button>

                        {/* Desktop: Account & Search */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Account Icon */}
                            {isSignedIn ? (
                                <UserButton afterSignOutUrl="/" />
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="group">
                                        <User className={`w-5 h-5 text-gray-400 group-hover:text-black transition-colors`} />
                                    </button>
                                </SignInButton>
                            )}

                            {/* Orders Icon */}
                            {isSignedIn && (
                                <Link href="/orders" className="group" title="My Orders">
                                    <Package className={`w-5 h-5 text-gray-400 group-hover:text-black transition-colors`} />
                                </Link>
                            )}

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex items-center bg-neutral-50 rounded-full px-4 py-2 group focus-within:bg-white focus-within:ring-1 focus-within:ring-neutral-300 transition-all w-64 lg:w-96">
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
                    </div>

                    {/* Logo (Center) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="block group">
                            <span className={`text-3xl lg:text-4xl font-serif font-medium tracking-[0.2em] uppercase group-hover:opacity-80 transition-colors ${logoColor}`}>
                                TENET
                            </span>
                        </Link>
                    </div>

                    {/* Navigation & Cart (Right) */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        <div className={`hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide transition-colors ${textColor}`}>
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

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-4 w-48 bg-white/95 backdrop-blur-md border border-neutral-100 shadow-xl rounded-xl overflow-hidden py-2"
                        >
                            <div className="flex flex-col">
                                <Link
                                    href="/support"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-3 text-sm font-medium text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-left"
                                >
                                    SUPPORT
                                </Link>
                                <Link
                                    href="/#new-arrivals"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-3 text-sm font-medium text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-left"
                                >
                                    COLLECTIONS
                                </Link>
                                <Link
                                    href="/about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-3 text-sm font-medium text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-left"
                                >
                                    ABOUT
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
