import Link from "next/link";
import { getCollections } from "@/lib/mock-collections";

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="text-center mb-20">
        <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-4">
          Seasonal Edits
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl mb-6">Collections</h1>
        <p className="text-secondary max-w-lg mx-auto">
          Curated edits that capture the essence of each season, selected
          by our editorial team from the world&apos;s most distinguished houses.
        </p>
      </div>

      <div className="space-y-16">
        {collections.map((collection, i) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group grid lg:grid-cols-2 gap-10 items-center"
          >
            {/* Image — alternate layout */}
            <div
              className={`aspect-[4/3] bg-surface ${i % 2 === 1 ? "lg:order-2" : ""}`}
            />

            {/* Text */}
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-4">
                {collection.season} {collection.year} &middot;{" "}
                {collection.productSlugs.length} pieces
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl leading-snug mb-4 group-hover:underline underline-offset-4 decoration-1">
                {collection.headline}
              </h2>
              <p className="text-secondary leading-relaxed line-clamp-3 mb-6">
                {collection.narrative.split("\n\n")[0]}
              </p>
              <span className="text-sm tracking-widest uppercase border-b border-primary pb-1">
                Explore Collection
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
