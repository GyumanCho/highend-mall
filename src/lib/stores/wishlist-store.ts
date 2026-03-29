"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly slug: string;
  readonly addedAt: string;
}

interface WishlistState {
  readonly items: readonly WishlistItem[];
  readonly addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  readonly removeItem: (productId: string) => void;
  readonly isInWishlist: (productId: string) => boolean;
  readonly toggleItem: (item: Omit<WishlistItem, "addedAt">) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          if (state.items.some((i) => i.productId === newItem.productId)) {
            return state;
          }
          return {
            items: [...state.items, { ...newItem, addedAt: new Date().toISOString() }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),

      toggleItem: (item) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(item.productId)) {
          removeItem(item.productId);
        } else {
          addItem(item);
        }
      },
    }),
    { name: "maison-wishlist" }
  )
);
