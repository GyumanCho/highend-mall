import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getProductsByBrand, formatPrice } from "@/lib/mock-data";
import { getBrandStory } from "@/lib/brand-stories";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

const TIER_LABELS: Record<string, string> = {
  HERITAGE: "Heritage Luxury",
  MODERN: "Modern Luxury",
  CONTEMPORARY: "Contemporary Luxury",
  STREETLUXURY: "Streetluxury",
};

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const products = getProductsByBrand(slug);
  const story = getBrandStory(slug);

  return (
    <div>
      {/* Brand Hero */}
      <section className="bg-surface py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
            {TIER_LABELS[brand.tier] ?? brand.tier}
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl mb-8">{brand.name}</h1>
          {story ? (
            <p className="text-secondary leading-relaxed text-lg">
              {story.subheadline}
            </p>
          ) : (
            <p className="text-secondary leading-relaxed text-lg">
              {brand.description}
            </p>
          )}
        </div>
      </section>

      {/* Brand Story — AI-generated editorial */}
      {story && (
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-24">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Story */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-3xl lg:text-4xl leading-snug mb-10">
                {story.headline}
              </h2>
              <div className="text-secondary leading-relaxed space-y-6">
                {story.story.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-10">
              {/* Milestones */}
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
                  Milestones
                </h3>
                <div className="space-y-3">
                  {story.milestones.map((milestone) => (
                    <p key={milestone} className="text-sm text-secondary">
                      {milestone}
                    </p>
                  ))}
                </div>
              </div>

              {/* Values */}
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
                  Brand Values
                </h3>
                <div className="flex flex-wrap gap-2">
                  {story.values.map((value) => (
                    <span
                      key={value}
                      className="text-xs border border-muted px-3 py-1.5 text-secondary"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Signature Elements */}
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
                  Signature Elements
                </h3>
                <div className="space-y-2">
                  {story.signatureElements.map((element) => (
                    <div key={element} className="flex items-start gap-2 text-sm text-secondary">
                      <span className="shrink-0 mt-0.5 text-accent">&#9679;</span>
                      <span>{element}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-center text-xs tracking-[0.3em] uppercase text-secondary mb-16">
            Shop {brand.name} &middot; {products.length} piece{products.length !== 1 ? "s" : ""}
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-[3/4] bg-muted mb-4 overflow-hidden">
                    <div className="w-full h-full bg-muted group-hover:scale-[1.02] transition-transform duration-500" />
                  </div>
                  <p className="text-sm mb-2 group-hover:underline underline-offset-4">
                    {product.name}
                  </p>
                  <p className="text-sm text-secondary">
                    {formatPrice(product.priceUsd)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary">
              New pieces arriving soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
