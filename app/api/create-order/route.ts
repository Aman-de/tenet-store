import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cart, paymentId, email, shippingAddress, totalAmount } = body;

        if (!cart || !email || !paymentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newOrder = {
            _type: 'order',
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            stripePaymentId: paymentId,
            email: email,
            products: cart.map((item: any) => ({
                _type: 'object', // This might just be key in array, but for sanity object in array
                _key: item.id + item.selectedSize + item.selectedColor, // Unique key
                product: {
                    _type: 'reference',
                    _ref: item.id
                },
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor
            })),
            totalPrice: totalAmount,
            status: 'pending',
            shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
            createdAt: new Date().toISOString()
        };

        const createdOrder = await client.create(newOrder);

        return NextResponse.json({ orderId: createdOrder._id, message: "Order created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
