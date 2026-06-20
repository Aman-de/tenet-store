export const partner = {
    name: 'partner',
    title: 'Circle Partner',
    type: 'document',
    fields: [
        {
            name: 'clerkId',
            title: 'Clerk User ID',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
        },
        {
            name: 'referralCode',
            title: 'Referral Code',
            type: 'string',
        },
        {
            name: 'clicks',
            title: 'Total Link Clicks',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'joins',
            title: 'Total Signups',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'carts',
            title: 'Total Add to Carts',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'revenue',
            title: 'Total Revenue Driven (₹)',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'walletBalance',
            title: 'Available Wallet Balance (₹)',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'redeemedAmount',
            title: 'Total Redeemed Amount (₹)',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'payoutDetails',
            title: 'Payout Details (UPI or Bank)',
            type: 'string',
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'referralCode',
        },
    },
};
