import Link from "next/link";
import { getCuratedEdit } from "@/lib/recommendations";
import { CuratedEdit } from "@/components/customer/curated-edit";
import { VipBanner } from "@/components/customer/vip-banner";
import { PrivateSaleSection } from "@/components/customer/private-sale-section";

const FEATURED_CATEGORIES = [
  { name: "Ready-to-Wear", href: "/products?category=RTW", image: "/placeholder-rtw.jpg" },
  { name: "Bags", href: "/products?category=BAGS", image: "/placeholder-bags.jpg" },
  { name: "Shoes", href: "/products?category=SHOES", image: "/placeholder-shoes.jpg" },
  { name: "Accessories", href: "/products?category=ACCESSORIES", image: "/placeholder-acc.jpg" },
] as const;

// TODO: Replace with actual auth session tier
const CURRENT_VIP_TIER = "GOLD" as const;

export default function HomePage() {
  return (
    <div>
      {/* VIP Banner */}
      <VipBanner tier={CURRENT_VIP_TIER} />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-surface overflow-hidden">
        <div className="text-center px-6 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
            Fall/Winter 2026
          </p>
          <h2 className="font-serif text-5xl lg:text-7xl leading-tight mb-8">
            The Art of
            <br />
            Quiet Luxury
          </h2>
          <p className="text-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Discover the defining pieces of the season, curated from the
            world&apos;s most prestigious houses.
          </p>
          <Link
            href="/collections"
            className="inline-block border border-primary px-10 py-4 text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all"
          >
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <h3 className="text-center text-xs tracking-[0.3em] uppercase text-secondary mb-16">
          Shop by Category
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {FEATURED_CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[3/4] bg-surface overflow-hidden"
            >
              <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-charcoal/10 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-sm tracking-widest uppercase">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated For You — powered by AI style-recommender */}
      <CuratedEdit edit={getCuratedEdit("GOLD")} />

      {/* Brand Story Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-surface" />
          <div className="max-w-md">
            <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-6">
              The Journal
            </p>
            <h3 className="font-serif text-3xl lg:text-4xl leading-snug mb-6">
              The Enduring Allure of Italian Craftsmanship
            </h3>
            <p className="text-secondary leading-relaxed mb-8">
              From the ateliers of Florence to the runways of Milan, discover
              how generations of artisans continue to shape the future of luxury
              fashion.
            </p>
            <Link
              href="/journal"
              className="text-sm tracking-widest uppercase border-b border-primary pb-1 hover:border-accent transition-colors"
            >
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* Private Sale — VIP only */}
      <PrivateSaleSection tier={CURRENT_VIP_TIER} />
    </div>
  );
}
