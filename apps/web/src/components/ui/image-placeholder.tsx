interface ImagePlaceholderProps {
  readonly className?: string;
  readonly aspectRatio?: "square" | "portrait" | "landscape";
  readonly label?: string;
}

const ASPECT_CLASSES = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
} as const;

export function ImagePlaceholder({
  className = "",
  aspectRatio = "portrait",
  label,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`${ASPECT_CLASSES[aspectRatio]} bg-neutral-100 relative overflow-hidden ${className}`}
    >
      {/* Shimmer animation */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Optional label */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-neutral-400 tracking-widest uppercase">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
