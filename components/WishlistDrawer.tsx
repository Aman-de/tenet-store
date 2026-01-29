"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

// Helper Component for Swipeable logic
const WishlistItemRow = ({ item, removeFromWishlist, addToCart }: any) => {
    const x = useMotionValue(0);

    // Move to Bag Feedback (Swipe Right) - Values > 0
    const bagOpacity = useTransform(x, [0, 50], [0, 1]);
    const bagScale = useTransform(x, [0, 100], [0.8, 1.2]);

    // Remove Feedback (Swipe Left) - Values < 0
    const removeOpacity = useTransform(x, [-50, 0], [1, 0]);
    const removeScale = useTransform(x, [-100, 0], [1.2, 0.8]);

    const handleMoveToCart = () => {
        addToCart(item, undefined, undefined);
        removeFromWishlist(item.id);
    };

    return (
        <div className="relative group overflow-hidden bg-neutral-100">
            {/* Left Background Layer (Visible when swiping RIGHT -> Move to Bag) */}
            <motion.div
                style={{ opacity: bagOpacity }}
                className="absolute inset-y-0 left-0 w-full bg-black flex items-center justify-start px-6 z-0"
            >
                <motion.div style={{ scale: bagScale }}>
                    <ShoppingBag className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-white text-xs font-bold uppercase tracking-widest ml-4">Move to Bag</span>
            </motion.div>

            {/* Right Background Layer (Visible when swiping LEFT -> Remove) */}
            <motion.div
                style={{ opacity: removeOpacity }}
                className="absolute inset-y-0 right-0 w-full bg-red-600 flex items-center justify-end px-6 z-0"
            >
                <span className="text-white text-xs font-bold uppercase tracking-widest mr-4">Remove</span>
                <motion.div style={{ scale: removeScale }}>
                    <Trash2 className="w-6 h-6 text-white" />
                </motion.div>
            </motion.div>

            {/* Draggable Item */}
            <motion.div
                style={{ x, touchAction: "pan-y" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.9}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
                onDragEnd={() => {
                    const currentX = x.get();
                    if (currentX > 80) {
                        // Swipe Right Action -> Move to Bag
                        handleMoveToCart();
                    } else if (currentX < -80) {
                        // Swipe Left Action -> Remove
                        removeFromWishlist(item.id);
                    }
                }}
                className="relative bg-[#FDFBF7] flex gap-4 transition-transform z-10"
            >
                <Link href={`/product/${item.handle}`} className="relative w-24 h-32 bg-neutral-100 shrink-0 block overflow-hidden group">
                    <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start">
                            <Link href={`/product/${item.handle}`} className="font-serif text-sm text-[#1A1A1A] hover:underline hover:decoration-1 underline-offset-4 line-clamp-2">
                                {item.title}
                            </Link>
                            {/* Desktop/Accessible Remove Button */}
                            <button onClick={() => removeFromWishlist(item.id)} className="text-neutral-400 hover:text-red-800 p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A]">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                        onClick={handleMoveToCart}
                        className="flex items-center justify-center gap-2 w-full bg-white border border-[#1A1A1A] text-[#1A1A1A] py-2 text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors rounded-full"
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
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#FDFBF7] shadow-2xl z-[70] flex flex-col border-l border-neutral-200 md:rounded-l-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-white">
                            <h2 className="font-serif text-xl text-[#1A1A1A]">Wishlist ({wishlist.length})</h2>
                            <button onClick={closeWishlist} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#1A1A1A]" />
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
                            <div className="p-6 border-t border-neutral-200 bg-white">
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
