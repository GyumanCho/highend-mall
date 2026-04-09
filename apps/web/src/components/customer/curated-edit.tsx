import Link from "next/link";
import { formatPrice } from "@/lib/mock-data";
import type { RecommendationEdit } from "@/lib/recommendations";

interface CuratedEditProps {
  readonly edit: RecommendationEdit;
}

export function CuratedEdit({ edit }: CuratedEditProps) {
  return (
    <section className="bg-surface py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h3 className="font-serif text-3xl lg:text-4xl mb-4">{edit.title}</h3>
          <p className="text-secondary text-sm max-w-lg mx-auto">
            {edit.narrative}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {edit.items.slice(0, 4).map(({ product, matchReason, type }) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="relative aspect-[3/4] bg-muted mb-4 overflow-hidden">
                <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500" />
                {type === "discovery" && (
                  <span className="absolute top-3 left-3 bg-accent/90 text-white text-[10px] tracking-widest uppercase px-2 py-1">
                    Discovery
                  </span>
                )}
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
              <p className="text-xs text-accent leading-relaxed">
                {matchReason}
              </p>
            </Link>
          ))}
        </div>

        {edit.items.length > 4 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block text-sm tracking-widest uppercase border-b border-primary pb-1 hover:border-accent transition-colors"
            >
              View All Recommendations
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
