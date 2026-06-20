import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
    try {
        const clerk = await clerkClient();
        let allUsers: any[] = [];
        let offset = 0;
        const limit = 500;
        
        while (true) {
            const batch = await clerk.users.getUserList({ limit, offset });
            allUsers.push(...batch.data);
            if (batch.data.length < limit) break;
            offset += limit;
        }

        const arpita = allUsers.find(u => 
            u.emailAddresses.some((e: any) => e.emailAddress.toLowerCase() === "arpitagamer09@gmail.com")
        );

        if (!arpita) {
            return NextResponse.json({ success: false, message: "Arpita not found in live DB" }, { status: 404 });
        }

        const arpitaCode = arpita.unsafeMetadata?.referralCode as string || "ARPITA20";

        const cutoff = new Date("2026-06-17T00:00:00Z").getTime();
        
        const recentUsers = allUsers.filter(u => {
            const createdMs = new Date(u.createdAt).getTime();
            return createdMs > cutoff && u.id !== arpita.id;
        });

        const uncreditedUsers = recentUsers.filter(u => u.unsafeMetadata?.referredByCode !== arpitaCode);

        let addedCredits = 0;

        for (const u of uncreditedUsers) {
            // Update the user to attribute to Arpita
            await clerk.users.updateUserMetadata(u.id, {
                unsafeMetadata: {
                    ...u.unsafeMetadata,
                    referredByCode: arpitaCode
                }
            });
            addedCredits += 10;
        }

        if (uncreditedUsers.length > 0) {
            // Atomic update to Sanity
            const sanityPartner = await client
                .patch(`partner-${arpita.id}`)
                .inc({ 
                    joins: uncreditedUsers.length, 
                    walletBalance: addedCredits, 
                    revenue: addedCredits 
                })
                .commit();

            // Sync back to Clerk
            await clerk.users.updateUserMetadata(arpita.id, {
                unsafeMetadata: {
                    ...arpita.unsafeMetadata,
                    referralJoins: sanityPartner.joins,
                    walletBalance: sanityPartner.walletBalance,
                    referralRevenue: sanityPartner.revenue
                }
            });
        }

        return NextResponse.json({ 
            success: true, 
            totalRecentUsers: recentUsers.length,
            newlyAttributedUsers: uncreditedUsers.length,
            addedCredits,
            arpitaNewTotals: {
                joins: arpita.unsafeMetadata?.referralJoins,
                wallet: arpita.unsafeMetadata?.walletBalance
            }
        });

    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
