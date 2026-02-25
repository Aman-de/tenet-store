"use client";

import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertCircle, Heart, Ruler, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import SizeGuide from "./SizeGuide";
import ShareButton from "./ShareButton";
import MobileStickyBar from "./MobileStickyBar";
import { Product, Review, Variant } from "@/lib/data";
import { createReview } from "@/app/actions";

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

    // Reset image index when variant changes or images update
    useEffect(() => {
        setSelectedImageIndex(0);
    }, [selectedVariant, displayImages.length]);

    const isWishlisted = isInWishlist(product.id);
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
    const showSizeSelector = product.sizeType !== 'onesize';

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

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
            openCart();
        }
    }

    const handleBuyNow = () => {
        if (product.isOutOfStock) return;
        const selection = validateSelection();
        if (selection) {
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
        <div className="max-w-7xl mx-auto px-0 md:px-6 pt-0 md:pt-10 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-20">
            <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

            {/* Left Column: Gallery */}
            {/* Mobile: Swipeable Carousel */}
            <div className="block md:hidden relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 mb-6">
                <motion.div
                    className="flex h-full"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            setSelectedImageIndex((prev) => (prev + 1) % displayImages.length);
                        } else if (swipe > swipeConfidenceThreshold) {
                            setSelectedImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
                        }
                    }}
                    animate={{ x: `-${selectedImageIndex * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {displayImages.map((img, idx) => (
                        <div key={idx} className="min-w-full h-full relative">
                            {img ? (
                                <Image
                                    src={img}
                                    alt={`View ${idx}`}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-100" />
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Mobile Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {displayImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all shadow-sm",
                                selectedImageIndex === idx ? "bg-white scale-125" : "bg-white/50"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop: Vertical Stack & Thumbnails */}
            <div className="hidden md:flex gap-6 sticky top-24 h-fit">
                {/* Thumbnails */}
                <div className="flex flex-col gap-4">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={cn(
                                "relative w-20 h-24 shrink-0 border border-transparent transition-all",
                                selectedImageIndex === idx ? "border-[#1A1A1A]" : "opacity-60 hover:opacity-100"
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

                {/* Description Accordions */}
                <div className="divide-y divide-neutral-200 border-t border-neutral-200">
                    <AccordionItem title="Description" defaultOpen>
                        Crafted from the finest materials, this piece embodies the essence of silent luxury. Designed for the modern gentleman who values heritage and quality above all else. Perfect for layering in the cooler months.
                    </AccordionItem>
                    <AccordionItem title="Material & Care">
                        100% Premium Cashmere blend.<br />
                        Dry clean only. Do not bleach.<br />
                        Store folded to maintain shape.
                    </AccordionItem>
                    <AccordionItem title="Delivery & Returns">
                        Free standard shipping on all orders over ₹10,000.<br />
                        Returns accepted within 14 days of delivery in original condition.
                    </AccordionItem>
                    <AccordionItem title={`Reviews (${reviews.length})`}>
                        <div className="space-y-6">
                            {/* Review Form Toggle */}
                            {!isReviewFormOpen ? (
                                <button
                                    onClick={() => setIsReviewFormOpen(true)}
                                    className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-70"
                                >
                                    Write a Review
                                </button>
                            ) : (
                                <ReviewForm productId={product.id} onCancel={() => setIsReviewFormOpen(false)} />
                            )}

                            {reviews.length === 0 ? (
                                <p className="text-neutral-400 italic text-sm">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="space-y-6 mt-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-[#1A1A1A] text-sm">{review.name}</h4>
                                                <div className="flex text-[#1A1A1A]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-current" : "text-neutral-300")} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-neutral-600 text-sm mb-2">{review.comment}</p>
                                            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</span>
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
