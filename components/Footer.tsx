"use client";

import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">

                {/* Top Section: Newsletter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-10 mb-10 gap-12">
                    <div className="max-w-lg">
                        <h2 className="font-serif text-3xl md:text-5xl mb-6">Join our inner circle.</h2>
                        <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col items-start gap-4">
                        <div className="flex w-full md:w-[400px]">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-transparent border-b border-white/30 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                            />
                            <button className="bg-white text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Links & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="block">
                            <span className="font-serif text-2xl tracking-widest">TENET ARCHIVES</span>
                        </Link>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3 lg:pl-32">

                        {/* Shop */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Shop</h4>
                            <ul className="space-y-4 text-sm font-medium tracking-wide">
                                <li><Link href="/#new-arrivals" className="hover:text-neutral-300 transition-colors">New Arrivals</Link></li>
                                <li><Link href="/#new-arrivals" className="hover:text-neutral-300 transition-colors">Best Sellers</Link></li>
                                <li><Link href="/#new-arrivals" className="hover:text-neutral-300 transition-colors">Accessories</Link></li>
                            </ul>
                        </div>

                        {/* Brand */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Brand</h4>
                            <ul className="space-y-4 text-sm font-medium tracking-wide">
                                <li><Link href="/about" className="hover:text-neutral-300 transition-colors">About Tenet</Link></li>
                                <li><Link href="/about" className="hover:text-neutral-300 transition-colors">Sustainability</Link></li>
                                <li><Link href="/about" className="hover:text-neutral-300 transition-colors">Careers</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Support</h4>
                            <ul className="space-y-4 text-sm font-medium tracking-wide">
                                <li><Link href="/support" className="hover:text-neutral-300 transition-colors">Contact Us</Link></li>
                                <li><Link href="/support" className="hover:text-neutral-300 transition-colors">Shipping</Link></li>
                                <li><Link href="/support" className="hover:text-neutral-300 transition-colors">Returns</Link></li>
                            </ul>
                        </div>

                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 font-sans">
                    <p>© 2026 TENET. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>

                {/* SEO Footer */}
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 tracking-wide font-sans">
                        Popular: <span className="hover:text-gray-400 cursor-pointer">Linen Shirts</span> | <span className="hover:text-gray-400 cursor-pointer">Polo T-Shirts</span> | <span className="hover:text-gray-400 cursor-pointer">Old Money Aesthetic</span> | <span className="hover:text-gray-400 cursor-pointer">Luxury Knitwear</span> | <span className="hover:text-gray-400 cursor-pointer">Cashmere Sweaters</span> | <span className="hover:text-gray-400 cursor-pointer">Quiet Luxury</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}
