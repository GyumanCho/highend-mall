import { MOCK_PRODUCTS, type MockProduct } from "./mock-data";

export interface MockCollection {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly season: string;
  readonly year: number;
  readonly brandSlug: string | null;
  readonly headline: string;
  readonly narrative: string;
  readonly productSlugs: readonly string[];
}

export const MOCK_COLLECTIONS: readonly MockCollection[] = [
  {
    id: "col-1",
    name: "Fall/Winter 2026",
    slug: "fw26",
    season: "FW",
    year: 2026,
    brandSlug: null,
    headline: "The Art of Quiet Luxury",
    narrative: `This season's defining collections converge on a shared conviction: that luxury speaks most eloquently in a restrained voice. Across the houses represented here, there is a return to material purity — calfskin that demands to be touched, cashmere that settles on the shoulders with deliberate weight, hardware that catches light without demanding attention.

The Fall/Winter 2026 edit is not about trends. It is about objects that outlast them. Each piece has been selected for its capacity to anchor a wardrobe for seasons to come — because true luxury is measured not in novelty but in endurance.`,
    productSlugs: [
      "gucci-gg-marmont-small-shoulder-bag",
      "bottega-veneta-cassette-bag-intreccio",
      "celine-triomphe-shoulder-bag-shiny-calfskin",
      "the-row-margaux-15-smooth-calfskin",
      "jacquemus-le-chiquito-long-smooth-leather",
    ],
  },
  {
    id: "col-2",
    name: "FW26 Private Preview",
    slug: "fw26-preview",
    season: "FW",
    year: 2026,
    brandSlug: null,
    headline: "Your Private Preview",
    narrative: `Before the season begins, we invite our most valued clients to discover the pieces that will define Autumn 2026. This preview is reserved exclusively for VIP members — an opportunity to secure the season's most coveted pieces before they reach the wider audience.

Each item in this preview has been hand-selected by our curatorial team for its exceptional craftsmanship, design significance, and investment potential.`,
    productSlugs: [
      "the-row-margaux-15-smooth-calfskin",
      "bottega-veneta-cassette-bag-intreccio",
      "celine-triomphe-shoulder-bag-shiny-calfskin",
    ],
  },
  {
    id: "col-3",
    name: "The Icons Edit",
    slug: "icons",
    season: "FW",
    year: 2026,
    brandSlug: null,
    headline: "Enduring Icons",
    narrative: `Some pieces transcend seasons. They are not of a moment — they define it. This edit gathers the bags that have earned their place in the permanent vocabulary of luxury: designs so resolved, so essential, that each generation discovers them anew.

From the interlocking GG to the intreccio weave, from the Triomphe clasp to the Margaux's silent perfection — these are the objects that need no introduction.`,
    productSlugs: [
      "gucci-gg-marmont-small-shoulder-bag",
      "bottega-veneta-cassette-bag-intreccio",
      "celine-triomphe-shoulder-bag-shiny-calfskin",
      "the-row-margaux-15-smooth-calfskin",
    ],
  },
];

export function getCollections(): readonly MockCollection[] {
  return MOCK_COLLECTIONS;
}

export function getCollectionBySlug(slug: string): MockCollection | undefined {
  return MOCK_COLLECTIONS.find((c) => c.slug === slug);
}

export function getCollectionProducts(collection: MockCollection): readonly MockProduct[] {
  return collection.productSlugs
    .map((slug) => MOCK_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is MockProduct => p !== undefined);
}
