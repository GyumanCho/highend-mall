import { MOCK_PRODUCTS, type MockProduct } from "./mock-data";

export interface RecommendationEdit {
  readonly title: string;
  readonly narrative: string;
  readonly items: readonly RecommendedItem[];
}

export interface RecommendedItem {
  readonly product: MockProduct;
  readonly matchReason: string;
  readonly stylingNote: string;
  readonly confidence: number;
  readonly type: "curated" | "cross_sell" | "discovery";
}

// Simulates style-recommender agent output
export function getCuratedEdit(customerTier: string): RecommendationEdit {
  const items: readonly RecommendedItem[] = MOCK_PRODUCTS.map((product, i) => ({
    product,
    matchReason: MATCH_REASONS[i % MATCH_REASONS.length],
    stylingNote: STYLING_NOTES[i % STYLING_NOTES.length],
    confidence: 0.95 - i * 0.05,
    type: i < 3 ? ("curated" as const) : i < 4 ? ("cross_sell" as const) : ("discovery" as const),
  }));

  const title =
    customerTier === "PLATINUM"
      ? "Your Private Edit: Quiet Luxury Essentials"
      : customerTier === "GOLD"
        ? "Curated for You: The Season's Defining Pieces"
        : "Discover: New Season Arrivals";

  const narrative =
    customerTier === "PLATINUM"
      ? "A selection reserved exclusively for you, drawn from the latest arrivals across your preferred houses."
      : customerTier === "GOLD"
        ? "Inspired by your affinity for understated elegance, a refined edit of this season's most considered pieces."
        : "Begin your journey with the season's most compelling new arrivals from our curated portfolio.";

  return { title, narrative, items };
}

export function getRelatedProducts(
  currentSlug: string,
): readonly RecommendedItem[] {
  return MOCK_PRODUCTS
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3)
    .map((product, i) => ({
      product,
      matchReason: RELATED_REASONS[i % RELATED_REASONS.length],
      stylingNote: "",
      confidence: 0.85 - i * 0.1,
      type: "curated" as const,
    }));
}

const MATCH_REASONS = [
  "Aligns with your preference for heritage luxury craftsmanship",
  "Matches your affinity for understated, logo-free design",
  "Complements your minimalist aesthetic and fine leather preference",
  "Reflects your interest in modern Italian craftsmanship",
  "A discovery piece from a brand in the same aesthetic family",
] as const;

const STYLING_NOTES = [
  "Pairs naturally with tailored outerwear for a refined evening silhouette",
  "A versatile piece that transitions seamlessly from day to evening",
  "The perfect complement to your existing neutral wardrobe",
  "An investment piece that anchors any seasonal rotation",
  "A playful counterpoint to more structured pieces in your collection",
] as const;

const RELATED_REASONS = [
  "Similar aesthetic and material quality",
  "From the same brand family",
  "Complementary style and price range",
] as const;
