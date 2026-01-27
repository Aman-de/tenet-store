"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string;
    iconSize?: number;
    showText?: boolean;
}

export default function ShareButton({
    title,
    text,
    url,
    className,
    iconSize = 20,
    showText = false
}: ShareButtonProps) {
    const [showToast, setShowToast] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const shareUrl = url || window.location.href;
        const shareData = {
            title: title,
            text: text || "Check out this product",
            url: shareUrl,
        };

        // TypeScript guard for navigator.share check
        if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled or share failed
            }
        } else {
            // Fallback
            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(shareUrl);
                } else {
                    // Legacy fallback for non-secure contexts
                    const textArea = document.createElement("textarea");
                    textArea.value = shareUrl;
                    textArea.style.position = "fixed"; // Avoid scrolling to bottom
                    textArea.style.left = "-9999px";
                    textArea.style.top = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        console.error('Fallback: Oops, unable to copy', err);
                    }
                    document.body.removeChild(textArea);
                }
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } catch (err) {
                console.error("Failed to copy", err);
            }
        }
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleShare}
                className={cn(
                    "flex items-center gap-2 transition-colors",
                    className
                )}
                aria-label="Share"
            >
                <Share2 size={iconSize} strokeWidth={1.5} />
                {showText && <span className="underline decoration-1 underline-offset-4">Share</span>}
            </button>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg font-medium tracking-wide whitespace-nowrap"
                    >
                        Link Copied
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
