"use client";

import { useStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle, Heart, Ruler, Star, Loader2, Truck, ShieldCheck, RefreshCw, ShoppingBag } from "lucide-react";
import Image from "next/image";
import SizeGuide from "./SizeGuide";
import ShareButton from "./ShareButton";
import MobileStickyBar from "./MobileStickyBar";
import { Product, Review, Variant } from "@/lib/data";
import { createReview } from "@/app/actions";
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
            <h4 className="font-serif text-lg text-[#1A1A1A] font-medium">Write a Review</h4>
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

    // Derived State
    const currentImages = (selectedVariant ? selectedVariant.images : product.images)?.filter(Boolean);
    // Fallback: If variant has no images, use product default images to prevent crash
    const displayImages = currentImages && currentImages.length > 0 ? currentImages : product.images.filter(Boolean);

    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    // If variants exist, use variant color. Else fallback to product.colors
    // Actually, distinct colors might be flat in data vs variants. 
    // Let's assume selecting a variant sets the "color".
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [isMainImgLoading, setIsMainImgLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    const [loadedThumbnails, setLoadedThumbnails] = useState<Record<number, boolean>>({});

    useEffect(() => {
        setIsMainImgLoading(true);
    }, [selectedVariant?.colorName, selectedImageIndex]);
    
    // Pincode State
    const { user } = useUser();
    const [pincode, setPincode] = useState("");
    const [deliveryInfo, setDeliveryInfo] = useState<{ date: string, free: boolean } | null>(null);
    const [pincodeError, setPincodeError] = useState<string | null>(null);

    const handleCheckPincode = async (code: string) => {
        setPincodeError(null);
        setDeliveryInfo(null);
        
        if (code.length === 6) {
            if (!/^[1-9][0-9]{5}$/.test(code)) {
                setPincodeError("Oops, we don't deliver to this pincode or it is invalid.");
                return;
            }

            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
                const data = await res.json();
                
                const days = 3;

                if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
                    const city = data[0].PostOffice[0].District || data[0].PostOffice[0].Block || "your location";
                    setDeliveryInfo({ 
                        date: `Delivery available in ${city} in ${days} days`, 
                        free: true 
                    });
                } else {
                    setPincodeError("Oops, we don't deliver to this pincode or it is invalid.");
                }
            } catch (err) {
                const days = 3;
                setDeliveryInfo({ 
                    date: `Delivery available in ${days} days`, 
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

    // Reset image index when variant changes or images update
    useEffect(() => {
        setSelectedImageIndex(0);
        if (emblaApi) emblaApi.scrollTo(0);
    }, [selectedVariant?.colorName, displayImages.length, emblaApi]);

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
            <div className="border-b border-neutral-200">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-3 flex items-center justify-between text-left focus:outline-none group"
                >
                    <span className="font-serif text-lg text-[#1A1A1A] group-hover:text-neutral-600 transition-colors">{title}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pb-3 text-sm font-sans text-neutral-600 leading-relaxed">
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
            addToCart(product, selection.size, selection.color);
            trackAddToCart(product, 1, selection.size, selection.color);
            openCart();
        }
    }

    const handleBuyNow = () => {
        if (product.isOutOfStock) return;
        const selection = validateSelection();
        if (selection) {
            trackAddToCart(product, 1, selection.size, selection.color);
            setCheckoutItem({
                ...product,
                quantity: 1,
                selectedSize: selection.size,
                selectedColor: selection.color
            });
            // setCheckoutItem automatically opens cart in store logic
        }
    };

    return (
        <div className="max-w-[2000px] w-full mx-auto px-0 md:px-8 xl:px-12 pt-0 xl:pt-14 grid grid-cols-1 lg:landscape:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-0 lg:landscape:gap-[4vw] xl:gap-[6vw] 2xl:gap-[8vw]">
            <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

            {/* Left Column: Gallery */}
            {/* Mobile/Tablet: Infinite Looping Carousel using Embla */}
            <div className="block lg:landscape:hidden xl:hidden relative w-full aspect-[3/4] mb-6 overflow-hidden" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {displayImages.map((img, idx) => (
                        <div 
                            key={idx} 
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
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow-md active:scale-95 transition-all text-[#1A1A1A]"
                    title="Add to Wishlist"
                    aria-label="Wishlist"
                >
                    <Heart 
                        className="w-5 h-5 transition-all duration-300"
                        style={isWishlisted ? { fill: accentColor, stroke: accentColor } : { stroke: "currentColor" }} 
                        strokeWidth={2} 
                    />
                </button>

                {/* Mobile Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {displayImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToIndex(idx)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all shadow-sm",
                                selectedImageIndex === idx ? "bg-white scale-125" : "bg-white/50"
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
                                        alt={`Thumbnail ${idx}`}
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
                        initial={{ opacity: 0 }}
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
                                <span className="text-neutral-400 text-xs uppercase tracking-widest">No Image</span>
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
            <div className="flex flex-col pt-4 px-4 md:px-0 lg:max-w-[480px] xl:max-w-[540px] 2xl:max-w-[600px] w-full">
                {/* Breadcrumb pseudo */}
                <span className="text-xs uppercase tracking-widest text-neutral-400 mb-2">{product.category}</span>

                <h1 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] mb-2 flex justify-between items-start">
                    {product.title}
                    <ShareButton
                        title={product.title}
                        className="text-neutral-400 hover:text-[#1A1A1A] mt-1"
                        iconSize={20}
                    />
                </h1>

                <div className="flex items-center gap-4 mb-2">
                    {product.originalPrice && <span className="text-neutral-400 line-through text-lg">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
                    <span className="text-2xl text-[#1A1A1A]">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && product.originalPrice > product.price && !product.isOutOfStock && (
                        <div className="flex items-center gap-2">
                            <span 
                                className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
                                style={{ backgroundColor: accentColor }}
                            >
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                            <span 
                                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border bg-neutral-50/50"
                                style={{ color: accentColor, borderColor: `${accentColor}30` }}
                            >
                                SAVE ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                            </span>
                        </div>
                    )}
                    {product.isOutOfStock && <span className="text-xs bg-red-600 text-white px-2 py-1 uppercase font-bold tracking-widest">Out of Stock</span>}
                </div>

                {/* Rating Mini Summary */}
                {reviews.length > 0 && (
                    <div className="flex items-center gap-1 mb-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={cn("w-4 h-4", i < Math.round(averageRating) ? "" : "text-neutral-300")} 
                                    style={i < Math.round(averageRating) ? { fill: accentColor, color: accentColor } : undefined}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">({reviews.length} Reviews)</span>
                    </div>
                )}
                {reviews.length === 0 && <div className="mb-4" />}


                {/* Color Selector (Variants) */}
                {hasVariants ? (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Color</span>
                            <span className="text-xs font-serif text-[#1A1A1A]">{selectedVariant?.colorName}</span>
                        </div>
                        <div className="flex gap-3">
                            {product.variants!.map((variant) => (
                                <button
                                    key={variant.colorName}
                                    onClick={() => setSelectedVariant(variant)}
                                    className="w-8 h-8 rounded-full border border-neutral-200 transition-all relative hover:scale-110"
                                    style={{ 
                                        backgroundColor: variant.colorHex,
                                        boxShadow: selectedVariant?.colorName === variant.colorName 
                                            ? `0 0 0 2px white, 0 0 0 4px ${accentColor}` 
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
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-2">Color</span>
                        <div className="flex gap-3">
                            {product.colors && product.colors.map((color) => (
                                <div
                                    key={color}
                                    className="w-8 h-8 rounded-full border border-neutral-200"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selector */}
                {showSizeSelector && (
                    <div id="size-selector-section" className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Size</span>
                            <div className="flex items-center gap-4">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-xs text-red-600 flex items-center gap-1 font-medium"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {error}
                                    </motion.div>
                                )}
                                <button
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="flex items-center gap-1 text-xs font-medium border-b pb-0.5 hover:opacity-70 transition-opacity"
                                    style={{ color: accentColor, borderColor: accentColor }}
                                >
                                    <Ruler className="w-3 h-3" />
                                    Size Guide
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => { setSelectedSize(size); setError(null); }}
                                    className={cn(
                                        "w-12 h-12 border flex items-center justify-center font-sans text-sm transition-all",
                                        selectedSize === size
                                            ? "text-white"
                                            : error
                                                ? "border-red-300 text-[#1A1A1A] bg-red-50 hover:border-red-500"
                                                : "border-neutral-200 text-[#1A1A1A] hover:border-[#1A1A1A]"
                                    )}
                                    style={selectedSize === size ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <div className="mt-3 px-4 py-2.5 bg-[#F8F9FA] rounded-[24px] text-sm text-[#1A1A1A] font-medium flex items-center gap-2">
                                {selectedSize === "S" && "Product Bust 36 in • Product Waist 34 in • Product Hip 40 in"}
                                {selectedSize === "M" && "Product Bust 38 in • Product Waist 36 in • Product Hip 42 in"}
                                {selectedSize === "L" && "Product Bust 40 in • Product Waist 38 in • Product Hip 44 in"}
                                {selectedSize === "XL" && "Product Bust 42 in • Product Waist 40 in • Product Hip 46 in"}
                                {selectedSize === "2XL" && "Product Bust 44 in • Product Waist 42 in • Product Hip 48 in"}
                                {selectedSize === "3XL" && "Product Bust 46 in • Product Waist 44 in • Product Hip 50 in"}
                                {(!["S", "M", "L", "XL", "2XL", "3XL"].includes(selectedSize)) && `Standard fit for size ${selectedSize}`}
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons (Desktop Only) */}
                <div className="hidden md:flex gap-2 mb-6">
                    <button
                        onClick={handleBuyNow}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "flex-grow h-[56px] flex items-center justify-center font-sans uppercase tracking-widest text-xs md:text-sm font-bold shadow-md hover:scale-[1.01] hover:brightness-[1.04] hover:shadow-xl active:scale-[0.98] transition-all duration-300",
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
                            "w-[53px] h-[56px] flex items-center justify-center border shrink-0 hover:scale-[1.05] active:scale-[0.95] hover:bg-[var(--accent-color)] hover:text-white transition-all duration-300",
                            product.isOutOfStock
                                ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
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
                <div className="mt-6 border-t border-neutral-200 pt-4 mb-4">
                    <h4 className="text-sm font-bold text-[#1A1A1A] mb-2 font-sans">Check Delivery Details</h4>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text" 
                            placeholder="Enter 6-digit Pincode" 
                            value={pincode}
                            onChange={handlePincodeChange}
                            className={cn(
                                "w-full border px-4 py-3 text-sm focus:outline-none transition-colors",
                                pincodeError ? "border-red-300 focus:border-red-500 bg-red-50" : "border-neutral-200 focus:border-[var(--accent-color)]"
                            )}
                            style={{ '--accent-color': accentColor } as React.CSSProperties}
                            maxLength={6}
                        />
                    </div>
                    {pincodeError && (
                        <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{pincodeError}</span>
                        </div>
                    )}
                    {deliveryInfo && (
                        <div className="flex items-center gap-2 text-sm text-[#1A1A1A] mt-2">
                            <Truck className="w-4 h-4 text-green-600" />
                            <span>{deliveryInfo.date}</span>
                            <span className="text-neutral-400">•</span>
                            <span className="text-green-600 font-medium">Free Shipping</span>
                        </div>
                    )}
                </div>

                {/* Micro-Trust Badges */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-neutral-100 mb-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                        <Truck className="w-4 h-4 text-neutral-500 stroke-[1.5]" />
                        <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]">Free Shipping</span>
                        <span className="font-sans text-[9px] text-neutral-400 uppercase">Express across India</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 border-x border-neutral-200">
                        <ShieldCheck className="w-4 h-4 text-neutral-500 stroke-[1.5]" />
                        <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]">Secure Payment</span>
                        <span className="font-sans text-[9px] text-neutral-400 uppercase">UPI & Cards via Razorpay</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                        <RefreshCw className="w-4 h-4 text-neutral-500 stroke-[1.5]" />
                        <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]">Easy Exchange</span>
                        <span className="font-sans text-[9px] text-neutral-400 uppercase">Hassle-free 7-day returns</span>
                    </div>
                </div>

                {/* Description Accordions */}
                <div className="divide-y divide-neutral-200 border-t border-neutral-200">
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
                            <div className="border border-neutral-100 rounded-2xl p-6 bg-neutral-50/30">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">About Tenet</h3>
                                        <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
                                            TENET is defined by silent luxury—clean silhouettes, exceptional natural materials, and meticulous tailoring curated for the modern wardrobe.
                                        </p>
                                    </div>
                                    <div className="flex gap-4 text-center border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                                        <div>
                                            <div className="font-serif text-lg text-[#1A1A1A]">4.8★</div>
                                            <div className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Patron Rating</div>
                                        </div>
                                        <div className="border-l border-neutral-100 pl-4">
                                            <div className="font-serif text-lg text-[#1A1A1A]">10k+</div>
                                            <div className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Reviews</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100/50">
                                    <span 
                                        className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border"
                                        style={{ color: accentColor, borderColor: `${accentColor}20`, backgroundColor: `${accentColor}05` }}
                                    >
                                        Premium Cashmere & Wool
                                    </span>
                                    <span 
                                        className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border"
                                        style={{ color: accentColor, borderColor: `${accentColor}20`, backgroundColor: `${accentColor}05` }}
                                    >
                                        Artisanal Craftsmanship
                                    </span>
                                    <span 
                                        className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border"
                                        style={{ color: accentColor, borderColor: `${accentColor}20`, backgroundColor: `${accentColor}05` }}
                                    >
                                        Effortless Modularity
                                    </span>
                                </div>
                            </div>

                            {/* Reviews Header */}
                            <div className="text-center pb-6 pt-4 border-b border-neutral-100">
                                <h3 className="font-serif text-2xl text-[#1A1A1A] mb-2 font-medium">Customer Reviews</h3>
                                <div className="flex justify-center items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4.5 h-4.5" style={{ fill: accentColor, color: accentColor }} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-neutral-600 font-medium">4.8 ({reviews.length} reviews)</span>
                                </div>
                                
                                {!isReviewFormOpen ? (
                                    <button
                                        onClick={() => setIsReviewFormOpen(true)}
                                        className="text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md transition-all duration-300"
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
                                <p className="text-neutral-400 italic text-sm text-center py-8">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    {reviews.map((review) => (
                                        <div 
                                            key={review.id} 
                                            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    {/* User Initials Avatar */}
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-neutral-600 bg-neutral-100 uppercase select-none">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-[#1A1A1A] text-sm">{review.name}</h4>
                                                            <span className="text-[9px] bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5 uppercase tracking-wider font-bold">Verified Buy</span>
                                                        </div>
                                                        <span className="text-[10px] text-neutral-400 block font-sans">{new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={cn("w-3.5 h-3.5", i < review.rating ? "" : "text-neutral-200")} 
                                                            style={i < review.rating ? { fill: accentColor, color: accentColor } : undefined}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <p className="font-serif text-base text-[#1A1A1A] mb-1.5 font-medium">{review.comment.split('.')[0]}</p>
                                            <p className="text-neutral-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                                            
                                            {/* Review Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-3 mb-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                                                    {review.images.map((img, idx) => (
                                                        <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-zoom-in">
                                                            <Image 
                                                                src={img} 
                                                                alt={`Review photo ${idx + 1}`} 
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
                <div className="md:hidden sticky bottom-0 left-0 right-0 z-30 bg-[#FDFBF7] py-5 pb-safe -mx-4 px-4 flex gap-2">
                    <button
                        onClick={handleBuyNow}
                        disabled={product.isOutOfStock}
                        className={cn(
                            "flex-grow h-[56px] flex items-center justify-center font-sans uppercase tracking-widest text-xs font-bold shadow-md hover:scale-[1.01] hover:brightness-[1.04] active:scale-[0.98] transition-all duration-300",
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
                            "w-[53px] h-[56px] flex items-center justify-center border shrink-0 hover:scale-[1.05] active:scale-[0.95] hover:bg-[var(--accent-color)] hover:text-white transition-all duration-300",
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
            />
        </div>
    );
}
