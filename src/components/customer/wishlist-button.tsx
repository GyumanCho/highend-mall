"use client";

import { useWishlistStore } from "@/lib/stores/wishlist-store";

interface WishlistButtonProps {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly slug: string;
}

export function WishlistButton({
  productId,
  name,
  brand,
  price,
  slug,
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const inWishlist = isInWishlist(productId);

  function handleToggle() {
    toggleItem({ productId, name, brand, price, slug });
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-full border py-4 text-sm tracking-widest uppercase transition-colors ${
        inWishlist
          ? "border-primary text-primary"
          : "border-muted text-secondary hover:border-primary hover:text-primary"
      }`}
    >
      {inWishlist ? "In Wishlist" : "Add to Wishlist"}
    </button>
  );
}
