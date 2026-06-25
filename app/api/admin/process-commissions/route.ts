import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function POST(req: Request) {
    try {
        // Authenticate admin (you'd normally check headers/auth here)

        // 1. Find all delivered orders that haven't had commission processed yet
        const query = `*[_type == "order" && status == "delivered" && commissionProcessed != true && defined(referralCode)]`;
        const orders = await client.fetch(query);

        let processedCount = 0;

        for (const order of orders) {
            // Check if 10 days have passed since delivery
            if (!order.deliveredAt) continue;
            
            const deliveredDate = new Date(order.deliveredAt);
            const now = new Date();
            const daysSinceDelivery = (now.getTime() - deliveredDate.getTime()) / (1000 * 3600 * 24);

            if (daysSinceDelivery >= 10) {
                // Find the referrer
                const partner = await client.fetch(
                    `*[_type == "partner" && (referralCode == $code || wishlinkId == $code)][0]`,
                    { code: order.referralCode }
                );

                if (partner) {
                    const commissionAmount = order.totalPrice * 0.15; // 15% commission

                    // Use Sanity Transaction to update both atomicallly
                    await client.transaction()
                        .patch(partner._id, (p) => p.inc({ walletBalance: commissionAmount, revenue: order.totalPrice }))
                        .patch(order._id, (p) => p.set({ commissionProcessed: true }))
                        .commit();
                    
                    processedCount++;
                }
            }
        }

        return NextResponse.json({ success: true, processedCount, message: `Processed ${processedCount} commissions.` });

    } catch (error) {
        console.error('Error processing commissions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
