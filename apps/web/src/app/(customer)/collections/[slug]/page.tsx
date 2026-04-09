import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCollectionBySlug,
  getCollectionProducts,
} from "@/lib/mock-collections";
import { formatPrice } from "@/lib/mock-data";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) return { title: "Collection Not Found" };

  return {
    title: `${collection.name} — ${collection.headline}`,
    description: collection.narrative.split("\n\n")[0],
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = getCollectionProducts(collection);

  return (
    <div>
      {/* Hero */}
      <section className="bg-surface py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
            {collection.season} {collection.year} &middot;{" "}
            {products.length} pieces
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl leading-tight mb-8">
            {collection.headline}
          </h1>
        </div>
      </section>

      {/* Narrative */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-secondary leading-relaxed space-y-6 text-lg">
          {collection.narrative.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <h2 className="text-center text-xs tracking-[0.3em] uppercase text-secondary mb-16">
          The Edit
        </h2>
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
              <p className="text-xs tracking-widest uppercase text-secondary mb-1">
                {product.brand.name}
              </p>
              <p className="text-sm mb-2 group-hover:underline underline-offset-4">
                {product.name}
              </p>
              <p className="text-sm text-secondary">
                {formatPrice(product.priceUsd)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Back to collections */}
      <div className="text-center pb-24">
        <Link
          href="/collections"
          className="text-sm tracking-widest uppercase border-b border-primary pb-1 hover:border-accent transition-colors"
        >
          All Collections
        </Link>
      </div>
    </div>
  );
}
