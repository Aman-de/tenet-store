"use server";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { revalidatePath } from "next/cache";

const token = process.env.SANITY_API_TOKEN;

const fetchWithRetry = async (url: string | URL, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok && response.status >= 500 && i < retries - 1) {
                console.warn(`⚠️ Fetch failed with status ${response.status}. Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.warn(`⚠️ Fetch error: ${(error as Error).message}. Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error("Fetch failed after all retries");
};

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token, // Must be a valid write token
    useCdn: false,
    fetch: fetchWithRetry as any
});

export async function createReview(productId: string, formData: FormData) {
    if (!token) {
        console.error("Missing SANITY_API_TOKEN");
        return { success: false, message: "Server configuration error. Unable to submit review." };
    }

    const name = formData.get("name") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (!name || !rating || !productId) {
        return { success: false, message: "Missing required fields." };
    }

    try {
        await client.create({
            _type: 'review',
            product: {
                _type: 'reference',
                _ref: productId
            },
            author: name,
            rating,
            comment,
            status: 'Pending',
            createdAt: new Date().toISOString()
        });

        // Revalidate the product page to update (though pending reviews won't show yet)
        revalidatePath(`/product/[slug]`, 'page');

        return { success: true, message: "Review submitted for approval." };
    } catch (error) {
        console.error("Sanity Create Review Error:", error);
        return { success: false, message: "Failed to submit review. Please try again." };
    }
}

export async function checkUserOrderHistory(email: string) {
    if (!email) return { hasOrders: false };
    try {
        const count = await client.fetch(`count(*[_type == "order" && email == $email])`, { email });
        return { hasOrders: count > 0 };
    } catch (error) {
        console.error("checkUserOrderHistory error:", error);
        return { hasOrders: false };
    }
}

export async function checkReferralCodeValidity(code: string) {
    if (!code) return { isValid: false };
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({ limit: 500 });
        const referrer = users.data.find(u => u.unsafeMetadata.referralCode === code);
        return { isValid: !!referrer };
    } catch (error) {
        console.error("checkReferralCodeValidity error:", error);
        return { isValid: false };
    }
}

export async function linkBankAccount(userId: string, bankDetails: { bankName: string, accountHolder: string, accountNumber: string, ifscCode: string }) {
    if (!userId || !bankDetails) return { success: false, message: "Missing required fields" };
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        await clerk.users.updateUserMetadata(userId, {
            unsafeMetadata: {
                ...user.unsafeMetadata,
                bankDetails
            }
        });
        return { success: true, message: "Bank details linked successfully" };
    } catch (error) {
        console.error("linkBankAccount error:", error);
        return { success: false, message: "Failed to link bank details" };
    }
}

export async function redeemReferralBalance(userId: string) {
    if (!userId) return { success: false, message: "Unauthorized" };
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const balance = (user.unsafeMetadata.walletBalance as number) || 0;
        const redeemedAmount = (user.unsafeMetadata.redeemedAmount as number) || 0;
        
        if (balance <= 0) {
            return { success: false, message: "Insufficient balance to redeem" };
        }
        if (!user.unsafeMetadata.bankDetails) {
            return { success: false, message: "Please link your bank account first" };
        }

        await clerk.users.updateUserMetadata(userId, {
            unsafeMetadata: {
                ...user.unsafeMetadata,
                walletBalance: 0,
                redeemedAmount: redeemedAmount + balance
            }
        });
        
        return { success: true, message: `Redemption request of ₹${balance.toLocaleString('en-IN')} submitted successfully. Funds will arrive in 2-3 business days.` };
    } catch (error) {
        console.error("redeemReferralBalance error:", error);
        return { success: false, message: "Redemption failed" };
    }
}
