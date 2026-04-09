"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";

export function CartCount() {
  const itemCount = useCartStore((s) => s.itemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="text-secondary hover:text-primary text-sm tracking-wide"
    >
      Bag ({mounted ? itemCount : 0})
    </Link>
  );
}
