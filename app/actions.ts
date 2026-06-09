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
    
    const nameTrimmed = bankDetails.accountHolder.trim();
    if (nameTrimmed.length < 3) {
        return { success: false, message: "Account holder name must be at least 3 characters long." };
    }
    if (!/^[a-zA-Z\s]+$/.test(nameTrimmed)) {
        return { success: false, message: "Account holder name must only contain letters and spaces." };
    }

    const accountNum = bankDetails.accountNumber.trim();
    if (!/^\d{9,18}$/.test(accountNum)) {
        return { success: false, message: "Invalid bank account number. It must contain only digits and be between 9 and 18 digits long." };
    }

    // 1. Repeating digits check (e.g. 9999999999)
    if (/^(.)\1+$/.test(accountNum)) {
        return { success: false, message: "Invalid bank account number. It cannot consist of only repeating digits." };
    }

    // 2. Sequential digits check (e.g. 123456789, 987654321)
    const asc = "0123456789";
    const desc = "9876543210";
    if (asc.includes(accountNum) || desc.includes(accountNum)) {
        return { success: false, message: "Invalid bank account number. Sequential digits are not allowed." };
    }

    const ifsc = bankDetails.ifscCode.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        return { success: false, message: "Invalid IFSC code format. It must start with 4 letters, then 0, followed by 6 alphanumeric characters (e.g. HDFC0001234)." };
    }

    // 3. Bank-specific length checks based on IFSC prefix
    const bankLengths: Record<string, number[]> = {
        "SBIN": [11, 17], // State Bank of India
        "HDFC": [14],     // HDFC Bank
        "ICIC": [12],     // ICICI Bank
        "UTIB": [15],     // Axis Bank
        "PUNB": [16],     // Punjab National Bank
        "BARB": [14],     // Bank of Baroda
        "CNRB": [13],     // Canara Bank
        "KKBK": [15],     // Kotak Mahindra Bank
        "UBIN": [15],     // Union Bank of India
        "IBKL": [15],     // IDBI Bank
        "INDB": [15, 16], // IndusInd Bank
        "YESB": [15],     // Yes Bank
        "CBIN": [10],     // Central Bank of India
        "IDIB": [17],     // Indian Bank
        "UCBA": [14],     // UCO Bank
        "BKID": [15],     // Bank of India
        "IOBA": [15],     // Indian Overseas Bank
    };

    const ifscPrefix = ifsc.slice(0, 4);
    if (bankLengths[ifscPrefix]) {
        const expectedLengths = bankLengths[ifscPrefix];
        if (!expectedLengths.includes(accountNum.length)) {
            const lengthsStr = expectedLengths.join(" or ");
            return {
                success: false,
                message: `For bank IFSC prefix ${ifscPrefix}, the account number must be exactly ${lengthsStr} digits long (your input is ${accountNum.length} digits).`
            };
        }
    }

    try {
        const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
        if (!response.ok) {
            return { success: false, message: "Invalid IFSC code. Please enter a valid bank IFSC." };
        }
        const data = await response.json();
        // Automatically overwrite with the verified bank name from Razorpay API
        bankDetails.bankName = data.BANK || bankDetails.bankName;
        bankDetails.ifscCode = ifsc;
        bankDetails.accountNumber = accountNum;
        bankDetails.accountHolder = nameTrimmed;
    } catch (apiError) {
        console.warn("IFSC verification API error:", apiError);
        // Fallback: Continue if API is down but format is valid
    }

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
        return { success: true, message: `Bank details linked successfully with ${bankDetails.bankName}.` };
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
        
        const referralCode = user.unsafeMetadata.referralCode as string;
        if (!referralCode) return { success: false, message: "No referral code found" };

        const referralOrdersQuery = `*[_type == "order" && referralCode == $referralCode && status == "delivered"] {
            totalPrice,
            createdAt,
            deliveredAt
        }`;
        const referralOrders = await client.fetch(referralOrdersQuery, { referralCode }) || [];
        
        const now = Date.now();
        const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
        let availableCommission = 0;

        referralOrders.forEach((o: any) => {
            const deliveredTime = o.deliveredAt ? new Date(o.deliveredAt).getTime() : new Date(o.createdAt).getTime() + (48 * 60 * 60 * 1000);
            if (now - deliveredTime >= TEN_DAYS_MS) {
                availableCommission += Math.round((o.totalPrice || 0) * 0.15);
            }
        });

        const redeemedAmount = (user.unsafeMetadata.redeemedAmount as number) || 0;
        const balance = Math.max(0, availableCommission - redeemedAmount);
        
        if (balance <= 0) {
            return { success: false, message: "Insufficient balance to redeem" };
        }
        if (!user.unsafeMetadata.bankDetails) {
            return { success: false, message: "Please link your bank account first" };
        }

        await clerk.users.updateUserMetadata(userId, {
            unsafeMetadata: {
                ...user.unsafeMetadata,
                redeemedAmount: redeemedAmount + balance
            }
        });
        
        return { success: true, message: `Redemption request of ₹${balance.toLocaleString('en-IN')} submitted successfully. Funds will arrive in 2-3 business days.` };
    } catch (error) {
        console.error("redeemReferralBalance error:", error);
        return { success: false, message: "Redemption failed" };
    }
}

export async function trackReferralClick(code: string) {
    if (!code) return { success: false };
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({ limit: 500 });
        const referrer = users.data.find(u => u.unsafeMetadata.referralCode === code);
        
        if (referrer) {
            const clicks = (referrer.unsafeMetadata.referralClicks as number) || 0;
            await clerk.users.updateUserMetadata(referrer.id, {
                unsafeMetadata: {
                    ...referrer.unsafeMetadata,
                    referralClicks: clicks + 1
                }
            });
            return { success: true };
        }
        return { success: false, message: "Referrer not found" };
    } catch (error) {
        console.error("trackReferralClick error:", error);
        return { success: false };
    }
}

export async function trackReferralAddToCart(code: string) {
    if (!code) return { success: false };
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({ limit: 500 });
        const referrer = users.data.find(u => u.unsafeMetadata.referralCode === code);
        
        if (referrer) {
            const carts = (referrer.unsafeMetadata.referralCarts as number) || 0;
            await clerk.users.updateUserMetadata(referrer.id, {
                unsafeMetadata: {
                    ...referrer.unsafeMetadata,
                    referralCarts: carts + 1
                }
            });
            return { success: true };
        }
        return { success: false, message: "Referrer not found" };
    } catch (error) {
        console.error("trackReferralAddToCart error:", error);
        return { success: false };
    }
}

export async function trackReferralJoin(userId: string, code: string) {
    if (!userId || !code) return { success: false };
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        
        const currentUser = await clerk.users.getUser(userId);
        if (currentUser.unsafeMetadata.referredByCode) {
            return { success: false, message: "User already joined via a code" };
        }

        const users = await clerk.users.getUserList({ limit: 500 });
        const referrer = users.data.find(u => u.unsafeMetadata.referralCode === code);
        
        if (referrer && referrer.id !== userId) {
            const joins = (referrer.unsafeMetadata.referralJoins as number) || 0;
            await clerk.users.updateUserMetadata(referrer.id, {
                unsafeMetadata: {
                    ...referrer.unsafeMetadata,
                    referralJoins: joins + 1
                }
            });

            await clerk.users.updateUserMetadata(userId, {
                unsafeMetadata: {
                    ...currentUser.unsafeMetadata,
                    referredByCode: code
                }
            });

            return { success: true };
        }
        return { success: false, message: "Referrer not found" };
    } catch (error) {
        console.error("trackReferralJoin error:", error);
        return { success: false };
    }
}
