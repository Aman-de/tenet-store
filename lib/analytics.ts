/**
 * Utility for Google Analytics 4 Ecommerce tracking
 */

export interface GA4Item {
    item_id: string;
    item_name: string;
    item_category?: string;
    price: number;
    quantity: number;
    item_variant?: string; // e.g., "M / Red"
    [key: string]: any;
}

export const trackGA4Event = (event: string, ecommerce: any) => {
    if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
            event,
            ecommerce
        });
        console.log(`[GA4 Event]: ${event}`, ecommerce);
    }
};

export const trackViewItem = (product: any, quantity: number = 1) => {
    trackGA4Event("view_item", {
        currency: "INR",
        value: product.price * quantity,
        items: [
            {
                item_id: product.id || product._id || product.sku,
                item_name: product.title || product.name,
                item_category: product.category,
                price: product.price,
                quantity: quantity
            }
        ]
    });
};

export const trackAddToCart = (product: any, quantity: number = 1, size?: string, color?: string) => {
    const variantStr = [size, color].filter(Boolean).join(" / ");
    trackGA4Event("add_to_cart", {
        currency: "INR",
        value: product.price * quantity,
        items: [
            {
                item_id: product.id || product._id || product.sku,
                item_name: product.title || product.name,
                item_category: product.category,
                price: product.price,
                quantity: quantity,
                item_variant: variantStr || undefined
            }
        ]
    });
};

export const trackBeginCheckout = (items: any[], totalValue: number) => {
    trackGA4Event("begin_checkout", {
        currency: "INR",
        value: totalValue,
        items: items.map((item) => ({
            item_id: item.id || item._id || item.sku,
            item_name: item.title || item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
            item_variant: [item.selectedSize, item.selectedColor].filter(Boolean).join(" / ") || undefined
        }))
    });
};

export const trackPurchase = (transactionId: string, items: any[], totalValue: number, tax: number = 0, shipping: number = 0) => {
    trackGA4Event("purchase", {
        transaction_id: transactionId,
        value: totalValue,
        tax: tax,
        shipping: shipping,
        currency: "INR",
        items: items.map((item) => ({
            item_id: item.id || item._id || item.sku,
            item_name: item.title || item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
            item_variant: [item.selectedSize, item.selectedColor].filter(Boolean).join(" / ") || undefined
        }))
    });
};
