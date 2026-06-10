"use client";

import { useStore } from "@/lib/store";
import { getCartUpsells } from "@/lib/sanity";
import { trackBeginCheckout, trackPurchase, trackAddToCart } from "@/lib/analytics";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Heart, Trash2, ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { checkReferralCodeValidity, trackReferralClick, trackReferralJoin } from "@/app/actions";

// Helper Component for Swipeable logic with visual feedback
const CartItemRow = ({ item, removeFromCart, updateQuantity, toggleWishlist, isInWishlist }: any) => {
    const x = useMotionValue(0);
    const [swipeState, setSwipeState] = useState<'idle' | 'wishlist' | 'remove'>('idle');

    // Wishlist Feedback (Swipe Right) - Values > 0
    const wishlistOpacity = useTransform(x, [0, 50], [0, 1], { clamp: true });
    const wishlistScale = useTransform(x, [0, 100], [0.8, 1.2], { clamp: true });
    const wishlistPointerEvents = useTransform(x, (val) => (val > 10 ? "auto" : "none"));

    // Remove Feedback (Swipe Left) - Values < 0
    const removeOpacity = useTransform(x, [-50, 0], [1, 0], { clamp: true });
    const removeScale = useTransform(x, [-100, 0], [1.2, 0.8], { clamp: true });
    const removePointerEvents = useTransform(x, (val) => (val < -10 ? "auto" : "none"));

    // Smoothly snap to state bounds
    useEffect(() => {
        if (swipeState === 'remove') {
            animate(x, -80, { type: "spring", stiffness: 350, damping: 30 });
        } else if (swipeState === 'wishlist') {
            animate(x, 80, { type: "spring", stiffness: 350, damping: 30 });
        } else {
            animate(x, 0, { type: "spring", stiffness: 350, damping: 30 });
        }
    }, [swipeState]);

    const handleWishlistAction = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await animate(x, 400, { duration: 0.2 });
        if (!isInWishlist(item.id)) toggleWishlist(item);
        removeFromCart(item.id, item.selectedSize, item.selectedColor, item.selectedPiece);
    };

    const handleRemoveAction = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        await animate(x, -400, { duration: 0.2 });
        removeFromCart(item.id, item.selectedSize, item.selectedColor, item.selectedPiece);
    };

    const handleInteractiveClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        if (swipeState !== 'idle') {
            setSwipeState('idle');
        } else {
            action();
        }
    };

    return (
        <div className="relative group overflow-hidden bg-neutral-100">
            {/* Left Background Layer (Swipe Right -> Wishlist) */}
            <motion.div
                style={{ opacity: wishlistOpacity, pointerEvents: wishlistPointerEvents }}
                onClick={handleWishlistAction}
                className="absolute inset-y-0 left-0 w-1/2 bg-black flex items-center justify-start px-6 z-0 cursor-pointer select-none"
            >
                <motion.div style={{ scale: wishlistScale }} className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-white" fill="white" />
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Wishlist</span>
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
                        setSwipeState('wishlist');
                    } else {
                        setSwipeState('idle');
                    }
                }}
                onClick={() => {
                    if (swipeState !== 'idle') {
                        setSwipeState('idle');
                    }
                }}
                className="relative bg-[#FDFBF7] flex gap-4 z-10 w-full cursor-grab active:cursor-grabbing"
            >
                <div className="relative w-20 h-24 bg-neutral-100 shrink-0">
                    {item.images?.[0] && typeof item.images[0] === 'string' && item.images[0].length > 0 ? (
                        <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover pointer-events-none"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-[10px] text-center p-1">
                            No Image
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-serif text-sm text-[#1A1A1A] select-none">{item.title}</h3>
                        <button onClick={(e) => handleInteractiveClick(e, handleRemoveAction)} className="text-xs text-neutral-500 hover:text-red-800 pointer-events-auto">Remove</button>
                    </div>
                    <p className="text-sm font-sans text-neutral-500 select-none">
                        {item.selectedSize && <span className="mr-2">Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span className="block w-3 h-3 rounded-full border border-gray-300 inline-block align-middle" style={{ backgroundColor: item.selectedColor }}></span>}
                        {item.selectedPiece && item.selectedPiece !== 'set' && (
                            <span className="block text-[10px] text-neutral-500 font-medium capitalize mt-0.5">
                                Piece: {item.selectedPiece} only
                            </span>
                        )}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 rounded-sm bg-white pointer-events-auto">
                            <button
                                onClick={(e) => handleInteractiveClick(e, () => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1, item.selectedPiece))}
                                className="p-1 hover:bg-neutral-100 transition-colors"
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="w-3 h-3 text-neutral-600" />
                            </button>
                            <span className="px-2 text-xs font-sans text-[#1A1A1A] w-6 text-center select-none">{item.quantity}</span>
                            <button
                                onClick={(e) => handleInteractiveClick(e, () => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1, item.selectedPiece))}
                                className="p-1 hover:bg-neutral-100 transition-colors"
                            >
                                <Plus className="w-3 h-3 text-neutral-600" />
                            </button>
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A] ml-auto select-none">
                            ₹{item.price.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div >
    );
};

