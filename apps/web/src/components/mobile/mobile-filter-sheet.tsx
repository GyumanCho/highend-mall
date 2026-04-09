"use client";

import { BottomSheet } from "./bottom-sheet";

interface MobileFilterSheetProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly brands: readonly { name: string; slug: string }[];
  readonly activeBrand?: string;
  readonly activeCategory?: string;
  readonly onSelectBrand: (slug: string | null) => void;
  readonly onSelectCategory: (category: string | null) => void;
}

const CATEGORIES = [
  { value: "BAGS", label: "Bags" },
  { value: "RTW", label: "Ready-to-Wear" },
  { value: "SHOES", label: "Shoes" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "JEWELRY", label: "Jewelry" },
  { value: "BEAUTY", label: "Beauty" },
] as const;

export function MobileFilterSheet({
  isOpen,
  onClose,
  brands,
  activeBrand,
  activeCategory,
  onSelectBrand,
  onSelectCategory,
}: MobileFilterSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter">
      <div className="space-y-8">
        {/* Categories */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-secondary mb-4">Category</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { onSelectCategory(null); onClose(); }}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                !activeCategory ? "bg-primary text-white border-primary" : "border-muted text-secondary"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { onSelectCategory(cat.value); onClose(); }}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  activeCategory === cat.value ? "bg-primary text-white border-primary" : "border-muted text-secondary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-secondary mb-4">Brand</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { onSelectBrand(null); onClose(); }}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                !activeBrand ? "bg-primary text-white border-primary" : "border-muted text-secondary"
              }`}
            >
              All
            </button>
            {brands.map((brand) => (
              <button
                key={brand.slug}
                onClick={() => { onSelectBrand(brand.slug); onClose(); }}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  activeBrand === brand.slug ? "bg-primary text-white border-primary" : "border-muted text-secondary"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
