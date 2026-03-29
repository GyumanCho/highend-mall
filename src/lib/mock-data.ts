// Mock data for development without DB connection
// Replace with Prisma queries when DB is available

export interface MockBrand {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly tier: string;
  readonly description: string;
}

export interface MockProduct {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly subcategory: string;
  readonly priceTier: string;
  readonly titleDisplay: string;
  readonly descriptionHero: string;
  readonly descriptionFull: string;
  readonly tags: readonly string[];
  readonly categoryPath: string;
  readonly collection: string;
  readonly materials: { readonly primary: string; readonly secondary?: string; readonly lining?: string };
  readonly brand: MockBrand;
  readonly priceUsd: number;
  readonly priceKrw: number;
}

export const MOCK_BRANDS: readonly MockBrand[] = [
  { id: "b1", name: "Gucci", slug: "gucci", tier: "HERITAGE", description: "Founded in Florence in 1921, Gucci is one of the world's leading luxury fashion brands." },
  { id: "b2", name: "Bottega Veneta", slug: "bottega-veneta", tier: "MODERN", description: "Italian luxury fashion house known for its intrecciato weave and understated elegance." },
  { id: "b3", name: "Celine", slug: "celine", tier: "MODERN", description: "French luxury house renowned for minimalist, refined fashion under creative direction." },
  { id: "b4", name: "The Row", slug: "the-row", tier: "MODERN", description: "American luxury brand epitomizing quiet luxury with impeccable tailoring and fabrics." },
  { id: "b5", name: "Jacquemus", slug: "jacquemus", tier: "CONTEMPORARY", description: "French fashion brand bringing Provencal warmth to contemporary luxury." },
];

