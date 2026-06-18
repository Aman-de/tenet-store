"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export default function GuestOrderForm() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            router.push(`/orders?email=${encodeURIComponent(email)}`);
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-md w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm">
                <h1 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-2 text-center">Track Your Orders</h1>
                <p className="text-neutral-500 text-sm mb-6 text-center">
                    Enter the email address used during checkout to view your previous guest orders, or sign in to access your complete history.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-neutral-300 py-3 text-sm outline-none focus:border-black transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#1A1A1A] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-full flex items-center justify-center gap-2 mt-4">
                        View Orders <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="text-center pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-6">
                        <p className="text-xs text-neutral-500">
                            Have an account? <SignInButton mode="modal" forceRedirectUrl="/orders"><button type="button" className="text-[#1A1A1A] dark:text-[#F4F1ED] font-bold underline">Sign In</button></SignInButton>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
