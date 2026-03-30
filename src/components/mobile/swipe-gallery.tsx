"use client";

import { useState, useRef } from "react";
import { ProductImage } from "@/components/ui/product-image";

interface SwipeGalleryProps {
  readonly images: readonly { id: string; url: string; type: string; altText: string | null }[];
}

export function SwipeGallery({ images }: SwipeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  }

  const items = images.length > 0 ? images : [{ id: "placeholder", url: "", type: "PRODUCT", altText: null }];

  return (
    <div className="lg:hidden">
      {/* Scrollable gallery */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-y"
      >
        {items.map((image, i) => (
          <div
            key={image.id}
            className="w-full shrink-0 snap-center"
          >
            <ProductImage
              src={image.url}
              alt={image.altText ?? image.type}
              aspectRatio="square"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 py-3">
          {items.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? "bg-primary w-4" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
