"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { formatPrice } from "@/lib/mock-data";

// Mock customer data (replace with auth session)
const MOCK_CUSTOMER = {
  name: "Soyeon Kim",
  email: "soyeon@example.com",
  tier: "GOLD" as const,
  annualSpend: 28000,
  memberSince: "2024",
} as const;

const TIER_CONFIG = {
  PLATINUM: {
    label: "Platinum",
    color: "text-neutral-800",
    nextTier: null,
    threshold: 50000,
    benefits: ["Personal stylist", "Priority access to all collections", "Exclusive event invitations", "Complimentary alterations"],
  },
  GOLD: {
    label: "Gold",
    color: "text-amber-700",
    nextTier: "PLATINUM" as const,
    threshold: 50000,
    benefits: ["Early access (24h before general)", "Dedicated VIP customer service", "Birthday gift", "Complimentary shipping"],
  },
  SILVER: {
    label: "Silver",
    color: "text-neutral-500",
    nextTier: "GOLD" as const,
    threshold: 15000,
    benefits: ["Seasonal preview invitations", "Birthday perks", "Personalized recommendations"],
  },
  STANDARD: {
    label: "Standard",
    color: "text-neutral-400",
    nextTier: "SILVER" as const,
    threshold: 3000,
    benefits: ["Access to curated recommendations", "Newsletter exclusives"],
  },
} as const;

export default function AccountPage() {
  const { items: wishlistItems, removeItem } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const customer = MOCK_CUSTOMER;
  const tierConfig = TIER_CONFIG[customer.tier];
  const progressToNext = tierConfig.nextTier
    ? Math.min((customer.annualSpend / tierConfig.threshold) * 100, 100)
    : 100;
  const remaining = tierConfig.nextTier
    ? tierConfig.threshold - customer.annualSpend
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
      <h1 className="font-serif text-4xl mb-12">My Account</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile */}
          <div className="bg-surface p-8">
            <p className="font-serif text-xl mb-1">{customer.name}</p>
            <p className="text-sm text-secondary mb-4">{customer.email}</p>
            <p className="text-xs tracking-widest uppercase text-secondary">
              Member since {customer.memberSince}
            </p>
          </div>

          {/* VIP Tier */}
          <div className="bg-surface p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-widest uppercase">VIP Status</span>
              <span className={`font-serif text-lg ${tierConfig.color}`}>
                {tierConfig.label}
              </span>
            </div>

            {/* Progress bar */}
            {tierConfig.nextTier && (
              <div className="mb-4">
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <p className="text-xs text-secondary mt-2">
                  {formatPrice(remaining)} to{" "}
                  {TIER_CONFIG[tierConfig.nextTier].label}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {tierConfig.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2 text-xs text-secondary">
                  <span className="shrink-0 mt-0.5 text-accent">&#10003;</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {[
              { label: "Orders", href: "/account/orders" },
              { label: "Addresses", href: "/account/addresses" },
              { label: "Preferences", href: "/account/preferences" },
              { label: "Size Profile", href: "/account/size-profile" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-4 text-sm text-secondary hover:text-primary hover:bg-surface transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Recent Orders */}
          <section>
            <h2 className="text-xs tracking-widest uppercase text-secondary mb-6">
              Recent Orders
            </h2>
            <div className="border border-muted p-8 text-center">
              <p className="text-secondary text-sm">No orders yet.</p>
              <Link
                href="/products"
                className="inline-block mt-4 text-sm tracking-widest uppercase border-b border-primary pb-1"
              >
                Start Shopping
              </Link>
            </div>
          </section>

          {/* Wishlist */}
          <section>
            <h2 className="text-xs tracking-widest uppercase text-secondary mb-6">
              Wishlist ({mounted ? wishlistItems.length : 0})
            </h2>
            {mounted && wishlistItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.productId} className="group">
                    <Link href={`/products/${item.slug}`}>
                      <div className="aspect-[3/4] bg-surface mb-3" />
                    </Link>
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
                      {formatPrice(item.price)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="mt-2 text-xs text-secondary hover:text-primary underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-muted p-8 text-center">
                <p className="text-secondary text-sm">
                  Save pieces you love for later.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
