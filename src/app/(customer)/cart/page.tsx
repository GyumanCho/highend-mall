"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/mock-data";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } =
    useCartStore();

  const total = subtotal();
  const shippingNote =
    total >= 500
      ? "Complimentary shipping"
      : `$${(500 - total).toFixed(0)} away from complimentary shipping`;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-24 text-center">
        <h1 className="font-serif text-4xl mb-6">Your Bag</h1>
        <p className="text-secondary mb-10">
          Your shopping bag is empty.
        </p>
        <Link
          href="/products"
          className="inline-block border border-primary px-10 py-4 text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
      <h1 className="font-serif text-4xl mb-12">Your Bag</h1>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-0">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-6 py-8 border-b border-muted"
            >
              {/* Image placeholder */}
              <Link href={`/products/${item.slug}`}>
                <div className="w-28 h-36 bg-surface shrink-0" />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs tracking-widest uppercase text-secondary mb-1">
                  {item.brand}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm hover:underline underline-offset-4"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-secondary mt-1">
                  Size: {item.size}
                </p>
                <p className="text-sm mt-2">{formatPrice(item.price)}</p>

                {/* Quantity */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-muted">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-1 text-secondary hover:text-primary transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1 text-secondary hover:text-primary transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-xs text-secondary hover:text-primary underline underline-offset-4 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Line total */}
              <div className="text-right shrink-0">
                <p className="text-sm">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="mt-6 text-xs text-secondary hover:text-primary underline underline-offset-4 transition-colors"
          >
            Clear Bag
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="bg-surface p-8">
            <h2 className="text-xs tracking-widest uppercase mb-8">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shipping</span>
                <span className="text-secondary">
                  {total >= 500 ? "Complimentary" : "Calculated at checkout"}
                </span>
              </div>
              <p className="text-xs text-accent">{shippingNote}</p>
            </div>

            <div className="border-t border-muted mt-6 pt-6">
              <div className="flex justify-between text-sm font-medium">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block mt-8 w-full bg-primary text-white py-4 text-sm tracking-widest uppercase text-center hover:bg-primary/90 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block mt-4 text-center text-xs text-secondary hover:text-primary underline underline-offset-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Luxury assurances */}
          <div className="mt-8 space-y-4 text-xs text-secondary">
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5">&#9679;</span>
              <span>Complimentary luxury packaging</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5">&#9679;</span>
              <span>Secure payment with full encryption</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5">&#9679;</span>
              <span>14-day return policy on all items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
