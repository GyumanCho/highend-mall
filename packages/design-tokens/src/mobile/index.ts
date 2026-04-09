// Tier 2 Platform Tokens (Mobile) — 모바일 전용 스페이싱/타이포 스케일.
// 웹에서 import 금지. ESLint boundary rule로 강제.
// 자세한 원칙은 docs/mobile-native/mobile-design-system.md 참조.

export const mobileSpacing = {
  page: 16,
  section: 40,
  gutter: 12,
  touchTargetMin: 44,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const mobileTypography = {
  display: { fontSize: 32, lineHeight: 40 },
  h1: { fontSize: 28, lineHeight: 36 },
  h2: { fontSize: 22, lineHeight: 30 },
  h3: { fontSize: 18, lineHeight: 26 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  body: { fontSize: 15, lineHeight: 22 },
  caption: { fontSize: 13, lineHeight: 18 },
  label: { fontSize: 11, lineHeight: 14 },
  eyebrow: { fontSize: 10, lineHeight: 14, letterSpacing: 2 },
} as const;
