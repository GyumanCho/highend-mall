import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, formatPrice } from "@/lib/mock-data";
import { getRelatedProducts } from "@/lib/recommendations";
import { AddToCartButton } from "@/components/customer/add-to-cart-button";
import { WishlistButton } from "@/components/customer/wishlist-button";
import { RelatedProducts } from "@/components/customer/related-products";
import { ProductReviews } from "@/components/customer/product-reviews";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-secondary">
          <li>
            <Link href="/" className="hover:text-primary">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-primary">Products</Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/brands/${product.brand.slug}`}
              className="hover:text-primary"
            >
              {product.brand.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary">{product.name}</li>
        </ol>
      </nav>

      {/* Product Layout */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface" />
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-muted" />
            <div className="aspect-square bg-muted" />
            <div className="aspect-square bg-muted" />
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-3">
            {product.brand.name}
          </p>

          <h1 className="font-serif text-3xl lg:text-4xl mb-4">
            {product.titleDisplay}
          </h1>

          <p className="text-xl mb-8">
            {formatPrice(product.priceUsd)}
          </p>

          <p className="text-secondary leading-relaxed mb-8">
            {product.descriptionHero}
          </p>

          {/* Size - placeholder */}
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase mb-3">Size</p>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-primary text-sm">
                One Size
              </button>
            </div>
          </div>

          {/* Add to Bag */}
          <div className="space-y-3">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              brand={product.brand.name}
              price={product.priceUsd}
              slug={product.slug}
            />
            <WishlistButton
              productId={product.id}
              name={product.name}
              brand={product.brand.name}
              price={product.priceUsd}
              slug={product.slug}
            />
          </div>

          {/* Details Accordion */}
          <div className="mt-12 space-y-0">
            {/* Materials */}
            <details className="border-t border-muted py-5 group" open>
              <summary className="flex justify-between items-center cursor-pointer text-xs tracking-widest uppercase">
                Materials
                <span className="text-secondary group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="mt-4 text-sm text-secondary leading-relaxed space-y-1">
                <p>Primary: {product.materials.primary}</p>
                {product.materials.secondary && (
                  <p>Hardware: {product.materials.secondary}</p>
                )}
                {product.materials.lining && (
                  <p>Lining: {product.materials.lining}</p>
                )}
              </div>
            </details>

            {/* Collection */}
            <details className="border-t border-muted py-5 group">
              <summary className="flex justify-between items-center cursor-pointer text-xs tracking-widest uppercase">
                Collection
                <span className="text-secondary group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="mt-4 text-sm text-secondary">
                {product.collection}
              </div>
            </details>

            {/* Category */}
            <details className="border-t border-b border-muted py-5 group">
              <summary className="flex justify-between items-center cursor-pointer text-xs tracking-widest uppercase">
                Category
                <span className="text-secondary group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="mt-4 text-sm text-secondary">
                {product.categoryPath}
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Editorial Description */}
      <section className="max-w-3xl mx-auto py-24">
        <h2 className="font-serif text-3xl text-center mb-10">The Story</h2>
        <div className="text-secondary leading-relaxed space-y-6">
          {product.descriptionFull.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <ProductReviews productSlug={slug} />

      {/* Related Products — powered by AI style-recommender */}
      <RelatedProducts items={getRelatedProducts(slug)} />
    </div>
  );
}
