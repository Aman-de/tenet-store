"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { trackReferralClick } from "@/app/actions";

export default function ReferralTracker() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { user } = useUser();
    const hasTracked = useRef(false);

    // 1. URL Parameter Tracking (Landed Referral)
    useEffect(() => {
        // Prevent double tracking in React Strict Mode for the same URL params
        const ref = searchParams?.get('ref');
        const wishlink = searchParams?.get('wishlink');
        const wl = searchParams?.get('wl');
        const subId1 = searchParams?.get('subId1');
        const source = searchParams?.get('source');

        let referralId = null;

        if (ref) {
            referralId = ref;
        } else if (wishlink) {
            referralId = wishlink;
        } else if (wl) {
            referralId = wl;
        } else if (subId1) {
            referralId = subId1;
        } else if (source) {
            referralId = source;
        }

        if (referralId) {
            // Store in localStorage so it persists until checkout
            localStorage.setItem('referralCode', referralId);

            // Register the click using the server action
            trackReferralClick(referralId).catch(console.error);
        }
    }, [searchParams]);

    // 2. Address Bar Referral Appender for Partners
    useEffect(() => {
        if (user?.unsafeMetadata?.referralCode && typeof window !== "undefined") {
            const refCode = user.unsafeMetadata.referralCode as string;
            const currentParams = new URLSearchParams(window.location.search);
            
            // Only set if not already present or matching
            if (currentParams.get('ref') !== refCode) {
                currentParams.set('ref', refCode);
                const queryStr = currentParams.toString();
                const newUrl = `${pathname}${queryStr ? `?${queryStr}` : ""}`;
                
                // Update address bar dynamically without re-rendering or reloading
                window.history.replaceState(
                    { ...window.history.state, as: newUrl, url: newUrl }, 
                    '', 
                    newUrl
                );
            }
        }
    }, [user, pathname, searchParams]);

    return null; // Invisible component
}
