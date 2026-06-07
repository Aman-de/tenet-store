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
            answer: "Orders are processed within 24-48 hours. Express shipping across major Indian cities takes 3-5 business days. Once dispatched, you will receive a tracking link via email and SMS. You can also look up status using the tracker below."
        },
        {
            question: "Do you offer Cash on Delivery (COD)?",
            answer: "Yes, we support Cash on Delivery (COD) for orders above ₹2,000. For orders below this threshold, we accept all major Credit/Debit Cards, UPI, Netbanking, and Wallets securely via Razorpay."
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
        <main className="bg-[#FDFBF7] min-h-screen pb-24 text-[#1A1A1A]">
            {/* Header */}
            <div className="py-24 px-6 border-b border-neutral-100 bg-white text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-3">Concierge</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">Customer Support</h1>
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
                        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                            <div className="flex items-center gap-2 mb-3 text-neutral-800">
                                <ShieldCheck className="w-5 h-5 text-black" />
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
                                    className="flex-1 bg-[#FDFBF7] border border-neutral-200 rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-black transition-colors"
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
                            <a
                                href="mailto:tenetarchives@gmail.com"
                                className="flex items-center gap-4 p-5 bg-white border border-neutral-100 rounded-xl hover:border-neutral-300 transition-all duration-300 group"
                            >
                                <div className="bg-neutral-50 p-3 rounded-lg group-hover:bg-neutral-100 transition-colors">
                                    <Mail className="w-5 h-5 text-[#1A1A1A]" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">Email Support</span>
                                    <span className="text-sm font-sans font-medium text-black">tenetarchives@gmail.com</span>
                                </div>
                            </a>

                            <a
                                href="https://wa.me/917737796817"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 p-5 bg-white border border-neutral-100 rounded-xl hover:border-neutral-300 transition-all duration-300 group"
                            >
                                <div className="bg-neutral-50 p-3 rounded-lg group-hover:bg-neutral-100 transition-colors">
                                    <MessageCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">WhatsApp Desk</span>
                                    <span className="text-sm font-sans font-medium text-black">+91 77377 96817</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right: FAQ Accordions */}
                    <div className="md:col-span-3 space-y-4 bg-white border border-neutral-100 p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                        <h2 className="font-serif text-2xl text-black mb-6">Frequently Asked Questions</h2>
                        
                        <div className="divide-y divide-neutral-100">
                            {faqs.map((faq, index) => {
                                const isOpen = activeFaq === index;
                                return (
                                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                                        <button
                                            onClick={() => setActiveFaq(isOpen ? null : index)}
                                            className="w-full flex items-center justify-between text-left py-2 font-sans font-medium text-sm text-[#1A1A1A] hover:opacity-85 transition-opacity"
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
