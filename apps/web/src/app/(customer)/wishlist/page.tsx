"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { formatPrice } from "@/lib/mock-data";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-12 py-12">
        <h1 className="font-serif text-3xl lg:text-4xl mb-8">Wishlist</h1>
        <div className="h-40" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="font-serif text-3xl lg:text-4xl mb-2">Wishlist</h1>
      <p className="text-secondary text-sm mb-8">
        {items.length} saved piece{items.length !== 1 ? "s" : ""}
      </p>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((item) => (
            <div key={item.productId} className="group relative">
              <Link href={`/products/${item.slug}`}>
                <div className="overflow-hidden mb-3">
                  <div className="group-hover:scale-[1.02] transition-transform duration-500">
                    <ImagePlaceholder aspectRatio="portrait" />
                  </div>
                </div>
              </Link>

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.productId)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                aria-label="Remove from wishlist"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <p className="text-xs tracking-widest uppercase text-secondary mb-0.5">
                {item.brand}
              </p>
              <Link
                href={`/products/${item.slug}`}
                className="text-sm group-hover:underline underline-offset-4 line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="text-sm text-secondary mt-1">
                {formatPrice(item.price)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="mx-auto text-neutral-300 mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <p className="text-secondary mb-6">
            Save pieces you love by tapping the heart icon.
          </p>
          <Link
            href="/products"
            className="inline-block border border-primary px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all"
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
