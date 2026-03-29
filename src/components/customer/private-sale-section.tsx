import Link from "next/link";

interface PrivateSaleSectionProps {
  readonly tier: "PLATINUM" | "GOLD" | "SILVER" | "STANDARD";
}

export function PrivateSaleSection({ tier }: PrivateSaleSectionProps) {
  if (tier !== "PLATINUM" && tier !== "GOLD") return null;

  const isEarlyAccess = tier === "PLATINUM";

  return (
    <section className="bg-neutral-900 text-white py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-6">
          {isEarlyAccess ? "Exclusive Access" : "Early Access"}
        </p>
        <h2 className="font-serif text-4xl lg:text-5xl mb-6">
          Autumn Atelier
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-4 max-w-lg mx-auto">
          {isEarlyAccess
            ? "As a Platinum member, you have first access to the season's most coveted pieces — 48 hours before anyone else."
            : "As a Gold member, you have early access to our private preview — 24 hours before general release."}
        </p>
        <p className="text-xs text-neutral-500 mb-10">
          {isEarlyAccess
            ? "Your private preview is now open"
            : "Your preview opens September 14, 2026"}
        </p>
        <Link
          href="/collections/fw26-preview"
          className="inline-block border border-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-neutral-900 transition-all"
        >
          {isEarlyAccess ? "Shop Now" : "Preview the Collection"}
        </Link>
      </div>
    </section>
  );
}
