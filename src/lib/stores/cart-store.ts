"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly currency: "USD" | "KRW";
  readonly size: string;
  readonly slug: string;
  readonly quantity: number;
}

interface CartState {
  readonly items: readonly CartItem[];
  readonly addItem: (item: Omit<CartItem, "quantity">) => void;
  readonly removeItem: (productId: string, size: string) => void;
  readonly updateQuantity: (productId: string, size: string, quantity: number) => void;
  readonly clearCart: () => void;
  readonly itemCount: () => number;
  readonly subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId && i.size === newItem.size
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId && i.size === newItem.size
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),

      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        })),

      updateQuantity: (productId, size, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.productId === productId && i.size === size)
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId && i.size === size
                ? { ...i, quantity }
                : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "maison-cart" }
  )
);
