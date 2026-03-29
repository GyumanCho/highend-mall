import Link from "next/link";
import { BRAND_STORIES } from "@/lib/brand-stories";
import { MOCK_BRANDS } from "@/lib/mock-data";

export default function JournalPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="text-center mb-20">
        <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-4">
          The Journal
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl mb-6">
          Stories of Craft & Culture
        </h1>
        <p className="text-secondary max-w-lg mx-auto">
          Explore the heritage, philosophy, and artistry behind the houses
          that define modern luxury.
        </p>
      </div>

      {/* Featured Story */}
      {BRAND_STORIES[0] && (
        <section className="mb-24">
          <Link
            href={`/brands/${BRAND_STORIES[0].brandSlug}`}
            className="group grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="aspect-[4/5] bg-surface" />
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-4">
                Featured
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl leading-snug mb-6 group-hover:underline underline-offset-4">
                {BRAND_STORIES[0].headline}
              </h2>
              <p className="text-secondary leading-relaxed mb-6">
                {BRAND_STORIES[0].story.split("\n\n")[0]}
              </p>
              <span className="text-sm tracking-widest uppercase border-b border-primary pb-1">
                Read the Full Story
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* All Stories Grid */}
      <section>
        <h3 className="text-xs tracking-[0.3em] uppercase text-secondary mb-12 text-center">
          All Stories
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {BRAND_STORIES.slice(1).map((story) => {
            const brand = MOCK_BRANDS.find((b) => b.slug === story.brandSlug);
            return (
              <Link
                key={story.brandSlug}
                href={`/brands/${story.brandSlug}`}
                className="group"
              >
                <div className="aspect-[4/3] bg-surface mb-6" />
                <p className="text-xs tracking-widest uppercase text-secondary mb-2">
                  {brand?.name ?? story.brandSlug}
                </p>
                <h3 className="font-serif text-xl leading-snug mb-3 group-hover:underline underline-offset-4">
                  {story.headline}
                </h3>
                <p className="text-sm text-secondary leading-relaxed line-clamp-3">
                  {story.subheadline}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
