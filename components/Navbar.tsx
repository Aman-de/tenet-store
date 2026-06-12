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
    
    // Hyper-premium Apple glassmorphism on scroll, perfectly transparent on load
    // Using a floating pill design (margins on left/right/top)
    const navContainerClass = isScrolled || !isHome
        ? "bg-[#FDFBF7]/80 backdrop-blur-3xl saturate-200 border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        : "bg-transparent border border-transparent";
        
    const textColor = isScrolled || !isHome ? "text-[#1A1A1A]" : "text-white";
    const logoColor = isScrolled || !isHome ? "text-[#1A1A1A]" : "text-white";

    // High-contrast stroke width for icons
    const iconStroke = 2;

    // Ultra-premium Apple-style segmented control (Liquid Glass)
    const GenderToggle = () => (
        <div className={`relative flex items-center rounded-full p-1.5 transition-colors duration-500 shadow-sm backdrop-blur-3xl saturate-200 ${isScrolled || !isHome ? 'bg-black/5 border border-black/10' : 'bg-white/20 border border-white/30'}`}>
            <button 
                onClick={() => setGender('man')}
                className={`relative z-10 w-20 sm:w-24 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full transition-colors duration-300 ${gender === 'man' ? 'text-white' : `text-current opacity-80 hover:opacity-100`}`}
            >
                MEN
                {gender === 'man' && (
                    <motion.div
                        layoutId="nav-gender-active"
                        className="absolute inset-0 rounded-full -z-10 shadow-md bg-[#2B6496]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                )}
            </button>
            <button 
                onClick={() => setGender('woman')}
                className={`relative z-10 w-20 sm:w-24 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full transition-colors duration-300 ${gender === 'woman' ? 'text-white' : `text-current opacity-80 hover:opacity-100`}`}
            >
                WOMEN
                {gender === 'woman' && (
                    <motion.div
                        layoutId="nav-gender-active"
                        className="absolute inset-0 rounded-full -z-10 shadow-md bg-[#E05275]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                )}
            </button>
        </div>
    );

    return (
        <>
            {/* The wrapper handles the floating position */}
            <div className={`fixed top-0 left-0 w-full z-50 p-2 sm:p-4 lg:p-6 transition-all duration-500 ease-in-out pointer-events-none`}>
                <nav className={`pointer-events-auto max-w-[2000px] w-full mx-auto px-6 sm:px-8 xl:px-12 py-3 lg:py-4 transition-all duration-500 ease-in-out rounded-[32px] lg:rounded-full ${navContainerClass}`}>
                    
                    {/* MOBILE LAYOUT (lg:hidden) */}
                    <div className="flex lg:hidden w-full items-center justify-between">
                        {/* LEFT: Logo */}
                        <Link href="/" className="block group shrink-0">
                            <span className={`text-xl font-serif font-medium tracking-[0.25em] uppercase group-hover:opacity-80 transition-colors ${logoColor} drop-shadow-sm`}>
                                TENET
                            </span>
                        </Link>

                        {/* CENTER: Men/Women Switch */}
                        <div className="flex justify-center flex-1 mx-2">
                            <GenderToggle />
                        </div>

                        {/* RIGHT: Hamburger Menu Button */}
                        <button className="p-2 -mr-2 hover:scale-105 active:scale-95 transition-transform shrink-0" aria-label="Toggle mobile menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <X className={`w-6 h-6 transition-colors ${textColor}`} strokeWidth={iconStroke} />
                            ) : (
                                <Menu className={`w-6 h-6 transition-colors ${textColor}`} strokeWidth={iconStroke} />
                            )}
                        </button>
                    </div>

                    {/* DESKTOP LAYOUT (hidden lg:flex) */}
                    <div className="hidden lg:flex w-full items-center justify-between">
                        {/* LEFT: Links */}
                        <div className={`flex items-center gap-10 w-1/3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${textColor} drop-shadow-sm`}>
                            <Link href="/circle" className="hover:opacity-70 transition-opacity">
                                THE CIRCLE
                            </Link>
                            <Link href="/support" className="hover:opacity-70 transition-opacity">
                                SUPPORT
                            </Link>
                        </div>

                        {/* CENTER: Logo */}
                        <div className="w-1/3 flex justify-center">
                            <Link href="/" className="block group">
                                <span className={`text-3xl font-serif font-medium tracking-[0.25em] uppercase group-hover:opacity-80 transition-colors ${logoColor} drop-shadow-md`}>
                                    TENET
                                </span>
                            </Link>
                        </div>

                        {/* RIGHT: Gender Toggle, Account, Wishlist, Cart */}
                        <div className="flex items-center justify-end gap-8 w-1/3">
                            <GenderToggle />
                            
                            <div className={`flex items-center gap-5 transition-colors ${textColor} drop-shadow-sm`}>
                                {isSignedIn ? (
                                    <>
                                        <Link href="/orders" className="p-2 hover:opacity-70 transition-opacity" title="My Orders">
                                            <Package className="w-5 h-5" strokeWidth={iconStroke} />
                                        </Link>
                                        <div className="p-2 flex items-center justify-center">
                                            <UserButton afterSignOutUrl="/" />
                                        </div>
                                    </>
                                ) : (
                                    <SignInButton mode="modal">
                                        <button className="p-2 hover:opacity-70 transition-opacity" aria-label="Sign in">
                                            <User className="w-5 h-5" strokeWidth={iconStroke} />
                                        </button>
                                    </SignInButton>
                                )}
                                
                                <button className="relative p-2 hover:opacity-70 transition-opacity" aria-label="Open wishlist" onClick={openWishlist}>
                                    <Heart className="w-5 h-5" strokeWidth={iconStroke} />
                                    {wishlistCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                    )}
                                </button>

                                <button className="relative p-2 -mr-2 hover:opacity-70 transition-opacity" aria-label="Open cart" onClick={openCart}>
                                    <ShoppingBag className="w-5 h-5" strokeWidth={iconStroke} />
                                    {cartCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-4 right-4 mt-2 pointer-events-auto bg-white/90 backdrop-blur-3xl saturate-200 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[32px] overflow-hidden py-4"
                        >
                            <div className="flex flex-col">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100"
                                >
                                    HOME
                                </Link>
                                <Link
                                    href="/#new-arrivals"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100"
                                >
                                    COLLECTIONS
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100"
                                >
                                    ORDERS
                                </Link>
                                <SignedIn>
                                    <div className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors flex items-center justify-center gap-4 border-b border-neutral-100">
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
                                            className="px-6 py-4 text-xs font-bold tracking-[0.2em] text-[#1A1A1A] hover:bg-neutral-50 transition-colors text-center border-b border-neutral-100 w-full"
                                        >
                                            ACCOUNT (LOG IN)
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <div className="flex justify-center gap-8 py-6">
                                    <button className="relative p-2" aria-label="Open wishlist" onClick={() => { setIsMobileMenuOpen(false); openWishlist(); }}>
                                        <Heart className="w-6 h-6 text-[#1A1A1A]" strokeWidth={iconStroke} />
                                        {wishlistCount > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                    <button className="relative p-2" aria-label="Open cart" onClick={() => { setIsMobileMenuOpen(false); openCart(); }}>
                                        <ShoppingBag className="w-6 h-6 text-[#1A1A1A]" strokeWidth={iconStroke} />
                                        {cartCount > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: accentColor }} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
