"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { formatPrice } from "@/lib/mock-data";

interface CartDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const mounted = useIsClient();

  const total = mounted ? subtotal() : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-muted">
          <h2 className="font-serif text-lg">Your Bag ({mounted ? items.length : 0})</h2>
          <button onClick={onClose} className="text-2xl text-secondary leading-none p-1">&times;</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {mounted && items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                  <div className="w-20 h-24 bg-surface rounded shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-secondary">{item.brand}</p>
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-sm mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-muted rounded-full">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-sm"
                        >-</button>
                        <span className="px-2 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-sm"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-xs text-secondary underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary text-sm">Your bag is empty</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {mounted && items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-muted px-4 py-4 safe-area-bottom">
            <div className="flex justify-between mb-3 text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-primary text-white text-center py-3.5 text-sm tracking-widest uppercase rounded-xl"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
