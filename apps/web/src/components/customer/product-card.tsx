import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatPrice, type MockProduct } from "@/lib/mock-data";

interface ProductCardProps {
  readonly product: MockProduct;
  readonly showBrand?: boolean;
  readonly matchReason?: string;
}

export function ProductCard({
  product,
  showBrand = true,
  matchReason,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group"
    >
      <div className="overflow-hidden mb-4">
        <div className="group-hover:scale-[1.02] transition-transform duration-500">
          <ImagePlaceholder aspectRatio="portrait" />
        </div>
      </div>
      {showBrand && (
        <p className="text-xs tracking-widest uppercase text-secondary mb-1">
          {product.brand.name}
        </p>
      )}
      <p className="text-sm mb-1 group-hover:underline underline-offset-4">
        {product.name}
      </p>
      <p className="text-sm text-secondary mb-1">
        {formatPrice(product.priceUsd)}
      </p>
      {matchReason && (
        <p className="text-xs text-accent leading-relaxed mt-1">
          {matchReason}
        </p>
      )}
    </Link>
  );
}
