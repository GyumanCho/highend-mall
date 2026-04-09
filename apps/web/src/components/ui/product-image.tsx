"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  readonly src: string | null | undefined;
  readonly alt: string;
  readonly aspectRatio?: "square" | "portrait" | "landscape";
  readonly className?: string;
  readonly priority?: boolean;
}

const ASPECT_CLASSES = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
} as const;

export function ProductImage({
  src,
  alt,
  aspectRatio = "portrait",
  className = "",
  priority = false,
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const isExternal = src?.startsWith("http");

  if (!src || error) {
    return (
      <div className={`${ASPECT_CLASSES[aspectRatio]} bg-neutral-100 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-neutral-400 tracking-widest uppercase">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ASPECT_CLASSES[aspectRatio]} relative overflow-hidden bg-neutral-50 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover"
        priority={priority}
        onError={() => setError(true)}
        {...(!isExternal && { unoptimized: true })}
      />
    </div>
  );
}
