"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";

interface AddToCartButtonProps {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly slug: string;
  readonly size?: string;
}

export function AddToCartButton({
  productId,
  name,
  brand,
  price,
  slug,
  size = "One Size",
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, name, brand, price, currency: "USD", size, slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-primary text-white py-4 text-sm tracking-widest uppercase hover:bg-primary/90 transition-all"
    >
      {added ? "Added to Bag" : "Add to Bag"}
    </button>
  );
}
