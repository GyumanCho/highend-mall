import Link from "next/link";
import { formatPrice } from "@/lib/mock-data";
import type { RecommendedItem } from "@/lib/recommendations";

interface RelatedProductsProps {
  readonly items: readonly RecommendedItem[];
  readonly title?: string;
}

export function RelatedProducts({
  items,
  title = "You May Also Like",
}: RelatedProductsProps) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-muted py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="font-serif text-3xl text-center mb-16">{title}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {items.map(({ product, matchReason }) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="aspect-[3/4] bg-surface mb-4 overflow-hidden">
                <div className="w-full h-full bg-muted group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <p className="text-xs tracking-widest uppercase text-secondary mb-1">
                {product.brand.name}
              </p>
              <p className="text-sm mb-1 group-hover:underline underline-offset-4">
                {product.name}
              </p>
              <p className="text-sm text-secondary mb-2">
                {formatPrice(product.priceUsd)}
              </p>
              <p className="text-xs text-accent">{matchReason}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
