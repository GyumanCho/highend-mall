// Tier 2 Platform Tokens (Web) — 웹 전용 스페이싱/타이포 스케일.
// 모바일에서 import 금지. ESLint boundary rule로 강제.

export const webSpacing = {
  page: 64,
  section: 128,
  gutter: 24,
} as const;

export const webTypography = {
  h1: { fontSize: 56, lineHeight: 64 },
  h2: { fontSize: 40, lineHeight: 48 },
  h3: { fontSize: 28, lineHeight: 36 },
  body: { fontSize: 16, lineHeight: 26 },
} as const;
