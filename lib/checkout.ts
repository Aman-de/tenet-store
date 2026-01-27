import { CartItem } from "./store";

export const checkout = async (cartItems: CartItem[]) => {
    // 1. Calculate Total Amount
    const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // 2. Create Order on Server
    const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount }),
    });

    const order = await response.json();

    if (!order.id) {
        alert("Server error. Are you online?");
        return;
    }

    // 3. Load Razorpay SDK
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const res = await loadRazorpay();

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    // 4. Open Razorpay Modal
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "TENET ARCHIVES",
        description: "Luxury Transaction",
        image: "/logo.png", // Optional: Add logo if available
        order_id: order.id,
        handler: function (response: any) {
            alert("Payment Successful. Payment ID: " + response.razorpay_payment_id);
            // Here you would clear cart, update database, redirect to success page
        },
        prefill: {
            name: "Valued Customer",
            email: "guest@example.com",
            contact: "9999999999",
        },
        theme: {
            color: "#000000", // Luxury Black
        },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
};