export const MOCK_PRODUCTS: readonly MockProduct[] = [
  {
    id: "p1",
    sku: "GUC-443497",
    name: "GG Marmont Small Shoulder Bag",
    slug: "gucci-gg-marmont-small-shoulder-bag",
    category: "BAGS",
    subcategory: "shoulder_bags",
    priceTier: "CORE",
    titleDisplay: "GG Marmont Small Shoulder Bag in Matelasse Chevron Calfskin",
    descriptionHero: "A defining expression of Gucci's contemporary elegance, uniting the House's storied heritage with modern Italian craftsmanship.",
    descriptionFull: `Since Alessandro Michele reimagined the double G monogram for a new generation, the Marmont line has stood as a bridge between Gucci's Florentine roots and its ever-evolving creative vision.

Crafted from matelasse chevron calfskin, the bag reveals its quality through texture and weight. The chevron quilting is achieved through a meticulous process that requires the leather to be softened, layered, and stitched with precision that only seasoned Gucci artisans possess.

The antique gold-toned brass hardware carries the interlocking GG emblem, a motif drawn from the House's archival codes dating to the 1970s. Inside, a microfiber-lined interior is organized with a slip pocket and a central divider.`,
    tags: ["gucci", "gg-marmont", "shoulder-bag", "matelasse", "calfskin", "fw26"],
    categoryPath: "Bags > Shoulder Bags",
    collection: "FW26",
    materials: { primary: "Matelasse chevron calfskin", secondary: "Antique gold-toned brass hardware", lining: "Microfiber" },
    brand: { id: "b1", name: "Gucci", slug: "gucci", tier: "HERITAGE", description: "" },
    priceUsd: 2350,
    priceKrw: 3120000,
  },
  {
    id: "p2",
    sku: "BV-730303",
    name: "Cassette Bag in Intreccio Leather",
    slug: "bottega-veneta-cassette-bag-intreccio",
    category: "BAGS",
    subcategory: "crossbody_bags",
    priceTier: "CORE",
    titleDisplay: "Cassette Bag in Intreccio Nappa Leather",
    descriptionHero: "The Cassette reimagines Bottega Veneta's signature intreccio weave in a bold, contemporary silhouette.",
    descriptionFull: `The Cassette bag speaks to Bottega Veneta's mastery of leather craft. The oversized intreccio weave transforms supple nappa leather into a tactile, sculptural form.

Each strip of leather is cut, softened, and hand-woven by artisans in Vicenza. The result is a bag that feels as considered to the touch as it appears to the eye.

In keeping with Bottega Veneta's philosophy of stealth luxury, there is no visible logo. The weave itself is the signature — unmistakable to those who know, invisible to those who don't.`,
    tags: ["bottega-veneta", "cassette", "intreccio", "nappa", "crossbody", "fw26"],
    categoryPath: "Bags > Crossbody Bags",
    collection: "FW26",
    materials: { primary: "Intreccio nappa leather", secondary: "Gold-finished hardware", lining: "Suede" },
    brand: { id: "b2", name: "Bottega Veneta", slug: "bottega-veneta", tier: "MODERN", description: "" },
    priceUsd: 3200,
    priceKrw: 4250000,
  },
  {
    id: "p3",
    sku: "CEL-194143",
    name: "Triomphe Shoulder Bag in Shiny Calfskin",
    slug: "celine-triomphe-shoulder-bag-shiny-calfskin",
    category: "BAGS",
    subcategory: "shoulder_bags",
    priceTier: "CORE",
    titleDisplay: "Triomphe Shoulder Bag in Shiny Calfskin",
    descriptionHero: "The Triomphe clasp — drawn from the chains along the Arc de Triomphe — anchors Celine's vision of Parisian refinement.",
    descriptionFull: `The Triomphe bag is a study in restraint and precision. Its namesake clasp, inspired by the interlocking chains that adorn the Arc de Triomphe in Paris, is both a functional closure and a quiet declaration of heritage.

Crafted from shiny calfskin, the leather develops a distinctive patina with wear — growing more personal over time.

Celine's approach to luxury is one of reduction: every element earns its place. What remains is the essential: fine materials, considered proportions, and a clasp that connects past and present.`,
    tags: ["celine", "triomphe", "shoulder-bag", "calfskin", "fw26"],
    categoryPath: "Bags > Shoulder Bags",
    collection: "FW26",
    materials: { primary: "Shiny calfskin", secondary: "Gold-finished brass hardware", lining: "Lambskin" },
    brand: { id: "b3", name: "Celine", slug: "celine", tier: "MODERN", description: "" },
    priceUsd: 4150,
    priceKrw: 5500000,
  },
  {
    id: "p4",
    sku: "ROW-W1992",
    name: "Margaux 15 Bag in Smooth Calfskin",
    slug: "the-row-margaux-15-smooth-calfskin",
    category: "BAGS",
    subcategory: "top_handle_bags",
    priceTier: "ULTRA",
    titleDisplay: "Margaux 15 Bag in Smooth Calfskin",
    descriptionHero: "The Margaux is The Row's definitive statement on understated luxury — a bag that needs no introduction.",
    descriptionFull: `The Margaux 15 is the ultimate expression of The Row's design philosophy: that true luxury lies in what you don't see. There is no visible branding, no trend-driven detail, no concession to the moment.

The smooth calfskin — sourced from a single Italian tannery — is cut and assembled by hand. The proportions have been refined over multiple seasons to achieve a silhouette that is neither too structured nor too relaxed.

The Margaux doesn't announce itself. It rewards those who look closely.`,
    tags: ["the-row", "margaux", "top-handle", "calfskin", "quiet-luxury"],
    categoryPath: "Bags > Top Handle Bags",
    collection: "FW26",
    materials: { primary: "Smooth calfskin", lining: "Suede" },
    brand: { id: "b4", name: "The Row", slug: "the-row", tier: "MODERN", description: "" },
    priceUsd: 5490,
    priceKrw: 7290000,
  },
  {
    id: "p5",
    sku: "JAC-CHIQUITO",
    name: "Le Chiquito Long in Smooth Leather",
    slug: "jacquemus-le-chiquito-long-smooth-leather",
    category: "BAGS",
    subcategory: "mini_bags",
    priceTier: "ACCESSIBLE",
    titleDisplay: "Le Chiquito Long in Smooth Leather",
    descriptionHero: "Le Chiquito Long captures Jacquemus's gift for turning playful proportion into an enduring icon.",
    descriptionFull: `Simon Porte Jacquemus has an instinct for scale. The Le Chiquito — originally introduced as a miniature statement — has grown into a family of bags that balance wit with wearability.

Crafted from smooth leather in a palette inspired by the south of France, the bag carries Jacquemus's signature warmth. The single rolled handle and detachable strap offer versatility.

This is contemporary luxury at its most direct: a bag that makes you smile without asking permission.`,
    tags: ["jacquemus", "le-chiquito", "mini-bag", "contemporary", "fw26"],
    categoryPath: "Bags > Mini Bags",
    collection: "FW26",
    materials: { primary: "Smooth leather", secondary: "Gold-toned metal hardware" },
    brand: { id: "b5", name: "Jacquemus", slug: "jacquemus", tier: "CONTEMPORARY", description: "" },
    priceUsd: 495,
    priceKrw: 659000,
  },
];

export function getProducts(filters?: {
  category?: string;
  brandSlug?: string;
  priceTier?: string;
}): readonly MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => {
    if (filters?.category && p.category !== filters.category) return false;
    if (filters?.brandSlug && p.brand.slug !== filters.brandSlug) return false;
    if (filters?.priceTier && p.priceTier !== filters.priceTier) return false;
    return true;
  });
}

export function getProductBySlug(slug: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getBrandBySlug(slug: string): MockBrand | undefined {
  return MOCK_BRANDS.find((b) => b.slug === slug);
}

export function getProductsByBrand(brandSlug: string): readonly MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.brand.slug === brandSlug);
}

export function formatPrice(amount: number, currency: "USD" | "KRW" = "USD"): string {
  return new Intl.NumberFormat(currency === "KRW" ? "ko-KR" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
