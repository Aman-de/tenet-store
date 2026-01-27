"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white p-8 shadow-2xl z-[90] rounded-sm"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="font-serif text-2xl text-[#1A1A1A] flex items-center gap-3">
                                <Ruler className="w-6 h-6" />
                                Size Guide
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1A1A1A]" />
                            </button>
                        </div>

                        <p className="text-sm font-sans text-neutral-500 mb-8">
                            Measurements are in inches. For the best fit, compare these measurements to a similar garment you already own.
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm font-sans text-left">
                                <thead className="bg-neutral-50 border-b border-neutral-200">
                                    <tr>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[#1A1A1A]">Size</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[#1A1A1A]">Chest</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[#1A1A1A]">Length</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[#1A1A1A]">Shoulder</th>
                                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[#1A1A1A]">Sleeve</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    <tr>
                                        <td className="px-4 py-3 font-bold text-[#1A1A1A]">S</td>
                                        <td className="px-4 py-3 text-neutral-600">38</td>
                                        <td className="px-4 py-3 text-neutral-600">27</td>
                                        <td className="px-4 py-3 text-neutral-600">17.5</td>
                                        <td className="px-4 py-3 text-neutral-600">25</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-bold text-[#1A1A1A]">M</td>
                                        <td className="px-4 py-3 text-neutral-600">40</td>
                                        <td className="px-4 py-3 text-neutral-600">28</td>
                                        <td className="px-4 py-3 text-neutral-600">18</td>
                                        <td className="px-4 py-3 text-neutral-600">25.5</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-bold text-[#1A1A1A]">L</td>
                                        <td className="px-4 py-3 text-neutral-600">42</td>
                                        <td className="px-4 py-3 text-neutral-600">29</td>
                                        <td className="px-4 py-3 text-neutral-600">18.5</td>
                                        <td className="px-4 py-3 text-neutral-600">26</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-bold text-[#1A1A1A]">XL</td>
                                        <td className="px-4 py-3 text-neutral-600">44</td>
                                        <td className="px-4 py-3 text-neutral-600">30</td>
                                        <td className="px-4 py-3 text-neutral-600">19</td>
                                        <td className="px-4 py-3 text-neutral-600">26.5</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-200">
                            <p className="text-xs text-neutral-400 text-center uppercase tracking-widest">
                                Need more help? <a href="/support" className="border-b border-neutral-400 hover:text-[#1A1A1A] transition-colors">Contact Support</a>
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
