import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { clerkClient } from "@clerk/nextjs/server";
import { calculateAvailableBalance } from "@/app/actions";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cart, paymentId, email, userId, shippingAddress, totalAmount, amountPaid, paymentMethod, walletUsed, referralCode } = body;

        if (!cart || !email || !paymentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Security Check: Verify wallet balance before deducting or writing order
        let verifiedWalletUsed = 0;
        if (userId && walletUsed > 0) {
            try {
                const currentBalance = await calculateAvailableBalance(userId);
                
                if (walletUsed > currentBalance) {
                    return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
                }
                verifiedWalletUsed = walletUsed;
            } catch (err) {
                console.error("Failed to verify wallet balance:", err);
                return NextResponse.json({ error: "Failed to verify wallet balance" }, { status: 400 });
            }
        }

        // Server-Side Referral Code Verification: Only allow on first purchase
        // (if referralCode is explicitly provided for a discount)
        if (referralCode) {
            const pastOrdersCount = await client.fetch(`count(*[_type == "order" && email == $email && status != 'cancelled'])`, { email });
            if (pastOrdersCount > 0) {
                return NextResponse.json({ error: "Referral discounts are only valid for your first purchase." }, { status: 400 });
            }
        }

        // Auto-assign referral code for commission tracking if they joined via one
        let finalReferralCode = referralCode || null;
        if (userId && !finalReferralCode) {
            try {
                const clerk = await clerkClient();
                const user = await clerk.users.getUser(userId);
                if (user.unsafeMetadata?.referredByCode) {
                    finalReferralCode = user.unsafeMetadata.referredByCode as string;
                }
            } catch (err) {
                console.error("Failed to fetch referredByCode", err);
            }
        }

        const newOrder = {
            _type: 'order',
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            stripePaymentId: paymentId,
            paymentMethod: paymentMethod || 'RAZORPAY',
            amountPaid: amountPaid || totalAmount,
            email: email,
            products: cart.map((item: any) => ({
                _type: 'object',
                _key: (item.id + item.selectedSize + item.selectedColor + (item.selectedPiece || 'set')).replace(/[^a-zA-Z0-9]/g, ''),
                product: {
                    _type: 'reference',
                    _ref: item.id
                },
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor,
                piece: item.selectedPiece || 'set'
            })),
            totalPrice: totalAmount,
            status: 'pending',
            shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
            referralCode: finalReferralCode,
            createdAt: new Date().toISOString()
        };

        const createdOrder = await client.create(newOrder);

        // 1. Deduct from buyer's wallet if they used it
        if (userId && verifiedWalletUsed > 0) {
            try {
                // Ensure partner document exists
                const sanityPartnerId = `partner-${userId}`;
                await client.createIfNotExists({
                    _type: 'partner',
                    _id: sanityPartnerId,
                    clerkId: userId
                });
                // Atomically update spentOnPurchases
                await client
                    .patch(sanityPartnerId)
                    .inc({ spentOnPurchases: verifiedWalletUsed })
                    .commit();
            } catch (err) {
                console.error("Failed to deduct wallet:", err);
            }
        }

        // 2. We no longer instantly reward the referrer. Payouts are dynamically calculated in the Circle Dashboard
        // based on a 10-day return window from the delivered date.

        return NextResponse.json({ orderId: createdOrder._id, message: "Order created successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
