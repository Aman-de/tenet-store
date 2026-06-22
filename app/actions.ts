"use server";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

function isBot(userAgent: string): boolean {
    const botKeywords = [
        "bot", "spider", "crawl", "scrape", "headless", "puppeteer", 
        "selenium", "playwright", "curl", "wget", "python", "node"
    ];
    const ua = userAgent.toLowerCase();
    return botKeywords.some(keyword => ua.includes(keyword));
}

function isDisposableEmail(email: string): boolean {
    const tempEmailDomains = [
        "mailinator.com", "tempmail.com", "yopmail.com", "guerrillamail.com",
        "dispostable.com", "sharklasers.com", "10minutemail.com", "trashmail.com"
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    return tempEmailDomains.includes(domain);
}

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

export async function findUserByReferralCode(code: string, clerk: any) {
    if (!code) return null;
    try {
        // O(1) lookup: Query Sanity for the partner with this referral code
        const partner = await client.fetch(
            `*[_type == "partner" && referralCode == $code][0]{ clerkId }`,
            { code }
        );
        if (partner?.clerkId) {
            try {
                return await clerk.users.getUser(partner.clerkId);
            } catch (e) {
                // clerkId in Sanity might be stale — fall through to scan
                console.warn(`Sanity partner clerkId ${partner.clerkId} not found in Clerk, falling back to scan`);
            }
        }
        // Fallback: scan Clerk users (handles case where partner doc doesn't exist yet)
        let offset = 0;
        const limit = 500;
        while (true) {
            const users = await clerk.users.getUserList({ limit, offset });
            const match = users.data.find((u: any) => u.unsafeMetadata?.referralCode === code);
            if (match) return match;
            if (users.data.length < limit) break;
            offset += limit;
        }
        return null;
    } catch (error) {
        console.error("findUserByReferralCode error:", error);
        return null;
    }
}

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

export async function checkReferralCodeValidity(code: string, email?: string) {
    if (!code) return { isValid: false, message: "Invalid code" };
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const referrer = await findUserByReferralCode(code, clerk);
        
        if (!referrer) {
            return { isValid: false, message: "Invalid referral code" };
        }

        if (email) {
            const count = await client.fetch(`count(*[_type == "order" && email == $email && status != 'cancelled'])`, { email });
            if (count > 0) {
                return { isValid: false, message: "Referral discounts are only valid for your first purchase." };
            }
        }

        return { isValid: true, message: "" };
    } catch (error) {
        console.error("checkReferralCodeValidity error:", error);
        return { isValid: false, message: "Validation error" };
    }
}

export async function linkBankAccount(userId: string, bankDetails: { upiId?: string, bankName?: string, accountHolder?: string, accountNumber?: string, ifscCode?: string }) {
    if (!userId || !bankDetails) return { success: false, message: "Missing required fields" };
    
    if (bankDetails.upiId) {
        const upi = bankDetails.upiId.trim().toLowerCase();
        if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi)) {
            return { success: false, message: "Invalid UPI ID format." };
        }
        try {
            const { clerkClient } = await import("@clerk/nextjs/server");
            const clerk = await clerkClient();
            const user = await clerk.users.getUser(userId);
            await clerk.users.updateUserMetadata(userId, {
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    bankDetails: { upiId: upi }
                }
            });
            return { success: true, message: `UPI ID linked successfully.` };
        } catch (error) {
            console.error("linkBankAccount UPI error:", error);
            return { success: false, message: "Failed to link UPI ID" };
        }
    }

    if (!bankDetails.accountHolder || !bankDetails.accountNumber || !bankDetails.ifscCode) {
        return { success: false, message: "Missing required bank fields" };
    }

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

