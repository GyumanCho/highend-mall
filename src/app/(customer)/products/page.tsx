import Link from "next/link";
import { getProducts, getBrands, formatPrice } from "@/lib/db/queries";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; brand?: string; tier?: string }>;
}

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "BAGS", label: "Bags" },
  { value: "RTW", label: "Ready-to-Wear" },
  { value: "SHOES", label: "Shoes" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "JEWELRY", label: "Jewelry" },
  { value: "BEAUTY", label: "Beauty" },
] as const;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [products, brands] = await Promise.all([
    getProducts({
      category: params.category,
      brandSlug: params.brand,
      priceTier: params.tier,
    }),
    getBrands(),
  ]);

  const activeCategory = params.category ?? "";

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl lg:text-5xl mb-4">
          {params.category ?? "All Products"}
        </h1>
        <p className="text-secondary text-sm">
          {products.length} piece{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-6 mb-16 border-b border-muted pb-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={cat.value ? `/products?category=${cat.value}` : "/products"}
            className={`text-xs tracking-widest uppercase transition-colors pb-2 ${
              activeCategory === cat.value
                ? "text-primary border-b border-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Brand filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link
          href={params.category ? `/products?category=${params.category}` : "/products"}
          className={`text-xs tracking-wide px-3 py-1.5 border transition-colors ${
            !params.brand ? "border-primary text-primary" : "border-muted text-secondary hover:border-primary"
          }`}
        >
          All Brands
        </Link>
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/products?brand=${brand.slug}${params.category ? `&category=${params.category}` : ""}`}
            className={`text-xs tracking-wide px-3 py-1.5 border transition-colors ${
              params.brand === brand.slug
                ? "border-primary text-primary"
                : "border-muted text-secondary hover:border-primary"
            }`}
          >
            {brand.name}
          </Link>
        ))}
      </div>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="overflow-hidden mb-4">
                <div className="group-hover:scale-[1.02] transition-transform duration-500">
                  <ImagePlaceholder aspectRatio="portrait" />
                </div>
              </div>
              <p className="text-xs tracking-widest uppercase text-secondary mb-1">
                {product.brand.name}
              </p>
              <p className="text-sm mb-2 group-hover:underline underline-offset-4">
                {product.name}
              </p>
              <p className="text-sm text-secondary">
                {product.prices[0] ? formatPrice(product.prices[0].amount) : ""}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-secondary">No products found matching your criteria.</p>
          <Link href="/products" className="inline-block mt-6 text-sm tracking-widest uppercase border-b border-primary pb-1">
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
