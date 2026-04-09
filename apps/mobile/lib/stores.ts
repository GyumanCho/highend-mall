import { create } from "zustand";

// ─── Cart Store ───
export interface CartItem {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly size: string;
  readonly slug: string;
  readonly imageUrl: string | null;
  readonly quantity: number;
}

interface CartState {
  readonly items: readonly CartItem[];
  readonly addItem: (item: Omit<CartItem, "quantity">) => void;
  readonly removeItem: (productId: string) => void;
  readonly updateQuantity: (productId: string, quantity: number) => void;
  readonly clearCart: () => void;
  readonly itemCount: () => number;
  readonly subtotal: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  addItem: (newItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === newItem.productId);
      if (existing) {
        return { items: state.items.map((i) => i.productId === newItem.productId ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { ...newItem, quantity: 1 }] };
    }),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) return { items: state.items.filter((i) => i.productId !== productId) };
      return { items: state.items.map((i) => i.productId === productId ? { ...i, quantity } : i) };
    }),
  clearCart: () => set({ items: [] }),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

// ─── Wishlist Store ───
export interface WishlistItem {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly slug: string;
  readonly imageUrl: string | null;
}

interface WishlistState {
  readonly items: readonly WishlistItem[];
  readonly toggleItem: (item: WishlistItem) => void;
  readonly isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  toggleItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.productId === item.productId)) {
        return { items: state.items.filter((i) => i.productId !== item.productId) };
      }
      return { items: [...state.items, item] };
    }),
  isInWishlist: (productId) => get().items.some((i) => i.productId === productId),
}));
