"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { formatPrice } from "@/lib/mock-data";

interface StickyCTAProps {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly slug: string;
}

export function StickyCTA({ productId, name, brand, price, slug }: StickyCTAProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(productId);

  function handleAddToBag() {
    addItem({ productId, name, brand, price, currency: "USD", size: "One Size", slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleToggleWishlist() {
    toggleItem({ productId, name, brand, price, slug });
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-muted px-4 py-3 lg:hidden safe-area-bottom">
      <div className="flex items-center gap-3">
        {/* Wishlist heart */}
        <button
          onClick={handleToggleWishlist}
          className="shrink-0 w-12 h-12 flex items-center justify-center border border-muted rounded-xl transition-colors"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className={inWishlist ? "text-red-500" : "text-secondary"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        {/* Add to Bag */}
        <button
          onClick={handleAddToBag}
          className={`flex-1 py-3.5 text-sm tracking-widest uppercase rounded-xl transition-all ${
            added
              ? "bg-green-600 text-white"
              : "bg-primary text-white"
          }`}
        >
          {added ? "Added to Bag" : `Add to Bag · ${formatPrice(price)}`}
        </button>
      </div>
    </div>
  );
}
