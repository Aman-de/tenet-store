"use client";

import { ShoppingBag, Menu, X, Heart, User, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, SignInButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs";

import { motion, AnimatePresence } from "framer-motion";

import { useStore } from "@/lib/store";
import { useGender } from "@/context/GenderContext";

export default function Navbar() {
    const pathname = usePathname();
    const { openCart, openWishlist, cart, wishlist } = useStore();
    const { gender, setGender } = useGender();
    const isWoman = gender === "woman";
    const accentColor = isWoman ? "#E05275" : "#2B6496";
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
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";
    const navBackground = isScrolled || !isHome
        ? "bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-neutral-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
        : "bg-transparent border-b border-transparent";
        
    const textColor = isScrolled || !isHome ? "text-[#1A1A1A]" : "text-white";
    const logoColor = isScrolled || !isHome ? "text-[#1A1A1A]" : "text-white";

    // Reusable Gender Switch Component
    const GenderToggle = () => (
        <div className={`flex items-center backdrop-blur-md rounded-full p-1 border transition-colors ${isScrolled || !isHome ? 'bg-black/5 border-black/10' : 'bg-white/10 border-white/20'}`}>
            <button 
                onClick={() => setGender('man')}
                className={`px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${gender === 'man' ? (isScrolled || !isHome ? 'bg-black text-white' : 'bg-white text-black shadow-sm') : `text-current opacity-70 hover:opacity-100`}`}
            >
                MEN
            </button>
            <button 
                onClick={() => setGender('woman')}
                className={`px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${gender === 'woman' ? (isScrolled || !isHome ? 'bg-[#E05275] text-white' : 'bg-[#E05275] text-white shadow-sm') : `text-current opacity-70 hover:opacity-100`}`}
            >
                WOMEN
            </button>
        </div>
    );

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${navBackground}`}
            >
                <div className="max-w-[2000px] w-full mx-auto px-4 sm:px-6 xl:px-12 py-3 lg:py-4 flex items-center justify-between relative z-50">
                    
                    {/* LEFT: Mobile Menu & Desktop Links */}
                    <div className="flex items-center gap-4 lg:w-1/3">
                        <button className="lg:hidden p-2 -ml-2 hover:scale-105 active:scale-95 transition-transform" aria-label="Toggle mobile menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <X className={`w-6 h-6 transition-colors ${textColor}`} />
                            ) : (
                                <Menu className={`w-6 h-6 transition-colors ${textColor}`} />
                            )}
                        </button>

                        <div className={`hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${textColor}`}>
                            <Link href="/circle" className="hover:opacity-70 transition-opacity">
                                THE CIRCLE
                            </Link>
                            <Link href="/support" className="hover:opacity-70 transition-opacity">
                                SUPPORT
                            </Link>
                        </div>
                    </div>

                    {/* CENTER: Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-1/3 flex justify-center">
                        <Link href="/" className="block group">
                            <span className={`text-2xl lg:text-3xl font-serif font-medium tracking-[0.25em] uppercase group-hover:opacity-80 transition-colors ${logoColor} ml-1`}>
                                TENET
                            </span>
                        </Link>
                    </div>

                    {/* RIGHT: Gender Toggle, Account, Wishlist, Cart */}
                    <div className="flex items-center justify-end gap-3 lg:gap-6 lg:w-1/3">
                        
                        {/* Gender Toggle - Hidden on extra small mobile to save space, but visible on most phones */}
                        <div className="flex lg:flex">
                            <GenderToggle />
                        </div>

                        {/* Desktop Icons */}
                        <div className={`hidden lg:flex items-center gap-4 transition-colors ${textColor}`}>
                            {isSignedIn ? (
                                <>
                                    <Link href="/orders" className="p-2 hover:opacity-70 transition-opacity" title="My Orders">
                                        <Package className="w-5 h-5" strokeWidth={1.5} />
                                    </Link>
                                    <div className="p-2 flex items-center justify-center">
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                </>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="p-2 hover:opacity-70 transition-opacity" aria-label="Sign in">
                                        <User className="w-5 h-5" strokeWidth={1.5} />
                                    </button>
                                </SignInButton>
                            )}
                            
                            <button className="relative p-2 hover:opacity-70 transition-opacity" aria-label="Open wishlist" onClick={openWishlist}>
                                <Heart className="w-5 h-5" strokeWidth={1.5} />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                )}
                            </button>

                            <button className="relative p-2 -mr-2 hover:opacity-70 transition-opacity" aria-label="Open cart" onClick={openCart}>
                                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-4 right-4 bg-white/95 backdrop-blur-md border border-neutral-100 shadow-xl rounded-xl overflow-hidden py-2"
                        >
                            <div className="flex flex-col">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-50"
                                >
                                    HOME
                                </Link>
                                <Link
                                    href="/#new-arrivals"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-50"
                                >
                                    COLLECTIONS
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-50"
                                >
                                    ORDERS
                                </Link>
                                <SignedIn>
                                    <div className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors flex items-center justify-center gap-4 border-b border-neutral-50">
                                        <span>ACCOUNT</span>
                                        <div className="scale-90 origin-center">
                                            <UserButton afterSignOutUrl="/" />
                                        </div>
                                    </div>
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-50 w-full"
                                        >
                                            ACCOUNT (LOG IN)
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <div className="flex justify-center gap-6 py-4">
                                    <button className="relative p-2" aria-label="Open wishlist" onClick={() => { setIsMobileMenuOpen(false); openWishlist(); }}>
                                        <Heart className="w-5 h-5 text-[#1A1A1A]" />
                                        {wishlistCount > 0 && (
                                            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                    <button className="relative p-2" aria-label="Open cart" onClick={() => { setIsMobileMenuOpen(false); openCart(); }}>
                                        <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" />
                                        {cartCount > 0 && (
                                            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
