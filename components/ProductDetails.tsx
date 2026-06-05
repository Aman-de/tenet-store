"use client";

import { useStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle, Heart, Ruler, Star, Loader2, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import Image from "next/image";
import SizeGuide from "./SizeGuide";
import ShareButton from "./ShareButton";
import MobileStickyBar from "./MobileStickyBar";
import { Product, Review, Variant } from "@/lib/data";
import { createReview } from "@/app/actions";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { useUser } from "@clerk/nextjs";
import useEmblaCarousel from "embla-carousel-react";

interface ProductDetailsProps {
    product: Product;
    reviews?: Review[];
}

// Review Form Component
const ReviewForm = ({ productId, onCancel }: { productId: string, onCancel: () => void }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

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
        <form action={handleSubmit} className="bg-neutral-50 p-6 rounded-sm space-y-4 mt-4 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-serif text-lg">Write a Review</h4>
            <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-bold text-neutral-500">Name</label>
                <input required name="name" className="w-full p-2 border border-neutral-200 focus:border-[#1A1A1A] outline-none text-sm" placeholder="Your name" />
            </div>
            <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-bold text-neutral-500">Rating</label>
                <select required name="rating" className="w-full p-2 border border-neutral-200 focus:border-[#1A1A1A] outline-none text-sm bg-white">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest font-bold text-neutral-500">Comment</label>
                <textarea required name="comment" rows={3} className="w-full p-2 border border-neutral-200 focus:border-[#1A1A1A] outline-none text-sm" placeholder="Share your thoughts..." />
            </div>

            {message && (
                <p className={cn("text-xs font-medium", message.includes("Thank you") ? "text-green-700" : "text-red-600")}>
                    {message}
                </p>
            )}

            <div className="flex gap-2 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#1A1A1A] text-white py-3 text-xs uppercase tracking-widest hover:bg-black disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                    Submit Review
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 border border-neutral-200 text-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-white"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default function ProductDetails({ product, reviews = [] }: ProductDetailsProps) {
    const { addToCart, openCart, toggleWishlist, isInWishlist, setCheckoutItem } = useStore();

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

    // GA4 View Item Tracking
    useEffect(() => {
        if (product) {
            trackViewItem(product);
        }
    }, [product.id]);

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
                    className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
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
                            <div className="pb-4 text-sm font-sans text-neutral-600 leading-relaxed">
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
        <div className="max-w-[2000px] w-full mx-auto px-0 md:px-8 xl:px-12 pt-0 xl:pt-14 grid grid-cols-1 lg:landscape:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.3fr_1fr] 2xl:grid-cols-[1.5fr_1fr] gap-0 lg:landscape:gap-16 xl:gap-20 2xl:gap-28">
            <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

            {/* Left Column: Gallery */}
            {/* Mobile/Tablet: Infinite Looping Carousel using Embla */}
            <div className="block lg:landscape:hidden xl:hidden relative w-full aspect-[3/4] mb-6 overflow-hidden" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {displayImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="flex-[0_0_100%] h-full relative"
                        >
                            {img ? (
                                <Image
                                    src={img}
                                    alt={`${product.title} - View ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                    quality={90}
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-200" />
                            )}
                        </div>
                    ))}
                </div>

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
                                "relative w-20 h-28 lg:w-28 lg:h-36 xl:w-32 xl:h-44 shrink-0 border transition-all",
                                selectedImageIndex === idx ? "border-[#1A1A1A] opacity-100 ring-1 ring-[#1A1A1A] ring-offset-1" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            {img ? (
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-100" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="relative flex-1 aspect-[3/4] bg-neutral-100 overflow-hidden">
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
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                <span className="text-neutral-400 text-xs uppercase tracking-widest">No Image</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="flex flex-col pt-4 px-4 md:px-0">
                {/* Breadcrumb pseudo */}
                <span className="text-xs uppercase tracking-widest text-neutral-400 mb-4">{product.category}</span>

                <h1 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] mb-4 flex justify-between items-start">
                    {product.title}
                    <ShareButton
                        title={product.title}
                        className="text-neutral-400 hover:text-[#1A1A1A] mt-1"
                        iconSize={20}
                    />
                </h1>

                <div className="flex items-center gap-4 mb-4">
                    {product.originalPrice && <span className="text-neutral-400 line-through text-lg">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
                    <span className="text-2xl text-[#1A1A1A]">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.discountLabel && !product.isOutOfStock && <span className="text-xs bg-black text-white px-2 py-1 uppercase">{product.discountLabel}</span>}
                    {product.isOutOfStock && <span className="text-xs bg-red-600 text-white px-2 py-1 uppercase font-bold tracking-widest">Out of Stock</span>}
                </div>

                {/* Rating Mini Summary */}
                {reviews.length > 0 && (
                    <div className="flex items-center gap-1 mb-8">
                        <div className="flex text-[#1A1A1A]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("w-4 h-4", i < Math.round(averageRating) ? "fill-current" : "text-neutral-300")} />
                            ))}
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">({reviews.length} Reviews)</span>
                    </div>
                )}
                {reviews.length === 0 && <div className="mb-8" />}


                {/* Color Selector (Variants) */}
                {hasVariants ? (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Color</span>
                            <span className="text-xs font-serif text-[#1A1A1A]">{selectedVariant?.colorName}</span>
                        </div>
                        <div className="flex gap-3">
                            {product.variants!.map((variant) => (
                                <button
                                    key={variant.colorName}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border border-neutral-200 transition-all relative",
                                        selectedVariant?.colorName === variant.colorName ? "ring-2 ring-offset-2 ring-[#1A1A1A]" : "hover:scale-110"
                                    )}
                                    style={{ backgroundColor: variant.colorHex }}
                                    title={variant.colorName}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Legacy Colors Fallback */
                    <div className="mb-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-3">Color</span>
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
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-3">
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
                                    className="flex items-center gap-1 text-xs text-[#1A1A1A] font-medium border-b border-[#1A1A1A] pb-0.5 hover:opacity-70 transition-opacity"
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
                                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                            : error
                                                ? "border-red-300 text-[#1A1A1A] bg-red-50 hover:border-red-500"
                                                : "border-neutral-200 text-[#1A1A1A] hover:border-[#1A1A1A]"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <div className="mt-4 px-4 py-3 bg-[#F8F9FA] rounded-[24px] text-sm text-[#1A1A1A] font-medium flex items-center gap-2">
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

                {/* Action Buttons */}
                <div className="flex gap-3 mb-10">
                    <div className="flex-1 flex flex-col gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.isOutOfStock}
                            className={cn(
                                "w-full py-4 font-sans uppercase tracking-widest transition-all text-sm font-bold border",
                                product.isOutOfStock
                                    ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                                    : "bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-neutral-50 active:scale-[0.99]"
                            )}
                        >
                            {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={product.isOutOfStock}
                            className={cn(
                                "w-full py-4 font-sans uppercase tracking-widest transition-all text-sm font-bold shadow-md",
                                product.isOutOfStock
                                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed hidden" // Optionally hide Buy Now entirely
                                    : "bg-[#1A1A1A] text-white hover:bg-black hover:shadow-lg active:scale-[0.99]"
                            )}
                        >
                            {product.isOutOfStock ? "Unavailable" : "Buy Now"}
                        </button>
                    </div>
                    {/* Wishlist Button */}
                    <button
                        onClick={() => toggleWishlist(product as any)}
                        className={cn(
                            "w-[60px] flex items-center justify-center border transition-all",
                            isWishlisted
                                ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                                : "bg-white border-neutral-200 text-[#1A1A1A] hover:border-[#1A1A1A]"
                        )}
                        title="Add to Wishlist"
                    >
                        <Heart className={cn("w-6 h-6", isWishlisted && "fill-current")} />
                    </button>
                </div>

                {/* Pincode Check */}
                <div className="mt-8 border-t border-neutral-200 pt-6 mb-8">
                    <h4 className="text-sm font-bold text-[#1A1A1A] mb-3 font-sans">Check Delivery Details</h4>
                    <div className="flex gap-2 mb-3">
                        <input 
                            type="text" 
                            placeholder="Enter 6-digit Pincode" 
                            value={pincode}
                            onChange={handlePincodeChange}
                            className={cn(
                                "w-full border px-4 py-3 text-sm focus:outline-none transition-colors",
                                pincodeError ? "border-red-300 focus:border-red-500 bg-red-50" : "border-neutral-200 focus:border-[#1A1A1A]"
                            )}
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
                <div className="grid grid-cols-3 gap-2 py-6 border-t border-neutral-100 mb-6 text-center">
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
                            <div className="border border-neutral-200 rounded-lg p-6 bg-white">
                                <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">About Tenet</h3>
                                <p className="text-sm text-neutral-600 mb-6">Tenet is a luxury fashion brand based in India. The brand brings the latest international trends of prints, colour and style ...<span className="text-red-500 cursor-pointer">read more</span></p>
                                
                                <div className="grid grid-cols-4 gap-4 text-center mb-6 border-b border-neutral-100 pb-6">
                                    <div>
                                        <div className="font-bold text-xl text-[#1A1A1A]">5+</div>
                                        <div className="text-[10px] text-neutral-500 uppercase">Years</div>
                                    </div>
                                    <div className="border-l border-neutral-100">
                                        <div className="font-bold text-xl text-[#1A1A1A]">95k+</div>
                                        <div className="text-[10px] text-neutral-500 uppercase">Orders Fulfilled</div>
                                    </div>
                                    <div className="border-l border-neutral-100">
                                        <div className="font-bold text-xl text-[#1A1A1A]">4.8</div>
                                        <div className="text-[10px] text-neutral-500 uppercase">Average Rating</div>
                                    </div>
                                    <div className="border-l border-neutral-100">
                                        <div className="font-bold text-xl text-[#1A1A1A]">10k+</div>
                                        <div className="text-[10px] text-neutral-500 uppercase">Ratings</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-center text-[#1A1A1A] mb-3">What customers say about this brand</h4>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <span className="text-xs bg-[#F8F9FA] border border-neutral-200 px-3 py-1.5 rounded-full text-neutral-600">Value for money • 3457</span>
                                        <span className="text-xs bg-[#F8F9FA] border border-neutral-200 px-3 py-1.5 rounded-full text-neutral-600">Quality matches the price • 2282</span>
                                        <span className="text-xs bg-[#F8F9FA] border border-neutral-200 px-3 py-1.5 rounded-full text-neutral-600">Great Quality • 144</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Header */}
                            <div className="text-center pb-4">
                                <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">Customer Reviews</h3>
                                <div className="flex justify-center items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current text-[#FF8C94]" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-neutral-600">4.8 ({reviews.length} reviews)</span>
                                </div>
                                
                                {!isReviewFormOpen ? (
                                    <button
                                        onClick={() => setIsReviewFormOpen(true)}
                                        className="bg-[#FF8C94] text-white px-8 py-3 rounded-md font-medium text-sm hover:bg-[#ff7b84] transition-colors"
                                    >
                                        Write a review
                                    </button>
                                ) : (
                                    <ReviewForm productId={product.id} onCancel={() => setIsReviewFormOpen(false)} />
                                )}
                            </div>

                            {/* Reviews List */}
                            {reviews.length === 0 ? (
                                <p className="text-neutral-400 italic text-sm text-center">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="border border-neutral-200 rounded-lg p-6 bg-[#FDFDFD] space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-neutral-100 last:border-0 pb-6 last:pb-0">
                                            <div className="flex mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current text-[#FF8C94]" : "text-neutral-300")} />
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-bold text-[#1A1A1A] text-sm">{review.name}</h4>
                                                <span className="text-[10px] border border-[#1A1A1A] rounded-full px-2 py-0.5 text-[#1A1A1A]">Verified</span>
                                            </div>
                                            <span className="text-xs text-neutral-400 block mb-3">{new Date(review.date).toLocaleDateString()}</span>
                                            
                                            <p className="font-bold text-sm text-[#1A1A1A] mb-1">{review.comment.split('.')[0]}</p>
                                            <p className="text-neutral-600 text-sm mb-4">{review.comment}</p>
                                            
                                            {/* Review Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2 mb-3 mt-2 overflow-x-auto pb-2 scrollbar-hide">
                                                    {review.images.map((img, idx) => (
                                                        <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200">
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
            </div>

            {/* Sticky Mobile Bar */}
            <MobileStickyBar product={product} selectedVariant={selectedVariant} />
        </div>
    );
}
