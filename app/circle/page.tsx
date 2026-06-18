import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Crown, ArrowRight, Lock, ShoppingBag, Clock, Truck, CheckCircle2 } from "lucide-react";
import ClientCircleDashboard from "./ClientCircleDashboard";
import { client } from "@/lib/sanity";

export default async function InnerCirclePage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return (
            <div className="min-h-screen pt-20 lg:pt-28 pb-20 px-4">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Crown className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] dark:text-[#F4F1ED]">The Circle</h1>
                    <p className="font-sans text-neutral-500 max-w-md mx-auto leading-relaxed">
                        An exclusive partnership network for Tenet patrons. Refer your peers and unlock 15% commission on their acquisitions, while offering them a 15% discount.
                    </p>
                    <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl shadow-sm text-left space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-[#0A0A0A] flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED]">Join the Circle</h3>
                                <p className="text-sm text-neutral-500 mt-1">Create an account to activate your signature referral link and custom coupon key.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-[#0A0A0A] flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">2</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED]">Share Privilege</h3>
                                <p className="text-sm text-neutral-500 mt-1">Distribute your code. Guests receive an automatic 15% welcome discount on their first purchase.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-[#0A0A0A] flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">3</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED]">Earn Commission</h3>
                                <p className="text-sm text-neutral-500 mt-1">For every successful referral, your wallet is credited with 15% of their order value. Withdraw directly to your bank.</p>
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

    const email = user.emailAddresses[0]?.emailAddress || "";

    // Ensure referral code exists
    let referralCode = user.unsafeMetadata?.referralCode as string;
    
    if (!referralCode) {
        const baseName = (user.firstName || "TENET").toUpperCase().replace(/[^A-Z]/g, '');
        const codeCandidate = `${baseName}20`;
        
        // Update user metadata and check for unique code
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({ limit: 500 });
        const codeExists = users.data.some(u => u.unsafeMetadata?.referralCode === codeCandidate);
        
        if (codeExists) {
            const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
            referralCode = `${baseName}20${randomStr}`;
        } else {
            referralCode = codeCandidate;
        }

        await clerk.users.updateUserMetadata(userId, {
            unsafeMetadata: {
                ...user.unsafeMetadata,
                referralCode,
                walletBalance: user.unsafeMetadata?.walletBalance || 0,
            }
        });
    }

    // Fetch Clerk users first to calculate signup bonuses and list referred people
    let referredPeople: Array<{
        id: string;
        name: string;
        joinedAt: string;
        email: string;
        ordersCount: number;
        totalSpent: number;
    }> = [];
    let signupBonusTotal = 0;

    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({ limit: 500 });
        
        const referredUsers = users.data.filter(u => u.unsafeMetadata?.referredByCode === referralCode);
        signupBonusTotal = referredUsers.length * 15;
        const referredEmails = referredUsers.map(u => u.emailAddresses[0]?.emailAddress).filter(Boolean);

        // Fetch their orders from Sanity
        const referredOrdersData = referredEmails.length > 0 ? (await client.fetch(
            `*[_type == "order" && email in $emails] { email, status, totalPrice }`,
            { emails: referredEmails }
        ) || []) : [];

        referredPeople = referredUsers.map(u => {
            const emailAddress = u.emailAddresses[0]?.emailAddress;
            const personOrders = referredOrdersData.filter((o: any) => o.email === emailAddress && o.status !== 'cancelled');
            const totalContributed = personOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
            
            return {
                id: u.id,
                name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || emailAddress?.split('@')[0] || "Patron",
                joinedAt: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                email: emailAddress ? `${emailAddress.slice(0, 3)}***@${emailAddress.split('@')[1]}` : "Private email",
                ordersCount: personOrders.length,
                totalSpent: totalContributed
            };
        });
    } catch (err) {
        console.error("Failed to fetch referred users:", err);
    }

    // Fetch dynamic referral orders from Sanity
    const referralOrdersQuery = `*[_type == "order" && referralCode == $referralCode && status != "cancelled"] {
        totalPrice,
        status,
        createdAt,
        deliveredAt
    }`;
    const referralOrders = await client.fetch(referralOrdersQuery, { referralCode }) || [];
    
    let totalSales = 0;
    let availableCommission = signupBonusTotal; // Signup bonuses are instantly matured!
    
    const now = Date.now();
    const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

    referralOrders.forEach((o: any) => {
        const price = o.totalPrice || 0;
        totalSales += price;

        if (o.status === 'delivered') {
            // For testing: If deliveredAt is set, use it. Otherwise fallback to createdAt + 48h (simulated delivery)
            const deliveredTime = o.deliveredAt ? new Date(o.deliveredAt).getTime() : new Date(o.createdAt).getTime() + (48 * 60 * 60 * 1000);
            if (now - deliveredTime >= TEN_DAYS_MS) {
                availableCommission += Math.round(price * 0.15);
            }
        }
    });

    const totalEarnings = Math.round(totalSales * 0.15) + signupBonusTotal;
    const redeemedAmount = user.unsafeMetadata?.redeemedAmount as number || 0;
    // Real available balance is the total matured commission minus whatever was already redeemed.
    const availableBalance = Math.max(0, availableCommission - redeemedAmount);
    
    const bankDetails = user.unsafeMetadata?.bankDetails as any || null;
    const clicksCount = user.unsafeMetadata?.referralClicks as number || 0;
    const joinsCount = referredPeople.length; // Use the actual count of verified referred users
    const cartsCount = user.unsafeMetadata?.referralCarts as number || 0;

    const initialStats = {
        totalSales,
        totalEarnings,
        redeemedAmount,
        availableBalance,
        clicksCount,
        joinsCount,
        cartsCount,
        ordersCount: referralOrders.length
    };

    return (
        <div className="min-h-screen pt-20 lg:pt-28 pb-20 px-4 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-md">
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] dark:text-[#F4F1ED]">The Circle</h1>
                        <p className="font-sans text-neutral-500 text-sm">Welcome back, {user.firstName || 'Patron'}.</p>
                    </div>
                </div>

                <ClientCircleDashboard 
                    referralCode={referralCode} 
                    userId={userId}
                    initialStats={initialStats}
                    initialBankDetails={bankDetails}
                    referredPeople={referredPeople}
                />

                {/* How it works */}
                <div className="bg-neutral-50 dark:bg-[#0A0A0A] rounded-2xl p-8 mt-8 border border-neutral-100 dark:border-neutral-800">
                    <h3 className="font-serif text-xl mb-6">The Circle Protocol</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-serif text-sm">1</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Share Referral Assets</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">Distribute your unique referral link or coupon key to friends and colleagues.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-serif text-sm">2</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Welcome Discount</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">They receive 15% off their purchase value automatically at checkout when using your assets.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-serif text-sm">3</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Commission Payout</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">You receive a 15% commission on every order. Withdraw your balance directly to your linked bank account.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
