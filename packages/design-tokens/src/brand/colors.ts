// Tier 1 Brand Tokens — 플랫폼 불변. 웹/모바일 모두 참조.
// 실제 값은 현재 apps/web/src/app/globals.css 및 apps/mobile/lib/theme.ts와 일치.

export const brandColors = {
  // Core palette
  ivory: "#faf8f5",
  charcoal: "#1a1a1a",
  warmGray: "#6b6560",
  lightGray: "#e8e4df",
  gold: "#b8977e",
  goldLight: "#d4c4b0",
  cream: "#f5f0eb",
  white: "#ffffff",

  // Semantic roles
  primary: "#1a1a1a",
  accent: "#b8977e",
  surface: "#faf8f5",
  surfaceAlt: "#f5f0eb",
  textHigh: "#1a1a1a",
  textMuted: "#6b6560",
  divider: "rgba(0,0,0,0.08)",
} as const;

export type BrandColorKey = keyof typeof brandColors;
