import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

export async function POST(req: Request) {
    const { amount } = await req.json();

    // Initialize Razorpay
    const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create Order Options
    const payment_capture = 1;
    const currency = "INR";
    const options = {
        amount: (amount * 100).toString(), // Razorpay accepts smallest currency unit
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        return NextResponse.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.error("Razorpay Error:", error);
        return NextResponse.json(
            { message: "Unable to create order", error },
            { status: 500 }
        );
    }
}
