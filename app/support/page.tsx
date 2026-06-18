"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SupportPage() {
    const router = useRouter();
    const [trackingEmail, setTrackingEmail] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "When will my order ship and arrive?",
            answer: "Orders are processed within 24-48 hours. Standard delivery takes 3-7 business days, while Express delivery guarantees delivery in 2 business days. Once dispatched, you will receive a tracking link via email and SMS."
        },
        {
            question: "Do you offer Cash on Delivery (COD)?",
            answer: "Yes, we support Cash on Delivery (COD) on all orders. For COD orders, the shipping fee (₹80 for Standard or ₹120 for Express) must be prepaid upfront as a shipping confirmation fee, while the product price is paid on delivery. Alternatively, you can pay online to get FREE Standard shipping (or upgrade to Express for just ₹40) and save ₹80 instantly!"
        },
        {
            question: "What is your return and exchange policy?",
            answer: "We offer hassle-free exchanges and returns within 7 days of delivery. The item must be unworn, unwashed, and in its original packaging with all tags attached. Reverse pickup will be coordinated by our logistics partners."
        },
        {
            question: "How do I find the correct size?",
            answer: "Our sizes match standard global matrices (XS-XXL). Because we focus on tailored, relaxed structures, we recommend choosing your typical shirt size. Exact chest measurements are available on each product page's size guide."
        }
    ];

    const handleTrackingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingEmail.trim()) {
            router.push(`/orders?email=${encodeURIComponent(trackingEmail.trim())}`);
        }
    };

    return (
        <main className="min-h-screen pb-24 text-[#1A1A1A] dark:text-[#F4F1ED]">
            {/* Header */}
            <div className="py-24 px-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#111111] text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-3">Concierge</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-4">Customer Support</h1>
                    <p className="font-sans text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed">
                        Have questions about sizing, delivery, or custom orders? Reach out to our concierge desk, open Monday to Saturday, 10 AM — 7 PM IST.
                    </p>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-5 gap-12 items-start">
                    
                    {/* Left: Contact Channels & Tracking */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Order Tracking */}
                        <div className="bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                            <div className="flex items-center gap-2 mb-3 text-neutral-800">
                                <ShieldCheck className="w-5 h-5 text-[#1A1A1A] dark:text-[#F4F1ED]" />
                                <span className="font-serif text-lg font-semibold">Track Your Order</span>
                            </div>
                            <p className="font-sans text-xs text-neutral-400 mb-4">
                                Enter the email address associated with your order to view live tracking details and history.
                            </p>
                            <form onSubmit={handleTrackingSubmit} className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="yourname@gmail.com"
                                    value={trackingEmail}
                                    onChange={(e) => setTrackingEmail(e.target.value)}
                                    className="flex-1 bg-[#FDFBF7] dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-black hover:bg-neutral-800 text-white rounded-lg p-2 flex items-center justify-center transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        {/* Contacts */}
                        <div className="space-y-4">
                            {/* WhatsApp as Primary Channel */}
                            <a
                                href="https://wa.me/917737796817"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 p-5 bg-emerald-50/30 border border-emerald-100 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/60 transition-all duration-300 group"
                            >
                                <div className="bg-emerald-50 p-3 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-emerald-600" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.558 1.875 14.09 .843 11.458.841c-5.437 0-9.862 4.42-9.866 9.865-.001 1.714.457 3.39 1.32 4.908l-.99 3.612 3.703-.97zM17.487 14.39c-.3-.15-1.774-.875-2.026-.967-.253-.09-.436-.137-.62.137-.183.274-.707.875-.867 1.058-.16.183-.32.206-.62.056-3.01-1.503-4.887-3.86-5.882-5.57-.263-.452-.03-.697.195-.922.203-.203.436-.514.654-.772.218-.258.29-.442.436-.737.144-.294.07-.55-.035-.762-.105-.21-.867-2.09-1.19-2.868-.314-.757-.633-.654-.867-.666-.225-.012-.482-.015-.74-.015-.258 0-.678.096-.1.314-.16.183-.346-.575-.922-1.41-1.284-.338-.344-.66-.463-.995-.463-.332 0-.616.03-.83.09-.21.058-.437.214-.654.452-.218.238-.83.81-.83 1.977 0 1.167.848 2.296.967 2.456.12.16 1.67 2.548 4.044 3.57.566.243.83.322 1.096.406.57.18 1.09.155 1.5.093.456-.068 1.775-.726 2.027-1.43.25-.702.25-1.306.175-1.43-.075-.124-.275-.198-.574-.348z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 block">WhatsApp Desk</span>
                                        <span className="bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Primary</span>
                                    </div>
                                    <span className="text-sm font-sans font-medium text-[#1A1A1A] dark:text-[#F4F1ED]">+91 77377 96817</span>
                                </div>
                            </a>

                            <a
                                href="mailto:tenetarchives@gmail.com"
                                className="flex items-center gap-4 p-5 bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 rounded-xl hover:border-neutral-300 transition-all duration-300 group"
                            >
                                <div className="bg-neutral-50 dark:bg-[#0A0A0A] p-3 rounded-lg group-hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] dark:bg-[#141414] transition-colors">
                                    <Mail className="w-5 h-5 text-[#1A1A1A] dark:text-[#F4F1ED]" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">Email Support</span>
                                    <span className="text-sm font-sans font-medium text-[#1A1A1A] dark:text-[#F4F1ED]">tenetarchives@gmail.com</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right: FAQ Accordions */}
                    <div className="md:col-span-3 space-y-4 bg-white dark:bg-[#111111] border border-neutral-100 dark:border-neutral-800 p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                        <h2 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-6">Frequently Asked Questions</h2>
                        
                        <div className="divide-y divide-neutral-100">
                            {faqs.map((faq, index) => {
                                const isOpen = activeFaq === index;
                                return (
                                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                                        <button
                                            onClick={() => setActiveFaq(isOpen ? null : index)}
                                            className="w-full flex items-center justify-between text-left py-2 font-sans font-medium text-sm text-[#1A1A1A] dark:text-[#F4F1ED] hover:opacity-85 transition-opacity"
                                        >
                                            <span>{faq.question}</span>
                                            <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 0.8 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden font-sans text-xs text-neutral-500 leading-relaxed mt-2"
                                                >
                                                    <p className="pb-2">{faq.answer}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
