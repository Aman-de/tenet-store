import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";


export async function POST(req: Request) {
    const { amount } = await req.json(); // Amount in INR (e.g., 500 for ₹500)

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json({ error: "Razorpay credentials missing" }, { status: 500 });
    }

    const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount * 100, // Razorpay works in paise
        currency: "INR",
        receipt: shortid.generate(),
    };

    try {
        const order = await instance.orders.create(options);
        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }
}
