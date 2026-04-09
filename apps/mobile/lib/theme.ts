// Mobile theme — `@repo/design-tokens`에서 파생.
// 변경 시 주의: brand 토큰은 @repo/design-tokens/brand, 플랫폼 토큰은 @repo/design-tokens/mobile.
// 웹 토큰(@repo/design-tokens/web)을 import하면 안 됨.

import { brandColors } from "@repo/design-tokens/brand";
import { mobileSpacing, mobileStateColors } from "@repo/design-tokens/mobile";

export const colors = {
  ivory: brandColors.ivory,
  charcoal: brandColors.charcoal,
  warmGray: brandColors.warmGray,
  lightGray: brandColors.lightGray,
  gold: brandColors.gold,
  goldLight: brandColors.goldLight,
  cream: brandColors.cream,
  white: brandColors.white,
  red: mobileStateColors.red,
  green: mobileStateColors.green,
} as const;

export const fonts = {
  // 현재: 시스템 폰트 폴백. Phase 4에서 expo-font로 Playfair Display + Inter 번들링.
  serif: "Georgia",
  sans: "System",
} as const;

export const spacing = {
  xs: mobileSpacing.xs,
  sm: mobileSpacing.sm,
  md: mobileSpacing.md,
  lg: mobileSpacing.lg,
  xl: mobileSpacing.xl,
  xxl: mobileSpacing.xxl,
} as const;
