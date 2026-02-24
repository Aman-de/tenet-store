import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from './data';

// --- Types ---

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

export interface WishlistItem extends Product {
    // We can add specific fields here if needed, but for now it's just the product info
    dateAdded?: number;
}

interface StoreState {
    // --- Cart State ---
    cart: CartItem[];
    isCartOpen: boolean;

    // --- Wishlist State ---
    wishlist: WishlistItem[];
    isWishlistOpen: boolean;

    // --- Direct Checkout State ---
    checkoutItem: CartItem | null;

    // --- Actions ---

    // Cart Actions
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addToCart: (product: Product, size?: string, color?: string) => void;
    removeFromCart: (itemId: string, size?: string, color?: string) => void;
    updateQuantity: (itemId: string, size: string | undefined, color: string | undefined, delta: number) => void;
    getCartTotal: () => number;
    clearCart: () => void;

    // Wishlist Actions
    openWishlist: () => void;
    closeWishlist: () => void;
    toggleWishlistDrawer: () => void;
    toggleWishlist: (product: Product) => void; // Adds if not present, removes if present
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    removeFromWishlist: (productId: string) => void;

    // Direct Checkout Actions
    setCheckoutItem: (item: CartItem) => void;
    clearCheckoutItem: () => void;
    updateCheckoutItemQuantity: (delta: number) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            // --- Initial State ---
            cart: [],
            isCartOpen: false,
            wishlist: [],
            isWishlistOpen: false,
            checkoutItem: null,

            // --- Cart Implementation ---
            openCart: () => set({ isCartOpen: true, isWishlistOpen: false }), // Close wishlist if opening cart
            closeCart: () => set({ isCartOpen: false }),
            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isWishlistOpen: false })),

            addToCart: (product, size, color) => {
                set((state) => {
                    // Check if item already exists with same variants
                    const existingIndex = state.cart.findIndex(
                        (item) =>
                            item.id === product.id &&
                            item.selectedSize === size &&
                            item.selectedColor === color
                    );

                    if (existingIndex > -1) {
                        // Increment quantity
                        const newCart = [...state.cart];
                        newCart[existingIndex].quantity += 1;
                        return { cart: newCart };
                    } else {
                        // Determine the correct image based on selected color
                        let itemImages = product.images;
                        if (color && product.variants) {
                            const matchedVariant = product.variants.find(v => v.colorHex === color || v.colorName === color);
                            if (matchedVariant && matchedVariant.images && matchedVariant.images.length > 0) {
                                itemImages = matchedVariant.images;
                            }
                        }

                        // Add new item
                        return {
                            cart: [
                                ...state.cart,
                                { ...product, images: itemImages, quantity: 1, selectedSize: size, selectedColor: color }
                            ],
                            // isCartOpen: true  <-- Removed to prevent auto-open
                        };
                    }
                });
            },

            removeFromCart: (itemId, size, color) => {
                set((state) => ({
                    cart: state.cart.filter(
                        (item) =>
                            !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)
                    ),
                }));
            },

            updateQuantity: (itemId, size, color, delta) => {
                set((state) => {
                    const newCart = state.cart.map((item) => {
                        if (
                            item.id === itemId &&
                            item.selectedSize === size &&
                            item.selectedColor === color
                        ) {
                            return { ...item, quantity: Math.max(1, item.quantity + delta) };
                        }
                        return item;
                    });
                    return { cart: newCart };
                });
            },

            getCartTotal: () => {
                return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            clearCart: () => set({ cart: [] }),

            // --- Wishlist Implementation ---
            openWishlist: () => set({ isWishlistOpen: true, isCartOpen: false }),
            closeWishlist: () => set({ isWishlistOpen: false }),
            toggleWishlistDrawer: () => set((state) => ({ isWishlistOpen: !state.isWishlistOpen, isCartOpen: false })),

            toggleWishlist: (product) => {
                const { wishlist } = get();
                const exists = wishlist.some((item) => item.id === product.id);

                if (exists) {
                    set({
                        wishlist: wishlist.filter((item) => item.id !== product.id),
                    });
                } else {
                    set({
                        wishlist: [...wishlist, { ...product, dateAdded: Date.now() }],
                        // isWishlistOpen: true <-- Removed to prevent auto-open
                    });
                }
            },

            removeFromWishlist: (productId) => {
                set((state) => ({
                    wishlist: state.wishlist.filter((item) => item.id !== productId)
                }));
            },

            isInWishlist: (productId) => {
                return get().wishlist.some((item) => item.id === productId);
            },

            clearWishlist: () => set({ wishlist: [] }),

            // --- Direct Checkout Implementation ---
            setCheckoutItem: (item) => {
                // Determine the correct image based on selected color
                let itemImages = item.images;
                if (item.selectedColor && item.variants) {
                    const matchedVariant = item.variants.find(v => v.colorHex === item.selectedColor || v.colorName === item.selectedColor);
                    if (matchedVariant && matchedVariant.images && matchedVariant.images.length > 0) {
                        itemImages = matchedVariant.images;
                    }
                }
                set({ checkoutItem: { ...item, images: itemImages }, isCartOpen: true, isWishlistOpen: false });
            },
            clearCheckoutItem: () => set({ checkoutItem: null }),
            updateCheckoutItemQuantity: (delta) => {
                set((state) => {
                    if (!state.checkoutItem) return {};
                    const newQuantity = Math.max(1, state.checkoutItem.quantity + delta);
                    return { checkoutItem: { ...state.checkoutItem, quantity: newQuantity } };
                });
            },
        }),
        {
            name: 'tenet-storage',
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
            partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }), // Don't persist checkoutItem
        }
    )
);
