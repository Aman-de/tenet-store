"use client";

import { useStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle, Heart, Ruler, Star, Loader2, Truck, ShieldCheck, RefreshCw, ShoppingBag, Check, Copy } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
const SizeGuide = dynamic(() => import("./SizeGuide"), { ssr: false });
import ShareButton from "./ShareButton";
import MobileStickyBar from "./MobileStickyBar";
import { Product, Review, Variant } from "@/lib/data";
import { createReview, checkUserOrderHistory } from "@/app/actions";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { useUser } from "@clerk/nextjs";
import useEmblaCarousel from "embla-carousel-react";
import { useGender } from "@/context/GenderContext";

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
    const accentColor = isWoman ? "#E05275" : "#2B6496";

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
            <h3 className="font-serif text-lg text-[#1A1A1A] font-medium">Write a Review</h3>
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Name</label>
                <input 
                    required 
                    name="name" 
                    className="w-full p-3 border border-neutral-200 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm rounded-xl transition-all bg-white" 
                    style={{ '--accent-color': accentColor } as React.CSSProperties}
                    placeholder="Your name" 
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">Rating</label>
                <select 
                    required 
                    name="rating" 
                    className="w-full p-3 border border-neutral-200 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm bg-white rounded-xl transition-all cursor-pointer" 
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
                    className="w-full p-3 border border-neutral-200 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none text-sm rounded-xl transition-all bg-white" 
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
                    className="px-6 border border-neutral-200 text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-neutral-100/50 rounded-xl transition-all active:scale-95"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default function ProductDetails({ product, reviews = [] }: ProductDetailsProps) {
    const { addToCart, openCart, toggleWishlist, isInWishlist, setCheckoutItem, trackEngagement } = useStore();
    const { gender } = useGender();
    const targetGender = product.gender ? product.gender.toLowerCase() : gender;
    const isWoman = targetGender === "woman" || (targetGender === "unisex" && gender === "woman");
    const accentColor = isWoman ? "#E05275" : "#2B6496";

    // Variant Logic
    const hasVariants = product.variants && product.variants.length > 0;
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(hasVariants ? product.variants![0] : undefined);

    const isProgrammaticRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedPiece, setSelectedPiece] = useState<'top' | 'bottom' | 'set'>('set');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    // Desktop Sticky Buy Bar Scroll State
    const { scrollY } = useScroll();
    const [isStickyVisible, setIsStickyVisible] = useState(false);
    
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsStickyVisible(latest > 800);
    });
    
    // Derived State
    let currentImages = (selectedVariant ? selectedVariant.images : product.images)?.filter(Boolean);
    
    // Override images based on selected piece if custom component images are defined
    if (selectedPiece === 'top' && product.topImages && product.topImages.length > 0) {
        currentImages = product.topImages.filter(Boolean);
    } else if (selectedPiece === 'bottom' && product.bottomImages && product.bottomImages.length > 0) {
        currentImages = product.bottomImages.filter(Boolean);
    }

    // Fallback: If variant has no images, use product default images to prevent crash
    const displayImages = currentImages && currentImages.length > 0 ? currentImages : product.images.filter(Boolean);


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
    const [deliveryInfo, setDeliveryInfo] = useState<{ date: string, free: boolean } | null>(null);
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
                    const cityLower = city.toLowerCase().trim();
                    let dateText = "";
                    if (TIER_1_CITIES.has(cityLower)) {
                        dateText = `Get it by tomorrow, 6 PM in ${city}`;
                    } else if (TIER_2_CITIES.has(cityLower)) {
                        dateText = `Get it in 2 days in ${city}`;
                    } else {
                        dateText = `Get it in 3 days in ${city}`;
                    }
                    setDeliveryInfo({ 
                        date: dateText, 
                        free: true 
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

    const isWishlisted = isInWishlist(product.id);
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
                    <span className="font-serif text-base xs:text-[17px] font-medium text-[#1A1A1A] group-hover:text-neutral-600 transition-colors">{title}</span>
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
            {/* Desktop Sticky Buy Bar (Apple Store Style) */}
            <AnimatePresence>
                {isStickyVisible && (
                    <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="hidden md:flex fixed top-[72px] lg:top-[84px] left-0 right-0 z-[40] bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm py-3 px-6 xl:px-12 items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-serif font-medium text-[#1A1A1A]">{finalTitle}</div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <div className="text-sm font-medium text-[#1A1A1A]">₹{itemPrice.toLocaleString('en-IN')}</div>
                                {itemOriginalPrice && itemOriginalPrice > itemPrice && (
                                    <div className="text-[10px] text-neutral-400 line-through">₹{itemOriginalPrice.toLocaleString('en-IN')}</div>
                                )}
                            </div>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.isOutOfStock}
                                className="px-8 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 active:scale-95 transition-all rounded-full shadow-md border border-white/20"
                                style={!product.isOutOfStock ? { backgroundColor: accentColor } : { backgroundColor: '#d4d4d4', color: '#737373', cursor: 'not-allowed' }}
                            >
                                {product.isOutOfStock ? "Out of Stock" : "Buy Now"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-[2000px] w-full mx-auto px-0 md:px-8 xl:px-12 pt-0 xl:pt-14 grid grid-cols-1 lg:landscape:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-0 lg:landscape:gap-[4vw] xl:gap-[6vw] 2xl:gap-[8vw]">
                <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

            {/* Left Column: Gallery */}
            {/* Mobile/Tablet: Infinite Looping Carousel using Embla */}
            <div className="block lg:landscape:hidden xl:hidden relative w-[calc(100%-16px)] mx-auto mt-2 aspect-[3/4] mb-6 overflow-hidden rounded-[28px] sm:rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.05)] bg-neutral-100" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {displayImages.map((img, idx) => (
                        <div 
                            key={`${selectedPiece}-${idx}`} 
                            className="flex-[0_0_100%] h-full relative bg-neutral-100"
                        >
                            {img ? (
                                <>
                                    {!loadedImages[idx] && (
                                        <div className="absolute inset-0 bg-neutral-200 animate-pulse z-10" />
                                    )}
                                    <Image
                                        src={img}
                                        alt={`${product.title} - View ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={idx === 0}
                                        quality={90}
                                        onLoad={() => setLoadedImages(prev => ({ ...prev, [idx]: true }))}
                                    />
                                </>
                            ) : (
                                <div className="w-full h-full bg-neutral-200" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Floating Wishlist Button on Mobile */}
                <button
                    onClick={() => toggleWishlist(product as any)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-95 transition-all text-[#1A1A1A]"
                    title="Add to Wishlist"
                    aria-label="Wishlist"
                >
                    <Heart 
                        className="w-4.5 h-4.5 transition-all duration-300"
                        style={isWishlisted ? { fill: accentColor, stroke: accentColor } : { stroke: "currentColor" }} 
                        strokeWidth={2} 
                    />
                </button>

                {/* Mobile Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {displayImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIndex(idx)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                selectedImageIndex === idx ? "bg-white w-4.5" : "bg-white/40 w-1.5"
                            )}
                        />
                    ))}
                </div>
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
                                <div className={cn("w-full h-full relative bg-neutral-100", !loadedThumbnails[idx] && "animate-pulse bg-neutral-200")}>
                                    <Image
                                        src={img}
                                        alt={`Product View ${idx}`}
                                        fill
                                        className="object-cover"
                                        onLoad={() => setLoadedThumbnails(prev => ({ ...prev, [idx]: true }))}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-neutral-100" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="relative flex-1 aspect-[3/4] bg-neutral-100 overflow-hidden">
                    {isMainImgLoading && (
                        <div className="absolute inset-0 bg-neutral-200 animate-pulse z-10" />
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
                                className="object-cover"
                                priority
                                onLoad={() => setIsMainImgLoading(false)}
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                <span className="text-neutral-500 text-xs uppercase tracking-widest">No Image</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Floating Wishlist Button on Desktop */}
                    <button
                        onClick={() => toggleWishlist(product as any)}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all text-[#1A1A1A]"
                        title="Add to Wishlist"
                        aria-label="Wishlist"
                    >
                        <Heart 
                            className="w-5 h-5 transition-all duration-300"
                            style={isWishlisted ? { fill: accentColor, stroke: accentColor } : { stroke: "currentColor" }} 
                            strokeWidth={2} 
                        />
                    </button>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="flex flex-col pt-4 px-4 xs:px-5 sm:px-6 md:px-0 lg:max-w-[480px] xl:max-w-[540px] 2xl:max-w-[600px] w-full">
                {/* Breadcrumb pseudo */}
                <span className="text-[9px] xs:text-[10px] font-medium tracking-[0.15em] uppercase text-neutral-500 mb-1">{product.category}</span>

                <h1 className="font-serif text-xl xs:text-2xl md:text-4xl lg:text-5xl text-[#1A1A1A] font-medium leading-[1.2] mb-1.5 flex justify-between items-start">
                    {displayTitle}
                    <ShareButton
                        title={displayTitle}
                        className="text-neutral-500 hover:text-[#1A1A1A] mt-1"
                        iconSize={18}
                    />
                </h1>

                <div className="flex items-center gap-x-3 gap-y-2 mb-3 flex-wrap">
                    {displayOriginalPrice && <span className="text-neutral-500 line-through text-sm xs:text-base">₹{displayOriginalPrice.toLocaleString('en-IN')}</span>}
                    <span className="text-lg xs:text-xl md:text-2xl font-medium text-[#1A1A1A]">₹{displayPrice.toLocaleString('en-IN')}</span>
                    {displayOriginalPrice && displayOriginalPrice > displayPrice && !product.isOutOfStock && (
                        <div className="flex items-center gap-x-1.5 gap-y-1 flex-wrap">
                            <span 
                                className="text-[9px] xs:text-[10px] font-semibold text-white px-2 py-0.5 rounded uppercase tracking-wider"
                                style={{ backgroundColor: accentColor }}
                            >
                                {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}% OFF
                            </span>
                            <span 
                                className="text-[9px] xs:text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider border bg-neutral-50/40"
                                style={{ color: accentColor, borderColor: `${accentColor}25` }}
                            >
                                SAVE ₹{(displayOriginalPrice - displayPrice).toLocaleString('en-IN')}
                            </span>
                        </div>
                    )}
                    {product.isOutOfStock && <span className="text-xs bg-red-600 text-white px-2 py-1 uppercase font-bold tracking-widest">Out of Stock</span>}
                </div>

                {/* Rating Mini Summary */}
                {reviews.length > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={cn("w-3.5 h-3.5", i < Math.round(averageRating) ? "" : "text-neutral-300")} 
                                    style={i < Math.round(averageRating) ? { fill: accentColor, color: accentColor } : undefined}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">({reviews.length} Reviews)</span>
                    </div>
                )}
                {reviews.length === 0 && <div className="mb-2" />}

                {/* Active Promo Tags */}
                <div className="flex flex-col gap-2.5 mb-5 mt-1 border-t border-b border-neutral-100/60 py-3">
                    {isEligibleForFirst20 && (
                        <div className="flex items-start gap-2.5">
                            <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0" style={{ backgroundColor: accentColor }}>
                                Offer
                            </span>
                            <div className="text-[11.5px] leading-snug text-neutral-500 font-sans flex items-center flex-wrap gap-x-1.5 gap-y-1">
                                <span><strong className="text-[#1A1A1A] font-semibold">-20% OFF</strong> on your first purchase. Use code</span>
                                <button
                                    onClick={handleCopyCode}
                                    className="font-mono bg-neutral-100/80 px-2 py-0.5 border border-neutral-200/60 rounded text-neutral-800 text-[10.5px] flex items-center gap-1.5 hover:bg-neutral-200/50 hover:text-black active:scale-95 transition-all shadow-sm group cursor-pointer"
                                    title="Click to copy coupon code"
                                >
                                    <span>FIRST20</span>
                                    {copied ? (
                                        <Check className="w-3 h-3 text-emerald-600 animate-in fade-in zoom-in-50 duration-200" />
                                    ) : (
                                        <Copy className="w-3 h-3 text-neutral-500 group-hover:text-neutral-600 transition-colors" />
                                    )}
                                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-sans group-hover:text-[#1A1A1A] transition-colors">
                                        {copied ? "Copied!" : "Copy"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex items-start gap-2.5">
                        <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded bg-neutral-800 uppercase tracking-wider shrink-0">
                            Delivery
                        </span>
                        <div className="text-[11.5px] leading-snug text-neutral-500 font-sans">
                            {displayPrice >= 499 ? (
                                <span><strong className="text-emerald-700 font-semibold">✓ Eligible for Free Delivery</strong> on this purchase (Orders above ₹499)</span>
                            ) : (
                                <span>Add <strong className="text-[#1A1A1A] font-semibold">₹{499 - displayPrice}</strong> more to cart for <strong className="text-[#1A1A1A] font-semibold">Free Delivery</strong> (Threshold: ₹499)</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Piece Selector (for Set Components) */}
                {product.enableSetComponents && (
                    <div className="mb-5 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Select Component</span>
                        <div className="relative flex w-full bg-neutral-100/60 border border-neutral-200/50 p-1.5 rounded-[20px] gap-1 shadow-inner">
                            {(['set', 'top', 'bottom'] as const).map((piece) => {
                                let label = "Full Set";
                                let priceVal = product.setPrice ?? product.price;
                                const isSelected = selectedPiece === piece;
                                
                                const iconClass = cn("w-3.5 h-3.5 shrink-0 transition-all duration-300", isSelected ? "opacity-100" : "opacity-70");
                                
                                let Icon = () => (
                                    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10Z"/><path d="M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><path d="M8 14h8"/>
                                    </svg>
                                );

                                if (piece === 'top') {
                                    label = product.topName || "Top Only";
                                    priceVal = product.topPrice ?? product.price;
                                    Icon = () => (
                                        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                                        </svg>
                                    );
                                } else if (piece === 'bottom') {
                                    label = product.bottomName || "Bottom Only";
                                    priceVal = product.bottomPrice ?? product.price;
                                    Icon = () => (
                                        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 4h14l-1.5 17h-4L12 13l-1.5 8h-4L5 4z"/><path d="M5 4c0 1.5 3.13 2.5 7 2.5S19 5.5 19 4"/>
                                        </svg>
                                    );
                                } else if (piece === 'set') {
                                    Icon = () => (
                                        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v4h10v-4h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                                            <path d="M6 14h12l-1.5 8h-3.5L12 18l-1 4H7.5L6 14z"/>
                                        </svg>
                                    );
                                }

                                return (
                                    <button
                                        key={piece}
                                        onClick={() => setSelectedPiece(piece)}
                                        className={cn(
                                            "relative flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-[16px] transition-colors duration-300 cursor-pointer z-10",
                                            isSelected ? "text-[#1A1A1A]" : "text-neutral-500 hover:text-neutral-800"
                                        )}
                                        style={isSelected ? { color: accentColor } : undefined}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="pieceSelectorBackground"
                                                className="absolute inset-0 bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] z-[-1]"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Icon />
                                            <span className={cn("text-[10px] xs:text-[10.5px] tracking-wide transition-all", isSelected ? "font-bold" : "font-semibold")}>{label}</span>
                                        </div>
                                        <span className={cn("text-[9.5px] xs:text-[10px] font-sans transition-all", isSelected ? "font-bold opacity-90" : "font-medium opacity-80")}>₹{priceVal.toLocaleString('en-IN')}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Color Selector (Variants) */}
                {hasVariants ? (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Color</span>
                            <span className="text-xs font-serif text-[#1A1A1A]">{selectedVariant?.colorName}</span>
                        </div>
                        <div className="flex gap-2.5">
                            {product.variants!.map((variant) => (
                                <button
                                    key={variant.colorName}
                                    onClick={() => setSelectedVariant(variant)}
                                    className="w-7 h-7 xs:w-8 xs:h-8 rounded-full border border-neutral-200/50 transition-all relative hover:scale-105 active:scale-95 cursor-pointer"
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
                    <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Color</span>
                        <div className="flex gap-2.5">
                            {product.colors && product.colors.map((color) => (
                                <div
                                    key={color}
                                    className="w-7 h-7 xs:w-8 xs:h-8 rounded-full border border-neutral-200/50"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selector */}
                {showSizeSelector && (
                    <div id="size-selector-section" className="mb-5">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Size</span>
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
                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border-b pb-0.5 hover:opacity-70 transition-opacity cursor-pointer"
                                    style={{ color: accentColor, borderColor: accentColor }}
                                >
                                    <Ruler className="w-3 h-3" />
                                    Size Guide
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => { setSelectedSize(size); setError(null); }}
                                    className={cn(
                                        "w-10 h-10 xs:w-11 xs:h-11 border rounded-full flex items-center justify-center font-sans text-xs font-medium tracking-wide transition-all bg-white cursor-pointer active:scale-95",
                                        selectedSize === size
                                            ? "text-white shadow-sm scale-105"
                                            : error
                                                ? "border-red-300 text-red-600 bg-red-50 hover:border-red-500"
                                                : "border-neutral-200 text-[#1A1A1A] hover:border-[#1A1A1A]"
                                    )}
                                    style={selectedSize === size ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <div className="mt-3.5 pl-3 py-1 bg-transparent border-l-2 border-neutral-200 text-[11px] font-sans text-neutral-500 leading-normal animate-in fade-in slide-in-from-top-1">
                                {selectedSize === "XS" && "Product Bust 34 in • Product Waist 32 in • Product Hip 38 in"}
                                {selectedSize === "S" && "Product Bust 36 in • Product Waist 34 in • Product Hip 40 in"}
                                {selectedSize === "M" && "Product Bust 38 in • Product Waist 36 in • Product Hip 42 in"}
                                {selectedSize === "L" && "Product Bust 40 in • Product Waist 38 in • Product Hip 44 in"}
                                {selectedSize === "XL" && "Product Bust 42 in • Product Waist 40 in • Product Hip 46 in"}
                                {selectedSize === "2XL" && "Product Bust 44 in • Product Waist 42 in • Product Hip 48 in"}
                                {selectedSize === "3XL" && "Product Bust 46 in • Product Waist 44 in • Product Hip 50 in"}
                                {(!["XS", "S", "M", "L", "XL", "2XL", "3XL"].includes(selectedSize)) && `Standard fit for size ${selectedSize}`}
                            </div>
                        )}
                    </div>
                )}

                {/* Urgency & Low Stock Indicators */}
                {!product.isOutOfStock && (
                    <div className="flex flex-col gap-2 mb-5 animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-start gap-3 bg-red-50 text-red-800 px-4 py-3 rounded-xl border border-red-100/50 shadow-sm">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div className="text-[11px] xs:text-xs font-sans leading-tight">
                                <span className="font-bold tracking-wide uppercase text-[10px] text-red-600 mb-0.5 block">High Demand</span>
                                Only a few pieces left in stock. Order soon to secure yours.
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons (Desktop Only) */}
                <div className="hidden md:flex gap-3 mb-6">
                    <button
                        onClick={handleBuyNow}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "flex-grow h-[50px] flex items-center justify-center font-sans uppercase tracking-[0.2em] text-xs md:text-sm font-medium shadow-md hover:scale-[1.01] hover:brightness-[1.04] hover:shadow-xl active:scale-[0.98] rounded-full transition-all duration-300 cursor-pointer",
                            product.isOutOfStock
                                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                : "text-white"
                        )}
                        style={!product.isOutOfStock ? { backgroundColor: accentColor } : undefined}
                    >
                        {product.isOutOfStock ? "Out of Stock" : "Buy Now"}
                    </button>
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "w-[50px] h-[50px] flex items-center justify-center border shrink-0 hover:scale-[1.05] active:scale-[0.95] hover:bg-[var(--accent-color)] hover:text-white rounded-full shadow-sm transition-all duration-300 cursor-pointer",
                            product.isOutOfStock
                                ? "bg-neutral-100 text-neutral-500 border-neutral-200 cursor-not-allowed"
                                : "bg-[#FDFBF7]"
                        )}
                        style={!product.isOutOfStock ? { borderColor: accentColor, color: accentColor, '--accent-color': accentColor } as React.CSSProperties : undefined}
                        title="Add to Cart"
                        aria-label="Add to Cart"
                    >
                        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                    </button>
                </div>

                {/* Pincode Check */}
                <div className="mt-5 border-t border-neutral-100/80 pt-4 mb-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Check Delivery Details</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Enter 6-digit Pincode" 
                            value={pincode}
                            onChange={handlePincodeChange}
                            className={cn(
                                "w-full border px-3.5 py-2 text-xs focus:outline-none transition-colors rounded-lg bg-white",
                                pincodeError ? "border-red-300 focus:border-red-500 bg-red-50" : "border-neutral-200/80 focus:border-[var(--accent-color)] focus:ring-0"
                            )}
                            style={{ '--accent-color': accentColor } as React.CSSProperties}
                            maxLength={6}
                        />
                    </div>
                    {pincodeError && (
                        <div className="flex items-center gap-2 text-xs text-red-500 mt-2">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{pincodeError}</span>
                        </div>
                    )}
                    {deliveryInfo && (
                        <div className="flex items-center gap-2 text-xs text-[#1A1A1A] mt-2">
                            <Truck className="w-3.5 h-3.5 text-green-600" />
                            <span>{deliveryInfo.date}</span>
                            <span className="text-neutral-300">•</span>
                            {product.price >= 499 ? (
                                <span className="text-green-600 font-medium">Free Shipping</span>
                            ) : (
                                <span className="text-neutral-500 font-medium">₹70 Shipping (Free above ₹499)</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Micro-Trust Badges */}
                <div className="grid grid-cols-3 gap-1 py-3 border-t border-b border-neutral-100/80 mb-5 text-center bg-transparent">
                    <div className="flex flex-col items-center justify-center gap-0.5">
                        <Truck className="w-4 h-4 text-neutral-500 stroke-[1.2]" />
                        <span className="font-sans text-[9px] uppercase font-semibold tracking-wider text-[#1A1A1A]">Free Shipping</span>
                        <span className="font-sans text-[7.5px] text-neutral-500 uppercase leading-none">Express Delivery</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-0.5">
                        <ShieldCheck className="w-4 h-4 text-neutral-500 stroke-[1.2]" />
                        <span className="font-sans text-[9px] uppercase font-semibold tracking-wider text-[#1A1A1A]">Secure Pay</span>
                        <span className="font-sans text-[7.5px] text-neutral-500 uppercase leading-none">UPI & Cards</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-0.5">
                        <RefreshCw className="w-4 h-4 text-neutral-500 stroke-[1.2]" />
                        <span className="font-sans text-[9px] uppercase font-semibold tracking-wider text-[#1A1A1A]">Easy Return</span>
                        <span className="font-sans text-[7.5px] text-neutral-500 uppercase leading-none">7-day exchange</span>
                    </div>
                </div>

                {/* Description Accordions */}
                <div className="divide-y divide-neutral-200/60 border-t border-neutral-200/60">
                    <AccordionItem title="Description" defaultOpen>
                        {product.description || "Crafted from the finest materials, this piece embodies the essence of silent luxury."}
                    </AccordionItem>
                    <AccordionItem title="Material & Care">
                        Premium natural fibers and luxury weaves.<br />
                        Dry clean or gentle hand wash recommended.<br />
                        Store folded to maintain shape.
                    </AccordionItem>
                    <AccordionItem title="Delivery & Returns">
                        Free express shipping across all major Indian pin codes.<br />
                        Hassle-free 7-day exchanges and returns. Reverse pickup coordinated automatically.
                    </AccordionItem>
                    <AccordionItem title={`Reviews (${reviews.length})`}>
                        <div className="space-y-8 py-4">
                            {/* Brand Info Card */}
                            <div className="border border-neutral-100 rounded-xl p-4 sm:p-6 bg-neutral-50/30">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                    <div>
                                        <h2 className="font-serif text-base xs:text-lg text-[#1A1A1A] mb-1">About Tenet</h2>
                                        <p className="text-[11px] xs:text-xs text-neutral-500 leading-relaxed max-w-md">
                                            TENET is defined by silent luxury—clean silhouettes, exceptional natural materials, and meticulous tailoring curated for the modern wardrobe.
                                        </p>
                                    </div>
                                    <div className="flex gap-4 text-center border-t md:border-t-0 md:border-l border-neutral-100/80 pt-3 md:pt-0 md:pl-6 shrink-0">
                                        <div>
                                            <div className="font-serif text-base xs:text-lg text-[#1A1A1A]">4.8★</div>
                                            <div className="text-[8px] xs:text-[9px] text-neutral-500 uppercase tracking-wider font-bold">Patron Rating</div>
                                        </div>
                                        <div className="border-l border-neutral-100/80 pl-4">
                                            <div className="font-serif text-base xs:text-lg text-[#1A1A1A]">10k+</div>
                                            <div className="text-[8px] xs:text-[9px] text-neutral-500 uppercase tracking-wider font-bold">Reviews</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100/50">
                                    <span 
                                        className="text-[9px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded border"
                                        style={{ color: accentColor, borderColor: `${accentColor}15`, backgroundColor: `${accentColor}02` }}
                                    >
                                        Premium Cashmere & Wool
                                    </span>
                                    <span 
                                        className="text-[9px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded border"
                                        style={{ color: accentColor, borderColor: `${accentColor}15`, backgroundColor: `${accentColor}02` }}
                                    >
                                        Artisanal Craftsmanship
                                    </span>
                                    <span 
                                        className="text-[9px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded border"
                                        style={{ color: accentColor, borderColor: `${accentColor}15`, backgroundColor: `${accentColor}02` }}
                                    >
                                        Effortless Modularity
                                    </span>
                                </div>
                            </div>

                            {/* Reviews Header */}
                            <div className="text-center pb-5 pt-3 border-b border-neutral-100/80">
                                <h2 className="font-serif text-lg xs:text-2xl text-[#1A1A1A] mb-2 font-medium">Customer Reviews</h2>
                                <div className="flex justify-center items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4" style={{ fill: accentColor, color: accentColor }} />
                                        ))}
                                    </div>
                                    <span className="text-xs xs:text-sm text-neutral-600 font-medium">4.8 ({reviews.length} reviews)</span>
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

                            {/* Reviews List */}
                            {reviews.length === 0 ? (
                                <p className="text-neutral-500 italic text-sm text-center py-8">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    {reviews.map((review) => (
                                        <div 
                                            key={review.id} 
                                            className="bg-white p-4 xs:p-5 sm:p-6 rounded-xl border border-neutral-100 shadow-sm transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    {/* User Initials Avatar */}
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-neutral-600 bg-neutral-100 uppercase select-none">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <h4 className="font-semibold text-[#1A1A1A] text-xs xs:text-sm">{review.name}</h4>
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
                                            {(() => {
                                                const firstPeriodIndex = review.comment.indexOf('.');
                                                if (firstPeriodIndex === -1) {
                                                    return <p className="text-neutral-600 xs:text-neutral-700 text-xs xs:text-sm leading-relaxed mb-3">{review.comment}</p>;
                                                }
                                                const title = review.comment.substring(0, firstPeriodIndex).trim();
                                                const body = review.comment.substring(firstPeriodIndex + 1).trim();
                                                return (
                                                    <>
                                                        <p className="font-serif text-sm xs:text-base text-[#1A1A1A] mb-1.5 font-medium leading-snug">{title}</p>
                                                        {body && <p className="text-neutral-500 xs:text-neutral-600 text-xs xs:text-sm leading-relaxed mb-3">{body}</p>}
                                                    </>
                                                );
                                            })()}
                                            {/* Review Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2.5 mb-1 mt-3 overflow-x-auto pb-1 scrollbar-none">
                                                    {review.images.map((img, idx) => (
                                                        <div key={idx} className="relative w-20 h-20 xs:w-24 xs:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-100/80 shadow-sm hover:scale-102 active:scale-98 transition-all duration-300 cursor-zoom-in">
                                                            <Image 
                                                                src={img} 
                                                                alt={`Customer review snapshot ${idx + 1}`} 
                                                                fill 
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </AccordionItem>
                </div>

                {/* Mobile-only Sticky CTA Bar (stops sticking below reviews/accordions) */}
                <div className="md:hidden sticky bottom-0 left-0 right-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md py-3.5 pb-safe -mx-4 px-4 flex gap-2 border-t border-neutral-100/80 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <button
                        onClick={handleBuyNow}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "flex-grow h-[48px] flex items-center justify-center font-sans uppercase tracking-[0.2em] text-[11px] xs:text-xs font-medium shadow-md hover:scale-[1.01] hover:brightness-[1.04] active:scale-[0.98] rounded-full transition-all duration-300 cursor-pointer",
                            product.isOutOfStock
                                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                : "text-white"
                        )}
                        style={!product.isOutOfStock ? { backgroundColor: accentColor } : undefined}
                    >
                        {product.isOutOfStock ? "Out of Stock" : "Buy Now"}
                    </button>
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "w-[48px] h-[48px] flex items-center justify-center border shrink-0 hover:scale-[1.05] active:scale-[0.95] hover:bg-[var(--accent-color)] hover:text-white rounded-full shadow-sm transition-all duration-300 cursor-pointer",
                            product.isOutOfStock
                                ? "bg-neutral-100 text-[#A3A3A3] border-neutral-200 cursor-not-allowed"
                                : "bg-[#FDFBF7]"
                        )}
                        style={!product.isOutOfStock ? { borderColor: accentColor, color: accentColor, '--accent-color': accentColor } as React.CSSProperties : undefined}
                        title="Add to Cart"
                        aria-label="Add to Cart"
                    >
                        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                    </button>
                </div>
            </div>

            {/* Sticky Mobile Bar */}
            <MobileStickyBar 
                product={product} 
                selectedVariant={selectedVariant} 
                onAddToCart={handleAddToCart}
                displayPrice={displayPrice}
            />
        </div>
        </>
    );
}
