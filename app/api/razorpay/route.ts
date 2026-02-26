import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";


export async function POST(req: Request) {
    try {
        const { amount } = await req.json(); // Amount in INR (e.g., 500 for ₹500)

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_S9ipLearMTP7iI";
        const keySecret = process.env.RAZORPAY_KEY_SECRET || "czWQScZA42r6K4DQnJcHi9Ot";

        if (!keyId || !keySecret) {
            console.error("Razorpay credentials missing:", {
                hasKeyId: !!keyId,
                hasKeySecret: !!keySecret,
            });
            return NextResponse.json(
                { error: "Payment service configuration error" },
                { status: 500 }
            );
        }

        const instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const options = {
            amount: Math.round(amount * 100), // Razorpay works in paise, ensure integer
            currency: "INR",
            receipt: shortid.generate(),
        };

        const order = await instance.orders.create(options);
        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error: any) {
        console.error("Razorpay order creation failed:", error?.message || error);
        return NextResponse.json(
            { error: "Order creation failed", details: error?.message },
            { status: 500 }
        );
    }
}
