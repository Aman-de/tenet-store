"use client";

import { useStore } from "@/lib/store";
import { checkout } from "@/lib/checkout";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Mock Upsell Products
const UPSELL_PRODUCTS = [
    { id: "upsell_1", title: "Silk Pocket Square", price: 1200, image: "/images/product-placeholder.jpg" },
    { id: "upsell_2", title: "Leather Belt", price: 2500, image: "/images/product-placeholder.jpg" }
];

// Helper Component for Swipeable logic with visual feedback
const CartItemRow = ({ item, removeFromCart, updateQuantity, toggleWishlist, isInWishlist }: any) => {
    const x = useMotionValue(0);

    // Wishlist Feedback (Swipe Right) - Values > 0
    const wishlistOpacity = useTransform(x, [0, 50], [0, 1]);
    const wishlistScale = useTransform(x, [0, 100], [0.8, 1.2]);

    // Remove Feedback (Swipe Left) - Values < 0
    // Maps -100 to -50 pixels drag to opacity 1 to 0.5? No.
    // Standard: 0 -> -50: Opacity 0 -> 1.
    const removeOpacity = useTransform(x, [-50, 0], [1, 0]);
    const removeScale = useTransform(x, [-100, 0], [1.2, 0.8]);

    return (
        <div className="relative group overflow-hidden bg-neutral-100"> {/* Logic: Bg color leaks if we don't cover it. */}
            {/* Left Background Layer (Visible when swiping RIGHT -> Wishlist) */}
            <motion.div
                style={{ opacity: wishlistOpacity }}
                className="absolute inset-y-0 left-0 w-full bg-black flex items-center justify-start px-6 z-0"
            >
                <motion.div style={{ scale: wishlistScale }}>
                    <Heart className="w-6 h-6 text-white" fill="white" />
                </motion.div>
                <span className="text-white text-xs font-bold uppercase tracking-widest ml-4">Wishlist</span>
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
                dragElastic={0.6} // Slightly stiffer
                onDragEnd={() => {
                    const currentX = x.get();
                    if (currentX > 100) {
                        // Swipe Right Action
                        if (!isInWishlist(item.id)) toggleWishlist(item);
                        removeFromCart(item.id, item.selectedSize, item.selectedColor);
                    } else if (currentX < -100) {
                        // Swipe Left Action
                        removeFromCart(item.id, item.selectedSize, item.selectedColor);
                    }
                }}
                className="relative bg-[#FDFBF7] flex gap-4 transition-transform z-10"
            >
                <div className="relative w-20 h-24 bg-neutral-100 shrink-0">
                    <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-serif text-sm text-[#1A1A1A]">{item.title}</h3>
                        {/* Remove text button also exists, keeping it for accessibility/desktop */}
                        <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-xs text-neutral-400 hover:text-red-800">Remove</button>
                    </div>
                    <p className="text-sm font-sans text-neutral-500">
                        {item.selectedSize && <span className="mr-2">Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span className="block w-3 h-3 rounded-full border border-gray-300 inline-block align-middle" style={{ backgroundColor: item.selectedColor }}></span>}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-sm">
                            <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)}
                                className="p-1 hover:bg-neutral-100 transition-colors"
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="w-3 h-3 text-neutral-600" />
                            </button>
                            <span className="px-2 text-xs font-sans text-[#1A1A1A] w-6 text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)}
                                className="p-1 hover:bg-neutral-100 transition-colors"
                            >
                                <Plus className="w-3 h-3 text-neutral-600" />
                            </button>
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A] ml-auto">
                            ₹{item.price.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default function CartDrawer() {
    const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, getCartTotal, toggleWishlist, isInWishlist } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const total = mounted ? getCartTotal() : 0;
    const cartItems = mounted ? cart : [];
    const FREE_SHIPPING_THRESHOLD = 5000;
    const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const isFreeShipping = total >= FREE_SHIPPING_THRESHOLD;
    const amountNeeded = FREE_SHIPPING_THRESHOLD - total;

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#FDFBF7] shadow-2xl z-[70] flex flex-col border-l border-neutral-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-white">
                            <h2 className="font-serif text-xl text-[#1A1A1A]">Shopping Bag ({cart.length})</h2>
                            <button onClick={closeCart} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#1A1A1A]" />
                            </button>
                        </div>

                        {/* Smart Progress Bar */}
                        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                            <div className="mb-2 text-xs font-medium text-center uppercase tracking-wide text-[#1A1A1A]">
                                {isFreeShipping ? (
                                    <span className="text-green-800">You&apos;ve unlocked Free Shipping</span>
                                ) : (
                                    <span>Spend ₹{amountNeeded.toLocaleString('en-IN')} more for Free Shipping</span>
                                )}
                            </div>
                            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className={`h-full ${isFreeShipping ? 'bg-green-700' : 'bg-[#1A1A1A]'}`}
                                />
                            </div>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                                    <ShoppingBag className="w-12 h-12 opacity-20" />
                                    <p className="font-sans text-sm">Your bag is empty.</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                                            layout
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CartItemRow
                                                item={item}
                                                removeFromCart={removeFromCart}
                                                updateQuantity={updateQuantity}
                                                toggleWishlist={toggleWishlist}
                                                isInWishlist={isInWishlist}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Upsell Strip */}
                        {cart.length > 0 && (
                            <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Pairs Well With</h4>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {UPSELL_PRODUCTS.map((prod) => (
                                        <div key={prod.id} className="min-w-[200px] flex items-center gap-3 bg-white p-2 border border-neutral-100 rounded-sm">
                                            <div className="relative w-12 h-14 bg-neutral-100 shrink-0">
                                                {/* Placeholder for now since we don't have separate images */}
                                                <div className="w-full h-full bg-neutral-200" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-serif text-[#1A1A1A] truncate">{prod.title}</p>
                                                <p className="text-xs text-neutral-500">₹{prod.price.toLocaleString()}</p>
                                            </div>
                                            <button className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                                                <Plus className="w-4 h-4 text-[#1A1A1A]" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="p-6 border-t border-neutral-200 bg-white space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-between font-serif text-lg">
                                <span>Subtotal</span>
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-xs text-neutral-400 text-center font-sans">Shipping and taxes calculated at checkout.</p>
                            <button
                                className="w-full bg-[#1A1A1A] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                                disabled={cart.length === 0}
                                onClick={() => checkout(cart)}
                            >
                                Checkout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
