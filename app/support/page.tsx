"use client";

import Navbar from "@/components/Navbar";

export default function SupportPage() {
    return (
        <main className="bg-[#FDFBF7] min-h-screen">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-32 text-center">
                <h1 className="font-serif text-4xl text-[#1A1A1A] mb-6">Customer Support</h1>
                <p className="font-sans text-neutral-600">
                    For inquiries, please contact us at concierge@tenet.com.
                </p>
            </div>
        </main>
    );
}
