export interface MockReview {
  readonly id: string;
  readonly customerName: string;
  readonly customerTier: "PLATINUM" | "GOLD" | "SILVER" | "STANDARD";
  readonly productSlug: string;
  readonly rating: number;
  readonly text: string;
  readonly date: string;
  readonly sentiment: {
    readonly overall: "positive" | "neutral" | "negative" | "mixed";
    readonly score: number;
    readonly themes: readonly { readonly theme: string; readonly sentiment: string }[];
  };
  readonly aiResponse: string | null;
  readonly status: "PENDING" | "AI_ANALYZED" | "APPROVED" | "ESCALATED";
}

export const MOCK_REVIEWS: readonly MockReview[] = [
  {
    id: "r1",
    customerName: "Soyeon K.",
    customerTier: "GOLD",
    productSlug: "gucci-gg-marmont-small-shoulder-bag",
    rating: 4,
    text: "The bag itself is beautiful — the leather quality is truly exceptional. However, I was disappointed that the packaging arrived damaged and delivery took nearly two weeks. For this price point, I expected a more premium experience end to end.",
    date: "2026-03-15",
    sentiment: {
      overall: "mixed",
      score: 0.45,
      themes: [
        { theme: "product_quality", sentiment: "positive" },
        { theme: "packaging", sentiment: "negative" },
        { theme: "delivery_speed", sentiment: "negative" },
      ],
    },
    aiResponse: "Thank you for sharing your thoughts on the GG Marmont — we are genuinely delighted to hear that the leather quality and craftsmanship met the standard you deserve.\n\nWe sincerely apologize that the delivery experience fell short. Damaged packaging and a two-week wait are not reflective of the service we strive to provide. We have flagged this with our fulfillment team for immediate review.\n\nA member of our Client Care team will reach out to you within 24 hours to discuss how we can make this right.\n\nWarm regards,\nThe Client Experience Team",
    status: "APPROVED",
  },
  {
    id: "r2",
    customerName: "Minjae L.",
    customerTier: "PLATINUM",
    productSlug: "bottega-veneta-cassette-bag-intreccio",
    rating: 5,
    text: "The intreccio weave is even more stunning in person. The tactile quality of the nappa leather is extraordinary — you can feel the hours of handwork in every detail. This is what luxury should be.",
    date: "2026-03-20",
    sentiment: {
      overall: "positive",
      score: 0.95,
      themes: [
        { theme: "craftsmanship", sentiment: "positive" },
        { theme: "material_quality", sentiment: "positive" },
      ],
    },
    aiResponse: "Thank you for this thoughtful reflection on the Cassette — your appreciation for the intreccio weave speaks to a genuine understanding of the craft behind each Bottega Veneta piece.\n\nWe are delighted that the nappa leather met your expectations. The artisans in Vicenza pour remarkable dedication into every bag.\n\nAs a valued Platinum member, we would love to invite you to preview our upcoming collection. Your Client Advisor will be in touch with details.\n\nWarmly,\nThe Client Experience Team",
    status: "APPROVED",
  },
  {
    id: "r3",
    customerName: "Jiwon P.",
    customerTier: "SILVER",
    productSlug: "celine-triomphe-shoulder-bag-shiny-calfskin",
    rating: 5,
    text: "Understated perfection. The Triomphe clasp is a beautiful detail, and the calfskin already shows signs of developing the most gorgeous patina. I can tell this will age beautifully.",
    date: "2026-03-22",
    sentiment: {
      overall: "positive",
      score: 0.92,
      themes: [
        { theme: "design_detail", sentiment: "positive" },
        { theme: "material_aging", sentiment: "positive" },
      ],
    },
    aiResponse: null,
    status: "PENDING",
  },
  {
    id: "r4",
    customerName: "Hyunwoo C.",
    customerTier: "GOLD",
    productSlug: "the-row-margaux-15-smooth-calfskin",
    rating: 5,
    text: "Worth every penny. The quality of the calfskin is unlike anything I have owned. No logos, no fuss — just quietly perfect. The suede interior is a lovely surprise.",
    date: "2026-03-25",
    sentiment: {
      overall: "positive",
      score: 0.94,
      themes: [
        { theme: "value_perception", sentiment: "positive" },
        { theme: "material_quality", sentiment: "positive" },
        { theme: "brand_philosophy", sentiment: "positive" },
      ],
    },
    aiResponse: null,
    status: "AI_ANALYZED",
  },
];

export function getReviewsByProduct(productSlug: string): readonly MockReview[] {
  return MOCK_REVIEWS.filter((r) => r.productSlug === productSlug);
}

export function getPendingReviews(): readonly MockReview[] {
  return MOCK_REVIEWS.filter((r) => r.status !== "APPROVED");
}

export function getAverageRating(productSlug: string): number {
  const reviews = getReviewsByProduct(productSlug);
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
