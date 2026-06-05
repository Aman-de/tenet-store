import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Crown, Wallet, Copy, Share2, ArrowRight } from "lucide-react";
import ClientCircleDashboard from "./ClientCircleDashboard";

export default async function InnerCirclePage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Crown className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">The Inner Circle</h1>
                    <p className="font-sans text-neutral-500 max-w-md mx-auto leading-relaxed">
                        An exclusive society for Tenet patrons. Invite your peers and unlock curated rewards, store credit, and early access.
                    </p>
                    <div className="bg-white border border-neutral-200 p-8 rounded-2xl shadow-sm text-left space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Join the Circle</h3>
                                <p className="text-sm text-neutral-500 mt-1">Create an account to receive your unique signature key.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">2</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Invite Peers</h3>
                                <p className="text-sm text-neutral-500 mt-1">Share your key. Guests receive an automatic 15% courtesy discount on their first acquisition.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">3</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Earn Credit</h3>
                                <p className="text-sm text-neutral-500 mt-1">For every successful guest order, your wallet is credited with ₹1,000.</p>
                            </div>
                        </div>
                    </div>
                    <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-full w-full md:w-auto">
                        Sign In to Access <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    // Ensure referral code exists
    let referralCode = user.unsafeMetadata?.referralCode as string;
    
    if (!referralCode) {
        // Generate a new referral code: first name + 4 random chars
        const baseName = (user.firstName || "TENET").toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        referralCode = `${baseName}${randomStr}`;
        
        // Update user metadata
        // We use Clerk's backend API indirectly or rely on client side, but since we are in a Server Component,
        // we can just pass it to the Client Component to patch it if missing, or use clerkClient from server.
        // Let's import clerkClient
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(userId, {
            unsafeMetadata: {
                ...user.unsafeMetadata,
                referralCode,
                walletBalance: user.unsafeMetadata?.walletBalance || 0,
            }
        });
    }

    const walletBalance = user.unsafeMetadata?.walletBalance as number || 0;

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-md">
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">The Inner Circle</h1>
                        <p className="font-sans text-neutral-500 text-sm">Welcome back, {user.firstName || 'Patron'}.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Wallet Card */}
                    <div className="bg-[#1A1A1A] text-white rounded-2xl p-8 shadow-xl relative overflow-hidden md:col-span-1 flex flex-col justify-between min-h-[200px]">
                        <div className="absolute top-0 right-0 p-6 opacity-20">
                            <Wallet className="w-24 h-24" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Available Credit</p>
                            <h2 className="font-serif text-4xl">₹{walletBalance.toLocaleString('en-IN')}</h2>
                        </div>
                        <p className="text-xs text-neutral-400 mt-6">Automatically available at checkout.</p>
                    </div>

                    {/* Invite Card */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm md:col-span-2 flex flex-col justify-center">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A] mb-2">Your Signature Key</h3>
                        <p className="text-sm text-neutral-500 mb-6">
                            Share this link. Guests receive 15% off. You receive ₹1,000 credit per successful referral.
                        </p>
                        <ClientCircleDashboard referralCode={referralCode} />
                    </div>
                </div>

                {/* How it works */}
                <div className="bg-neutral-50 rounded-2xl p-8 mt-8 border border-neutral-100">
                    <h3 className="font-serif text-xl mb-6">The Privilege Protocol</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">1</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Share The Key</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed">Distribute your unique link to friends and colleagues.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">2</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Guest Discount</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed">They seamlessly receive 15% off their first acquisition when using your link.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">3</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Wallet Credit</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed">Upon their successful order, your wallet is automatically injected with ₹1,000 credit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
