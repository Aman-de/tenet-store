"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Copy } from "lucide-react";

import posthog from "posthog-js";

const segments = [
    { label: "5% Discount", color: "#E8E3DF", code: "TENET5" },
    { label: "10% Discount", color: "#D4CFCC", code: "TENET10" },
    { label: "Free Shipping", color: "#E8E3DF", code: "FREESHIP" },
    { label: "15% Discount", color: "#D4CFCC", code: "TENET15" },
    { label: "INR 100 Off", color: "#E8E3DF", code: "SAVE100" },
    { label: "INR 200 Off", color: "#D4CFCC", code: "SAVE200" },
    { label: "5% Discount", color: "#E8E3DF", code: "TENET5" },
    { label: "10% Discount", color: "#D4CFCC", code: "TENET10" },
];

export default function SpinWheelPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinRotation, setSpinRotation] = useState(0);
    const [wonSegment, setWonSegment] = useState<any>(null);
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [locationData, setLocationData] = useState<{ city?: string, region?: string, country?: string } | null>(null);

    // Fetch location silently in background
    useEffect(() => {
        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => {
                if (data && data.city) {
                    setLocationData({
                        city: data.city,
                        region: data.region,
                        country: data.country_name
                    });
                }
            })
            .catch(() => {
                // Silently ignore if blocked by adblockers
            });
    }, []);

    // Remove auto-open entirely as requested

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCopy = () => {
        if (wonSegment?.code) {
            navigator.clipboard.writeText(wonSegment.code);
            alert(`Code ${wonSegment.code} copied to clipboard!`);
            setIsOpen(false);
        }
    };

    const handleSpin = () => {
        if (phone.length !== 10 || isNaN(Number(phone))) {
            setError("Enter a valid 10-digit mobile number.");
            return;
        }
        
        setError("");
        setIsSpinning(true);
        
        // Store in localStorage for prefilling checkout
        localStorage.setItem("spinWheelPhone", phone);
        if (locationData?.city) {
            localStorage.setItem("spinWheelCity", locationData.city);
        }

        posthog.capture("spin_wheel_lead", {
            phone: phone,
            city: locationData?.city || "Unknown",
            region: locationData?.region || "Unknown",
            country: locationData?.country || "Unknown"
        });

        // Rig the wheel to land on "15% Discount" (index 3 now based on the new segments array)
        const targetIndex = 3; 
        
        // Calculate degrees
        const segmentDegrees = 360 / segments.length;
        
        // Calculate the exact rotation needed to land on the center of target index
        // Since CSS rotation is clockwise and 0deg is top. 
        // We want the target segment to land at the TOP (0deg).
        // Each segment takes up segmentDegrees. The center of segment i is at (i * segmentDegrees) + (segmentDegrees / 2)
        const targetAngle = (targetIndex * segmentDegrees) + (segmentDegrees / 2);
        
        // We need to rotate BY: 360 - targetAngle + (multiple spins)
        const extraSpins = 5 * 360; 
        const finalRotation = spinRotation + extraSpins + (360 - targetAngle);

        setSpinRotation(finalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setWonSegment(segments[targetIndex]);
            localStorage.setItem("hasSeenSpinWheel", "true");
        }, 5000); // 5s animation
    };

    return (
        <AnimatePresence>
            {!isOpen && !wonSegment && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 lg:bottom-6 left-4 lg:left-6 z-40 w-10 h-10 lg:w-11 lg:h-11 bg-[#1A1A1A]/85 hover:bg-[#1A1A1A] text-white/90 hover:text-white rounded-full flex items-center justify-center shadow-md cursor-pointer border border-white/10 opacity-80 hover:opacity-100 transition-all duration-200"
                >
                    <Gift className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                </motion.div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 lg:p-8 z-10 border border-neutral-100 dark:border-neutral-900"
                    >
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors z-20"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {!wonSegment ? (
                            <>
                                {/* Wheel Section */}
                                <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-6 mt-4">
                                    {/* The Wheel */}
                                    <div 
                                        className="w-full h-full rounded-full border-[10px] border-[#1A1A1A] relative overflow-hidden transition-transform shadow-lg"
                                        style={{ 
                                            transform: `rotate(${spinRotation}deg)`,
                                            transitionDuration: isSpinning ? '5s' : '0s',
                                            transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                                        }}
                                    >
                                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                            {segments.map((seg, i) => {
                                                // 8 segments -> 45deg each
                                                const angle = 360 / segments.length;
                                                const strokeWidth = 50 * Math.PI * (angle / 180); // approx logic for circumference
                                                // Actually, simpler to just draw path wedges.
                                                
                                                // Calculate SVG arc path for a wedge of 45 degrees
                                                const a1 = (i * angle) * (Math.PI / 180);
                                                const a2 = ((i + 1) * angle) * (Math.PI / 180);
                                                
                                                const x1 = 50 + 50 * Math.cos(a1);
                                                const y1 = 50 + 50 * Math.sin(a1);
                                                const x2 = 50 + 50 * Math.cos(a2);
                                                const y2 = 50 + 50 * Math.sin(a2);

                                                return (
                                                    <g key={i}>
                                                        <path 
                                                            d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} 
                                                            fill={seg.color}
                                                        />
                                                        {/* Text rotation */}
                                                        <text 
                                                            x="80" 
                                                            y="50" 
                                                            fill="#111" 
                                                            fontSize="4.5" 
                                                            fontWeight="bold"
                                                            fontFamily="sans-serif"
                                                            transform={`rotate(${i * angle + angle / 2}, 50, 50)`}
                                                            alignmentBaseline="middle"
                                                            textAnchor="middle"
                                                        >
                                                            {seg.label}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </div>
                                    
                                    {/* Center Dot & Pointer */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[8px] z-10 drop-shadow-md">
                                        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 32C12 32 0 16.4772 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 16.4772 12 32 12 32Z" fill="#1A1A1A"/>
                                        </svg>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1A1A] rounded-full shadow-inner border-4 border-white z-10" />
                                </div>

                                <div className="text-center mb-6">
                                    <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-[#F4F1ED] mb-1">Spin and Get Rewarded</h2>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Ready to test your luck?</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider pl-1">Enter your mobile number *</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:border-[#1A1A1A] dark:focus:border-white text-sm text-black dark:text-[#F4F1ED] bg-white dark:bg-[#111111]"
                                        />
                                        {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
                                    </div>
                                    <button
                                        onClick={handleSpin}
                                        disabled={isSpinning}
                                        className="w-full mt-2 bg-[#1A1A1A] hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-[#1A1A1A] py-3.5 rounded-md font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-70"
                                    >
                                        {isSpinning ? "SPINNING..." : "TRY YOUR LUCK"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl mb-2 shadow-sm">
                                    🎉
                                </div>
                                <h2 className="font-serif text-3xl font-bold text-neutral-900 dark:text-[#F4F1ED]">You Won!</h2>
                                <p className="text-neutral-600 dark:text-neutral-300 font-medium">{wonSegment.label}</p>
                                
                                <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 border-dashed w-full">
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">Your Coupon Code</p>
                                    <p className="text-2xl font-black text-[#1A1A1A] dark:text-[#F4F1ED] tracking-widest">{wonSegment.code}</p>
                                </div>

                                <button
                                    onClick={handleCopy}
                                    className="w-full mt-6 bg-[#1A1A1A] hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-[#1A1A1A] py-3.5 rounded-md font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Code & Shop
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
