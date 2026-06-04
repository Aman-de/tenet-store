"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingModal() {
    const { user, isLoaded } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        houseNumber: "",
        street: "",
        city: "",
        zip: ""
    });

    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (isLoaded && user) {
            // Check if user has completed onboarding
            if (!user.unsafeMetadata?.onboardingComplete) {
                setIsOpen(true);
                // Pre-fill known data
                setFormData(prev => ({
                    ...prev,
                    name: user.fullName || "",
                    phone: user.primaryPhoneNumber?.phoneNumber || ""
                }));
                // Auto trigger GPS
                handleAutoLocate();
            }
        }
    }, [isLoaded, user]);

    const handleAutoLocate = () => {
        if (!navigator.geolocation) return;

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`);
                if (!res.ok) throw new Error("Network error");
                
                const data = await res.json();
                if (data && !data.error) {
                    const addr = data.address || {};
                    let street = addr.road || addr.pedestrian || addr.residential || addr.neighbourhood || addr.suburb || addr.hamlet || "";
                    let city = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state || "";
                    let zip = addr.postcode || "";

                    if (!street && data.display_name) {
                        const parts = data.display_name.split(',').map((s: any) => s.trim());
                        street = parts.slice(0, 2).join(', ');
                        if (!city && parts.length >= 3) {
                            city = parts[parts.length - 3];
                        }
                    }

                    setFormData(prev => ({
                        ...prev,
                        street: street || data.display_name || "",
                        city: city,
                        zip: zip
                    }));
                }
            } catch (error) {
                console.error("Auto-locate failed", error);
            } finally {
                setIsLocating(false);
            }
        }, () => setIsLocating(false));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors = {
            name: !formData.name,
            phone: !formData.phone || formData.phone.length < 10,
            houseNumber: !formData.houseNumber,
            street: !formData.street,
            city: !formData.city,
            zip: !formData.zip
        };

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }

        if (!user) return;

        setIsSubmitting(true);
        try {
            await user.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    onboardingComplete: true,
                    address: formData
                }
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("An error occurred while saving your profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-6"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-[#FDFBF7] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 md:p-8 overflow-y-auto flex-1">
                        <h2 className="font-serif text-3xl mb-2">Complete Profile</h2>
                        <p className="text-neutral-500 text-sm mb-8">
                            Please provide your delivery details. We'll securely save this to your account for lightning-fast checkout.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            setErrors({ ...errors, name: false });
                                        }}
                                        className={`w-full border-b py-2 text-sm bg-transparent outline-none transition-colors ${errors.name ? 'border-red-500 text-red-500' : 'border-neutral-300 focus:border-black'}`}
                                        placeholder="Jane Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Mobile Number</label>
                                    <input
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({ ...formData, phone: e.target.value });
                                            setErrors({ ...errors, phone: false });
                                        }}
                                        className={`w-full border-b py-2 text-sm bg-transparent outline-none transition-colors ${errors.phone ? 'border-red-500 text-red-500' : 'border-neutral-300 focus:border-black'}`}
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-200">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Delivery Address</label>
                                    <button
                                        type="button"
                                        onClick={handleAutoLocate}
                                        className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 text-black hover:opacity-70 transition-opacity"
                                    >
                                        {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                                        Auto-Locate
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.houseNumber}
                                            onChange={(e) => {
                                                setFormData({ ...formData, houseNumber: e.target.value });
                                                setErrors({ ...errors, houseNumber: false });
                                            }}
                                            className={`w-full border-b py-2 text-sm bg-transparent outline-none transition-colors ${errors.houseNumber ? 'border-red-500 placeholder:text-red-300' : 'border-neutral-300 focus:border-black placeholder:text-neutral-400'}`}
                                            placeholder="House No. / Building Name / Flat"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.street}
                                            onChange={(e) => {
                                                setFormData({ ...formData, street: e.target.value });
                                                setErrors({ ...errors, street: false });
                                            }}
                                            className={`w-full border-b py-2 text-sm bg-transparent outline-none transition-colors ${errors.street ? 'border-red-500 placeholder:text-red-300' : 'border-neutral-300 focus:border-black placeholder:text-neutral-400'}`}
                                            placeholder="Street / Neighborhood / Landmark"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, city: e.target.value });
                                                    setErrors({ ...errors, city: false });
                                                }}
                                                className={`w-full border-b py-2 text-sm bg-transparent outline-none transition-colors ${errors.city ? 'border-red-500 placeholder:text-red-300' : 'border-neutral-300 focus:border-black placeholder:text-neutral-400'}`}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={formData.zip}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, zip: e.target.value });
                                                    setErrors({ ...errors, zip: false });
                                                }}
                                                className={`w-full border-b py-2 text-sm bg-transparent outline-none transition-colors ${errors.zip ? 'border-red-500 placeholder:text-red-300' : 'border-neutral-300 focus:border-black placeholder:text-neutral-400'}`}
                                                placeholder="ZIP Code"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div className="p-6 bg-white border-t border-neutral-100 shrink-0">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-[#1A1A1A] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-black transition-colors rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving Profile..." : "Save & Continue"}
                            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
