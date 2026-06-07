import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";
import ClientCircleDashboard from "./ClientCircleDashboard";
import { client } from "@/lib/sanity";

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
                                <p className="text-sm text-neutral-500 mt-1">For every successful guest order, your wallet is credited with 20% of their order value.</p>
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

    // Fetch dynamic referral orders and sales count from Sanity
    const referralOrdersQuery = `*[_type == "order" && referralCode == $referralCode && status != "cancelled"] {
        totalPrice
    }`;
    const referralOrders = await client.fetch(referralOrdersQuery, { referralCode }) || [];
    const totalSales = referralOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
    const totalEarnings = Math.round(totalSales * 0.20);

    const availableBalance = user.unsafeMetadata?.walletBalance as number || 0;
    const redeemedAmount = user.unsafeMetadata?.redeemedAmount as number || 0;
    const bankDetails = user.unsafeMetadata?.bankDetails as any || null;

    const initialStats = {
        totalSales,
        totalEarnings,
        redeemedAmount,
        availableBalance
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 animate-in fade-in duration-500">
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

                <ClientCircleDashboard 
                    referralCode={referralCode} 
                    userId={userId}
                    initialStats={initialStats}
                    initialBankDetails={bankDetails}
                />

                {/* How it works */}
                <div className="bg-neutral-50 rounded-2xl p-8 mt-8 border border-neutral-100">
                    <h3 className="font-serif text-xl mb-6">The Privilege Protocol</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">1</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Share The Key</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">Distribute your unique link or coupon code to friends and colleagues.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">2</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Guest Privilege</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">They receive 15% off their purchase value when using your link or code.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">3</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Earnings Transfer</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">You receive a 20% commission on every sale. Redeem funds directly to your linked bank account.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
