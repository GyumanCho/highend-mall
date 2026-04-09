"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { useIsClient } from "@/lib/hooks/use-is-client";

export function CartCount() {
  const itemCount = useCartStore((s) => s.itemCount());
  const mounted = useIsClient();

  return (
    <Link
      href="/cart"
      className="text-secondary hover:text-primary text-sm tracking-wide"
    >
      Bag ({mounted ? itemCount : 0})
    </Link>
  );
}
