"use client";

import { useStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle, Heart, Ruler, Star, Loader2, Truck, ShieldCheck, RefreshCw, ShoppingBag, Check, Copy, MapPin, Tag, Sparkles, CreditCard, Plus } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
const SizeGuide = dynamic(() => import("./SizeGuide"), { ssr: false });
import ShareButton from "./ShareButton";
import MobileStickyBar from "./MobileStickyBar";
import TrustBar from "./TrustBar";
import { Product, Review, Variant } from "@/lib/data";
import { createReview, checkUserOrderHistory } from "@/app/actions";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { useUser } from "@clerk/nextjs";
import useEmblaCarousel from "embla-carousel-react";
import { useGender } from "@/context/GenderContext";
import posthog from "posthog-js";

const FAST_CITIES = [
    'mumbai', 'delhi', 'new delhi', 'bangalore', 'bengaluru', 'hyderabad', 'ahmedabad', 
    'chennai', 'kolkata', 'surat', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri-chinchwad', 'patna', 'vadodara', 
    'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan-dombivli', 
    'vasai-virar', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 
    'allahabad', 'howrah', 'ranchi', 'gwalior', 'jabalpur', 'coimbatore', 'vijayawada', 
    'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur'
];

const getDeliveryDays = (city: string) => {
    if (!city) return 4;
    const normalizedCity = city.trim().toLowerCase();
    if (FAST_CITIES.includes(normalizedCity)) {
        return 2;
    }
    return 4;
};

interface ProductDetailsProps {
    product: Product;
    reviews?: Review[];
}

