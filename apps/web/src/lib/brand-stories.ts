export interface BrandStory {
  readonly brandSlug: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly story: string;
  readonly milestones: readonly string[];
  readonly values: readonly string[];
  readonly signatureElements: readonly string[];
}

export const BRAND_STORIES: readonly BrandStory[] = [
  {
    brandSlug: "gucci",
    headline: "Where Florentine Heritage Meets Radical Modernity",
    subheadline: "A century of Italian craftsmanship, reimagined for each generation",
    story: `Guccio Gucci opened a small leather goods shop in Florence in 1921, inspired by the refined luggage he had observed while working at the Savoy Hotel in London. What began as a commitment to impeccable Italian leather craft has evolved into one of the most influential creative forces in global fashion.

The House's visual vocabulary — the interlocking GG monogram, the green-red-green Web stripe, the horsebit motif — draws from a century of archival codes. Each element carries a specific provenance: the Web was inspired by the girths used in traditional equestrian saddlery, while the bamboo handle, introduced in 1947, was born from wartime material ingenuity.

Under successive creative visions, Gucci has proven uniquely adaptable. The House has moved from the restrained glamour of the 1950s through the maximalist exuberance of the 2010s to today's synthesis of heritage and contemporary relevance. What remains constant is the Florentine workshop, where artisans continue to cut, stitch, and finish leather with techniques refined over a hundred years.

Gucci does not merely reference its past — it inhabits it, carrying forward the founder's belief that luxury is a conversation between craft and culture.`,
    milestones: [
      "1921 — Founded in Florence by Guccio Gucci",
      "1947 — Introduction of the bamboo handle bag",
      "1953 — Horsebit loafer becomes a cultural icon",
      "1966 — Flora print created for Grace Kelly",
      "2015 — Alessandro Michele appointed Creative Director",
    ],
    values: ["Italian craftsmanship", "Archival innovation", "Cultural dialogue"],
    signatureElements: ["Interlocking GG monogram", "Green-red-green Web stripe", "Horsebit hardware", "Bamboo accents"],
  },
  {
    brandSlug: "bottega-veneta",
    headline: "When Your Own Initials Are Enough",
    subheadline: "The art of intreccio, Vicenza's gift to the world of leather",
    story: `Bottega Veneta was founded in Vicenza in 1966, in the heartland of Italy's leather-working tradition. The House's name — literally "Venetian workshop" — announced its intentions from the start: this would be a place where craft spoke louder than branding.

The intreccio weave, Bottega Veneta's defining technique, was developed as both aesthetic choice and structural innovation. By interlacing strips of leather rather than stitching flat panels, the artisans created bags that were stronger, more supple, and instantly recognizable — without a single visible logo.

This philosophy of "stealth luxury" was radical in an era of conspicuous branding, and it remains radical today. Bottega Veneta's clients do not seek recognition from strangers; they seek the private satisfaction of owning something made with extraordinary care.

Every piece that leaves the Vicenza atelier carries the mark of at least two artisans. The intreccio weave alone requires the completion of multiple hours of uninterrupted handwork. This is not efficiency — it is devotion to a standard that exists for its own sake.

The House's recent evolution has brought a bolder palette and more sculptural forms while preserving the founding commitment: that the craft is the brand.`,
    milestones: [
      "1966 — Founded in Vicenza, Italy",
      "1968 — Intreccio weave technique perfected",
      "2001 — Acquired by Kering Group",
      "2018 — Daniel Lee redefines modern Bottega",
      "2021 — Matthieu Blazy continues the vision",
    ],
    values: ["Invisible luxury", "Artisanal excellence", "Material innovation"],
    signatureElements: ["Intreccio weave", "No visible logos", "Vicenza craftsmanship", "Sculptural silhouettes"],
  },
  {
    brandSlug: "celine",
    headline: "The Architecture of Parisian Restraint",
    subheadline: "Where reduction becomes the most eloquent form of expression",
    story: `Celine was founded in 1945 by Celine Vipiana as a made-to-measure children's shoe business. Over the following decades, it evolved into a full ready-to-wear house, but it was the appointment of Phoebe Philo as Creative Director in 2008 that crystallized the identity the House is known for today: a vocabulary of intelligent minimalism, quiet authority, and uncompromising quality.

Celine's design philosophy begins with subtraction. Where other houses add embellishment, Celine removes it. What remains is architecture — the precise fall of a trouser leg, the exact curvature of a bag's silhouette, the weight of a cashmere coat as it settles on the shoulders.

The Triomphe clasp, introduced by Hedi Slimane and inspired by the chains adorning the Arc de Triomphe, is the House's most explicit nod to heritage. But even this emblem follows Celine's principle of restraint: it is a functional closure that happens to be beautiful, not decoration applied for its own sake.

Paris is not merely Celine's location — it is its material. The city's sense of proportion, its appreciation for the well-made, its distrust of the obvious: these qualities animate every collection.`,
    milestones: [
      "1945 — Founded by Celine Vipiana in Paris",
      "2008 — Phoebe Philo defines the modern Celine woman",
      "2018 — Hedi Slimane introduces the Triomphe emblem",
      "2023 — Michael Rider continues the Parisian vision",
    ],
    values: ["Intellectual minimalism", "Parisian proportion", "Material purity"],
    signatureElements: ["Triomphe clasp", "Clean silhouettes", "Neutral palette", "Architectural forms"],
  },
  {
    brandSlug: "the-row",
    headline: "The Discipline of Absolute Quality",
    subheadline: "Where luxury is defined by what you choose to leave out",
    story: `The Row was founded in 2006 by Mary-Kate and Ashley Olsen with an ambition that seemed almost contrarian: to create clothing of the highest possible quality with no visible branding whatsoever.

Named after Savile Row — London's historic street of bespoke tailoring — the label committed from its inception to the principles of the craft tradition: fit before fashion, material before marketing, longevity before novelty.

The Row's approach to design is closer to industrial design than fashion. Each piece begins with the selection of fabric — often from mills that supply only a handful of houses worldwide. The fit is developed through dozens of fittings, with tolerances measured in millimeters. A seemingly simple T-shirt might be the product of eighteen months of development.

This invisible complexity is the point. A Row garment should feel inevitable — as though it could not have been made any other way. There are no trend-driven details to date it, no logos to identify it to passersby. The reward is private: the knowledge that what you are wearing represents an uncompromising standard.

The Margaux bag, the N/S tote, the Bare sandal — these are not products of a fashion cycle. They are objects designed to be used, appreciated, and kept.`,
    milestones: [
      "2006 — Founded in New York by Mary-Kate and Ashley Olsen",
      "2007 — First collection debuts at New York Fashion Week",
      "2012 — Margaux bag becomes an icon of quiet luxury",
      "2020 — Recognized as the defining voice of stealth wealth",
    ],
    values: ["Invisible excellence", "Material obsession", "Timeless design"],
    signatureElements: ["No visible logos", "Neutral palette", "Perfect fit", "Supreme materials"],
  },
  {
    brandSlug: "jacquemus",
    headline: "Sunlight, Proportion, and the Joy of Dressing",
    subheadline: "The south of France, distilled into fashion",
    story: `Simon Porte Jacquemus launched his namesake brand in 2009, at the age of nineteen, with no formal fashion education and a vision entirely his own. Where luxury fashion often tends toward urban sophistication, Jacquemus draws from the warmth, color, and sensuality of Provence — the region where he grew up.

The brand's breakthrough came not from convention but from its joyful subversion of it. Le Chiquito — a bag so small it could hold nothing but its own charm — became a global phenomenon precisely because it refused to be practical. It announced Jacquemus's central thesis: that fashion should provoke delight.

But beneath the playfulness lies serious craft. Jacquemus's tailoring — the asymmetric cuts, the precise draping, the unexpected proportions — reveals a designer with an instinctive understanding of the body. His runway shows, staged in lavender fields and on deserted beaches, are not mere spectacle; they express the brand's core belief that fashion exists in relationship to landscape, light, and human warmth.

Jacquemus has proven that contemporary luxury need not be austere. It can smile.`,
    milestones: [
      "2009 — Founded by Simon Porte Jacquemus, age 19",
      "2018 — Le Chiquito bag becomes a global phenomenon",
      "2019 — Lavender field runway show defines the brand",
      "2022 — Le Raphia collection celebrates natural materials",
    ],
    values: ["Provencal warmth", "Joyful design", "Democratic luxury"],
    signatureElements: ["Le Chiquito silhouette", "Oversized sun hats", "Asymmetric cuts", "South of France palette"],
  },
];

export function getBrandStory(brandSlug: string): BrandStory | undefined {
  return BRAND_STORIES.find((s) => s.brandSlug === brandSlug);
}
