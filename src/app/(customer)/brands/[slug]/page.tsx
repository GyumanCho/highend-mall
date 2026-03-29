import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getProductsByBrand, formatPrice } from "@/lib/db/queries";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

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
  const [brand, products] = await Promise.all([
    getBrandBySlug(slug),
    getProductsByBrand(slug),
  ]);

  if (!brand) {
    notFound();
  }

  const storyRaw = brand.story as Record<string, unknown> | null;
  const story = storyRaw
    ? {
        headline: storyRaw.headline as string | undefined,
        subheadline: storyRaw.subheadline as string | undefined,
        milestones: storyRaw.milestones as string[] | undefined,
        values: storyRaw.values as string[] | undefined,
      }
    : null;

  return (
    <div>
      {/* Hero */}
      <section className="bg-surface py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
            {TIER_LABELS[brand.tier] ?? brand.tier}
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl mb-8">{brand.name}</h1>
          <p className="text-secondary leading-relaxed text-lg">
            {(story?.subheadline as string) ?? brand.description}
          </p>
        </div>
      </section>

      {/* Story */}
      {story && (
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-24">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <h2 className="font-serif text-3xl lg:text-4xl leading-snug mb-10">
                {story.headline as string}
              </h2>
              <p className="text-secondary leading-relaxed">{brand.description}</p>
            </div>
            <div className="lg:col-span-2 space-y-10">
              {story.milestones && (
                <div>
                  <h3 className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">Milestones</h3>
                  <div className="space-y-3">
                    {(story.milestones as string[]).map((m) => (
                      <p key={m} className="text-sm text-secondary">{m}</p>
                    ))}
                  </div>
                </div>
              )}
              {story.values && (
                <div>
                  <h3 className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">Brand Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {(story.values as string[]).map((v) => (
                      <span key={v} className="text-xs border border-muted px-3 py-1.5 text-secondary">{v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-center text-xs tracking-[0.3em] uppercase text-secondary mb-16">
            Shop {brand.name} &middot; {products.length} piece{products.length !== 1 ? "s" : ""}
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="overflow-hidden mb-4">
                    <div className="group-hover:scale-[1.02] transition-transform duration-500">
                      <ImagePlaceholder aspectRatio="portrait" />
                    </div>
                  </div>
                  <p className="text-sm mb-2 group-hover:underline underline-offset-4">{product.name}</p>
                  <p className="text-sm text-secondary">
                    {product.prices[0] ? formatPrice(product.prices[0].amount) : ""}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary">New pieces arriving soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
