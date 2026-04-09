// Tier 1 Brand Fonts — 플랫폼 불변 폰트 패밀리.
// 웹(현재): next/font/google Playfair_Display + Inter
// 모바일(현재): Georgia + System, Phase 4에서 Playfair Display + Inter 도입 예정

export const brandFonts = {
  serif: "Playfair Display",
  sans: "Inter",
  mono: "JetBrains Mono",
} as const;

export const brandVoice = {
  tone: "understated, confident, quietly luxurious",
  tagline: "Quiet luxury, deliberate craftsmanship",
} as const;
