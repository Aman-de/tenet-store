import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Crown, Users, TrendingUp, IndianRupee, ShieldAlert } from "lucide-react";
import { clerkClient } from "@clerk/nextjs/server";
import SyncButton from "./SyncButton";

export default async function AdminCircleDashboard() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect("/sign-in");
    }

    // Security Check: Hardcoded admin emails or role check
    const adminEmails = ["tenetarchives@gmail.com", "admin@tenetarchives.com"];
    const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
    const isAdminRole = user.publicMetadata?.role === "admin";
    
    if (!isAdminRole && !adminEmails.includes(userEmail)) {
        return (
            <div className="min-h-screen pt-28 pb-20 px-4 flex flex-col items-center justify-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="font-serif text-3xl mb-4 text-[#1A1A1A] dark:text-[#F4F1ED]">Access Denied</h1>
                <p className="font-sans text-neutral-500 max-w-md text-center">
                    You do not have the required permissions to view this dashboard. Please contact the administrator.
                </p>
            </div>
        );
    }

    // Fetch all users safely with pagination
    const clerk = await clerkClient();
    const allUsers: any[] = [];
    let offset = 0;
    const limit = 500;
    
    try {
        while (true) {
            const usersBatch = await clerk.users.getUserList({ limit, offset });
            allUsers.push(...usersBatch.data);
            if (usersBatch.data.length < limit) break;
            offset += limit;
        }
    } catch (e) {
        console.error("Failed to fetch users for admin dashboard", e);
    }

    // Filter partners (users who have a referral code generated)
    const partners = allUsers.filter(u => !!u.unsafeMetadata?.referralCode);

    // Aggregate metrics
    let totalClicks = 0;
    let totalCarts = 0;
    let totalJoins = 0;
    let totalRevenueGenerated = 0;
    let totalOutstandingWallets = 0;

    const partnerStats = partners.map(p => {
        const clicks = (p.unsafeMetadata?.referralClicks as number) || 0;
        const carts = (p.unsafeMetadata?.referralCarts as number) || 0;
        const joins = (p.unsafeMetadata?.referralJoins as number) || 0;
        const revenue = (p.unsafeMetadata?.referralRevenue as number) || 0;
        const wallet = (p.unsafeMetadata?.walletBalance as number) || 0;
        const code = p.unsafeMetadata?.referralCode as string;

        totalClicks += clicks;
        totalCarts += carts;
        totalJoins += joins;
        totalRevenueGenerated += revenue;
        totalOutstandingWallets += wallet;

        return {
            id: p.id,
            name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || "N/A",
            email: p.emailAddresses[0]?.emailAddress || "N/A",
            code,
            clicks,
            carts,
            joins,
            revenue,
            wallet,
            joinedAt: new Date(p.createdAt).toLocaleDateString()
        };
    });

    // Sort by revenue descending
    partnerStats.sort((a, b) => b.revenue - a.revenue);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-md">
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl text-[#1A1A1A] dark:text-[#F4F1ED]">Circle Admin</h1>
                        <p className="text-sm text-neutral-500 font-sans mt-1">Master Dashboard for Partner Tracking</p>
                    </div>
                </div>
                <SyncButton />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-blue-500" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Active Partners</h3>
                    </div>
                    <p className="text-4xl font-serif text-[#1A1A1A] dark:text-[#F4F1ED]">{partners.length}</p>
                </div>

                <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Total Joins</h3>
                    </div>
                    <p className="text-4xl font-serif text-[#1A1A1A] dark:text-[#F4F1ED]">{totalJoins}</p>
                    <p className="text-xs text-neutral-400 mt-2">From {totalClicks} clicks</p>
                </div>

                <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <IndianRupee className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Revenue Driven</h3>
                    </div>
                    <p className="text-4xl font-serif text-[#1A1A1A] dark:text-[#F4F1ED]">₹{totalRevenueGenerated.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <IndianRupee className="w-5 h-5 text-red-400" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Unpaid Wallets</h3>
                    </div>
                    <p className="text-4xl font-serif text-[#1A1A1A] dark:text-[#F4F1ED]">₹{totalOutstandingWallets.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="font-serif text-xl text-[#1A1A1A] dark:text-[#F4F1ED]">Partner Directory</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm">
                        <thead className="bg-neutral-50 dark:bg-[#0A0A0A] text-neutral-500 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-bold">Partner</th>
                                <th className="px-6 py-4 font-bold">Code</th>
                                <th className="px-6 py-4 font-bold">Clicks</th>
                                <th className="px-6 py-4 font-bold">Carts</th>
                                <th className="px-6 py-4 font-bold">Joins</th>
                                <th className="px-6 py-4 font-bold">Revenue</th>
                                <th className="px-6 py-4 font-bold">Wallet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {partnerStats.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                                        No partners found.
                                    </td>
                                </tr>
                            ) : (
                                partnerStats.map(p => (
                                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[#1A1A1A] dark:text-[#F4F1ED]">{p.name}</div>
                                            <div className="text-xs text-neutral-500 mt-1">{p.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-[#1A1A1A] dark:text-[#F4F1ED]">
                                                {p.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{p.clicks}</td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{p.carts}</td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{p.joins}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                                            ₹{p.revenue.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#1A1A1A] dark:text-[#F4F1ED]">
                                            ₹{p.wallet.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
