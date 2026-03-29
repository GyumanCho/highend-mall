import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByBrand, formatPrice } from "@/lib/db/queries";
import { AddToCartButton } from "@/components/customer/add-to-cart-button";
import { WishlistButton } from "@/components/customer/wishlist-button";
import { ProductReviews } from "@/components/customer/product-reviews";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProductsByBrand(product.brand.slug);
  const related = relatedProducts.filter((p) => p.slug !== slug).slice(0, 3);
  const defaultPrice = product.prices.find((p) => p.isDefault) ?? product.prices[0];
  const priceAmount = defaultPrice ? Number(defaultPrice.amount) : 0;
  const materials = product.materials as Record<string, string> | null;
  const specs = product.specifications as Record<string, string> | null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-secondary">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-primary">Products</Link></li>
          <li>/</li>
          <li><Link href={`/brands/${product.brand.slug}`} className="hover:text-primary">{product.brand.name}</Link></li>
          <li>/</li>
          <li className="text-primary">{product.name}</li>
        </ol>
      </nav>

      {/* Product Layout */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-4">
          <ImagePlaceholder aspectRatio="square" />
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(0, 3).map((img) => (
              <ImagePlaceholder key={img.id} aspectRatio="square" label={img.type} />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-3">{product.brand.name}</p>
          <h1 className="font-serif text-3xl lg:text-4xl mb-4">{product.titleDisplay}</h1>
          <p className="text-xl mb-8">{formatPrice(priceAmount)}</p>
          <p className="text-secondary leading-relaxed mb-8">{product.descriptionHero}</p>

          {/* Size */}
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase mb-3">Size</p>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-primary text-sm">One Size</button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              brand={product.brand.name}
              price={priceAmount}
              slug={product.slug}
            />
            <WishlistButton
              productId={product.id}
              name={product.name}
              brand={product.brand.name}
              price={priceAmount}
              slug={product.slug}
            />
          </div>

          {/* Accordions */}
          <div className="mt-12 space-y-0">
            {materials && (
              <details className="border-t border-muted py-5 group" open>
                <summary className="flex justify-between items-center cursor-pointer text-xs tracking-widest uppercase">
                  Materials
                  <span className="text-secondary group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="mt-4 text-sm text-secondary leading-relaxed space-y-1">
                  {materials.primary && <p>Primary: {materials.primary}</p>}
                  {materials.secondary && <p>Hardware: {materials.secondary}</p>}
                  {materials.lining && <p>Lining: {materials.lining}</p>}
                </div>
              </details>
            )}
            <details className="border-t border-muted py-5 group">
              <summary className="flex justify-between items-center cursor-pointer text-xs tracking-widest uppercase">
                Collection
                <span className="text-secondary group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="mt-4 text-sm text-secondary">{product.collection ?? "—"}</div>
            </details>
            <details className="border-t border-b border-muted py-5 group">
              <summary className="flex justify-between items-center cursor-pointer text-xs tracking-widest uppercase">
                Category
                <span className="text-secondary group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <div className="mt-4 text-sm text-secondary">{product.categoryPath}</div>
            </details>
          </div>
        </div>
      </div>

      {/* Editorial */}
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

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-muted py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl text-center mb-16">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group">
                  <div className="overflow-hidden mb-4">
                    <div className="group-hover:scale-[1.02] transition-transform duration-500">
                      <ImagePlaceholder aspectRatio="portrait" />
                    </div>
                  </div>
                  <p className="text-xs tracking-widest uppercase text-secondary mb-1">{p.brand.name}</p>
                  <p className="text-sm mb-1 group-hover:underline underline-offset-4">{p.name}</p>
                  <p className="text-sm text-secondary">{p.prices[0] ? formatPrice(p.prices[0].amount) : ""}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
