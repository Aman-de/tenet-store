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
            <div className="min-h-screen bg-[#FDFBF7] pt-20 lg:pt-28 pb-20 px-4">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Crown className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">The Circle</h1>
                    <p className="font-sans text-neutral-500 max-w-md mx-auto leading-relaxed">
                        An exclusive partnership network for Tenet patrons. Refer your peers and unlock 15% commission on their acquisitions, while offering them a 15% discount.
                    </p>
                    <div className="bg-white border border-neutral-200 p-8 rounded-2xl shadow-sm text-left space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Join the Circle</h3>
                                <p className="text-sm text-neutral-500 mt-1">Create an account to activate your signature referral link and custom coupon key.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">2</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Share Privilege</h3>
                                <p className="text-sm text-neutral-500 mt-1">Distribute your code. Guests receive an automatic 15% welcome discount on their first purchase.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                <span className="font-serif text-lg">3</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Earn Commission</h3>
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

    // Fetch user order history to check eligibility (must have at least one successfully delivered order)
    const userOrdersQuery = `*[_type == "order" && email == $email] | order(createdAt desc) {
        _id,
        orderNumber,
        status,
        createdAt,
        totalPrice
    }`;
    const orders = email ? (await client.fetch(userOrdersQuery, { email }) || []) : [];

    const hasDeliveredOrder = orders.some((order: any) => {
        const created = new Date(order.createdAt);
        const diffInHours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
        let displayStatus = order.status || 'pending';
        if (displayStatus !== 'cancelled') {
            if (diffInHours >= 48) displayStatus = 'delivered';
        }
        return displayStatus === 'delivered';
    });

    if (!hasDeliveredOrder) {
        const activeOrders = orders.filter((order: any) => {
            const status = (order.status || 'pending').toLowerCase();
            if (status === 'cancelled') return false;
            const created = new Date(order.createdAt);
            const diffInHours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
            return diffInHours < 48; // Not delivered yet in simulation
        });

        return (
            <div className="min-h-screen bg-[#FDFBF7] pt-20 lg:pt-28 pb-20 px-4 animate-in fade-in duration-500">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl relative">
                        <Crown className="w-8 h-8 text-[#D4AF37] opacity-40" />
                        <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1 bg-red-600 rounded-full p-1 border-2 border-[#FDFBF7]">
                            <Lock className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>
                    <h1 className="font-serif text-4xl text-[#1A1A1A]">Exclusive to Patrons</h1>
                    <p className="font-sans text-neutral-500 max-w-md mx-auto leading-relaxed text-sm">
                        To maintain the integrity and prestige of The Circle, access to our ambassador dashboard and signature referral keys is reserved for patrons who have placed a successfully completed and delivered order.
                    </p>

                    {orders.length === 0 ? (
                        <div className="bg-white border border-neutral-200/60 p-8 rounded-2xl shadow-sm space-y-6">
                            <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto">
                                <ShoppingBag className="w-6 h-6 text-neutral-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-serif text-lg text-[#1A1A1A]">No purchases detected</h3>
                                <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto leading-relaxed">
                                    Become a patron by exploring our silent luxury collections. Your Circle credentials will unlock automatically upon delivery.
                                </p>
                            </div>
                            <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-full">
                                Explore Collection <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6 text-left max-w-md mx-auto">
                            <div className="bg-amber-50/50 border border-amber-200/60 p-5 rounded-xl space-y-2">
                                <h3 className="font-bold text-xs uppercase tracking-widest text-amber-800 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Payout Credentials Pending
                                </h3>
                                <p className="text-xs text-amber-700 font-sans leading-relaxed">
                                    We detected your active order(s). Your dashboard and referral links will automatically unlock once your order status updates to **Delivered** (simulated 48 hours post-purchase).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-neutral-400">Your Pending Deliveries</h4>
                                {activeOrders.map((order: any) => {
                                    const created = new Date(order.createdAt);
                                    const expected = new Date(created);
                                    expected.setDate(created.getDate() + 3);
                                    const hoursElapsed = (Date.now() - created.getTime()) / (1000 * 60 * 60);
                                    
                                    let displayStatus = order.status || 'pending';
                                    if (hoursElapsed >= 24) displayStatus = 'shipped';
                                    else if (hoursElapsed >= 12) displayStatus = 'processing';

                                    return (
                                        <div key={order._id} className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4 shadow-sm">
                                            <div className="flex justify-between items-center border-b border-neutral-50 pb-3">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Order Number</p>
                                                    <p className="font-mono text-sm text-[#1A1A1A]">{order.orderNumber}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Estimated Delivery</p>
                                                    <p className="text-xs font-sans text-neutral-600">{expected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <span className="text-xs uppercase font-bold tracking-widest text-[#1A1A1A]">
                                                        Status: {displayStatus}
                                                    </span>
                                                    <div className="flex gap-1 mt-1">
                                                        {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                                                            const steps = ['pending', 'processing', 'shipped', 'delivered'];
                                                            const currentStepIdx = steps.indexOf(displayStatus.toLowerCase());
                                                            const isDone = idx <= currentStepIdx;
                                                            return (
                                                                <div key={step} className="flex items-center">
                                                                    <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-black' : 'bg-neutral-200'}`} />
                                                                    {idx < 3 && <div className={`h-0.5 w-6 ${idx < currentStepIdx ? 'bg-black' : 'bg-neutral-200'}`} />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <Link href="/orders" className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] underline underline-offset-4 hover:no-underline">
                                                    Track Order
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Ensure referral code exists (only for eligible patrons!)
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

    // Fetch dynamic referral orders and sales count from Sanity
    const referralOrdersQuery = `*[_type == "order" && referralCode == $referralCode && status != "cancelled"] {
        totalPrice
    }`;
    const referralOrders = await client.fetch(referralOrdersQuery, { referralCode }) || [];
    const totalSales = referralOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
    const totalEarnings = Math.round(totalSales * 0.15);

    const availableBalance = user.unsafeMetadata?.walletBalance as number || 0;
    const redeemedAmount = user.unsafeMetadata?.redeemedAmount as number || 0;
    const bankDetails = user.unsafeMetadata?.bankDetails as any || null;

    const clicksCount = user.unsafeMetadata?.referralClicks as number || 0;
    const joinsCount = user.unsafeMetadata?.referralJoins as number || 0;
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

    // Fetch Clerk users to find who joined via this ambassador's code
    let referredPeople: Array<{
        id: string;
        name: string;
        joinedAt: string;
        email: string;
        ordersCount: number;
        totalSpent: number;
    }> = [];

    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({ limit: 500 });
        
        const referredUsers = users.data.filter(u => u.unsafeMetadata?.referredByCode === referralCode);
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

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-20 lg:pt-28 pb-20 px-4 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-md">
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">The Circle</h1>
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
                <div className="bg-neutral-50 rounded-2xl p-8 mt-8 border border-neutral-100">
                    <h3 className="font-serif text-xl mb-6">The Circle Protocol</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">1</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Share Referral Assets</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">Distribute your unique referral link or coupon key to friends and colleagues.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">2</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Welcome Discount</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">They receive 15% off their purchase value automatically at checkout when using your assets.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center font-serif text-sm">3</div>
                            <h4 className="font-bold text-sm uppercase tracking-widest">Commission Payout</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed font-sans">You receive a 15% commission on every order. Withdraw your balance directly to your linked bank account.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