// Review Form Component
const ReviewForm = ({ productId, onCancel }: { productId: string, onCancel: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { gender } = useGender();
    const isWoman = gender === "woman";
    const accentColor = "var(--accent-color)";

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);

        const result = await createReview(productId, formData);

        setIsSubmitting(false);
        if (result.success) {
            setMessage("Thank you! Your review is pending approval.");
            // Reset form or close after delay?
            setTimeout(onCancel, 2000);
        } else {
            setMessage(result.message || "Something went wrong.");
        }
    }

    return (
        <form action={handleSubmit} className="bg-neutral-50/70 p-6 rounded-2xl border border-neutral-100/80 shadow-sm space-y-4 mt-6 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-serif text-lg text-[#1A1A1A] dark:text-[#F4F1ED] font-medium">Write a Review</h3>
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Name</label>
                <input 
                    required 
                    name="name" 
                    className="w-full p-3 border border-neutral-200 dark:border-neutral-800 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm rounded-xl transition-all bg-white dark:bg-[#111111]" 
                    style={{ '--accent-color': accentColor } as React.CSSProperties}
                    placeholder="Your name" 
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Rating</label>
                <select 
                    required 
                    name="rating" 
                    className="w-full p-3 border border-neutral-200 dark:border-neutral-800 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm bg-white dark:bg-[#111111] rounded-xl transition-all cursor-pointer" 
                    style={{ '--accent-color': accentColor } as React.CSSProperties}
                >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Comment</label>
                <textarea 
                    required 
                    name="comment" 
                    rows={3} 
                    className="w-full p-3 border border-neutral-200 dark:border-neutral-800 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm rounded-xl transition-all bg-white dark:bg-[#111111]" 
                    style={{ '--accent-color': accentColor } as React.CSSProperties}
                    placeholder="Share your thoughts..." 
                />
            </div>

            {message && (
                <p className={cn("text-xs font-semibold mt-2", message.includes("Thank you") ? "text-green-700" : "text-red-600")}>
                    {message}
                </p>
            )}

            <div className="flex gap-2 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 text-white py-3 text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl active:scale-95 transition-all font-bold shadow-sm"
                    style={{ backgroundColor: accentColor }}
                >
                    {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                    Submit Review
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 border border-neutral-200 dark:border-neutral-800 text-[#1A1A1A] dark:text-[#F4F1ED] text-xs uppercase tracking-widest hover:bg-neutral-100/50 rounded-xl transition-all active:scale-95"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

const SOCIAL_PROOF_TAGS = [
    {
        type: 'rating',
        icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500" />,
        bgIcon: 'bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30',
        title: '4.8 Rating',
        subtitle: 'Based on 127 reviews'
    },
    {
        type: 'customers',
        icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />,
        bgIcon: 'bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30',
        title: '10,000+ Customers',
        subtitle: 'Bespoke tailoring'
    },
    {
        type: 'quality',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />,
        bgIcon: 'bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30',
        title: 'Premium Quality',
        subtitle: 'Hand-finished detailing'
    },
    {
        type: 'exclusive',
        icon: <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />,
        bgIcon: 'bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30',
        title: 'Limited Edition',
        subtitle: 'Exclusively crafted'
    }
];

interface PurchaseEvent {
    name: string;
    city: string;
    timestamp: number; // Date.now() representation of purchase time
}

const FEMALE_NAMES = ["Priya", "Ananya", "Sneha", "Meera", "Aditi", "Kiara", "Riya", "Kriti", "Pooja", "Nisha", "Ishita", "Aanya", "Diya", "Tanvi", "Kavya", "Avani", "Shruti", "Riddhi", "Aisha", "Myra", "Zara"];
const MALE_NAMES = ["Rohan", "Arjun", "Kabir", "Ishaan", "Dev", "Aarav", "Rahul", "Amit", "Vikram", "Aditya", "Sidharth", "Neil", "Reyansh", "Vihaan", "Vivaan", "Shaurya", "Yash", "Kunal", "Aryan"];
const ALL_NAMES = [...FEMALE_NAMES, ...MALE_NAMES];

const PATRON_CITIES = ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Noida", "Gurugram", "Chandigarh", "Kochi", "Lucknow", "Indore", "Surat", "Vadodara", "Goa", "Dehradun"];

const generateRandomPurchase = (gender?: string): PurchaseEvent => {
    let nameList = ALL_NAMES;
    if (gender === "woman") {
        nameList = FEMALE_NAMES;
    } else if (gender === "man") {
        nameList = MALE_NAMES;
    }
    const name = nameList[Math.floor(Math.random() * nameList.length)];
    const city = PATRON_CITIES[Math.floor(Math.random() * PATRON_CITIES.length)];
    
    // Choose a random starting offset in seconds:
    const rand = Math.random();
    let offsetMs = 0;
    if (rand < 0.5) {
        // Recent: 10 seconds to 10 minutes (10s to 600s)
        offsetMs = (10 + Math.floor(Math.random() * 590)) * 1000;
    } else if (rand < 0.85) {
        // Medium: 10 minutes to 3 hours (600s to 10800s)
        offsetMs = (600 + Math.floor(Math.random() * 10200)) * 1000;
    } else {
        // Older: 3 hours to 12 hours (10800s to 43200s)
        offsetMs = (10800 + Math.floor(Math.random() * 32400)) * 1000;
    }

    return {
        name,
        city,
        timestamp: Date.now() - offsetMs
    };
};

const formatRelativeTime = (timestamp: number, now: number) => {
    const diffMs = now - timestamp;
    const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
    
    if (diffSecs < 5) {
        return "just now";
    }
    if (diffSecs < 60) {
        return `${diffSecs} seconds ago`;
    }
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) {
        return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }
    
    return "1 day ago";
};

const DynamicSocialProof = ({ gender }: { gender?: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPurchase, setCurrentPurchase] = useState<PurchaseEvent>(() => generateRandomPurchase(gender));
    const [now, setNow] = useState(Date.now());

    // Update 'now' timestamp every second to drive the relative time counter
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Cycle through indices: 0 to 4
    useEffect(() => {
        const cycleTimer = setInterval(() => {
            setCurrentIndex((prev) => {
                const nextIndex = (prev + 1) % 5;
                if (nextIndex === 4) {
                    // Generate a new purchase event when transitioning to index 4
                    setCurrentPurchase(generateRandomPurchase(gender));
                }
                return nextIndex;
            });
        }, 8000); // 8 seconds cycle time is more engaging than 12s
        return () => clearInterval(cycleTimer);
    }, [gender]);

    const getTag = () => {
        if (currentIndex < 4) {
            return SOCIAL_PROOF_TAGS[currentIndex];
        }
        
        // Return purchase tag with dynamic time string computed live
        const timeStr = formatRelativeTime(currentPurchase.timestamp, now);
        return {
            type: 'purchase',
            icon: <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
            bgIcon: 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30',
            title: `${currentPurchase.name} from ${currentPurchase.city}`,
            subtitle: `Bought it ${timeStr}`
        };
    };

    const currentTag = getTag();

    return (
        <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 z-20 flex justify-start">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex === 3 ? `purchase-${currentPurchase.timestamp}` : currentIndex}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xl border border-neutral-200/50 dark:border-white/10 px-3 py-2 shadow-[0_8px_16px_rgba(0,0,0,0.12)] rounded-2xl flex items-center gap-2"
                >
                    <div className="relative flex items-center gap-2.5">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 relative", currentTag.bgIcon)}>
                            {currentTag.icon}
                            {currentTag.type === 'purchase' && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col leading-tight pr-1">
                            <span className="text-[10px] font-bold text-[#1A1A1A] dark:text-[#F4F1ED] tracking-wide">{currentTag.title}</span>
                            <span className="text-[8.5px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">{currentTag.subtitle}</span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default function ProductDetails({ product, reviews = [] }: ProductDetailsProps) {
    const { addToCart, openCart, toggleWishlist, isInWishlist, setCheckoutItem, trackEngagement } = useStore();
    const { gender } = useGender();
    const targetGender = product.gender ? product.gender.toLowerCase() : gender;
    const isWoman = targetGender === "woman" || (targetGender === "unisex" && gender === "woman");
    const accentColor = "var(--accent-color)";
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Variant Logic
    const hasVariants = product.variants && product.variants.length > 0;
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(hasVariants ? product.variants![0] : undefined);

    const isProgrammaticRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedPiece, setSelectedPiece] = useState<'top' | 'bottom' | 'set'>('set');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    // Desktop Sticky Buy Bar Scroll State removed as per user feedback
    
    // Derived State
    let currentImages = (selectedVariant ? selectedVariant.images : product.images)?.filter(Boolean);
    
    let activeTopImages = product.topImages?.filter(Boolean) || [];
    let activeBottomImages = product.bottomImages?.filter(Boolean) || [];

    const collectionTitle = product.title || "The Product";

    if (selectedPiece === 'top' && activeTopImages.length > 0) {
        currentImages = activeTopImages;
    } else if (selectedPiece === 'bottom' && activeBottomImages.length > 0) {
        currentImages = activeBottomImages;
    }

    // Fallback: If variant has no images, use product default images to prevent crash
    const rawImages = currentImages && currentImages.length > 0 ? currentImages : product.images.filter(Boolean);
    const baseImages = [...rawImages].reverse();
    const displayImages = [...baseImages].slice(0, 8);

    // Component Pricing & Titles overrides
    let displayPrice = product.price;
    let displayOriginalPrice = product.originalPrice;
    let displayTitle = product.title;

    if (product.enableSetComponents) {
        if (selectedPiece === 'top') {
            displayPrice = product.topPrice ?? product.price;
            displayOriginalPrice = product.topOriginalPrice ?? product.originalPrice;
            displayTitle = product.topName || "Top Only";
        } else if (selectedPiece === 'bottom') {
            displayPrice = product.bottomPrice ?? product.price;
            displayOriginalPrice = product.bottomOriginalPrice ?? product.originalPrice;
            displayTitle = product.bottomName || "Bottom Only";
        } else if (selectedPiece === 'set') {
            displayPrice = product.setPrice ?? product.price;
            displayOriginalPrice = product.setOriginalPrice ?? product.originalPrice;
            displayTitle = product.title;
        }
    }
    // If variants exist, use variant color. Else fallback to product.colors
    // Actually, distinct colors might be flat in data vs variants. 
    // Let's assume selecting a variant sets the "color".
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [isMainImgLoading, setIsMainImgLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    const [loadedThumbnails, setLoadedThumbnails] = useState<Record<number, boolean>>({});
    const [viewers, setViewers] = useState(12);

    useEffect(() => {
        // Simulates real-time browser session counts randomly
        const interval = setInterval(() => {
            setViewers(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const next = prev + change;
                return next >= 8 && next <= 18 ? next : prev;
            });
        }, 9000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setIsMainImgLoading(true);
    }, [selectedVariant?.colorName, selectedImageIndex]);
    
    // Pincode State
    const { user, isLoaded } = useUser();
    const [pincode, setPincode] = useState("");
    const [isEligibleForFirst20, setIsEligibleForFirst20] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isLoaded) return;
        if (!user) {
            setIsEligibleForFirst20(true);
            return;
        }
        const email = user.primaryEmailAddress?.emailAddress;
        if (email) {
            checkUserOrderHistory(email).then((res) => {
                setIsEligibleForFirst20(!res.hasOrders);
            }).catch((err) => {
                console.error("Failed to check user orders:", err);
                setIsEligibleForFirst20(true);
            });
        } else {
            setIsEligibleForFirst20(true);
        }
    }, [user, isLoaded]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText("FIRST20");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const [deliveryInfo, setDeliveryInfo] = useState<{ date: string, free: boolean, city?: string } | null>(null);
    const [pincodeError, setPincodeError] = useState<string | null>(null);

    const handleCheckPincode = async (code: string) => {
        setPincodeError(null);
        setDeliveryInfo(null);
        
        const TIER_1_CITIES = new Set([
            "delhi", "new delhi", "mumbai", "mumbai suburban", "bangalore", "bengaluru", 
            "hyderabad", "chennai", "kolkata", "pune", "ahmedabad"
        ]);

        const TIER_2_CITIES = new Set([
            "chandigarh", "lucknow", "jaipur", "bhopal", "indore", "patna", "ranchi", 
            "bhubaneswar", "nagpur", "surat", "vadodara", "kochi", "coimbatore", 
            "madurai", "visakhapatnam", "mysore", "dehradun", "ludhiana", "agra", 
            "varanasi", "kanpur", "ghaziabad", "noida", "gurugram", "gurgaon", 
            "faridabad", "thane", "navi mumbai", "nashik", "aurangabad", "solapur", 
            "jabalpur", "gwalior", "raipur", "jodhpur", "kota", "guwahati"
        ]);

        if (code.length === 6) {
            if (!/^[1-9][0-9]{5}$/.test(code)) {
                setPincodeError("Oops, we don't deliver to this pincode or it is invalid.");
                return;
            }

            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
                const data = await res.json();
                
                if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
                    const city = data[0].PostOffice[0].District || data[0].PostOffice[0].Block || "your location";
                    
                    setDeliveryInfo({ 
                        date: `Get it in 10 days in ${city}`, 
                        free: true,
                        city: city
                    });
                } else {
                    setPincodeError("Oops, we don't deliver to this pincode or it is invalid.");
                }
            } catch (err) {
                const prefix2 = code.slice(0, 2);
                let dateText = "";
                if (["11", "40", "56", "50", "60", "70"].includes(prefix2)) {
                    dateText = `Get it by tomorrow, 6 PM`;
                } else {
                    dateText = `Get it in 3 days`;
                }
                setDeliveryInfo({ 
                    date: dateText, 
                    free: true 
                });
            }
        }
    };

    useEffect(() => {
        if (user && user.primaryEmailAddress) {
            setPincode("110001");
            handleCheckPincode("110001");
        }
    }, [user]);

    const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setPincode(value);
        if (value.length === 6) {
            handleCheckPincode(value);
        } else {
            setDeliveryInfo(null);
            setPincodeError(null);
        }
    };

    // Embla Carousel Setup
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", () => {
            setSelectedImageIndex(emblaApi.selectedScrollSnap());
        });
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        if (selectedImageIndex !== emblaApi.selectedScrollSnap()) {
            emblaApi.scrollTo(selectedImageIndex);
        }
    }, [selectedImageIndex, emblaApi]);

    // Reset image index when variant changes, piece changes, or images update
    useEffect(() => {
        const targetIdx = displayImages.length > 1 ? 1 : 0;
        setSelectedImageIndex(targetIdx);
        if (emblaApi) {
            emblaApi.scrollTo(targetIdx, true);
        }
    }, [selectedVariant?.colorName, selectedPiece, displayImages.length, emblaApi]);

    const scrollToIndex = (idx: number) => {
        setSelectedImageIndex(idx);
        if (emblaApi) emblaApi.scrollTo(idx);
    };

    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    // GA4 View Item Tracking & Smart Feed Engagement
    useEffect(() => {
        if (product) {
            trackViewItem(product);
            
            // Smart Feed Engagement: Immediate View (+1)
            const category = product.category || 'general';
            trackEngagement(category, 1);
            
            // Smart Feed Engagement: Retention > 5s (+3)
            const timer = setTimeout(() => {
                trackEngagement(category, 3);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [product.id, product.category, trackEngagement]);

    const isWishlisted = mounted ? isInWishlist(product.id) : false;
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
    const showSizeSelector = product.sizeType !== 'onesize';

    // Accordion Component
    const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        return (
            <div className="border-b border-neutral-200/60">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-3 flex items-center justify-between text-left focus:outline-none group"
                >
                    <span className="font-serif text-base xs:text-[17px] font-medium text-[#1A1A1A] dark:text-[#F4F1ED] group-hover:text-neutral-600 transition-colors">{title}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pb-3 text-[13px] font-sans text-neutral-500 leading-relaxed">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    const validateSelection = () => {
        // Size Check
        if (showSizeSelector && !selectedSize) {
            setError("Please select a size.");
            if (typeof window !== "undefined") {
                setTimeout(() => {
                    const element = document.getElementById("size-selector-section");
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                    } else {
                        window.scrollTo({ top: 380, behavior: "smooth" });
                    }
                }, 100);
            }
            return null;
        }

        setError(null);

        // Construct selected attributes
        const colorToSave = selectedVariant ? selectedVariant.colorHex : product.colors?.[0]; // Fallback

        return {
            size: selectedSize || "One Size",
            color: colorToSave
        };
    };

    const handleAddToCart = () => {
        if (product.isOutOfStock) return;
        const selection = validateSelection();
        if (selection) {
            addToCart(product, selection.size, selection.color, selectedPiece);
            trackAddToCart(product, 1, selection.size, selection.color);
            openCart();
        }
    }

    let finalTitle = product.title;
    let itemPrice = product.price;
    let itemOriginalPrice = product.originalPrice;

    if (product.enableSetComponents) {
        if (selectedPiece === 'top') {
            finalTitle = `${product.title} (Top Only)`;
            itemPrice = product.topPrice ?? product.price;
            itemOriginalPrice = product.topOriginalPrice ?? product.originalPrice;
        } else if (selectedPiece === 'bottom') {
            finalTitle = `${product.title} (Bottom Only)`;
            itemPrice = product.bottomPrice ?? product.price;
            itemOriginalPrice = product.bottomOriginalPrice ?? product.originalPrice;
        } else if (selectedPiece === 'set') {
            finalTitle = `${product.title} (Set)`;
            itemPrice = product.setPrice ?? product.price;
            itemOriginalPrice = product.setOriginalPrice ?? product.originalPrice;
        }
    }

    const handleBuyNow = () => {
        if (product.isOutOfStock) return;
        const selection = validateSelection();
        if (selection) {
            posthog.capture('buy_now_clicked', {
                product_id: product.id,
                product_name: finalTitle,
                price: itemPrice,
                currency: "INR"
            });
            trackAddToCart(product, 1, selection.size, selection.color);

            let discountLabel = null;
            if (itemOriginalPrice && itemOriginalPrice > itemPrice) {
                discountLabel = `SAVE RS. ${itemOriginalPrice - itemPrice}`;
            }

            setCheckoutItem({
                ...product,
                title: finalTitle,
                price: itemPrice,
                originalPrice: itemOriginalPrice,
                discountLabel,
                quantity: 1,
                selectedSize: selection.size,
                selectedColor: selection.color,
                selectedPiece
            });
            // setCheckoutItem automatically opens cart in store logic
        }
    };

    return (
        <>
            {/* Desktop Sticky Buy Bar removed */}

            <div className="max-w-[2000px] w-full mx-auto px-0 md:px-8 xl:px-12 pt-0 xl:pt-14 grid grid-cols-1 lg:landscape:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-0 lg:landscape:gap-[4vw] xl:gap-[6vw] 2xl:gap-[8vw]">
                <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

            {/* Left Column: Gallery */}
            {/* Mobile/Tablet: Infinite Looping Carousel using Embla */}
            <div className="block lg:landscape:hidden xl:hidden relative w-[calc(100%-16px)] mx-auto mt-2 aspect-[3/4] mb-6 overflow-hidden rounded-[28px] sm:rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.05)] bg-neutral-100 dark:bg-[#111111]" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {displayImages.map((img, idx) => (
                        <div 
                            key={`${selectedPiece}-${idx}`} 
                            className="flex-[0_0_100%] h-full relative bg-neutral-100 dark:bg-[#111111]"
                        >
                            {img ? (
                                <>
                                    {!loadedImages[idx] && (
                                        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-10" />
                                    )}
                                    <Image
                                        src={img}
                                        alt={`${product.title} - View ${idx + 1}`}
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                        priority={idx === 0}
                                        loading={idx === 0 ? "eager" : "lazy"}
                                        quality={idx === 0 ? 85 : 75}
                                        unoptimized={img.startsWith("http")}
                                        onLoad={() => setLoadedImages(prev => ({ ...prev, [idx]: true }))}
                                    />
                                </>
                            ) : (
                                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile Gradient Overlay for better contrast */}
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

                {/* Floating Share Button on Mobile */}
                <div className="absolute top-4 left-4 z-20">
                    <div className="w-9 h-9 rounded-full bg-black/20 dark:bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 transition-all text-white">
                        <ShareButton
                            title={displayTitle}
                            className="text-current w-full h-full flex justify-center items-center"
                            iconSize={16}
                            showText={false}
                        />
                    </div>
                </div>

                {/* Floating Wishlist Button on Mobile */}
                <button
                    onClick={() => toggleWishlist(product as any)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/20 dark:bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 transition-all text-white"
                    title="Add to Wishlist"
                    aria-label="Wishlist"
                >
                    <Heart 
                        className="w-4 h-4 transition-all duration-300"
                        style={isWishlisted ? { fill: accentColor, stroke: accentColor } : { stroke: "currentColor" }} 
                        strokeWidth={2.5} 
                    />
                </button>

                {/* Mobile Image Dots */}
                <div className="absolute bottom-6 right-5 z-20 bg-[#141414]/90 backdrop-blur-xl px-3 py-2 rounded-full border border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.12)] flex items-center justify-center">
                    <div className="flex items-center gap-1.5">
                        {displayImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollToIndex(idx)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    selectedImageIndex === idx 
                                        ? "bg-white w-3.5" 
                                        : "bg-white/40 w-1.5 hover:bg-white/70"
                                )}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Dynamic Social Proof Tag */}

                <DynamicSocialProof gender={targetGender} />
            </div>

            {/* Desktop: Vertical Stack & Thumbnails */}
            <div className="hidden lg:landscape:flex xl:flex gap-6 xl:gap-8 sticky top-24 h-fit max-h-[85vh]">
                {/* Thumbnails */}
                <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar pb-4 pr-1">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIndex(idx)}
                            className={cn(
                                "relative w-20 h-28 lg:w-28 lg:h-36 xl:w-32 xl:h-44 2xl:w-36 2xl:h-48 shrink-0 border transition-all",
                                selectedImageIndex === idx ? "border-[#1A1A1A] opacity-100 ring-1 ring-[#1A1A1A] ring-offset-1" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            {img ? (
                                <div className={cn("w-full h-full relative bg-neutral-100 dark:bg-[#141414]", !loadedThumbnails[idx] && "animate-pulse bg-neutral-200 dark:bg-neutral-800")}>
                                    <Image
                                        src={img}
                                        alt={`Product View ${idx}`}
                                        fill
                                        sizes="144px"
                                        className="object-cover"
                                        loading="lazy"
                                        quality={60}
                                        unoptimized={img.startsWith("http")}
                                        onLoad={() => setLoadedThumbnails(prev => ({ ...prev, [idx]: true }))}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-neutral-100 dark:bg-[#141414]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="relative flex-1 aspect-[3/4] bg-neutral-100 dark:bg-[#141414] overflow-hidden">
                    {isMainImgLoading && (
                        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-10" />
                    )}
                    <motion.div
                        key={`${selectedVariant?.colorName}-${selectedImageIndex}`} // Force re-render on variant change
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full relative"
                    >
                        {displayImages[selectedImageIndex] ? (
                            <Image
                                src={displayImages[selectedImageIndex]}
                                alt={product.title}
                                fill
                                sizes="(max-width: 1280px) 50vw, 40vw"
                                className="object-cover transition-transform duration-700 hover:scale-[1.08] cursor-zoom-in"
                                priority
                                quality={85}
                                unoptimized={displayImages[selectedImageIndex].startsWith("http")}
                                onLoad={() => setIsMainImgLoading(false)}
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-100 dark:bg-[#141414] flex items-center justify-center">
                                <span className="text-neutral-500 text-xs uppercase tracking-widest">No Image</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Floating Share Button on Desktop */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="w-10 h-10 rounded-full bg-white/85 dark:bg-black/80 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white hover:dark:bg-black active:scale-95 transition-all text-[#1A1A1A] dark:text-[#F4F1ED]">
                            <ShareButton
                                title={displayTitle}
                                className="text-current w-full h-full flex justify-center items-center"
                                iconSize={18}
                                showText={false}
                            />
                        </div>
                    </div>

                    {/* Floating Wishlist Button on Desktop */}
                    <button
                        onClick={() => toggleWishlist(product as any)}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/85 dark:bg-black/80 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white hover:dark:bg-black active:scale-95 transition-all text-[#1A1A1A] dark:text-[#F4F1ED]"
                        title="Add to Wishlist"
                        aria-label="Wishlist"
                    >
                        <Heart 
                            className="w-5 h-5 transition-all duration-300"
                            style={isWishlisted ? { fill: accentColor, stroke: accentColor } : { stroke: "currentColor" }} 
                            strokeWidth={2} 
                        />
                    </button>
                    {/* Dynamic Social Proof Tag */}

                    <DynamicSocialProof gender={targetGender} />
            </div>
        </div>

            {/* Right Column: Details */}
            <div className="flex flex-col pt-4 px-4 xs:px-5 sm:px-6 md:px-0 lg:max-w-[480px] xl:max-w-[540px] 2xl:max-w-[600px] w-full">
                {/* Breadcrumb pseudo */}
                <span className="text-[9px] xs:text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-2">{product.category}</span>

                <div className="flex flex-col mb-4">
                    <h1 className="font-serif text-[24px] md:text-[40px] lg:text-[44px] text-[#1A1A1A] dark:text-[#F4F1ED] font-bold leading-[1.2] tracking-tight mb-2.5">
                        {(() => {
                            const raw = displayTitle.toLowerCase() === 'blue denim' 
                                ? 'Signature Denim Trousers' 
                                : displayTitle.toLowerCase() === 'chocolate & denim set' 
                                    ? 'Chocolate Tassel Kurti & Wide-Leg Denim Co-Ord Set' 
                                    : displayTitle;
                            // Title Case capitalization
                            return raw.replace(/\b\w/g, c => c.toUpperCase());
                        })()}
                    </h1>
 
                    {/* Rating & Social Proof */}
                    <div className="flex flex-wrap items-center justify-start gap-2.5 mb-2">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span className="text-[11px] font-bold text-[#1A1A1A] dark:text-[#F4F1ED]">4.8</span>
                        </div>
                        <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-700"></span>
                        <a href="#reviews" className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors cursor-pointer">127 Reviews</a>
                        <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-700"></span>
                        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900/30 flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            Exclusively Crafted • Limited Run
                        </span>
                    </div>


                    <div className="-mx-4 xs:-mx-5 sm:-mx-6 md:mx-0 mt-1 mb-1">
                        <TrustBar />
                    </div>
 
                </div>

                {/* Why You'll Love It */}
                <div className="bg-white/45 dark:bg-black/15 backdrop-blur-sm border border-white/50 dark:border-white/5 rounded-2xl p-5 mb-5 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 opacity-[0.03] dark:opacity-[0.02]">
                        <Sparkles className="w-32 h-32 text-[#1A1A1A] dark:text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400 block mb-4 flex items-center gap-2 relative z-10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Signature details
                    </span>
                    <div className="flex flex-col gap-3.5 relative z-10">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-amber-700 dark:text-amber-400" strokeWidth={3} />
                            </div>
                            <span className="text-[12.5px] font-medium text-neutral-700 dark:text-neutral-300 leading-snug">Breathable Cotton Blend that keeps you cool</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-amber-700 dark:text-amber-400" strokeWidth={3} />
                            </div>
                            <span className="text-[12.5px] font-medium text-neutral-700 dark:text-neutral-300 leading-snug">Tailored Straight Silhouette flatters all body types</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-amber-700 dark:text-amber-400" strokeWidth={3} />
                            </div>
                            <span className="text-[12.5px] font-medium text-neutral-700 dark:text-neutral-300 leading-snug">Designed For All-Day Comfort without losing shape</span>
                        </div>
                    </div>
                </div>




                {/* Piece Selector (for Set Components) */}
                {product.enableSetComponents && (
                    <div className="mb-6 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] dark:text-[#F4F1ED] block mb-3">Choose Option</span>
                        <div className="grid grid-cols-3 gap-3 pb-1">
                            {(['set', 'top', 'bottom'] as const).map((piece) => {
                                let label = "Full Set";
                                let priceVal = product.setPrice ?? product.price;
                                let pieceImage = product.images[0];
                                
                                if (piece === 'top') {
                                    label = product.topName || "Top Only";
                                    priceVal = product.topPrice ?? product.price;
                                    if (activeTopImages && activeTopImages.length > 0) {
                                        pieceImage = activeTopImages[0];
                                    } else if (product.topImages && product.topImages[0]) {
                                        pieceImage = product.topImages[0];
                                    }
                                } else if (piece === 'bottom') {
                                    label = product.bottomName || "Bottom Only";
                                    priceVal = product.bottomPrice ?? product.price;
                                    if (activeBottomImages && activeBottomImages.length > 0) {
                                        pieceImage = activeBottomImages[0];
                                    } else if (product.bottomImages && product.bottomImages[0]) {
                                        pieceImage = product.bottomImages[0];
                                    }
                                }

                                const isSelected = selectedPiece === piece;
                                
                                // Proper Title Case Formatting
                                const formattedLabel = label.split(' ')
                                    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                                    .join(' ');

                                return (
                                    <button
                                        key={piece}
                                        onClick={() => setSelectedPiece(piece)}
                                        className={cn(
                                            "group flex flex-col gap-2 p-1.5 rounded-2xl transition-all cursor-pointer w-full items-center text-center relative",
                                        isSelected 
                                                ? "ring-[1.5px] ring-[#1A1A1A] dark:ring-white bg-white/70 dark:bg-white/5 shadow-[0_8px_20px_rgba(0,0,0,0.06)]" 
                                                : "border border-neutral-200/60 dark:border-white/5 opacity-80 hover:opacity-100 bg-white/30 dark:bg-black/10 hover:bg-white/50 dark:hover:bg-black/25"
                                        )}
                                    >
                                        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#111] shrink-0 border border-neutral-100 dark:border-white/5">
                                            {pieceImage ? (
                                                <Image src={pieceImage} alt={label} fill sizes="(max-width: 768px) 25vw, 120px" loading="lazy" quality={70} unoptimized={pieceImage.startsWith("http")} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                                            )}
                                            
                                            {/* Active check indicator overlay */}
                                            {isSelected && (
                                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#1A1A1A] dark:bg-[#F4F1ED] text-white dark:text-black flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-10">
                                                    <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col w-full px-0.5 pb-1">
                                            <span className={cn("text-[9px] xs:text-[10px] leading-tight truncate transition-all uppercase tracking-wider font-bold", isSelected ? "text-[#1A1A1A] dark:text-[#F4F1ED]" : "text-neutral-500 dark:text-neutral-400")}>
                                                {formattedLabel}
                                            </span>
                                            <span className="text-[10px] xs:text-[11px] font-sans font-bold text-neutral-800 dark:text-[#F4F1ED] mt-0.5">₹{priceVal.toLocaleString('en-IN')}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Color Selector (Variants) */}
                {hasVariants ? (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Selected Color</span>
                            <span className="text-xs font-serif text-[#1A1A1A] dark:text-[#F4F1ED]">{selectedVariant?.colorName}</span>
                        </div>
                        <div className="flex gap-3">
                            {product.variants!.map((variant) => (
                                <button
                                    key={variant.colorName}
                                    onClick={() => setSelectedVariant(variant)}
                                    className="w-8 h-8 rounded-full border border-neutral-200/50 transition-all relative hover:scale-105 active:scale-95 cursor-pointer"
                                    style={{ 
                                        backgroundColor: variant.colorHex,
                                        boxShadow: selectedVariant?.colorName === variant.colorName 
                                            ? `0 0 0 2px #FDFBF7, 0 0 0 3.5px ${accentColor}` 
                                            : undefined 
                                    }}
                                    title={variant.colorName}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Legacy Colors Fallback */
                    <div className="mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Color</span>
                        <div className="flex gap-3">
                            {product.colors && product.colors.map((color) => (
                                <div
                                    key={color}
                                    className="w-8 h-8 rounded-full border border-neutral-200/50"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selector */}
                {showSizeSelector && (
                    <div id="size-selector-section" className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED]">Select Size</span>
                                <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400">| Model is 5'8" wearing M</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-xs text-red-600 flex items-center gap-1 font-semibold"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {error}
                                    </motion.div>
                                )}
                                <button
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border-b border-neutral-300 pb-0.5 hover:opacity-70 transition-opacity cursor-pointer text-neutral-600 dark:text-neutral-400"
                                >
                                    <Ruler className="w-3 h-3" />
                                    Size Guide
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap mb-4">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => { setSelectedSize(size); setError(null); }}
                                    className={cn(
                                        "w-11 h-11 border rounded-lg flex items-center justify-center font-sans text-xs font-medium tracking-wide transition-all duration-300 bg-white dark:bg-[#111111] cursor-pointer active:scale-90",
                                        selectedSize === size
                                            ? "text-white shadow-md scale-110 border-transparent"
                                            : error
                                                ? "border-red-300 text-red-600 bg-red-50 hover:border-red-500"
                                                : "border-neutral-200 dark:border-neutral-800 text-[#1A1A1A] dark:text-[#F4F1ED] hover:border-[#1A1A1A] dark:hover:border-[#F4F1ED] hover:bg-neutral-50 dark:hover:bg-neutral-900"
                                    )}
                                    style={selectedSize === size ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        
                        {/* Size Scarcity Indicator */}
                        {selectedSize && !error && (
                            <div className="text-[11px] font-medium text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                Only {selectedSize === 'S' || selectedSize === 'M' ? 2 : 4} left in {selectedSize}
                            </div>
                        )}
                    </div>
                )}

                {/* Pincode Check (Moved Down below Size) */}
                <div className="mb-6 bg-neutral-50 dark:bg-[#111111] border border-neutral-100/80 dark:border-white/5 p-4 rounded-xl shadow-sm flex items-start gap-3">
                    <div className="flex-1 w-full flex flex-col gap-2 relative">
                        <div className="text-[13px] font-bold text-[#1A1A1A] dark:text-[#F4F1ED]">📍 Deliver to</div>
                        
                        <div className="flex w-full gap-2 relative z-10 mt-1 bg-white dark:bg-[#141414] border border-neutral-200/80 dark:border-white/10 rounded-xl overflow-hidden focus-within:border-[#1A1A1A] dark:focus-within:border-[#F4F1ED] transition-colors p-1 shadow-sm">
                            <input 
                                type="text" 
                                placeholder="Enter Pincode" 
                                value={pincode}
                                onChange={handlePincodeChange}
                                className={cn(
                                    "w-full bg-transparent px-2 py-2 text-[13px] font-medium tracking-wide focus:outline-none text-[#1A1A1A] dark:text-[#F4F1ED] placeholder:text-neutral-400",
                                    pincodeError && "text-red-600 dark:text-red-400"
                                )}
                                maxLength={6}
                            />
                            <button
                                onClick={() => pincode.length === 6 && handleCheckPincode(pincode)}
                                disabled={pincode.length !== 6 || !!deliveryInfo}
                                className={cn(
                                    "shrink-0 px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all shadow-sm",
                                    deliveryInfo 
                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default" 
                                        : "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                {deliveryInfo ? "✓" : "Check"}
                            </button>
                        </div>
                        {pincodeError && (
                            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{pincodeError}</span>
                            </div>
                        )}
                        {deliveryInfo && (
                            <div className="flex flex-col gap-2 mt-2 pt-2">
                                <div className="flex flex-col gap-2 text-xs font-bold text-[#1A1A1A] dark:text-[#F4F1ED]">
                                    <span className="flex items-center gap-2"><span className="text-emerald-600 text-sm">✅</span> Delivered in {deliveryInfo.city || "your location"} in {getDeliveryDays(deliveryInfo.city || "")} days</span>
                                    <span className="flex items-center gap-2"><span className="text-emerald-600 text-sm">✅</span> Easy 10-Day Returns</span>
                                    <span className="flex items-center gap-2"><span className="text-emerald-600 text-sm">✅</span> FREE Shipping (Pay Online)</span>
                                    <span className="flex items-center gap-2"><span className="text-emerald-600 text-sm">✅</span> COD Available (Prepaid shipping)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* PRICING BLOCK (Moved down for Desktop, hidden on Mobile because Sticky CTA handles price) */}
                <div className="hidden md:flex items-center justify-between bg-white/30 dark:bg-black/20 backdrop-blur-md border border-neutral-200/50 dark:border-white/10 rounded-xl p-4 mb-6 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col">
                        <div className="flex items-end gap-2 mb-1">
                            <span className="font-serif text-[38px] leading-none text-[#1A1A1A] dark:text-[#F4F1ED] font-bold tracking-tight">₹{displayPrice.toLocaleString('en-IN')}</span>
                            {displayOriginalPrice && displayOriginalPrice > displayPrice && !product.isOutOfStock && (
                                <span className="text-[13px] text-neutral-400 line-through mb-1">₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
                            )}
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-medium">Inclusive of all taxes</span>
                    </div>
                    
                    {displayOriginalPrice && displayOriginalPrice > displayPrice && !product.isOutOfStock && (
                        <div className="flex flex-col items-end">
                            <span className="bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase rounded flex items-center gap-1.5">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                SAVE ₹{(displayOriginalPrice - displayPrice).toLocaleString('en-IN')}
                            </span>
                        </div>
                    )}
                </div>                {/* Action Buttons (Desktop Only) */}
                <div className="hidden md:flex flex-col gap-2.5 mb-6">
                    <div className="flex items-center gap-2 justify-center mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-red-600">Only 7 Sets Left In Size M</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleBuyNow}
                            disabled={product.isOutOfStock}
                            className={cn(
                                "relative flex-grow h-[54px] flex flex-col items-center justify-center font-sans tracking-wide text-sm font-bold hover:scale-[1.02] hover:brightness-[1.1] active:scale-[0.98] rounded-xl transition-all duration-300 cursor-pointer leading-tight overflow-hidden group",
                                product.isOutOfStock
                                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                    : "text-white"
                            )}
                            style={!product.isOutOfStock ? { 
                                background: `linear-gradient(135deg, ${accentColor}, ${isWoman ? '#E03154' : '#1D4ED8'})`,
                                boxShadow: `0 8px 25px -6px ${accentColor}90`
                            } : undefined}
                        >
                            {!product.isOutOfStock && (
                                <div className="absolute inset-0 bg-white/20 w-full translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                            )}
                            {product.isOutOfStock ? "Out of Stock" : (
                                <>
                                    <span className="text-[14px] tracking-widest flex items-center gap-1.5 relative z-10">BUY NOW</span>
                                    <span className="text-[9px] uppercase tracking-widest font-medium opacity-90 mt-0.5 relative z-10">
                                        {deliveryInfo ? `Order Today • ${deliveryInfo.date}` : "Order Today • Get in 10 Days"}
                                    </span>
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={handleAddToCart}
                            disabled={product.isOutOfStock}
                            className={cn(
                                "w-[54px] h-[54px] flex items-center justify-center border shrink-0 hover:scale-[1.05] active:scale-[0.95] hover:bg-[var(--accent-color)] hover:text-white rounded-xl shadow-sm transition-all duration-300 cursor-pointer",
                                product.isOutOfStock
                                    ? "bg-neutral-100 dark:bg-[#141414] text-neutral-500 border-neutral-200 dark:border-neutral-800 cursor-not-allowed"
                                    : "bg-transparent hover:bg-neutral-100/50 dark:hover:bg-white/5"
                            )}
                            style={!product.isOutOfStock ? { borderColor: accentColor, color: accentColor, '--accent-color': accentColor } as React.CSSProperties : undefined}
                            title="Add to Cart"
                            aria-label="Add to Cart"
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                        </button>

                    </div>
                </div>

                {/* Core Trust Guarantees */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 mt-2 px-1 text-[12px] sm:text-[13px] font-semibold text-[#1A1A1A] dark:text-[#F4F1ED]">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                        </div>
                        Free Shipping
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                        </div>
                        Easy Returns
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                        </div>
                        COD Available
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                        </div>
                        Secure Checkout
                    </div>
                </div>

                {/* Luxury Coupon Block */}
                {isEligibleForFirst20 && (
                    <div className="mb-6 relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-white/30 to-[#F5F2EB]/30 dark:from-[#111111]/30 dark:to-[#1A1A1A]/30 backdrop-blur-md border-y-2 border-dashed border-[#A0604A]/30 px-4 py-4 rounded-sm shadow-sm">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] rounded-full border border-neutral-200/80 dark:border-white/10 shadow-inner z-10"></div>
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] rounded-full border border-neutral-200/80 dark:border-white/10 shadow-inner z-10"></div>
                        
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0604A] dark:text-[#E8A38B] mb-1.5 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Welcome Offer
                        </span>
                        <span className="text-sm font-serif text-[#1A1A1A] dark:text-[#F4F1ED] mb-3">Get 15% Off Your First Order</span>
                        <button
                            onClick={handleCopyCode}
                            className="bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-sm hover:scale-[1.02] transition-transform cursor-pointer shadow-md flex items-center gap-2"
                        >
                            {copied ? "COPIED ✓" : "USE CODE: FIRST15"}
                        </button>
                    </div>
                )}

                {/* Frequently Bought Together / Bundle */}
                <div className="py-6 border-t border-neutral-200/60 dark:border-white/10 mt-2">
                    <h2 className="font-serif text-lg md:text-xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-4">Frequently Bought Together</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 xs:gap-3 bg-neutral-50 dark:bg-white/5 p-3 rounded-lg border border-neutral-100 dark:border-white/10">
                            <div className="flex gap-1.5 xs:gap-2 flex-1 items-center">
                                <div className="relative w-10 h-14 xs:w-12 xs:h-16 rounded overflow-hidden shadow-sm shrink-0 border border-neutral-200/50 dark:border-white/10">
                                    {product.images?.[0] && <Image src={product.images[0]} alt="Kurti Set" fill sizes="48px" loading="lazy" quality={60} unoptimized={product.images[0].startsWith("http")} className="object-cover" />}
                                </div>
                                <div className="text-neutral-400 font-bold text-[10px]">+</div>
                                <div className="relative w-10 h-14 xs:w-12 xs:h-16 rounded overflow-hidden shadow-sm shrink-0 bg-white/40 dark:bg-black/20 border border-neutral-200/50 dark:border-white/10">
                                    <Image src="/images/generated/pearl_drop_earrings.png" alt="Earrings" fill sizes="48px" loading="lazy" quality={60} unoptimized={true} className="object-cover" />
                                </div>
                                <div className="text-neutral-400 font-bold text-[10px]">+</div>
                                <div className="relative w-10 h-14 xs:w-12 xs:h-16 rounded overflow-hidden shadow-sm shrink-0 bg-white/40 dark:bg-black/20 border border-neutral-200/50 dark:border-white/10">
                                    <Image src="/images/generated/woven_leather_slides.png" alt="Slides" fill sizes="48px" loading="lazy" quality={60} unoptimized={true} className="object-cover" />
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-center shrink-0">
                                <span className="font-serif text-sm xs:text-base text-[#1A1A1A] dark:text-[#F4F1ED] font-bold leading-none">₹5,697</span>
                                <span className="text-[10px] text-neutral-400 line-through mt-0.5">₹6,297</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                addToCart(product as any, selectedSize, selectedColor, selectedPiece);
                                addToCart({
                                    id: 'pearl-earrings',
                                    title: 'Pearl Drop Earrings',
                                    price: 1299,
                                    images: ['/images/generated/pearl_drop_earrings.png']
                                } as any, 'ONE SIZE', 'Gold');
                                addToCart({
                                    id: 'woven-slides',
                                    title: 'Woven Leather Slides',
                                    price: 3499,
                                    images: ['/images/generated/woven_leather_slides.png']
                                } as any, '8', 'Brown');
                                openCart();
                            }}
                            className="w-full bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] py-3 text-[11px] font-bold uppercase tracking-[0.15em] rounded-md shadow-sm hover:opacity-90 transition-opacity">
                            Bundle & Save ₹600
                        </button>
                    </div>
                </div>

                {/* Pair With Carousel */}
                <div className="py-6 border-t border-neutral-200/60 dark:border-white/10 mt-2">
                    <h2 className="font-serif text-lg md:text-xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-4">Pair With</h2>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { id: 'pearl-earrings', name: "Pearl Drop Earrings", priceVal: 1299, price: "₹1,299", img: "/images/generated/pearl_drop_earrings.png", size: 'ONE SIZE', color: 'Gold' },
                            { id: 'woven-slides', name: "Woven Leather Slides", priceVal: 3499, price: "₹3,499", img: "/images/generated/woven_leather_slides.png", size: '8', color: 'Brown' },
                            { id: 'silk-scarf', name: "Silk Blend Scarf", priceVal: 2199, price: "₹2,199", img: "/images/generated/silk_scarf_detail.png", size: 'ONE SIZE', color: 'Cream' }
                        ].map((item, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => {
                                    addToCart({
                                        id: item.id,
                                        title: item.name,
                                        price: item.priceVal,
                                        images: [item.img]
                                    } as any, item.size, item.color);
                                    openCart();
                                }}
                                className="w-[140px] shrink-0 group cursor-pointer"
                            >
                                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 dark:bg-[#141414] mb-2 border border-neutral-200/50 dark:border-white/5">
                                    {item.img && <Image src={item.img} alt={item.name} fill sizes="140px" loading="lazy" quality={70} unoptimized={item.img.startsWith("http")} className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                    
                                    {/* Desktop Hover Add Overlay */}
                                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 dark:bg-black/95 backdrop-blur-sm text-[#1A1A1A] dark:text-[#F4F1ED] text-[10px] font-bold uppercase tracking-widest py-2 text-center opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 rounded hidden md:flex justify-center items-center gap-1.5 shadow-sm">
                                        <Plus className="w-3 h-3 stroke-[2.5]" />
                                        <span>Add</span> <span className="opacity-50">•</span> <span>{item.price}</span>
                                    </div>

                                    {/* Mobile Quick Add Button */}
                                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-neutral-200/50 dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1ED] md:hidden active:scale-90 transition-all">
                                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-semibold text-[#1A1A1A] dark:text-[#F4F1ED] leading-tight mb-1 group-hover:underline underline-offset-2">{item.name}</h3>
                                <span className="text-[11px] text-neutral-500">{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Editorial Product Story */}
                <div className="pt-8 pb-6 border-t border-neutral-200/60 dark:border-white/10 mt-2">
                    <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-4">The Story</h2>
                    <div className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 font-sans">
                        <p className="font-bold text-[#1A1A1A] dark:text-[#F4F1ED] mb-2">Built for everyday luxury.</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"/> Handcrafted with premium fade-resistant cotton.</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"/> Tailored fit that flatters without restricting.</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"/> Gets softer with every wash. Guaranteed.</li>
                        </ul>
                    </div>
                    {/* Style Notes */}
                    <div className="mb-8 bg-white/30 dark:bg-black/20 backdrop-blur-md p-5 border border-neutral-200/60 dark:border-white/5 rounded-xl shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A] dark:text-[#F4F1ED] block mb-2 flex items-center gap-2"><Sparkles className="w-3 h-3"/> STYLE NOTES</span>
                        <p className="text-sm font-sans text-neutral-600 dark:text-neutral-400">
                            Pair with neutral heels and minimal pearl jewelry for an effortlessly elevated evening look.
                        </p>
                    </div>
                    
                    {/* What's Included (For Sets) */}
                    {product.enableSetComponents && (
                        <div className="mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED] block mb-2">Included In The Set</span>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-neutral-400 dark:text-neutral-500">✓</span>
                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        {(product.topName || "Chocolate Top").split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-neutral-400 dark:text-neutral-500">✓</span>
                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        {(product.bottomName || "Wide-Leg Denim Bottom").split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
                        <div className="bg-neutral-50 dark:bg-[#111111] p-5 rounded-xl border border-neutral-100 dark:border-white/5">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED] mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Material & Care
                            </h3>
                            <div className="text-[11px] xs:text-xs text-neutral-500 leading-relaxed">
                                <ul className="list-disc pl-4 space-y-1 mt-1 text-neutral-600 dark:text-neutral-400">
                                    <li>92% Premium Cotton</li>
                                    <li>8% Elastane</li>
                                    <li>Breathable weave</li>
                                    <li>Soft-touch finish</li>
                                </ul>
                                <p className="mt-3">
                                    Dry clean or gentle hand wash recommended.<br />
                                    Store folded to maintain shape.
                                </p>
                            </div>
                        </div>
                        <div className="bg-neutral-50 dark:bg-[#111111] p-5 rounded-xl border border-neutral-100 dark:border-white/5">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1ED] mb-2 flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" />
                                Delivery & Returns
                            </h3>
                            <p className="text-[11px] xs:text-xs text-neutral-500 leading-relaxed">
                                Free express shipping across all major Indian pin codes.<br />
                                Hassle-free 10-day exchanges and returns. Reverse pickup coordinated automatically.
                            </p>
                        </div>
                    </div>
                </div>


                {/* Reviews Section */}
                <div id="reviews" className="scroll-mt-[120px] mb-12 border-t border-neutral-200/60 dark:border-white/10">
                    <div className="space-y-8 py-2">
                            {/* Brand Info Card */}
                            <div className="border border-[#F4F1ED]/50 dark:border-white/5 rounded-2xl p-4 sm:p-6 bg-white/30 dark:bg-black/20 backdrop-blur-md shadow-sm relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 opacity-[0.03] dark:opacity-[0.02]">
                                    <Sparkles className="w-32 h-32 text-[#1A1A1A] dark:text-white" />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
                                    <div>
                                        <h2 className="font-serif text-base xs:text-lg text-[#1A1A1A] dark:text-[#F4F1ED] mb-2 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                            The TENET Standard
                                        </h2>
                                        <div className="flex flex-col gap-3 mt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><Star className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /></div>
                                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">4.8★ Average Rating</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><Heart className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /></div>
                                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">10,000+ Customers</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0"><RefreshCw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /></div>
                                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">97% Repeat Purchase Satisfaction</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Header */}
                            <div className="text-center pb-5 pt-3 border-b border-neutral-100/80">
                                <h2 className="font-serif text-lg xs:text-2xl text-[#1A1A1A] dark:text-[#F4F1ED] mb-2 font-medium">Customer Reviews</h2>
                                <div className="flex justify-center items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4" style={{ fill: accentColor, color: accentColor }} />
                                        ))}
                                    </div>
                                    <span className="text-xs xs:text-sm text-neutral-600 font-medium">4.8 (127 reviews)</span>
                                </div>
                                
                                {/* Most Mentioned Tags */}
                                <div className="flex flex-wrap justify-center gap-2 mb-6 mt-3">
                                    <span className="text-[10px] font-semibold tracking-wide bg-white/30 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/5 shadow-sm">✓ Perfect Fit</span>
                                    <span className="text-[10px] font-semibold tracking-wide bg-white/30 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/5 shadow-sm">✓ Premium Fabric</span>
                                    <span className="text-[10px] font-semibold tracking-wide bg-white/30 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/5 shadow-sm">✓ Beautiful Drape</span>
                                </div>

                                {/* Review Summary Bars */}
                                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6 mt-2 max-w-sm mx-auto w-full px-4">
                                    <div className="flex flex-col gap-1 w-full sm:w-1/3 text-left">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                            <span>Fit</span>
                                            <span>4.9</span>
                                        </div>
                                        <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#1A1A1A] dark:bg-[#F4F1ED] w-[98%]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full sm:w-1/3 text-left">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                            <span>Quality</span>
                                            <span>4.8</span>
                                        </div>
                                        <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#1A1A1A] dark:bg-[#F4F1ED] w-[96%]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full sm:w-1/3 text-left">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                                            <span>Value</span>
                                            <span>4.7</span>
                                        </div>
                                        <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#1A1A1A] dark:bg-[#F4F1ED] w-[94%]" />
                                        </div>
                                    </div>
                                </div>
                                {!isReviewFormOpen ? (
                                    <button
                                        onClick={() => setIsReviewFormOpen(true)}
                                        className="text-white px-6 py-2.5 rounded-lg font-medium text-[10px] tracking-[0.15em] uppercase hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        Write a review
                                    </button>
                                ) : (
                                    <ReviewForm productId={product.id} onCancel={() => setIsReviewFormOpen(false)} />
                                )}
                            </div>

                            {/* Customer Photos Grid */}
                            {reviews.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-serif text-[#1A1A1A] dark:text-[#F4F1ED] font-medium text-sm xs:text-base mb-3">Customer Photos</h3>
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                                        {[displayImages[1] || displayImages[0], displayImages[2] || displayImages[0]].filter(Boolean).map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-24 xs:w-28 xs:h-28 rounded-xl overflow-hidden shrink-0 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                                                <Image src={img} alt={`Customer photo ${idx}`} fill sizes="112px" loading="lazy" quality={70} unoptimized={img.startsWith("http")} className="object-cover hover:scale-105 transition-transform cursor-zoom-in" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews List */}
                            {reviews.length === 0 ? (
                                <p className="text-neutral-500 italic text-sm text-center py-8">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="space-y-5">
                        {/* Customer Photos Gallery removed per request */}

                        {[
                            {
                                id: 'realistic-review-1',
                                name: isWoman ? 'Pooja S.' : 'Arjun Sen',
                                rating: 5,
                                date: '2026-06-12',
                                comment: isWoman 
                                    ? 'Bohot pyara suit hai, fitting ekdum perfect aayi. Material bhi kaafi soft aur premium feel hota hai. Definitely worth the price!' 
                                    : 'Incredible fit and fabric. Material feels incredibly premium and it fits perfectly.',
                                images: [displayImages[0] || '']
                            },
                            {
                                id: 'realistic-review-2',
                                name: isWoman ? 'Neha Sharma' : 'Rohan Sharma',
                                rating: 5,
                                date: '2026-06-08',
                                comment: isWoman 
                                    ? 'Fabric quality ekdum top class hai. Pehanne ke baad look bohot amazing aata hai. Wash karne ke baad bhi color fade nahi hua.'
                                    : 'Exceeded expectations. The tailoring is flawless and it holds its shape even after multiple washes.',
                                images: [displayImages[1] || '']
                            },
                            {
                                id: 'realistic-review-3',
                                name: isWoman ? 'Kritika R.' : 'Jyoti K.',
                                rating: 4,
                                date: '2026-05-28',
                                comment: isWoman 
                                    ? 'Design aur embroidery bohot sundar hai. Office aur casual wear dono ke liye best hai. Delivery bhi fast thi.'
                                    : 'Beautiful piece, very comfortable. I get compliments every time I wear this. Highly recommend.',
                                images: [displayImages[2] || '']
                            },
                            {
                                id: 'realistic-review-4',
                                name: isWoman ? 'Anjali V.' : 'Vikram S.',
                                rating: 5,
                                date: '2026-05-15',
                                comment: isWoman
                                    ? 'Mujhe yeh kurti set bohot accha laga! Color exactly waise hi hai jaise picture mein dikhaya gaya tha. Very elegant.'
                                    : 'Looks exactly like the pictures. The fit is true to size and it feels very comfortable to wear all day.',
                                images: []
                            },
                            ...reviews
                        ].map((review: any) => (
                                        <div 
                                            key={review.id} 
                                            className="bg-white dark:bg-[#111111] p-4 xs:p-5 sm:p-6 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    {/* User Initials Avatar */}
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-neutral-600 bg-neutral-100 dark:bg-[#141414] uppercase select-none">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <h4 className="font-semibold text-[#1A1A1A] dark:text-[#F4F1ED] text-xs xs:text-sm">{review.name}</h4>
                                                            <span className="text-[8px] xs:text-[9px] bg-emerald-50/60 text-emerald-700 border border-emerald-100/30 rounded px-1.5 py-0.5 uppercase tracking-wider font-semibold">Verified Buy</span>
                                                        </div>
                                                        <span className="text-[9px] xs:text-[10px] text-neutral-500 block font-sans">{new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={cn("w-3 h-3 xs:w-3.5 xs:h-3.5", i < review.rating ? "" : "text-neutral-200")} 
                                                            style={i < review.rating ? { fill: accentColor, color: accentColor } : undefined}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Review Images */}
                                            {(() => {
                                                const hasImages = review.images && review.images.length > 0 && review.images[0] !== '';
                                                if (!hasImages) return null;

                                                return (
                                                    <div className="flex gap-2.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
                                                        {review.images.map((img: string, idx: number) => (
                                                            <div key={idx} className="relative w-20 h-20 xs:w-24 xs:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-100/80 shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 cursor-zoom-in">
                                                                <Image 
                                                                    src={img as string} 
                                                                    alt={`Review photo ${idx + 1}`} 
                                                                    fill 
                                                                    sizes="96px"
                                                                    loading="lazy"
                                                                    quality={70}
                                                                    unoptimized={img.startsWith("http")}
                                                                    className="object-cover" 
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}

                                            {(() => {
                                                const firstPeriodIndex = review.comment.indexOf('.');
                                                if (firstPeriodIndex === -1) {
                                                    return <p className="text-neutral-600 xs:text-neutral-700 text-xs xs:text-sm leading-relaxed mb-3">{review.comment}</p>;
                                                }
                                                const title = review.comment.substring(0, firstPeriodIndex).trim();
                                                const body = review.comment.substring(firstPeriodIndex + 1).trim();
                                                return (
                                                    <>
                                                        <p className="font-serif text-sm xs:text-base text-[#1A1A1A] dark:text-[#F4F1ED] mb-1.5 font-medium leading-snug">{title}</p>
                                                        {body && <p className="text-neutral-500 xs:text-neutral-600 text-xs xs:text-sm leading-relaxed">{body}</p>}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

            </div>

            {/* Mobile Sticky CTA */}
            <MobileStickyBar 
                product={product} 
                selectedVariant={selectedVariant} 
                onAddToCart={handleAddToCart} 
                onBuyNow={handleBuyNow}
                displayPrice={displayPrice}
            />
        </div>
        </>
    );
}
