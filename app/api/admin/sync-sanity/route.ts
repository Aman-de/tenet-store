import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { syncUserToSanity } from "@/app/actions";

export async function POST(req: Request) {
    try {
        const clerk = await clerkClient();
        const allUsers: any[] = [];
        let offset = 0;
        const limit = 500;
        
        while (true) {
            const usersBatch = await clerk.users.getUserList({ limit, offset });
            allUsers.push(...usersBatch.data);
            if (usersBatch.data.length < limit) break;
            offset += limit;
        }

        const partners = allUsers.filter(u => !!u.unsafeMetadata?.referralCode);
        
        for (const partner of partners) {
            await syncUserToSanity(partner);
        }

        return NextResponse.json({ success: true, count: partners.length });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
