"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";
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
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, name, brand, price, currency: "USD", size: "One Size", slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-muted px-4 py-3 lg:hidden safe-area-bottom">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-sm text-secondary">{formatPrice(price)}</p>
        </div>
        <button
          onClick={handleAdd}
          className={`shrink-0 px-6 py-3 text-sm tracking-widest uppercase rounded-xl transition-all ${
            added
              ? "bg-green-600 text-white"
              : "bg-primary text-white"
          }`}
        >
          {added ? "Added" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
}
