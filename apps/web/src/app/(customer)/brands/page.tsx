import Link from "next/link";
import { getBrands } from "@/lib/db/queries";

const TIER_LABELS: Record<string, string> = {
  HERITAGE: "Heritage Luxury",
  MODERN: "Modern Luxury",
  CONTEMPORARY: "Contemporary Luxury",
  STREETLUXURY: "Streetluxury",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  const brandsByTier = brands.reduce<Record<string, typeof brands>>((acc, brand) => {
    const tier = brand.tier;
    return { ...acc, [tier]: [...(acc[tier] ?? []), brand] };
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="text-center mb-20">
        <h1 className="font-serif text-4xl lg:text-5xl mb-4">Our Brands</h1>
        <p className="text-secondary text-sm max-w-lg mx-auto">
          A curated portfolio of the world&apos;s most distinguished fashion houses.
        </p>
      </div>

      {Object.entries(brandsByTier).map(([tier, tierBrands]) => (
        <section key={tier} className="mb-20">
          <h2 className="text-xs tracking-[0.3em] uppercase text-secondary mb-10 text-center">
            {TIER_LABELS[tier] ?? tier}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tierBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group p-8 border border-muted hover:border-primary transition-colors"
              >
                <h3 className="font-serif text-2xl mb-3 group-hover:underline underline-offset-4">
                  {brand.name}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {brand.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
