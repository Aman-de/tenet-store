"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Sparkles, User, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
    const [activeTab, setActiveTab] = useState<'height' | 'measurements'>('height');

    const heightGuide = [
        { size: "XS", height: "4'11\" – 5'2\"", heightCm: "150 – 157 cm", weight: "45 – 52 kg", fit: "Petite / Slim" },
        { size: "S", height: "5'3\" – 5'5\"", heightCm: "158 – 165 cm", weight: "53 – 62 kg", fit: "Tailored / Regular" },
        { size: "M", height: "5'6\" – 5'8\"", heightCm: "166 – 173 cm", weight: "63 – 72 kg", fit: "Classic Regular" },
        { size: "L", height: "5'9\" – 5'11\"", heightCm: "174 – 180 cm", weight: "73 – 82 kg", fit: "Comfort / Relaxed" },
        { size: "XL", height: "6'0\" – 6'2\"", heightCm: "181 – 188 cm", weight: "83 – 92 kg", fit: "Structured / Roomy" },
        { size: "XXL", height: "6'2\"+", heightCm: "189+ cm", weight: "93+ kg", fit: "Generous Fit" },
    ];

    const measurementsGuide = [
        { size: "S", chest: "38\"", length: "27\"", shoulder: "17.5\"", sleeve: "25\"" },
        { size: "M", chest: "40\"", length: "28\"", shoulder: "18.0\"", sleeve: "25.5\"" },
        { size: "L", chest: "42\"", length: "29\"", shoulder: "18.5\"", sleeve: "26.0\"" },
        { size: "XL", chest: "44\"", length: "30\"", shoulder: "19.0\"", sleeve: "26.5\"" },
        { size: "XXL", chest: "46\"", length: "31\"", shoulder: "19.5\"", sleeve: "27.0\"" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#120F11] p-5 sm:p-7 shadow-2xl z-[90] rounded-3xl border border-neutral-200 dark:border-white/10"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 flex items-center justify-center">
                                    <Ruler className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1ED]">
                                        Size & Fit Guide
                                    </h2>
                                    <p className="text-[10px] text-neutral-400 font-sans uppercase tracking-wider">
                                        Artisanal Tailoring Precision
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                                aria-label="Close size guide"
                            >
                                <X className="w-5 h-5 text-[#1A1A1A] dark:text-[#F4F1ED]" />
                            </button>
                        </div>

                        {/* Switcher: Height Recommended vs Measurements */}
                        <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-white/5 rounded-2xl mb-4 gap-1">
                            <button
                                onClick={() => setActiveTab('height')}
                                className={`py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all ${
                                    activeTab === 'height'
                                        ? 'bg-white dark:bg-[#1C1719] text-[#1A1A1A] dark:text-white shadow-sm'
                                        : 'text-neutral-500 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                📏 Find by Height
                            </button>
                            <button
                                onClick={() => setActiveTab('measurements')}
                                className={`py-2 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all ${
                                    activeTab === 'measurements'
                                        ? 'bg-white dark:bg-[#1C1719] text-[#1A1A1A] dark:text-white shadow-sm'
                                        : 'text-neutral-500 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                📐 Body Inches
                            </button>
                        </div>

                        {activeTab === 'height' ? (
                            <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 dark:border-white/10">
                                <table className="w-full text-xs font-sans text-left">
                                    <thead className="bg-neutral-100/70 dark:bg-white/5 border-b border-neutral-200 dark:border-white/10">
                                        <tr>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Size</th>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Your Height</th>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Est. Weight</th>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Fit Style</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                        {heightGuide.map((row) => (
                                            <tr key={row.size} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-3.5 py-2.5 font-black text-rose-600 dark:text-rose-400">{row.size}</td>
                                                <td className="px-3.5 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200">{row.height}</td>
                                                <td className="px-3.5 py-2.5 text-neutral-500 dark:text-neutral-400">{row.weight}</td>
                                                <td className="px-3.5 py-2.5 text-neutral-600 dark:text-neutral-300 font-medium">{row.fit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 dark:border-white/10">
                                <table className="w-full text-xs font-sans text-left">
                                    <thead className="bg-neutral-100/70 dark:bg-white/5 border-b border-neutral-200 dark:border-white/10">
                                        <tr>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Size</th>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Chest</th>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Length</th>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Shoulder</th>
                                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Sleeve</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                        {measurementsGuide.map((row) => (
                                            <tr key={row.size} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-3.5 py-2.5 font-black text-rose-600 dark:text-rose-400">{row.size}</td>
                                                <td className="px-3.5 py-2.5 text-neutral-700 dark:text-neutral-300">{row.chest}</td>
                                                <td className="px-3.5 py-2.5 text-neutral-700 dark:text-neutral-300">{row.length}</td>
                                                <td className="px-3.5 py-2.5 text-neutral-700 dark:text-neutral-300">{row.shoulder}</td>
                                                <td className="px-3.5 py-2.5 text-neutral-700 dark:text-neutral-300">{row.sleeve}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Personal Stylist WhatsApp Photo Recommendation Box */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#25D366]/10 to-emerald-500/10 border border-[#25D366]/30 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xs font-serif font-bold text-neutral-900 dark:text-[#F4F1ED]">
                                    Unsure about someone's size for Rakhi?
                                </span>
                                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-sans mt-0.5 leading-relaxed">
                                    Send a photo of your sister / brother on WhatsApp. Our master stylist will instantly suggest their exact size and place your order directly.
                                </p>
                                <a
                                    href="https://wa.me/918590958131?text=Hi%20Shreya%2C%20I%20want%20to%20send%20a%20photo%20for%20personalized%20size%20%26%20fit%20advice%20for%20Rakhi."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#25D366] hover:underline mt-1.5"
                                >
                                    <span>📸 Send Photo on WhatsApp (+91 8590958131)</span>
                                </a>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-white/10 text-center">
                            <p className="text-[10px] text-neutral-400 font-sans uppercase tracking-widest">
                                100% Free Doorstep Exchanges Within 7 Days If Fit Isn't Perfect
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
