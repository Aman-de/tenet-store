import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function POST(req: Request) {
    try {
        // Authenticate admin (you'd normally check headers/auth here)

        // 1. Find all delivered orders
        const query = `*[_type == "order" && status == "delivered"]`;
        const orders = await client.fetch(query);

        let processedCount = 0;

        for (const order of orders) {
            // Check if 10 days have passed since delivery
            if (!order.deliveredAt) continue;
            
            const deliveredDate = new Date(order.deliveredAt);
            const now = new Date();
            const daysSinceDelivery = (now.getTime() - deliveredDate.getTime()) / (1000 * 3600 * 24);

            if (daysSinceDelivery >= 10) {
                // Switch status to completed
                await client.patch(order._id)
                    .set({ status: 'completed' })
                    .commit();
                
                processedCount++;
            }
        }

        return NextResponse.json({ success: true, processedCount, message: `Switched ${processedCount} orders to completed.` });

    } catch (error) {
        console.error('Error processing commissions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
