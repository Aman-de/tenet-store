"use client";

import { useStore } from "@/lib/store";
import { trackAddToCart } from "@/lib/analytics";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

// Helper Component for Swipeable logic
const WishlistItemRow = ({ item, removeFromWishlist, addToCart }: any) => {
    const x = useMotionValue(0);
    const [swipeState, setSwipeState] = useState<'idle' | 'bag' | 'remove'>('idle');

    // Move to Bag Feedback (Swipe Right) - Values > 0
    const bagOpacity = useTransform(x, [0, 50], [0, 1], { clamp: true });
    const bagScale = useTransform(x, [0, 100], [0.8, 1.2], { clamp: true });
    const bagPointerEvents = useTransform(x, (val) => (val > 10 ? "auto" : "none"));

    // Remove Feedback (Swipe Left) - Values < 0
    const removeOpacity = useTransform(x, [-50, 0], [1, 0], { clamp: true });
    const removeScale = useTransform(x, [-100, 0], [1.2, 0.8], { clamp: true });
    const removePointerEvents = useTransform(x, (val) => (val < -10 ? "auto" : "none"));

    const handleMoveToCart = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        await animate(x, 400, { duration: 0.2 });
        addToCart(item, undefined, undefined);
        trackAddToCart(item, 1, undefined, undefined);
        removeFromWishlist(item.id);
    };

    const handleRemoveAction = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        await animate(x, -400, { duration: 0.2 });
        removeFromWishlist(item.id);
    };

    // Smoothly snap to state bounds
    useEffect(() => {
        if (swipeState === 'remove') {
            animate(x, -80, { type: "spring", stiffness: 350, damping: 30 });
        } else if (swipeState === 'bag') {
            animate(x, 80, { type: "spring", stiffness: 350, damping: 30 });
        } else {
            animate(x, 0, { type: "spring", stiffness: 350, damping: 30 });
        }
    }, [swipeState]);

    const handleInteractiveClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        if (swipeState !== 'idle') {
            setSwipeState('idle');
        } else {
            action();
        }
    };

    return (
        <div className="relative group overflow-hidden bg-neutral-100 dark:bg-[#141414]">
            {/* Left Background Layer (Swipe Right -> Move to Bag) */}
            <motion.div
                style={{ opacity: bagOpacity, pointerEvents: bagPointerEvents }}
                onClick={handleMoveToCart}
                className="absolute inset-y-0 left-0 w-1/2 bg-black flex items-center justify-start px-6 z-0 cursor-pointer select-none"
            >
                <motion.div style={{ scale: bagScale }} className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-white" />
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Move to Bag</span>
                </motion.div>
            </motion.div>

            {/* Right Background Layer (Swipe Left -> Remove) */}
            <motion.div
                style={{ opacity: removeOpacity, pointerEvents: removePointerEvents }}
                onClick={handleRemoveAction}
                className="absolute inset-y-0 right-0 w-1/2 bg-red-600 flex items-center justify-end px-6 z-0 cursor-pointer select-none"
            >
                <motion.div style={{ scale: removeScale }} className="flex items-center gap-2">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Remove</span>
                    <Trash2 className="w-5 h-5 text-white" />
                </motion.div>
            </motion.div>

            {/* Draggable Item */}
            <motion.div
                style={{ x, touchAction: "pan-y" }}
                drag="x"
                dragDirectionLock={true}
                dragConstraints={{ left: -100, right: 100 }}
                dragElastic={0.15}
                onDragEnd={(e, info) => {
                    const threshold = 40;
                    const offset = info.offset.x;
                    const velocity = info.velocity.x;

                    if (offset < -threshold || velocity < -300) {
                        setSwipeState('remove');
                    } else if (offset > threshold || velocity > 300) {
                        setSwipeState('bag');
                    } else {
                        setSwipeState('idle');
                    }
                }}
                onClick={() => {
                    if (swipeState !== 'idle') {
                        setSwipeState('idle');
                    }
                }}
                className="relative bg-[#FDFBF7] dark:bg-[#0A0A0A] flex gap-4 z-10 w-full cursor-grab active:cursor-grabbing"
            >
                <Link href={`/product/${item.handle}`} className="relative w-24 h-32 bg-neutral-100 dark:bg-[#141414] shrink-0 block overflow-hidden group pointer-events-none">
                    {item.images?.[0] && typeof item.images[0] === 'string' && item.images[0].length > 0 ? (
                        <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-[10px] text-center p-1">
                            No Image
                        </div>
                    )}
                </Link>
                <div className="flex-1 flex flex-col justify-between py-1 pr-4">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start">
                            <Link 
                                href={`/product/${item.handle}`} 
                                onClick={(e) => {
                                    if (swipeState !== 'idle') {
                                        e.preventDefault();
                                        setSwipeState('idle');
                                    }
                                }}
                                className="font-serif text-sm text-[#1A1A1A] dark:text-[#F4F1ED] hover:underline hover:decoration-1 underline-offset-4 line-clamp-2 pointer-events-auto select-none"
                            >
                                {item.title}
                            </Link>
                            <button onClick={(e) => handleInteractiveClick(e, () => removeFromWishlist(item.id))} className="text-neutral-400 hover:text-red-800 p-1 pointer-events-auto">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A] dark:text-[#F4F1ED] select-none">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                        onClick={(e) => handleInteractiveClick(e, handleMoveToCart)}
                        className="flex items-center justify-center gap-2 w-full bg-white dark:bg-[#111111] border border-[#1A1A1A] text-[#1A1A1A] dark:text-[#F4F1ED] py-2 text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors rounded-full pointer-events-auto"
                    >
                        <ShoppingBag className="w-3 h-3" />
                        Move to Bag
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default function WishlistDrawer() {
    const { isWishlistOpen, closeWishlist, wishlist, removeFromWishlist, addToCart } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const wishlistItems = mounted ? wishlist : [];

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isWishlistOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isWishlistOpen]);

    return (
        <AnimatePresence>
            {isWishlistOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeWishlist}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#FDFBF7] dark:bg-[#0A0A0A] shadow-2xl z-[70] flex flex-col border-l border-neutral-200 dark:border-neutral-800 md:rounded-l-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111]">
                            <h2 className="font-serif text-xl text-[#1A1A1A] dark:text-[#F4F1ED]">Wishlist ({wishlist.length})</h2>
                            <button onClick={closeWishlist} className="p-2 hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] dark:bg-[#141414] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#1A1A1A] dark:text-[#F4F1ED]" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {wishlistItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                                    <Heart className="w-12 h-12 opacity-20" />
                                    <p className="font-sans text-sm">Your wishlist is empty.</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {wishlistItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <WishlistItemRow
                                                item={item}
                                                removeFromWishlist={removeFromWishlist}
                                                addToCart={addToCart}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {wishlistItems.length > 0 && (
                            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111]">
                                <button
                                    onClick={closeWishlist}
                                    className="w-full bg-[#1A1A1A] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-black transition-colors rounded-full"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
