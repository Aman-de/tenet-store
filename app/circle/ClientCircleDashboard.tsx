"use client";

import { useState } from "react";
import { Copy, Share2, CheckCircle2 } from "lucide-react";

export default function ClientCircleDashboard({ referralCode }: { referralCode: string }) {
    const [copied, setCopied] = useState(false);
    
    // We assume the site URL, in production it would be the actual domain
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `https://tenet-store.com/?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join The Inner Circle',
                text: 'Join me in The Inner Circle at Tenet. Use my exclusive link to get 15% off your first acquisition.',
                url: shareUrl,
            }).catch(console.error);
        } else {
            // Fallback to copy
            handleCopy();
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 flex items-center overflow-hidden">
                <span className="text-sm font-mono text-neutral-600 truncate">{shareUrl}</span>
            </div>
            <div className="flex gap-2 shrink-0">
                <button 
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 hover:border-black transition-colors rounded-xl font-bold text-xs uppercase tracking-widest text-[#1A1A1A]"
                >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
                <button 
                    onClick={handleShare}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white hover:bg-black transition-colors rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>
        </div>
    );
}
