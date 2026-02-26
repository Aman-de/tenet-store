"use client";

import { useStore } from "@/lib/store";
import { getCartUpsells } from "@/lib/sanity";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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
                dragElastic={0.7} // Stiffer feel
                dragTransition={{ bounceStiffness: 1000, bounceDamping: 100 }} // Near instant snap-back, no bounce
                onDragEnd={() => {
                    const currentX = x.get();
                    if (currentX > 80) {
                        // Swipe Right Action
                        if (!isInWishlist(item.id)) toggleWishlist(item);
                        removeFromCart(item.id, item.selectedSize, item.selectedColor);
                    } else if (currentX < -80) {
                        // Swipe Left Action
                        removeFromCart(item.id, item.selectedSize, item.selectedColor);
                    }
                }}
                className="relative bg-[#FDFBF7] flex gap-4 transition-transform z-10"
            >
                <div className="relative w-20 h-24 bg-neutral-100 shrink-0">
                    {item.images?.[0] && typeof item.images[0] === 'string' && item.images[0].length > 0 ? (
                        <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-[10px] text-center p-1">
                            No Image
                        </div>
                    )}
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
        </div >
    );
};

export default function CartDrawer() {
    const {
        isCartOpen, closeCart, cart, removeFromCart, updateQuantity, getCartTotal,
        toggleWishlist, isInWishlist, addToCart, clearCart,
        checkoutItem, clearCheckoutItem, updateCheckoutItemQuantity
    } = useStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address'>('cart');
    const [address, setAddress] = useState({
        name: "",
        street: "",
        city: "",
        zip: "",
        phone: ""
    });
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
    const [errors, setErrors] = useState({
        name: false,
        street: false,
        city: false,
        zip: false,
        phone: false
    });

    const FREE_SHIPPING_THRESHOLD = 4999;
    const SHIPPING_COST = 70;
    const COD_MIN_THRESHOLD = 12000;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (user) {
            setAddress(prev => ({ ...prev, name: user.fullName || "" }));
        }
    }, [user]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [upsellProducts, setUpsellProducts] = useState<any[]>([]);

    // Fetch Upsell Products
    useEffect(() => {
        const fetchUpsells = async () => {
            if (cart.length > 0) {
                const cartIds = cart.map(item => item.id);
                try {
                    const products = await getCartUpsells(cartIds);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const filtered = products.filter((p: any) => !cartIds.includes(p.id));
                    setUpsellProducts(filtered);
                } catch (error) {
                    console.error("Failed to fetch upsells:", error);
                }
            } else {
                setUpsellProducts([]);
            }
        };

        if (isCartOpen) {
            fetchUpsells();
        }
    }, [cart, isCartOpen]);


    // Logic to switch between Cart and Single Item Checkout
    const cartItems = mounted ? (checkoutItem ? [checkoutItem] : cart) : [];

    // Calculate total depending on mode
    const subtotal = mounted ? (checkoutItem ? (checkoutItem.price * checkoutItem.quantity) : getCartTotal()) : 0;

    // Local wrappers for actions to handle both modes transparently
    const handleDelete = (id: string, size?: string, color?: string) => {
        if (checkoutItem) {
            clearCheckoutItem(); // Clearing the single item closes/resets the specific checkout
            closeCart(); // And close drawer
        } else {
            removeFromCart(id, size, color);
        }
    };

    const handleUpdateQuantity = (id: string, size: string | undefined, color: string | undefined, delta: number) => {
        if (checkoutItem) {
            updateCheckoutItemQuantity(delta);
        } else {
            updateQuantity(id, size, color, delta);
        }
    };

    const handleClose = () => {
        closeCart();
        if (checkoutItem) {
            // Delay clearing to avoid UI flicker during close animation
            setTimeout(() => clearCheckoutItem(), 300);
        }
    };


    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingAmount = isFreeShipping ? 0 : SHIPPING_COST;
    const finalTotal = subtotal + shippingAmount;

    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;

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

    const handleCheckout = async () => {
        // Validation
        // Validation
        const newErrors = {
            name: !address.name,
            street: !address.street,
            city: !address.city,
            zip: !address.zip,
            phone: !address.phone
        };

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }

        const fullAddress = `${address.name}, ${address.street}, ${address.city} - ${address.zip}. Phone: ${address.phone}`;

        // Handle Cash on Delivery
        if (paymentMethod === 'cod') {
            if (finalTotal < COD_MIN_THRESHOLD) {
                alert(`Cash on Delivery is only available for orders above ₹${COD_MIN_THRESHOLD.toLocaleString('en-IN')}`);
                return;
            }

            try {
                const orderRes = await fetch("/api/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cart: cartItems,
                        paymentId: "COD_PENDING",
                        email: user?.primaryEmailAddress?.emailAddress || "guest@tenet.com",
                        totalAmount: finalTotal,
                        shippingAddress: fullAddress
                    }),
                });

                if (orderRes.ok) {
                    if (checkoutItem) {
                        clearCheckoutItem();
                    } else {
                        clearCart();
                    }
                    closeCart();
                    setCheckoutStep('cart');
                    setAddress({ name: "", street: "", city: "", zip: "", phone: "" });
                    setPaymentMethod('razorpay');
                    router.push("/orders");
                } else {
                    alert("Order creation failed. Please contact support.");
                }
            } catch (error) {
                console.error("Order creation error:", error);
                alert("Order creation error. Please contact support.");
            }
            return;
        }

        // Handle Razorpay
        // 1. Load Razorpay Script
        const loadScript = (src: string) => {
            return new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = src;
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // 2. Create Order
        const response = await fetch("/api/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: finalTotal }),
        });

        const data = await response.json();

        if (!data.id) {
            const errorMessage = data.error || data.details || "Server error. Please try again.";
            alert(`Checkout Error: ${errorMessage}`);
            console.error("Razorpay API Error Response:", data);
            return;
        }

        // 3. Initialize Razorpay
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_S9ipLearMTP7iI",
            amount: data.amount,
            currency: data.currency,
            name: "TENET ARCHIVES",
            description: "Luxury Transaction",
            order_id: data.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: async function (response: any) {
                // Payment Successful
                try {
                    const orderRes = await fetch("/api/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            cart: cartItems,
                            paymentId: response.razorpay_payment_id,
                            email: user?.primaryEmailAddress?.emailAddress || "guest@tenet.com",
                            totalAmount: finalTotal,
                            shippingAddress: fullAddress
                        }),
                    });

                    if (orderRes.ok) {
                        clearCart();
                        closeCart();
                        setCheckoutStep('cart'); // Reset step
                        setAddress({ name: "", street: "", city: "", zip: "", phone: "" }); // Reset form
                        router.push("/orders");
                    } else {
                        alert("Payment successful but order creation failed. Please contact support.");
                    }

                } catch (error) {
                    console.error("Order creation error:", error);
                    alert("Order creation error. Please contact support.");
                }
            },
            prefill: {
                name: address.name || user?.fullName || "Tenet Client",
                email: user?.primaryEmailAddress?.emailAddress || "client@tenet.com",
                contact: address.phone || "9999999999",
            },
            theme: {
                color: "#000000",
            },
        };

        // @ts-ignore
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
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
                            <div className="flex items-center gap-3">
                                {checkoutStep === 'address' && (
                                    <button onClick={() => setCheckoutStep('cart')} className="p-1 hover:bg-neutral-100 rounded-full transition-colors mr-1">
                                        <X className="w-4 h-4 text-[#1A1A1A] rotate-45" /> {/* Using X rotated as back or just arrow if preferred, but keeping simple */}
                                    </button>
                                )}
                                <h2 className="font-serif text-xl text-[#1A1A1A]">
                                    {checkoutStep === 'cart'
                                        ? (checkoutItem ? 'Buy Now' : `Shopping Bag (${cart.length})`)
                                        : 'Shipping Details'
                                    }
                                </h2>
                            </div>
                            <button onClick={handleClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#1A1A1A]" />
                            </button>
                        </div>

                        {checkoutStep === 'cart' ? (
                            <>
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
                                            {cartItems.map((item) => (
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
                                                        removeFromCart={handleDelete}
                                                        updateQuantity={handleUpdateQuantity}
                                                        toggleWishlist={toggleWishlist}
                                                        isInWishlist={isInWishlist}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Upsell Strip - Hide during Buy Now? Or maybe suggest pairing? Let's hide to focus. */}
                                {!checkoutItem && upsellProducts.length > 0 && (
                                    <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Pairs Well With</h4>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {upsellProducts.map((prod) => (
                                                <div key={prod.id} className="min-w-[200px] flex items-center gap-3 bg-white p-2 border border-neutral-100 rounded-sm">
                                                    <div className="relative w-12 h-14 bg-neutral-100 shrink-0">
                                                        {prod.images?.[0] && typeof prod.images[0] === 'string' && prod.images[0].length > 0 ? (
                                                            <Image
                                                                src={prod.images[0]}
                                                                alt={prod.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-neutral-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-serif text-[#1A1A1A] truncate">{prod.title}</p>
                                                        <p className="text-xs text-neutral-500">₹{prod.price.toLocaleString()}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            let defaultSize = "M";
                                                            if (prod.sizeType === 'onesize') {
                                                                defaultSize = "One Size";
                                                            } else if (prod.sizes && prod.sizes.length > 0) {
                                                                defaultSize = prod.sizes[0];
                                                            }
                                                            addToCart(prod, defaultSize, prod.colors?.[0]);
                                                        }}
                                                        className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                                                    >
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
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-sans text-neutral-500">
                                        <span>Shipping</span>
                                        <span className={isFreeShipping ? "text-green-700 font-bold" : ""}>
                                            {isFreeShipping ? "FREE" : `₹${SHIPPING_COST}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between font-serif text-xl font-bold border-t border-dashed border-neutral-200 pt-4">
                                        <span>Total</span>
                                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button
                                        className="w-full bg-[#1A1A1A] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 rounded-full"
                                        disabled={cartItems.length === 0}
                                        onClick={() => setCheckoutStep('address')}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-6">
                                        {/* Full Name */}
                                        <div className="group">
                                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${errors.name ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                                Full Name
                                            </label>
                                            <motion.input
                                                type="text"
                                                value={address.name}
                                                onChange={(e) => {
                                                    setAddress({ ...address, name: e.target.value });
                                                    if (errors.name) setErrors({ ...errors, name: false });
                                                }}
                                                animate={errors.name ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                transition={{ duration: 0.4 }}
                                                className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-400
                                                    ${errors.name
                                                        ? 'border-red-500 text-red-700 placeholder:text-red-300'
                                                        : 'border-neutral-300 focus:border-black text-[#1A1A1A]'}`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && (
                                                <span className="text-[10px] text-red-500 font-medium mt-1 block tracking-wide">
                                                    Full Name is required
                                                </span>
                                            )}
                                        </div>

                                        {/* Street Address */}
                                        <div className="group">
                                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${errors.street ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                                Street Address
                                            </label>
                                            <motion.input
                                                type="text"
                                                value={address.street}
                                                onChange={(e) => {
                                                    setAddress({ ...address, street: e.target.value });
                                                    if (errors.street) setErrors({ ...errors, street: false });
                                                }}
                                                animate={errors.street ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                transition={{ duration: 0.4 }}
                                                className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-400
                                                    ${errors.street
                                                        ? 'border-red-500 text-red-700 placeholder:text-red-300'
                                                        : 'border-neutral-300 focus:border-black text-[#1A1A1A]'}`}
                                                placeholder="123 Fashion St"
                                            />
                                            {errors.street && (
                                                <span className="text-[10px] text-red-500 font-medium mt-1 block tracking-wide">
                                                    Street address is required
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            {/* City */}
                                            <div className="group">
                                                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${errors.city ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                                    City
                                                </label>
                                                <motion.input
                                                    type="text"
                                                    value={address.city}
                                                    onChange={(e) => {
                                                        setAddress({ ...address, city: e.target.value });
                                                        if (errors.city) setErrors({ ...errors, city: false });
                                                    }}
                                                    animate={errors.city ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                    transition={{ duration: 0.4 }}
                                                    className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-400
                                                        ${errors.city
                                                            ? 'border-red-500 text-red-700 placeholder:text-red-300'
                                                            : 'border-neutral-300 focus:border-black text-[#1A1A1A]'}`}
                                                    placeholder="New York"
                                                />
                                                {errors.city && (
                                                    <span className="text-[10px] text-red-500 font-medium mt-1 block tracking-wide">
                                                        City is required
                                                    </span>
                                                )}
                                            </div>

                                            {/* ZIP Code */}
                                            <div className="group">
                                                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${errors.zip ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                                    ZIP Code
                                                </label>
                                                <motion.input
                                                    type="text"
                                                    value={address.zip}
                                                    onChange={(e) => {
                                                        setAddress({ ...address, zip: e.target.value });
                                                        if (errors.zip) setErrors({ ...errors, zip: false });
                                                    }}
                                                    animate={errors.zip ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                    transition={{ duration: 0.4 }}
                                                    className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-400
                                                        ${errors.zip
                                                            ? 'border-red-500 text-red-700 placeholder:text-red-300'
                                                            : 'border-neutral-300 focus:border-black text-[#1A1A1A]'}`}
                                                    placeholder="10001"
                                                />
                                                {errors.zip && (
                                                    <span className="text-[10px] text-red-500 font-medium mt-1 block tracking-wide">
                                                        ZIP is required
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div className="group">
                                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${errors.phone ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                                Phone Number
                                            </label>
                                            <motion.input
                                                type="tel"
                                                value={address.phone}
                                                onChange={(e) => {
                                                    setAddress({ ...address, phone: e.target.value });
                                                    if (errors.phone) setErrors({ ...errors, phone: false });
                                                }}
                                                animate={errors.phone ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                transition={{ duration: 0.4 }}
                                                className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-400
                                                    ${errors.phone
                                                        ? 'border-red-500 text-red-700 placeholder:text-red-300'
                                                        : 'border-neutral-300 focus:border-black text-[#1A1A1A]'}`}
                                                placeholder="+91 99999 99999"
                                            />
                                            {errors.phone && (
                                                <span className="text-[10px] text-red-500 font-medium mt-1 block tracking-wide">
                                                    Phone is required
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div className="mt-6">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">Payment Method</label>

                                        <div className="space-y-3">
                                            {/* Online Payment */}
                                            <div
                                                onClick={() => setPaymentMethod('razorpay')}
                                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-black' : 'border-neutral-300'}`}>
                                                        {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-black" />}
                                                    </div>
                                                    <span className="text-sm font-medium text-[#1A1A1A]">Online Payment</span>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded-md">Fastest</span>
                                            </div>

                                            {/* Cash On Delivery */}
                                            <div
                                                onClick={() => setPaymentMethod('cod')}
                                                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-black' : 'border-neutral-300'}`}>
                                                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-black" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-[#1A1A1A]">Cash on Delivery</span>
                                                        {finalTotal < COD_MIN_THRESHOLD && (
                                                            <span className="text-[10px] text-red-500 mt-1">
                                                                Run purchase above ₹{COD_MIN_THRESHOLD.toLocaleString()} for COD
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-neutral-200">
                                    <div className="flex items-center justify-between font-serif text-lg mb-6 pt-4 border-t border-dashed border-neutral-200">
                                        <span>Total Due</span>
                                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button
                                        className="w-full bg-[#1A1A1A] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-black transition-colors rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleCheckout}
                                        disabled={paymentMethod === 'cod' && finalTotal < COD_MIN_THRESHOLD}
                                    >
                                        {paymentMethod === 'razorpay' ? 'Pay Securely Now' : 'Place Order (COD)'}
                                    </button>
                                    <button
                                        onClick={() => setCheckoutStep('cart')}
                                        className="w-full mt-3 text-xs text-neutral-500 hover:text-black py-2"
                                    >
                                        Back to Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
