import Link from "next/link";

interface VipBannerProps {
  readonly tier: "PLATINUM" | "GOLD" | "SILVER" | "STANDARD";
}

const BANNER_CONFIG = {
  PLATINUM: {
    message: "Your Private Preview: FW26 collection is now available exclusively for you",
    cta: "Access Your Preview",
    href: "/collections/fw26-preview",
    bgClass: "bg-neutral-900 text-white",
  },
  GOLD: {
    message: "Early Access: FW26 private preview begins in 2 days",
    cta: "Set Reminder",
    href: "/collections/fw26-preview",
    bgClass: "bg-amber-50 text-amber-900",
  },
  SILVER: {
    message: "Welcome back — explore new arrivals curated for the season",
    cta: "Discover New Arrivals",
    href: "/products",
    bgClass: "bg-surface text-primary",
  },
  STANDARD: null,
} as const;

export function VipBanner({ tier }: VipBannerProps) {
  const config = BANNER_CONFIG[tier];
  if (!config) return null;

  return (
    <div className={`${config.bgClass} py-3`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-center gap-6 text-sm">
        <span className="tracking-wide">{config.message}</span>
        <Link
          href={config.href}
          className="shrink-0 text-xs tracking-widest uppercase underline underline-offset-4"
        >
          {config.cta}
        </Link>
      </div>
    </div>
  );
}