export async function calculateAvailableBalance(userId: string): Promise<number> {
    if (!userId) return 0;
    try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        
        const referralCode = user.unsafeMetadata.referralCode as string;
        if (!referralCode) return 0;

        let sanityDoc = await client.fetch(`*[_type == "partner" && clerkId == $userId][0]`, { userId });
        // Fallback: if clerkId lookup fails, try by email
        if (!sanityDoc) {
            const email = user.emailAddresses?.[0]?.emailAddress;
            if (email) {
                sanityDoc = await client.fetch(`*[_type == "partner" && email == $email][0]`, { email });
            }
        }
        
        // 1. Base balance from signups (synced in walletBalance field)
        const baseBalance = (sanityDoc?.walletBalance as number) || (user.unsafeMetadata.walletBalance as number) || 0;

        // 2. Matured Order Commissions
        let maturedOrdersCommission = 0;
        const referralOrdersQuery = `*[_type == "order" && referralCode == $referralCode && status == "delivered"] {
            totalPrice,
            createdAt,
            deliveredAt
        }`;
        const referralOrders = await client.fetch(referralOrdersQuery, { referralCode }) || [];
        const now = Date.now();
        const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;
        
        referralOrders.forEach((o: any) => {
            const deliveredTime = o.deliveredAt ? new Date(o.deliveredAt).getTime() : new Date(o.createdAt).getTime() + (48 * 60 * 60 * 1000);
            if (now - deliveredTime >= TEN_DAYS_MS) {
                maturedOrdersCommission += Math.round((o.totalPrice || 0) * 0.15);
            }
        });

        // 3. Deductions (Withdrawn to Bank + Spent on Store)
        const redeemedAmount = (sanityDoc?.redeemedAmount as number) || (user.unsafeMetadata.redeemedAmount as number) || 0;
        const spentOnPurchases = (sanityDoc?.spentOnPurchases as number) || 0;

        // Total available is base + orders - redeemed - spent
        return Math.max(0, baseBalance + maturedOrdersCommission - redeemedAmount - spentOnPurchases);
    } catch (error) {
        console.error("calculateAvailableBalance error:", error);
        return 0;
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

        const balance = await calculateAvailableBalance(userId);
        let sanityDoc = await client.fetch(`*[_type == "partner" && clerkId == $userId][0]`, { userId });
        if (!sanityDoc) {
            const email = user.emailAddresses?.[0]?.emailAddress;
            if (email) sanityDoc = await client.fetch(`*[_type == "partner" && email == $email][0]`, { email });
        }
        const redeemedAmount = (sanityDoc?.redeemedAmount as number) || (user.unsafeMetadata.redeemedAmount as number) || 0;
        
        if (balance < 500) {
            return { success: false, message: `Minimum redeem amount is ₹500. Your available balance is ₹${balance}` };
        }
        if (!user.unsafeMetadata.bankDetails) {
            return { success: false, message: "Please link your bank account or UPI ID first" };
        }

        // Atomically increment redeemedAmount in Sanity to prevent double-spending
        await syncUserToSanity(user);
        const sanityPartner = await client
            .patch(`partner-${user.id}`)
            .inc({ redeemedAmount: balance })
            .commit();

        await clerk.users.updateUserMetadata(userId, {
            unsafeMetadata: {
                ...user.unsafeMetadata,
                redeemedAmount: sanityPartner.redeemedAmount || (redeemedAmount + balance)
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
        const referrer = await findUserByReferralCode(code, clerk);
        
        if (referrer) {
            // Ensure partner exists in Sanity for atomic increments
            await syncUserToSanity(referrer);
            
            // Atomically increment clicks in Sanity to prevent race conditions
            const sanityPartner = await client
                .patch(`partner-${referrer.id}`)
                .inc({ clicks: 1 })
                .commit();

            const updatedUser = await clerk.users.updateUserMetadata(referrer.id, {
                unsafeMetadata: {
                    ...referrer.unsafeMetadata,
                    referralClicks: sanityPartner.clicks
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
        const referrer = await findUserByReferralCode(code, clerk);
        
        if (referrer) {
            await syncUserToSanity(referrer);
            
            // Atomically increment carts in Sanity
            const sanityPartner = await client
                .patch(`partner-${referrer.id}`)
                .inc({ carts: 1 })
                .commit();

            await clerk.users.updateUserMetadata(referrer.id, {
                unsafeMetadata: {
                    ...referrer.unsafeMetadata,
                    referralCarts: sanityPartner.carts
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

        const referrer = await findUserByReferralCode(code, clerk);
        
        if (referrer && referrer.id !== userId) {
            // Get Client Headers for IP and Bot tracking
            const headerList = await headers();
            const clientIp = headerList.get('x-forwarded-for')?.split(',')[0].trim() || 
                             headerList.get('x-real-ip') || 
                             "unknown-ip";
            const userAgent = headerList.get('user-agent') || "";
            const emailAddress = currentUser.emailAddresses[0]?.emailAddress || "";

            // Spam & Bot checks
            if (isBot(userAgent)) {
                console.warn(`Signup blocked: Bot detected from user agent: ${userAgent}`);
                return { success: false, message: "Spam prevention: Bot signup blocked" };
            }
            if (isDisposableEmail(emailAddress)) {
                console.warn(`Signup blocked: Temporary email provider detected: ${emailAddress}`);
                return { success: false, message: "Spam prevention: Temp email blocked" };
            }

            // IP tracking: Check if client IP already signed up under any user
            if (clientIp !== "unknown-ip") {
                // To properly prevent duplicate IPs across thousands of users efficiently, we would need 
                // a dedicated DB table. For now, we skip the loop over 500 users here to save extreme overhead.
                // We'll rely on email verification and bot detection.
            }

            // Ensure partner exists in Sanity
            await syncUserToSanity(referrer);
            
            // Atomically increment joins, wallet, and revenue in Sanity
            const sanityPartner = await client
                .patch(`partner-${referrer.id}`)
                .inc({ joins: 1, walletBalance: 10, revenue: 10 })
                .commit();

            const updatedUser = await clerk.users.updateUserMetadata(referrer.id, {
                unsafeMetadata: {
                    ...referrer.unsafeMetadata,
                    referralJoins: sanityPartner.joins,
                    walletBalance: sanityPartner.walletBalance,
                    referralRevenue: sanityPartner.revenue // Credit revenue for signups
                }
            });

            await clerk.users.updateUserMetadata(userId, {
                unsafeMetadata: {
                    ...currentUser.unsafeMetadata,
                    referredByCode: code,
                    signupIp: clientIp
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

export async function syncUserToSanity(user: any) {
    try {
        const bd = user.unsafeMetadata?.bankDetails as any;
        let payoutInfo = "";
        if (bd?.upiId) payoutInfo = `UPI: ${bd.upiId}`;
        else if (bd?.accountNumber) payoutInfo = `Bank: ${bd.bankName} - ${bd.accountNumber}`;

        const targetId = `partner-${user.id}`;
        const email = user.emailAddresses?.[0]?.emailAddress || "";
        const referralCode = user.unsafeMetadata?.referralCode || "";

        // Use createIfNotExists so we don't overwrite Sanity's atomic counters
        await client.createIfNotExists({
            _type: 'partner',
            _id: targetId,
            clerkId: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email,
            referralCode,
            clicks: (user.unsafeMetadata?.referralClicks as number) || 0,
            joins: (user.unsafeMetadata?.referralJoins as number) || 0,
            carts: (user.unsafeMetadata?.referralCarts as number) || 0,
            revenue: (user.unsafeMetadata?.referralRevenue as number) || 0,
            walletBalance: (user.unsafeMetadata?.walletBalance as number) || 0,
            payoutDetails: payoutInfo
        });

        // Always update mutable string fields + referralCode
        await client.patch(targetId).set({
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email,
            referralCode,
            payoutDetails: payoutInfo
        }).commit();
    } catch (error) {
        console.error("Failed to sync user to Sanity:", error);
    }
}
