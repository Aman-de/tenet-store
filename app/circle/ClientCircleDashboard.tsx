"use client";

import { useState, useEffect } from "react";
import { Copy, Share2, CheckCircle2, Building2, TrendingUp, Wallet, Banknote, Check, Loader2, Lock, MousePointerClick, Users, ShoppingCart, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { linkBankAccount, redeemReferralBalance } from "@/app/actions";

interface ClientCircleDashboardProps {
    referralCode: string;
    userId: string;
    initialStats: {
        totalSales: number;
        totalEarnings: number;
        redeemedAmount: number;
        availableBalance: number;
        clicksCount: number;
        joinsCount: number;
        cartsCount: number;
        ordersCount: number;
    };
    initialBankDetails: {
        bankName: string;
        accountHolder: string;
        accountNumber: string;
        ifscCode: string;
    } | null;
    referredPeople: Array<{
        id: string;
        name: string;
        joinedAt: string;
        email: string;
        ordersCount: number;
        totalSpent: number;
    }>;
}

export default function ClientCircleDashboard({ 
    referralCode, 
    userId, 
    initialStats, 
    initialBankDetails,
    referredPeople
}: ClientCircleDashboardProps) {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [redemptionMessage, setRedemptionMessage] = useState("");
    const [redemptionSuccess, setRedemptionSuccess] = useState(false);

    // Bank Account State
    const [bankDetails, setBankDetails] = useState(initialBankDetails);
    const [isEditingBank, setIsEditingBank] = useState(!initialBankDetails);
    const [isSavingBank, setIsSavingBank] = useState(false);
    
    // Form Inputs & Validation States
    const [bankName, setBankName] = useState(initialBankDetails?.bankName || "");
    const [accountHolder, setAccountHolder] = useState(initialBankDetails?.accountHolder || "");
    const [accountNumber, setAccountNumber] = useState(initialBankDetails?.accountNumber || "");
    const [ifscCode, setIfscCode] = useState(initialBankDetails?.ifscCode || "");
    const [bankError, setBankError] = useState("");
    const [ifscError, setIfscError] = useState("");
    const [isValidatingIFSC, setIsValidatingIFSC] = useState(false);
    const [resolvedBankName, setResolvedBankName] = useState(initialBankDetails?.bankName || "");
    const [accountNumberError, setAccountNumberError] = useState("");

    // Real-time IFSC Verification
    useEffect(() => {
        const checkIFSC = async () => {
            const cleanIFSC = ifscCode.trim().toUpperCase();
            if (cleanIFSC.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIFSC)) {
                setIsValidatingIFSC(true);
                setIfscError("");
                try {
                    const res = await fetch(`https://ifsc.razorpay.com/${cleanIFSC}`);
                    if (res.ok) {
                        const data = await res.json();
                        setResolvedBankName(data.BANK || "Unknown Bank");
                        setBankName(data.BANK || "");
                        setIfscError("");
                    } else {
                        setIfscError("Invalid IFSC code. Bank not found.");
                        setResolvedBankName("");
                        setBankName("");
                    }
                } catch (e) {
                    console.warn("Client IFSC fetch failed:", e);
                } finally {
                    setIsValidatingIFSC(false);
                }
            } else {
                setResolvedBankName("");
                if (cleanIFSC.length > 0 && cleanIFSC.length < 11) {
                    setIfscError("IFSC must be exactly 11 characters.");
                } else if (cleanIFSC.length === 11) {
                    setIfscError("Invalid IFSC format (e.g. HDFC0001234).");
                } else {
                    setIfscError("");
                }
            }
        };

        checkIFSC();
    }, [ifscCode]);

    // Real-time Account Number Validation
    const handleAccountNumberChange = (val: string) => {
        const cleaned = val.replace(/[^0-9]/g, '');
        setAccountNumber(cleaned);
        
        if (cleaned.length > 0) {
            if (cleaned.length < 9 || cleaned.length > 18) {
                setAccountNumberError("Account number must be 9-18 digits.");
            } else if (/^(.)\1+$/.test(cleaned)) {
                setAccountNumberError("Cannot consist of only repeating digits.");
            } else if ("0123456789".includes(cleaned) || "9876543210".includes(cleaned)) {
                setAccountNumberError("Cannot be a simple sequential sequence.");
            } else {
                setAccountNumberError("");
            }
        } else {
            setAccountNumberError("");
        }
    };

    // Dynamic Balance State
    const [availableBalance, setAvailableBalance] = useState(initialStats.availableBalance);
    const [redeemedAmount, setRedeemedAmount] = useState(initialStats.redeemedAmount);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `https://tenet-store.com/?ref=${referralCode}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join The Circle',
                text: 'Join me in The Circle at Tenet. Use my exclusive link to get 15% off your first acquisition.',
                url: shareUrl,
            }).catch(console.error);
        } else {
            handleCopyLink();
        }
    };

    const handleLinkBank = async (e: React.FormEvent) => {
        e.preventDefault();
        setBankError("");
        setIsSavingBank(true);

        if (ifscError || accountNumberError) {
            setBankError("Please resolve validation errors first.");
            setIsSavingBank(false);
            return;
        }

        if (!bankName || !accountHolder || !accountNumber || !ifscCode) {
            setBankError("All bank account fields are required.");
            setIsSavingBank(false);
            return;
        }

        const details = { bankName, accountHolder, accountNumber, ifscCode };
        const res = await linkBankAccount(userId, details);

        setIsSavingBank(false);
        if (res.success) {
            setBankDetails(details);
            setIsEditingBank(false);
        } else {
            setBankError(res.message || "Failed to save bank details.");
        }
    };

    const handleRedeem = async () => {
        if (availableBalance <= 0) return;
        if (!bankDetails) {
            alert("Please link your bank account details first before requesting redemption.");
            return;
        }

        setIsRedeeming(true);
        setRedemptionMessage("");
        
        const res = await redeemReferralBalance(userId);
        setIsRedeeming(false);

        if (res.success) {
            setRedemptionSuccess(true);
            setRedemptionMessage(res.message || "Redemption successful.");
            // Update local balance values immediately
            setRedeedmedAmount(prev => prev + availableBalance);
            setAvailableBalance(0);
        } else {
            setRedemptionSuccess(false);
            setRedemptionMessage(res.message || "Failed to submit request.");
        }
    };

    // Helper to obscure account number
    const getObscuredAccountNumber = (num: string) => {
        if (num.length < 4) return "****";
        return `******${num.slice(-4)}`;
    };

    // Fix typo in state updater helper
    function setRedeedmedAmount(updater: (prev: number) => number) {
        setRedeedmedAmountInternal(updater);
    }
    const [_, setRedeedmedAmountInternal] = useState(0);

    return (
        <div className="space-y-10">
            {/* Share and Invitation Section */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 xs:p-8 shadow-sm flex flex-col gap-6">
                <div>
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] mb-1.5">Your Circle Assets</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                        Share your unique invite assets. Customers receive an extra <strong className="text-[#1A1A1A] dark:text-[#F4F1ED] font-semibold">15% discount</strong> at checkout, and you earn <strong className="text-[#1A1A1A] dark:text-[#F4F1ED] font-semibold">15% commission</strong> on their entire purchase value.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Share Link Row */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Referral Link</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 flex items-center overflow-hidden h-[46px]">
                                <span className="text-xs font-mono text-neutral-500 truncate">{shareUrl}</span>
                            </div>
                            <button 
                                onClick={handleCopyLink}
                                className="w-[100px] flex items-center justify-center gap-1.5 px-4 h-[46px] bg-white border border-neutral-200 hover:border-[#1A1A1A] active:scale-95 transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED] cursor-pointer shrink-0"
                            >
                                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedLink ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Coupon Code Row */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Referral Coupon Code</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 flex items-center overflow-hidden h-[46px]">
                                <span className="text-xs font-mono font-bold tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">{referralCode}</span>
                            </div>
                            <button 
                                onClick={handleCopyCode}
                                className="w-[100px] flex items-center justify-center gap-1.5 px-4 h-[46px] bg-white border border-neutral-200 hover:border-[#1A1A1A] active:scale-95 transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1ED] cursor-pointer shrink-0"
                            >
                                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedCode ? 'Copied' : 'Copy'}
                            </button>
                            <button 
                                onClick={handleShare}
                                className="h-[46px] flex items-center justify-center gap-1.5 px-5 bg-[#1A1A1A] hover:bg-black text-white active:scale-95 transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer shrink-0"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Stat 1: Total Sales */}
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Total Sales Made</span>
                        <TrendingUp className="w-4 h-4 text-neutral-300" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">₹{initialStats.totalSales.toLocaleString('en-IN')}</h3>
                </div>

                {/* Stat 2: Total Commission */}
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Commission (15%)</span>
                        <Banknote className="w-4 h-4 text-neutral-300" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">₹{initialStats.totalEarnings.toLocaleString('en-IN')}</h3>
                </div>

                {/* Stat 3: Pending Balance */}
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Pending (10-Day Hold)</span>
                        <Clock className="w-4 h-4 text-neutral-300" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">₹{Math.max(0, initialStats.totalEarnings - availableBalance - redeemedAmount).toLocaleString('en-IN')}</h3>
                </div>

                {/* Stat 4: Redeemed */}
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Redeemed</span>
                        <Check className="w-4 h-4 text-neutral-300" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">₹{redeemedAmount.toLocaleString('en-IN')}</h3>
                </div>

                {/* Stat 5: Available */}
                <div className="bg-[#1A1A1A] text-white rounded-2xl p-5 shadow-md flex flex-col justify-between h-full min-h-[110px] md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Available to Redeem</span>
                        <Wallet className="w-4 h-4 text-neutral-400" />
                    </div>
                    <h3 className="font-serif text-2xl text-white">₹{availableBalance.toLocaleString('en-IN')}</h3>
                </div>
            </div>

            {/* Traffic & Engagement Funnel */}
            <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-neutral-400">Traffic & Engagement Funnel</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Funnel 1: Click Traffic */}
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#1A1A1A] transition-all">
                        <div className="flex justify-between items-center text-neutral-400">
                            <span className="text-[9px] font-bold uppercase tracking-wider">Link Clicks</span>
                            <MousePointerClick className="w-4 h-4 text-neutral-300 group-hover:text-[#1A1A1A] dark:text-[#F4F1ED] transition-colors" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">{initialStats.clicksCount}</h3>
                        <p className="text-[9px] text-neutral-400 font-sans">Total referral visits</p>
                    </div>

                    {/* Funnel 2: Community Joins */}
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#1A1A1A] transition-all">
                        <div className="flex justify-between items-center text-neutral-400">
                            <span className="text-[9px] font-bold uppercase tracking-wider">Patrons Joined</span>
                            <Users className="w-4 h-4 text-neutral-300 group-hover:text-[#1A1A1A] dark:text-[#F4F1ED] transition-colors" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">{initialStats.joinsCount}</h3>
                        <p className="text-[9px] text-neutral-400 font-sans">New user sign-ups</p>
                    </div>

                    {/* Funnel 3: Cart Adds */}
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#1A1A1A] transition-all">
                        <div className="flex justify-between items-center text-neutral-400">
                            <span className="text-[9px] font-bold uppercase tracking-wider">Items Carted</span>
                            <ShoppingCart className="w-4 h-4 text-neutral-300 group-hover:text-[#1A1A1A] dark:text-[#F4F1ED] transition-colors" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">{initialStats.cartsCount}</h3>
                        <p className="text-[9px] text-neutral-400 font-sans">Products added to cart</p>
                    </div>

                    {/* Funnel 4: Completed Orders */}
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#1A1A1A] transition-all">
                        <div className="flex justify-between items-center text-neutral-400">
                            <span className="text-[9px] font-bold uppercase tracking-wider">Successful Orders</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600/70" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#1A1A1A] dark:text-[#F4F1ED]">{initialStats.ordersCount}</h3>
                        <p className="text-[9px] text-neutral-400 font-sans">Conversions using assets</p>
                    </div>
                </div>
            </div>

            {/* Redemption Section */}
            {availableBalance > 0 && (
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 xs:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md border border-neutral-800">
                    <div className="space-y-1">
                        <h4 className="font-serif text-lg text-white">Settlement Pending</h4>
                        <p className="text-xs text-neutral-400 font-sans max-w-md">
                            You have <strong className="text-white">₹{availableBalance.toLocaleString('en-IN')}</strong> available in unpaid commissions. Request redemption directly to your linked bank account.
                        </p>
                    </div>
                    <button
                        onClick={handleRedeem}
                        disabled={isRedeeming || !bankDetails}
                        className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-100 text-black font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isRedeeming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {!bankDetails ? "Link Bank to Redeem" : "Redeem to Bank"}
                    </button>
                </div>
            )}

            <AnimatePresence>
                {redemptionMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-5 rounded-2xl border text-sm font-sans flex items-start gap-3 ${
                            redemptionSuccess 
                                ? "bg-emerald-50/60 border-emerald-100 text-emerald-800" 
                                : "bg-red-50/60 border-red-100 text-red-800"
                        }`}
                    >
                        {redemptionSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <Lock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                        <p className="leading-relaxed">{redemptionMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bank Details Section */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 xs:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-2.5">
                        <Building2 className="w-5 h-5 text-neutral-400" />
                        <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED]">Bank Settlement Account</h3>
                    </div>
                    {bankDetails && !isEditingBank && (
                        <button
                            onClick={() => setIsEditingBank(true)}
                            className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors cursor-pointer"
                        >
                            Change Account
                        </button>
                    )}
                </div>

                {!isEditingBank && bankDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm font-sans leading-relaxed text-neutral-600">
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">Beneficiary Name</span>
                            <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#F4F1ED]">{bankDetails.accountHolder}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">Bank Name</span>
                            <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#F4F1ED]">{bankDetails.bankName}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">Account Number</span>
                            <span className="text-sm font-mono text-[#1A1A1A] dark:text-[#F4F1ED]">{getObscuredAccountNumber(bankDetails.accountNumber)}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">IFSC Code</span>
                            <span className="text-sm font-mono text-[#1A1A1A] dark:text-[#F4F1ED]">{bankDetails.ifscCode}</span>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleLinkBank} className="space-y-4 max-w-xl">
                        <p className="text-xs text-neutral-400 font-sans mb-2">
                            Link your settlement details to enable payout transfers. Payments are securely audited and credited directly.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Account Holder Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter full name"
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:border-black bg-neutral-50/40"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Bank Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="Auto-resolved from IFSC"
                                        value={bankName}
                                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none bg-neutral-100 text-neutral-500 cursor-not-allowed"
                                    />
                                    {resolvedBankName && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Account Number</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter bank account number"
                                    value={accountNumber}
                                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                                    className={`w-full border ${accountNumberError ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 focus:border-black'} rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none bg-neutral-50/40`}
                                />
                                {accountNumberError && (
                                    <p className="text-[10px] text-red-500 font-sans mt-0.5">{accountNumberError}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">IFSC Code</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. HDFC0001234"
                                        value={ifscCode}
                                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                        className={`w-full border ${ifscError ? 'border-red-300 focus:border-red-500' : 'border-neutral-200 focus:border-black'} rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none bg-neutral-50/40`}
                                    />
                                    {isValidatingIFSC && (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    )}
                                </div>
                                {ifscError && (
                                    <p className="text-[10px] text-red-500 font-sans mt-0.5">{ifscError}</p>
                                )}
                            </div>
                        </div>

                        {bankError && (
                            <p className="text-xs text-red-500 font-sans mt-2">{bankError}</p>
                        )}

                        <div className="flex gap-2.5 pt-2">
                            <button
                                type="submit"
                                disabled={isSavingBank}
                                className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white font-sans text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                {isSavingBank && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Link Bank Account
                            </button>
                            {bankDetails && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingBank(false);
                                        setBankError("");
                                    }}
                                    className="px-6 py-3 border border-neutral-200 hover:border-black text-neutral-800 font-sans text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>

            {/* Referred Community Section */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 xs:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                    <Users className="w-5 h-5 text-neutral-400" />
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED]">Your Referred Community</h3>
                </div>

                {referredPeople.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 font-sans leading-relaxed">
                        No members have registered using your circle invitation key yet. Share your invite assets to build your community.
                    </div>
                ) : (
                    <div className="overflow-x-auto animate-in fade-in duration-300">
                        <table className="w-full text-left border-collapse text-xs font-sans">
                            <thead>
                                <tr className="border-b border-neutral-150 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                    <th className="py-3 px-4 pl-0 font-bold">Patron</th>
                                    <th className="py-3 px-4 font-bold">Joined On</th>
                                    <th className="py-3 px-4 text-center font-bold">Purchases</th>
                                    <th className="py-3 px-4 text-right pr-0 font-bold">Net Contribution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-[#1A1A1A] dark:text-[#F4F1ED]">
                                {referredPeople.map((person) => (
                                    <tr key={person.id} className="hover:bg-neutral-50/40 transition-colors">
                                        <td className="py-3 px-4 pl-0">
                                            <div className="font-medium">{person.name}</div>
                                            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{person.email}</div>
                                        </td>
                                        <td className="py-3 px-4 text-neutral-500">{person.joinedAt}</td>
                                        <td className="py-3 px-4 text-center font-medium">{person.ordersCount}</td>
                                        <td className="py-3 px-4 text-right font-medium pr-0">
                                            ₹{person.totalSpent.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