export default function CartDrawer() {
    const { openSignIn } = useClerk();
    const {
        isCartOpen, closeCart, openCart, cart, removeFromCart, updateQuantity, getCartTotal,
        toggleWishlist, isInWishlist, addToCart, clearCart,
        checkoutItem, clearCheckoutItem, updateCheckoutItemQuantity,
        referralCode, setReferralCode
    } = useStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();

    // Auto-open cart if redirected back from sign-in
    useEffect(() => {
        if (searchParams.get('cart') === 'open') {
            openCart();
            // Clean up URL so it doesn't reopen if they refresh
            router.replace('/');
        }
        
        // Referral Tracking
        const refParam = searchParams.get('ref');
        if (refParam && typeof refParam === 'string') {
            const cleanCode = refParam.toUpperCase();
            setReferralCode(cleanCode);
            trackReferralClick(cleanCode);
            // Optional: clean up URL
            router.replace('/');
        }
    }, [searchParams, openCart, router, setReferralCode]);

    // Track user join if referral code exists in store
    useEffect(() => {
        if (user && referralCode) {
            const referredByCode = user.unsafeMetadata?.referredByCode;
            if (!referredByCode && user.id) {
                // Ensure we don't trigger join for own code
                const ownCode = user.unsafeMetadata?.referralCode;
                if (ownCode !== referralCode) {
                    trackReferralJoin(user.id, referralCode);
                }
            }
        }
    }, [user, referralCode]);

    const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address'>('cart');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [hasAutoLocated, setHasAutoLocated] = useState(false);
    const [address, setAddress] = useState({
        name: "",
        houseNumber: "",
        street: "",
        city: "",
        zip: "",
        phone: ""
    });
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
    const [errors, setErrors] = useState({
        name: false,
        houseNumber: false,
        street: false,
        city: false,
        zip: false,
        phone: false
    });

    const [isLocating, setIsLocating] = useState(false);
    
    // Coupon State
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, percent: number, isReferral?: boolean} | null>(null);
    const [couponError, setCouponError] = useState("");

    const VALID_COUPONS: Record<string, number> = {
        'CREATOR15': 0.15,
        'FIRST20': 0.20,
    };

    const handleApplyCoupon = async () => {
        setCouponError("");
        const code = couponInput.trim().toUpperCase();
        if (!code) return;
        
        if (VALID_COUPONS[code]) {
            setAppliedCoupon({ code, percent: VALID_COUPONS[code] });
            setCouponInput("");
        } else {
            try {
                const userEmail = user?.emailAddresses?.[0]?.emailAddress;
                const res = await checkReferralCodeValidity(code, userEmail);
                if (res.isValid) {
                    setAppliedCoupon({ code, percent: 0.15, isReferral: true });
                    setCouponInput("");
                } else {
                    setCouponError(res.message || "Invalid coupon code");
                }
            } catch (err) {
                console.error("Error validating referral code:", err);
                setCouponError("Invalid coupon code");
            }
        }
    };
    
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError("");
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`);
                if (!res.ok) throw new Error("Network response was not ok");
                
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

                    setAddress(prev => ({
                        ...prev,
                        street: street || data.display_name || "",
                        city: city,
                        zip: zip
                    }));
                } else {
                    throw new Error(data.error || "No data returned");
                }
            } catch (error: any) {
                console.error("Error fetching address:", error);
                alert(`Could not fetch address: ${error?.message || "Unknown error"}`);
            } finally {
                setIsLocating(false);
            }
        }, (error) => {
            console.error("Geolocation error:", error);
            alert(`Unable to retrieve your location: ${error?.message}`);
            setIsLocating(false);
        });
    };

    const FREE_SHIPPING_THRESHOLD = 499;
    const SHIPPING_COST = 70;
    const COD_MIN_THRESHOLD = 2000;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (checkoutStep === 'address' && !address.street && !hasAutoLocated) {
            handleUseCurrentLocation();
            setHasAutoLocated(true);
        }
    }, [checkoutStep, address.street, hasAutoLocated]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (user) {
            const savedAddress = user.unsafeMetadata?.address as any;
            if (savedAddress) {
                setAddress(prev => ({ 
                    ...prev, 
                    name: user.fullName || "",
                    phone: user.primaryPhoneNumber?.phoneNumber || "",
                    ...savedAddress
                }));
                // If they have a saved address, don't show the form by default
                if (savedAddress.street && savedAddress.city) {
                    setIsEditingAddress(false);
                }
            } else {
                setAddress(prev => ({
                    ...prev,
                    name: user.fullName || "",
                    phone: user.primaryPhoneNumber?.phoneNumber || ""
                }));
                setIsEditingAddress(true);
            }
        }
    }, [user]);

     
    const [upsellProducts, setUpsellProducts] = useState<any[]>([]);

    // Fetch Upsell Products
    useEffect(() => {
        const fetchUpsells = async () => {
            if (cart.length > 0) {
                const cartIds = cart.map(item => item.id);
                try {
                    const products = await getCartUpsells(cartIds);
                     
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
    const rawSubtotal = mounted ? (checkoutItem ? (checkoutItem.price * checkoutItem.quantity) : getCartTotal()) : 0;
    
    // Calculate Offers
    let b2g1Discount = 0;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= 3) {
        const allItemPrices: number[] = [];
        cartItems.forEach(item => {
            for (let i = 0; i < item.quantity; i++) allItemPrices.push(item.price);
        });
        allItemPrices.sort((a, b) => a - b);
        const freeItems = Math.floor(totalQuantity / 3);
        for (let i = 0; i < freeItems; i++) {
            b2g1Discount += allItemPrices[i];
        }
    }

    const afterB2G1 = rawSubtotal - b2g1Discount;
    let couponDiscount = appliedCoupon ? (afterB2G1 * appliedCoupon.percent) : 0;
    
    // Auto-apply referral discount if present and no coupon is manually entered
    let activeReferral = false;
    if (referralCode && !appliedCoupon) {
        couponDiscount = afterB2G1 * 0.15; // 15% for guest
        activeReferral = true;
    }

    const totalDiscount = b2g1Discount + couponDiscount;
    const subtotal = Math.max(0, rawSubtotal - totalDiscount);
    
    // Wallet Logic
    const walletBalance = user?.unsafeMetadata?.walletBalance as number || 0;
    const [useWallet, setUseWallet] = useState(false);
    
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingAmount = isFreeShipping ? 0 : SHIPPING_COST;
    const totalBeforeWallet = subtotal + shippingAmount;
    
    const walletDeduction = useWallet ? Math.min(walletBalance, totalBeforeWallet) : 0;
    const finalTotal = totalBeforeWallet - walletDeduction;

    // Local wrappers for actions to handle both modes transparently
    const handleDelete = (id: string, size?: string, color?: string, piece?: 'top' | 'bottom' | 'set') => {
        if (checkoutItem) {
            clearCheckoutItem(); // Clearing the single item closes/resets the specific checkout
            closeCart(); // And close drawer
        } else {
            removeFromCart(id, size, color, piece);
        }
    };

    const handleUpdateQuantity = (id: string, size: string | undefined, color: string | undefined, delta: number, piece?: 'top' | 'bottom' | 'set') => {
        if (checkoutItem) {
            updateCheckoutItemQuantity(delta);
        } else {
            updateQuantity(id, size, color, delta, piece);
        }
    };

    const handleClose = () => {
        closeCart();
        if (checkoutItem) {
            // Delay clearing to avoid UI flicker during close animation
            setTimeout(() => clearCheckoutItem(), 300);
        }
    };


    // Calculate Offers above has `const totalBeforeWallet` and `finalTotal`...

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
            houseNumber: !address.houseNumber,
            street: !address.street,
            city: !address.city,
            zip: !address.zip,
            phone: !address.phone
        };

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }

        const fullAddress = `${address.name}, ${address.houseNumber}, ${address.street}, ${address.city} - ${address.zip}. Phone: ${address.phone}`;

        // Handle Cash on Delivery Rules
        if (paymentMethod === 'cod' && finalTotal < COD_MIN_THRESHOLD) {
            alert(`Cash on Delivery is only available for orders above ₹${COD_MIN_THRESHOLD.toLocaleString('en-IN')}`);
            return;
        }

        // Determine amount to charge via Razorpay
        // For COD, charge 15% upfront
        const amountToCharge = paymentMethod === 'cod' 
            ? Math.round(finalTotal * 0.15) 
            : finalTotal;

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
            body: JSON.stringify({ amount: amountToCharge }),
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
            description: paymentMethod === 'cod' ? "15% Advance (COD Confirmation)" : "Luxury Transaction",
            order_id: data.id,
             
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
                            userId: user?.id || null,
                            totalAmount: totalBeforeWallet, // before wallet
                            amountPaid: amountToCharge,
                            walletUsed: walletDeduction,
                            referralCode: activeReferral ? referralCode : (appliedCoupon?.isReferral ? appliedCoupon.code : null),
                            paymentMethod: paymentMethod === 'cod' ? 'PARTIAL_COD' : 'RAZORPAY',
                            shippingAddress: fullAddress
                        }),
                    });

                    if (orderRes.ok) {
                        trackPurchase(response.razorpay_payment_id, cartItems, finalTotal, 0, shippingAmount);
                        clearCart();
                        closeCart();
                        setCheckoutStep('cart'); // Reset step
                        setAddress({ name: "", houseNumber: "", street: "", city: "", zip: "", phone: "" }); // Reset form
                        setUseWallet(false);
                        if (activeReferral) {
                            setReferralCode(null); // Clear referral after use
                        }
                        if (user) {
                            try {
                                await user.update({ unsafeMetadata: { address } });
                            } catch (e) {
                                console.error("Failed to save address to Clerk:", e);
                            }
                        }
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
                                    <button aria-label="Back to cart" onClick={() => setCheckoutStep('cart')} className="p-1 hover:bg-neutral-100 rounded-full transition-colors mr-1">
                                        <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" />
                                    </button>
                                )}
                                <h2 className="font-serif text-xl text-[#1A1A1A]">
                                    {checkoutStep === 'cart'
                                        ? (checkoutItem ? 'Buy Now' : `Shopping Bag (${cart.length})`)
                                        : 'Shipping Details'
                                    }
                                </h2>
                            </div>
                            <button aria-label="Close cart" onClick={handleClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
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
                                        <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                                            <ShoppingBag className="w-12 h-12 opacity-20" />
                                            <p className="font-sans text-sm">Your bag is empty.</p>
                                        </div>
                                    ) : (
                                        <AnimatePresence initial={false}>
                                            {cartItems.map((item) => (
                                                <motion.div
                                                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${item.selectedPiece || 'set'}`}
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
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Pairs Well With</h3>
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
                                                            trackAddToCart(prod, 1, defaultSize, prod.colors?.[0]);
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
                                        <span className="line-through text-neutral-500 mr-2 text-sm">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    {b2g1Discount > 0 && (
                                        <div className="flex items-center justify-between text-xs font-sans text-green-600 font-bold">
                                            <span>Buy 2 Get 1 Free</span>
                                            <span>-₹{b2g1Discount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between text-xs font-sans text-green-600 font-bold">
                                            <span>{appliedCoupon.code} ({(appliedCoupon.percent * 100)}% Off)</span>
                                            <div className="flex items-center gap-2">
                                                <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                                                <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700 ml-1">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {activeReferral && (
                                        <div className="flex items-center justify-between text-xs font-sans text-green-600 font-bold">
                                            <span>Circle Invite (15% Off)</span>
                                            <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    
                                    {/* Coupon Input Area */}
                                    {!appliedCoupon && !activeReferral && (
                                        <div className="flex flex-col gap-1 mt-2 mb-2">
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter discount code" 
                                                    value={couponInput}
                                                    onChange={(e) => {
                                                        setCouponInput(e.target.value);
                                                        setCouponError("");
                                                    }}
                                                    className="flex-1 border border-neutral-300 rounded-sm px-3 py-2 text-xs font-sans outline-none focus:border-black uppercase"
                                                />
                                                <button 
                                                    onClick={handleApplyCoupon}
                                                    disabled={!couponInput.trim()}
                                                    className="bg-black text-white px-4 text-xs font-bold tracking-widest uppercase rounded-sm disabled:opacity-50"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {couponError && <span className="text-[10px] text-red-500">{couponError}</span>}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs font-sans text-neutral-500">
                                        <span>Shipping</span>
                                        <span className={isFreeShipping ? "text-green-700 font-bold" : ""}>
                                            {isFreeShipping ? "FREE" : `₹${SHIPPING_COST}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between font-serif text-xl font-bold border-t border-dashed border-neutral-200 pt-4">
                                        <span>Total</span>
                                        <span>₹{totalBeforeWallet.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button
                                        className="w-full bg-[#1A1A1A] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 rounded-full"
                                        disabled={cartItems.length === 0}
                                        onClick={() => {
                                            if (!user) {
                                                closeCart();
                                                openSignIn({ forceRedirectUrl: '/?cart=open' });
                                                return;
                                            }
                                            trackBeginCheckout(cartItems, finalTotal);
                                            setCheckoutStep('address');
                                        }}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                                <div className="space-y-4 flex-1">
                                    {(!isEditingAddress && address.street && address.city) ? (
                                        <div className="space-y-6">
                                            <div className="p-4 border border-neutral-200 rounded-2xl bg-neutral-50 relative group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Main Address</span>
                                                    <button 
                                                        onClick={() => setIsEditingAddress(true)}
                                                        className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-black transition-colors"
                                                    >
                                                        Edit / Change
                                                    </button>
                                                </div>
                                                <div className="text-sm text-neutral-700 leading-relaxed font-sans">
                                                    <p className="font-bold text-black">{address.name}</p>
                                                    {address.houseNumber && <p>{address.houseNumber}</p>}
                                                    <p>{address.street}</p>
                                                    <p>{address.city} - {address.zip}</p>
                                                    <p className="mt-2 text-neutral-500">{address.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
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
                                                className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-500
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

                                        {/* House Number */}
                                        <div className="group">
                                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-colors ${errors.houseNumber ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                                House No. / Building Name
                                            </label>
                                            <motion.input
                                                type="text"
                                                value={address.houseNumber}
                                                onChange={(e) => {
                                                    setAddress({ ...address, houseNumber: e.target.value });
                                                    if (errors.houseNumber) setErrors({ ...errors, houseNumber: false });
                                                }}
                                                animate={errors.houseNumber ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                transition={{ duration: 0.4 }}
                                                className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-500
                                                    ${errors.houseNumber
                                                        ? 'border-red-500 text-red-700 placeholder:text-red-300'
                                                        : 'border-neutral-300 focus:border-black text-[#1A1A1A]'}`}
                                                placeholder="Flat 101, Luxury Towers"
                                            />
                                        </div>

                                        {/* Street Address */}
                                        <div className="group">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className={`block text-xs font-bold uppercase tracking-widest transition-colors ${errors.street ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                                                    Street Address
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleUseCurrentLocation}
                                                    disabled={isLocating}
                                                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A] hover:text-black transition-colors"
                                                >
                                                    <MapPin className="w-3 h-3" />
                                                    {isLocating ? "Locating..." : "Use Current Location"}
                                                </button>
                                            </div>
                                            <motion.input
                                                type="text"
                                                value={address.street}
                                                onChange={(e) => {
                                                    setAddress({ ...address, street: e.target.value });
                                                    if (errors.street) setErrors({ ...errors, street: false });
                                                }}
                                                animate={errors.street ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                transition={{ duration: 0.4 }}
                                                className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-500
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
                                                    className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-500
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
                                                    className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-500
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
                                                autoComplete="tel"
                                                value={address.phone}
                                                onChange={(e) => {
                                                    setAddress({ ...address, phone: e.target.value });
                                                    if (errors.phone) setErrors({ ...errors, phone: false });
                                                }}
                                                animate={errors.phone ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                                                transition={{ duration: 0.4 }}
                                                className={`w-full border-b py-3 text-sm outline-none bg-transparent transition-all placeholder:text-neutral-500
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
                                    )}

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
                                                onClick={() => finalTotal >= COD_MIN_THRESHOLD && setPaymentMethod('cod')}
                                                className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                                                    finalTotal < COD_MIN_THRESHOLD 
                                                        ? 'border-neutral-100 bg-neutral-50/50 cursor-not-allowed opacity-50' 
                                                        : paymentMethod === 'cod' 
                                                            ? 'border-black bg-neutral-50 cursor-pointer' 
                                                            : 'border-neutral-200 bg-white hover:border-neutral-300 cursor-pointer'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-black' : 'border-neutral-300'}`}>
                                                        {paymentMethod === 'cod' && finalTotal >= COD_MIN_THRESHOLD && <div className="w-2 h-2 rounded-full bg-black" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-[#1A1A1A]">Cash on Delivery</span>
                                                        {finalTotal < COD_MIN_THRESHOLD && (
                                                            <span className="text-[10px] text-red-500 mt-1 font-sans">
                                                                Cash on Delivery is available on orders above ₹{COD_MIN_THRESHOLD.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Wallet Balance Usage */}
                                    {walletBalance > 0 && (
                                        <div className="mt-6 border border-black rounded-xl p-4 bg-black text-white flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold tracking-widest uppercase">Circle Wallet</span>
                                                <span className="text-xs text-neutral-500 mt-1">Available: ₹{walletBalance.toLocaleString('en-IN')}</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={useWallet}
                                                    onChange={(e) => setUseWallet(e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                                            </label>
                                        </div>
                                    )}

                                </div>

                                <div className="mt-8 pt-6 border-t border-neutral-200">
                                    {walletDeduction > 0 && (
                                        <div className="flex items-center justify-between text-sm font-sans mb-3 text-green-700 font-bold">
                                            <span>Wallet Credit Applied</span>
                                            <span>-₹{walletDeduction.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between font-serif text-lg mb-6 pt-4 border-t border-dashed border-neutral-200">
                                        <span>Total Due</span>
                                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button
                                        className="w-full bg-[#1A1A1A] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-black transition-colors rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleCheckout}
                                        disabled={paymentMethod === 'cod' && finalTotal < COD_MIN_THRESHOLD}
                                    >
                                        {paymentMethod === 'razorpay' ? 'Pay Securely Now' : `Pay 15% Advance (₹${Math.round(finalTotal * 0.15).toLocaleString('en-IN')})`}
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
