"use client";

import { useState } from "react";
import { Copy, Share2, CheckCircle2, Building2, TrendingUp, Wallet, Banknote, Check, Loader2, Lock } from "lucide-react";
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
    };
    initialBankDetails: {
        bankName: string;
        accountHolder: string;
        accountNumber: string;
        ifscCode: string;
    } | null;
}

export default function ClientCircleDashboard({ 
    referralCode, 
    userId, 
    initialStats, 
    initialBankDetails 
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
    
    // Form Inputs
    const [bankName, setBankName] = useState(initialBankDetails?.bankName || "");
    const [accountHolder, setAccountHolder] = useState(initialBankDetails?.accountHolder || "");
    const [accountNumber, setAccountNumber] = useState(initialBankDetails?.accountNumber || "");
    const [ifscCode, setIfscCode] = useState(initialBankDetails?.ifscCode || "");
    const [bankError, setBankError] = useState("");

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
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#1A1A1A] mb-1.5">Your Circle Assets</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                        Share your unique invite assets. Customers receive an extra <strong className="text-[#1A1A1A] font-semibold">15% discount</strong> at checkout, and you earn <strong className="text-[#1A1A1A] font-semibold">20% commission</strong> on their entire purchase value.
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
                                className="w-[100px] flex items-center justify-center gap-1.5 px-4 h-[46px] bg-white border border-neutral-200 hover:border-[#1A1A1A] active:scale-95 transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest text-[#1A1A1A] cursor-pointer shrink-0"
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
                                <span className="text-xs font-mono font-bold tracking-wider text-[#1A1A1A]">{referralCode}</span>
                            </div>
                            <button 
                                onClick={handleCopyCode}
                                className="w-[100px] flex items-center justify-center gap-1.5 px-4 h-[46px] bg-white border border-neutral-200 hover:border-[#1A1A1A] active:scale-95 transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest text-[#1A1A1A] cursor-pointer shrink-0"
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1: Total Sales */}
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Total Sales Made</span>
                        <TrendingUp className="w-4 h-4 text-neutral-300" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1A1A]">₹{initialStats.totalSales.toLocaleString('en-IN')}</h3>
                </div>

                {/* Stat 2: Total Commission */}
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Commission (20%)</span>
                        <Banknote className="w-4 h-4 text-neutral-300" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1A1A]">₹{initialStats.totalEarnings.toLocaleString('en-IN')}</h3>
                </div>

                {/* Stat 3: Redeemed */}
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider">Redeemed</span>
                        <Check className="w-4 h-4 text-neutral-300" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1A1A]">₹{redeemedAmount.toLocaleString('en-IN')}</h3>
                </div>

                {/* Stat 4: Available */}
                <div className="bg-[#1A1A1A] text-white rounded-2xl p-5 shadow-md flex flex-col justify-between h-full min-h-[110px]">
                    <div className="flex justify-between items-center text-neutral-400">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Available to Redeem</span>
                        <Wallet className="w-4 h-4 text-neutral-400" />
                    </div>
                    <h3 className="font-serif text-2xl text-white">₹{availableBalance.toLocaleString('en-IN')}</h3>
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
                        <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#1A1A1A]">Bank Settlement Account</h3>
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
                            <span className="text-sm font-medium text-[#1A1A1A]">{bankDetails.accountHolder}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">Bank Name</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">{bankDetails.bankName}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">Account Number</span>
                            <span className="text-sm font-mono text-[#1A1A1A]">{getObscuredAccountNumber(bankDetails.accountNumber)}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">IFSC Code</span>
                            <span className="text-sm font-mono text-[#1A1A1A]">{bankDetails.ifscCode}</span>
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
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. HDFC Bank"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:border-black bg-neutral-50/40"
                                />
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
                                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:border-black bg-neutral-50/40"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">IFSC Code</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. HDFC0001234"
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-sans focus:outline-none focus:border-black bg-neutral-50/40"
                                />
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
        </div>
    );
}
