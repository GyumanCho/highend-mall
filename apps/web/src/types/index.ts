// ─── Brand Types ───
export type BrandTier =
  | "HERITAGE"
  | "MODERN"
  | "CONTEMPORARY"
  | "STREETLUXURY";

export type PriceTier = "ACCESSIBLE" | "CORE" | "ULTRA";

export type ProductCategory =
  | "BAGS"
  | "RTW"
  | "SHOES"
  | "ACCESSORIES"
  | "JEWELRY"
  | "BEAUTY";

export type VipTier = "PLATINUM" | "GOLD" | "SILVER" | "STANDARD";

export type Season = "SS" | "PF" | "FW" | "CR" | "HC";

export type Currency = "KRW" | "USD" | "EUR" | "JPY";

// ─── API Response Types ───
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly metadata?: PaginationMeta;
}

export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

// ─── Product Types ───
export interface ProductPrice {
  readonly amount: number;
  readonly currency: Currency;
}

export interface MaterialSpec {
  readonly primary: string;
  readonly secondary?: string;
  readonly lining?: string;
}

export interface SizeInfo {
  readonly available: readonly string[];
  readonly sizeSystem: string;
}

// ─── AI Agent Types ───
export type AgentJobType =
  | "PRODUCT_LISTING"
  | "RECOMMENDATION"
  | "CAMPAIGN_DESIGN"
  | "REVIEW_RESPONSE"
  | "BRAND_STORY";

export type JobStatus =
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface AgentJobResult {
  readonly jobId: string;
  readonly type: AgentJobType;
  readonly status: JobStatus;
  readonly output: unknown;
  readonly qaScore?: number;
}

// ─── Style DNA Types ───
export interface StyleDna {
  readonly primaryAesthetic: string;
  readonly colorPalette: readonly string[];
  readonly preferredSilhouettes: readonly string[];
  readonly materialPreferences: readonly string[];
}

export interface BrandAffinity {
  readonly topBrands: readonly string[];
  readonly loyaltyScore: number;
  readonly explorationTendency: "low" | "medium" | "high";
}

export interface SpendingPattern {
  readonly averageOrderValue: number;
  readonly annualSpend: number;
  readonly priceSensitivity: "low" | "medium" | "high";
  readonly peakSeasons: readonly Season[];
  readonly categorySplit: Readonly<Record<string, number>>;
}
