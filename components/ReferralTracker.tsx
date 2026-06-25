"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackReferralClick } from "@/app/actions";

export default function ReferralTracker() {
    const searchParams = useSearchParams();
    const hasTracked = useRef(false);

    useEffect(() => {
        // Prevent double tracking in React Strict Mode
        if (hasTracked.current) return;

        const ref = searchParams?.get('ref');
        const source = searchParams?.get('source');
        const subId1 = searchParams?.get('subId1');

        let referralId = null;

        // Try standard ?ref=XYZ
        if (ref) {
            referralId = ref;
        } 
        // Wishlink uses ?subId1=wl_xyz
        else if (subId1 && subId1.startsWith('wl_')) {
            referralId = subId1;
        }
        // Fallback for custom campaigns
        else if (source) {
            referralId = source;
        }

        if (referralId) {
            hasTracked.current = true;
            
            // 1. Store in localStorage so it persists until checkout
            localStorage.setItem('referralCode', referralId);

            // 2. Register the click using the server action
            trackReferralClick(referralId).catch(console.error);
        }
    }, [searchParams]);

    return null; // Invisible component
}
