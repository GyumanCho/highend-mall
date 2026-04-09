import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ═══════════════════════════════════════════
// BRANDS
// ═══════════════════════════════════════════

const BRANDS = [
  {
    name: "Gucci",
    slug: "gucci",
    tier: "HERITAGE" as const,
    description: "Founded in Florence in 1921, Gucci is one of the world's leading luxury fashion brands.",
    story: {
      headline: "Where Florentine Heritage Meets Radical Modernity",
      subheadline: "A century of Italian craftsmanship, reimagined for each generation",
      milestones: ["1921 — Founded in Florence", "1953 — Horsebit loafer becomes icon", "2015 — Alessandro Michele era"],
      values: ["Italian craftsmanship", "Archival innovation", "Cultural dialogue"],
    },
  },
  {
    name: "Bottega Veneta",
    slug: "bottega-veneta",
    tier: "MODERN" as const,
    description: "Italian luxury fashion house known for its intrecciato weave and understated elegance.",
    story: {
      headline: "When Your Own Initials Are Enough",
      subheadline: "The art of intreccio, Vicenza's gift to the world of leather",
      milestones: ["1966 — Founded in Vicenza", "1968 — Intreccio weave perfected", "2021 — Matthieu Blazy era"],
      values: ["Invisible luxury", "Artisanal excellence", "Material innovation"],
    },
  },
  {
    name: "Celine",
    slug: "celine",
    tier: "MODERN" as const,
    description: "French luxury house renowned for minimalist, refined fashion under creative direction.",
    story: {
      headline: "The Architecture of Parisian Restraint",
      subheadline: "Where reduction becomes the most eloquent form of expression",
      milestones: ["1945 — Founded by Celine Vipiana", "2008 — Phoebe Philo era", "2018 — Hedi Slimane introduces Triomphe"],
      values: ["Intellectual minimalism", "Parisian proportion", "Material purity"],
    },
  },
  {
    name: "The Row",
    slug: "the-row",
    tier: "MODERN" as const,
    description: "American luxury brand epitomizing quiet luxury with impeccable tailoring and fabrics.",
    story: {
      headline: "The Discipline of Absolute Quality",
      subheadline: "Where luxury is defined by what you choose to leave out",
      milestones: ["2006 — Founded in New York", "2012 — Margaux bag becomes icon", "2020 — Defining voice of stealth wealth"],
      values: ["Invisible excellence", "Material obsession", "Timeless design"],
    },
  },
  {
    name: "Jacquemus",
    slug: "jacquemus",
    tier: "CONTEMPORARY" as const,
    description: "French fashion brand bringing Provençal warmth to contemporary luxury.",
    story: {
      headline: "Sunlight, Proportion, and the Joy of Dressing",
      subheadline: "The south of France, distilled into fashion",
      milestones: ["2009 — Founded age 19", "2018 — Le Chiquito phenomenon", "2019 — Lavender field runway show"],
      values: ["Provençal warmth", "Joyful design", "Democratic luxury"],
    },
  },
];

// ═══════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════

const PRODUCTS = [
  {
    sku: "GUC-443497-DTDIT",
    brandSlug: "gucci",
    name: "GG Marmont Small Shoulder Bag",
    slug: "gucci-gg-marmont-small-shoulder-bag",
    category: "BAGS" as const,
    subcategory: "shoulder_bags",
    priceTier: "CORE" as const,
    titleDisplay: "GG Marmont Small Shoulder Bag in Matelasse Chevron Calfskin",
    titleSeo: "Gucci GG Marmont Small Shoulder Bag | Matelasse Chevron Leather | FW26",
    descriptionHero: "A defining expression of Gucci's contemporary elegance, uniting the House's storied heritage with modern Italian craftsmanship.",
    descriptionFull: "Since Alessandro Michele reimagined the double G monogram for a new generation, the Marmont line has stood as a bridge between Gucci's Florentine roots and its ever-evolving creative vision.\n\nCrafted from matelasse chevron calfskin, the bag reveals its quality through texture and weight. The chevron quilting is achieved through a meticulous process that requires the leather to be softened, layered, and stitched with precision that only seasoned Gucci artisans possess.\n\nThe antique gold-toned brass hardware carries the interlocking GG emblem, a motif drawn from the House's archival codes dating to the 1970s.",
    specifications: { brand: "Gucci", collection: "FW26", materials: "Matelasse chevron calfskin", lining: "Microfiber", closure: "Flap with spring closure" },
    tags: ["gucci", "gg-marmont", "shoulder-bag", "matelasse", "calfskin", "fw26", "heritage-luxury"],
    seoKeywords: ["gucci gg marmont shoulder bag", "gucci marmont calfskin bag"],
    categoryPath: "Bags > Shoulder Bags > Designer Shoulder Bags",
    materials: { primary: "Matelasse chevron calfskin", secondary: "Antique gold-toned brass hardware", lining: "Microfiber" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    priceUsd: 2350, priceKrw: 3120000,
    images: [
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", type: "PRODUCT" as const, altText: "GG Marmont front view" },
      { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", type: "DETAIL" as const, altText: "GG Marmont hardware detail" },
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", type: "LIFESTYLE" as const, altText: "GG Marmont styled" },
    ],
  },
  {
    sku: "BV-730303-VCPP2",
    brandSlug: "bottega-veneta",
    name: "Cassette Bag in Intreccio Leather",
    slug: "bottega-veneta-cassette-bag-intreccio",
    category: "BAGS" as const,
    subcategory: "crossbody_bags",
    priceTier: "CORE" as const,
    titleDisplay: "Cassette Bag in Intreccio Nappa Leather",
    titleSeo: "Bottega Veneta Cassette Bag | Intreccio Nappa | FW26",
    descriptionHero: "The Cassette reimagines Bottega Veneta's signature intreccio weave in a bold, contemporary silhouette.",
    descriptionFull: "The Cassette bag speaks to Bottega Veneta's mastery of leather craft. The oversized intreccio weave transforms supple nappa leather into a tactile, sculptural form.\n\nEach strip of leather is cut, softened, and hand-woven by artisans in Vicenza. The result is a bag that feels as considered to the touch as it appears to the eye.\n\nIn keeping with Bottega Veneta's philosophy of stealth luxury, there is no visible logo. The weave itself is the signature.",
    specifications: { brand: "Bottega Veneta", collection: "FW26", materials: "Intreccio nappa leather", lining: "Suede" },
    tags: ["bottega-veneta", "cassette", "intreccio", "nappa", "crossbody", "fw26"],
    seoKeywords: ["bottega veneta cassette bag", "intreccio leather bag"],
    categoryPath: "Bags > Crossbody Bags > Designer Crossbody",
    materials: { primary: "Intreccio nappa leather", secondary: "Gold-finished hardware", lining: "Suede" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    priceUsd: 3200, priceKrw: 4250000,
    images: [
      { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", type: "PRODUCT" as const, altText: "Cassette bag front" },
      { url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80", type: "DETAIL" as const, altText: "Cassette intreccio detail" },
      { url: "https://images.unsplash.com/photo-1612902456551-404b5b2e20be?w=800&q=80", type: "MODEL" as const, altText: "Cassette on model" },
    ],
  },
  {
    sku: "CEL-194143-BFP",
    brandSlug: "celine",
    name: "Triomphe Shoulder Bag in Shiny Calfskin",
    slug: "celine-triomphe-shoulder-bag-shiny-calfskin",
    category: "BAGS" as const,
    subcategory: "shoulder_bags",
    priceTier: "CORE" as const,
    titleDisplay: "Triomphe Shoulder Bag in Shiny Calfskin",
    titleSeo: "Celine Triomphe Shoulder Bag | Shiny Calfskin | FW26",
    descriptionHero: "The Triomphe clasp — drawn from the chains along the Arc de Triomphe — anchors Celine's vision of Parisian refinement.",
    descriptionFull: "The Triomphe bag is a study in restraint and precision. Its namesake clasp, inspired by the interlocking chains that adorn the Arc de Triomphe in Paris, is both a functional closure and a quiet declaration of heritage.\n\nCrafted from shiny calfskin, the leather develops a distinctive patina with wear — growing more personal over time.\n\nCeline's approach to luxury is one of reduction: every element earns its place. What remains is the essential: fine materials, considered proportions, and a clasp that connects past and present.",
    specifications: { brand: "Celine", collection: "FW26", materials: "Shiny calfskin", lining: "Lambskin" },
    tags: ["celine", "triomphe", "shoulder-bag", "calfskin", "fw26", "parisian"],
    seoKeywords: ["celine triomphe bag", "celine shoulder bag calfskin"],
    categoryPath: "Bags > Shoulder Bags > Designer Shoulder Bags",
    materials: { primary: "Shiny calfskin", secondary: "Gold-finished brass hardware", lining: "Lambskin" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    priceUsd: 4150, priceKrw: 5500000,
    images: [
      { url: "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=800&q=80", type: "PRODUCT" as const, altText: "Triomphe bag front" },
      { url: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&q=80", type: "DETAIL" as const, altText: "Triomphe clasp detail" },
      { url: "https://images.unsplash.com/photo-1606522754091-a05c6b5f21e3?w=800&q=80", type: "LIFESTYLE" as const, altText: "Triomphe styled" },
    ],
  },
  {
    sku: "ROW-W1992-LSC",
    brandSlug: "the-row",
    name: "Margaux 15 Bag in Smooth Calfskin",
    slug: "the-row-margaux-15-smooth-calfskin",
    category: "BAGS" as const,
    subcategory: "top_handle_bags",
    priceTier: "ULTRA" as const,
    titleDisplay: "Margaux 15 Bag in Smooth Calfskin",
    titleSeo: "The Row Margaux 15 Bag | Smooth Calfskin | Timeless Investment",
    descriptionHero: "The Margaux is The Row's definitive statement on understated luxury — a bag that needs no introduction.",
    descriptionFull: "The Margaux 15 is the ultimate expression of The Row's design philosophy: that true luxury lies in what you don't see. There is no visible branding, no trend-driven detail, no concession to the moment.\n\nThe smooth calfskin — sourced from a single Italian tannery — is cut and assembled by hand. The proportions have been refined over multiple seasons.\n\nThe Margaux doesn't announce itself. It rewards those who look closely.",
    specifications: { brand: "The Row", materials: "Smooth calfskin", lining: "Suede", closure: "Top zip" },
    tags: ["the-row", "margaux", "top-handle", "calfskin", "quiet-luxury", "investment"],
    seoKeywords: ["the row margaux bag", "the row margaux 15"],
    categoryPath: "Bags > Top Handle Bags > Designer Top Handle",
    materials: { primary: "Smooth calfskin", lining: "Suede" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    priceUsd: 5490, priceKrw: 7290000,
    images: [
      { url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80", type: "PRODUCT" as const, altText: "Margaux 15 front" },
      { url: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&q=80", type: "DETAIL" as const, altText: "Margaux interior" },
      { url: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&q=80", type: "LIFESTYLE" as const, altText: "Margaux lifestyle" },
    ],
  },
  {
    sku: "JAC-LE-CHIQUITO",
    brandSlug: "jacquemus",
    name: "Le Chiquito Long in Smooth Leather",
    slug: "jacquemus-le-chiquito-long-smooth-leather",
    category: "BAGS" as const,
    subcategory: "mini_bags",
    priceTier: "ACCESSIBLE" as const,
    titleDisplay: "Le Chiquito Long in Smooth Leather",
    titleSeo: "Jacquemus Le Chiquito Long | Smooth Leather | Contemporary Luxury",
    descriptionHero: "Le Chiquito Long captures Jacquemus's gift for turning playful proportion into an enduring icon.",
    descriptionFull: "Simon Porte Jacquemus has an instinct for scale. The Le Chiquito — originally introduced as a miniature statement — has grown into a family of bags that balance wit with wearability.\n\nCrafted from smooth leather in a palette inspired by the south of France, the bag carries Jacquemus's signature warmth.\n\nThis is contemporary luxury at its most direct: a bag that makes you smile without asking permission.",
    specifications: { brand: "Jacquemus", collection: "FW26", materials: "Smooth leather", closure: "Flap with metal buckle" },
    tags: ["jacquemus", "le-chiquito", "mini-bag", "contemporary", "fw26", "french"],
    seoKeywords: ["jacquemus le chiquito long", "jacquemus mini bag"],
    categoryPath: "Bags > Mini Bags > Designer Mini Bags",
    materials: { primary: "Smooth leather", secondary: "Gold-toned metal hardware" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    priceUsd: 495, priceKrw: 659000,
    images: [
      { url: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=80", type: "PRODUCT" as const, altText: "Le Chiquito front" },
      { url: "https://images.unsplash.com/photo-1604177091072-fa7fbc09e281?w=800&q=80", type: "DETAIL" as const, altText: "Le Chiquito buckle" },
      { url: "https://images.unsplash.com/photo-1581404917879-53e19259fdda?w=800&q=80", type: "MODEL" as const, altText: "Le Chiquito on model" },
    ],
  },
];

// ═══════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════

const CUSTOMERS = [
  {
    email: "soyeon@example.com",
    name: "Soyeon Kim",
    phone: "010-1234-5678",
    tier: "GOLD" as const,
    annualSpend: 28000,
    preferredBrands: ["Bottega Veneta", "The Row", "Celine"],
    styleDna: { primaryAesthetic: "minimalist_modern", colorPalette: ["black", "navy", "cream"], preferredSilhouettes: ["structured", "tailored"] },
    sizeProfile: { tops: "IT 42 / FR 38 / US 6", bottoms: "IT 44 / FR 40 / US 8", shoes: "IT 38 / EU 38 / US 8" },
  },
  {
    email: "minjae@example.com",
    name: "Minjae Lee",
    phone: "010-9876-5432",
    tier: "PLATINUM" as const,
    annualSpend: 68000,
    preferredBrands: ["Hermes", "Bottega Veneta", "The Row"],
    styleDna: { primaryAesthetic: "classic_elegant", colorPalette: ["black", "tan", "white"], preferredSilhouettes: ["relaxed", "oversized"] },
    sizeProfile: { tops: "IT 40 / FR 36 / US 4", bottoms: "IT 42 / FR 38 / US 6", shoes: "IT 37 / EU 37 / US 7" },
  },
  {
    email: "jiwon@example.com",
    name: "Jiwon Park",
    phone: "010-5555-1234",
    tier: "SILVER" as const,
    annualSpend: 8500,
    preferredBrands: ["Jacquemus", "Celine"],
    styleDna: { primaryAesthetic: "contemporary", colorPalette: ["beige", "white", "terracotta"], preferredSilhouettes: ["flowing", "asymmetric"] },
    sizeProfile: { tops: "IT 38 / FR 34 / US 0-2", bottoms: "IT 40 / FR 36 / US 4", shoes: "IT 36 / EU 36 / US 6" },
  },
  {
    email: "hyunwoo@example.com",
    name: "Hyunwoo Choi",
    phone: "010-7777-8888",
    tier: "GOLD" as const,
    annualSpend: 32000,
    preferredBrands: ["Gucci", "Bottega Veneta"],
    styleDna: { primaryAesthetic: "heritage_modern", colorPalette: ["brown", "forest", "burgundy"], preferredSilhouettes: ["structured", "classic"] },
    sizeProfile: { tops: "IT 50 / FR 46 / US 40", bottoms: "IT 50 / FR 46 / US 34", shoes: "IT 43 / EU 43 / US 10" },
  },
  {
    email: "admin@maison.com",
    name: "Admin",
    tier: "STANDARD" as const,
    annualSpend: 0,
    preferredBrands: [],
  },
];

// ═══════════════════════════════════════════
// COLLECTIONS
// ═══════════════════════════════════════════

const COLLECTIONS = [
  { name: "Fall/Winter 2026", slug: "fw26", season: "FW" as const, year: 2026, narrative: "This season's defining collections converge on a shared conviction: that luxury speaks most eloquently in a restrained voice." },
  { name: "FW26 Private Preview", slug: "fw26-preview", season: "FW" as const, year: 2026, narrative: "Before the season begins, we invite our most valued clients to discover the pieces that will define Autumn 2026." },
  { name: "The Icons Edit", slug: "icons", season: "FW" as const, year: 2026, narrative: "Some pieces transcend seasons. This edit gathers the bags that have earned their place in the permanent vocabulary of luxury." },
];

// ═══════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════

const REVIEWS = [
  {
    customerEmail: "soyeon@example.com",
    productSlug: "gucci-gg-marmont-small-shoulder-bag",
    rating: 4,
    text: "The bag itself is beautiful — the leather quality is truly exceptional. However, I was disappointed that the packaging arrived damaged and delivery took nearly two weeks. For this price point, I expected a more premium experience end to end.",
    status: "APPROVED" as const,
    sentimentScore: 0.45,
    sentimentLabel: "mixed",
    themes: [{ theme: "product_quality", sentiment: "positive" }, { theme: "packaging", sentiment: "negative" }, { theme: "delivery_speed", sentiment: "negative" }],
    publishedResponse: "Thank you for sharing your thoughts on the GG Marmont — we are genuinely delighted to hear that the leather quality and craftsmanship met the standard you deserve.\n\nWe sincerely apologize that the delivery experience fell short. Damaged packaging and a two-week wait are not reflective of the service we strive to provide. We have flagged this with our fulfillment team for immediate review.\n\nA member of our Client Care team will reach out to you within 24 hours to discuss how we can make this right.\n\nWarm regards,\nThe Client Experience Team",
  },
  {
    customerEmail: "minjae@example.com",
    productSlug: "bottega-veneta-cassette-bag-intreccio",
    rating: 5,
    text: "The intreccio weave is even more stunning in person. The tactile quality of the nappa leather is extraordinary — you can feel the hours of handwork in every detail. This is what luxury should be.",
    status: "APPROVED" as const,
    sentimentScore: 0.95,
    sentimentLabel: "positive",
    themes: [{ theme: "craftsmanship", sentiment: "positive" }, { theme: "material_quality", sentiment: "positive" }],
    publishedResponse: "Thank you for this thoughtful reflection on the Cassette — your appreciation for the intreccio weave speaks to a genuine understanding of the craft behind each Bottega Veneta piece.\n\nWarmly,\nThe Client Experience Team",
  },
  {
    customerEmail: "jiwon@example.com",
    productSlug: "celine-triomphe-shoulder-bag-shiny-calfskin",
    rating: 5,
    text: "Understated perfection. The Triomphe clasp is a beautiful detail, and the calfskin already shows signs of developing the most gorgeous patina. I can tell this will age beautifully.",
    status: "PENDING" as const,
    sentimentScore: 0.92,
    sentimentLabel: "positive",
    themes: [{ theme: "design_detail", sentiment: "positive" }, { theme: "material_aging", sentiment: "positive" }],
  },
  {
    customerEmail: "hyunwoo@example.com",
    productSlug: "the-row-margaux-15-smooth-calfskin",
    rating: 5,
    text: "Worth every penny. The quality of the calfskin is unlike anything I have owned. No logos, no fuss — just quietly perfect. The suede interior is a lovely surprise.",
    status: "AI_ANALYZED" as const,
    sentimentScore: 0.94,
    sentimentLabel: "positive",
    themes: [{ theme: "value_perception", sentiment: "positive" }, { theme: "material_quality", sentiment: "positive" }, { theme: "brand_philosophy", sentiment: "positive" }],
    aiResponseDraft: "Thank you for your generous words about the Margaux. Your recognition of its understated quality reflects exactly what The Row strives to achieve.\n\nWe are delighted the suede interior was a welcome discovery — those considered details are the hallmark of the House.\n\nWarmly,\nThe Client Experience Team",
  },
];

// ═══════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════

const ORDERS = [
  {
    orderNumber: "MSN-20260315-A1B2",
    customerEmail: "soyeon@example.com",
    status: "DELIVERED" as const,
    currency: "USD" as const,
    subtotal: 2350, shippingFee: 0, total: 2350,
    paymentMethod: "Credit Card",
    trackingNumber: "KR1234567890",
    productSlug: "gucci-gg-marmont-small-shoulder-bag",
    createdDaysAgo: 14,
  },
  {
    orderNumber: "MSN-20260320-C3D4",
    customerEmail: "minjae@example.com",
    status: "DELIVERED" as const,
    currency: "USD" as const,
    subtotal: 8690, shippingFee: 0, total: 8690,
    paymentMethod: "Kakao Pay",
    trackingNumber: "KR9876543210",
    productSlug: "the-row-margaux-15-smooth-calfskin",
    createdDaysAgo: 9,
  },
  {
    orderNumber: "MSN-20260327-E5F6",
    customerEmail: "soyeon@example.com",
    status: "PROCESSING" as const,
    currency: "USD" as const,
    subtotal: 3200, shippingFee: 0, total: 3200,
    paymentMethod: "Toss Pay",
    productSlug: "bottega-veneta-cassette-bag-intreccio",
    createdDaysAgo: 2,
  },
  {
    orderNumber: "MSN-20260328-G7H8",
    customerEmail: "jiwon@example.com",
    status: "PAID" as const,
    currency: "USD" as const,
    subtotal: 4150, shippingFee: 0, total: 4150,
    paymentMethod: "Credit Card",
    productSlug: "celine-triomphe-shoulder-bag-shiny-calfskin",
    createdDaysAgo: 1,
  },
];

// ═══════════════════════════════════════════
// CAMPAIGNS
// ═══════════════════════════════════════════

const CAMPAIGNS = [
  {
    name: "Autumn Atelier: Private Preview",
    type: "PRIVATE_SALE" as const,
    objective: "Drive FW26 pre-orders from top VIPs",
    status: "ACTIVE" as const,
    content: {
      subject: "Your Private Autumn Preview Awaits",
      heroText: "Before the season begins, we invite you to discover the pieces that will define Autumn 2026.",
      cta: "Explore Your Preview",
    },
    budget: 50000,
    startAt: new Date("2026-09-13"),
    endAt: new Date("2026-09-22"),
    earlyAccessAt: new Date("2026-09-11"),
  },
  {
    name: "FW26 Collection Launch",
    type: "COLLECTION_LAUNCH" as const,
    objective: "Announce FW26 collection to all tiers",
    status: "SCHEDULED" as const,
    content: {
      subject: "Fall/Winter 2026 Has Arrived",
      heroText: "The season's defining pieces, now available.",
      cta: "Discover the Collection",
    },
    budget: 30000,
    startAt: new Date("2026-10-01"),
    endAt: new Date("2026-10-15"),
  },
  {
    name: "Holiday Gift Guide",
    type: "BRAND_PARTNERSHIP" as const,
    objective: "Drive holiday season sales with curated gift selections",
    status: "DRAFT" as const,
    content: {},
    budget: 20000,
  },
];

// ═══════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════

async function main() {
  // eslint-disable-next-line no-console
  console.log("🧹 Cleaning existing data...");

  await prisma.campaignRecipient.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.recommendationItem.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productPrice.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.agentJob.deleteMany();

  // ─── Brands ───
  // eslint-disable-next-line no-console
  console.log("🏷️  Seeding brands...");
  const brandMap = new Map<string, string>();
  for (const brand of BRANDS) {
    const created = await prisma.brand.create({ data: brand });
    brandMap.set(brand.slug, created.id);
  }

  // ─── Products ───
  // eslint-disable-next-line no-console
  console.log("👜 Seeding products...");
  const productMap = new Map<string, string>();
  for (const product of PRODUCTS) {
    const brandId = brandMap.get(product.brandSlug);
    if (!brandId) continue;
    const { brandSlug, priceUsd, priceKrw, images, ...data } = product;
    const created = await prisma.product.create({
      data: {
        ...data,
        brandId,
        status: "PUBLISHED",
        qaScore: 0.96,
        publishedAt: new Date(),
        prices: {
          create: [
            { currency: "USD", amount: priceUsd, isDefault: true },
            { currency: "KRW", amount: priceKrw },
          ],
        },
        images: {
          create: images.map((img, i) => ({ ...img, position: i })),
        },
      },
    });
    productMap.set(product.slug, created.id);
  }

  // ─── Collections ───
  // eslint-disable-next-line no-console
  console.log("📦 Seeding collections...");
  const firstBrandId = brandMap.get("gucci")!;
  for (const col of COLLECTIONS) {
    await prisma.collection.create({
      data: { ...col, brandId: firstBrandId },
    });
  }

  // ─── Customers ───
  // eslint-disable-next-line no-console
  console.log("👤 Seeding customers...");
  const customerMap = new Map<string, string>();
  for (const customer of CUSTOMERS) {
    const created = await prisma.customer.create({
      data: {
        email: customer.email,
        name: customer.name,
        phone: customer.phone ?? null,
        tier: customer.tier,
        annualSpend: customer.annualSpend,
        preferredBrands: customer.preferredBrands,
        styleDna: customer.styleDna ?? undefined,
        sizeProfile: customer.sizeProfile ?? undefined,
        lastActiveAt: new Date(),
      },
    });
    customerMap.set(customer.email, created.id);
  }

  // ─── Addresses ───
  // eslint-disable-next-line no-console
  console.log("📍 Seeding addresses...");
  const soyeonId = customerMap.get("soyeon@example.com")!;
  await prisma.address.create({
    data: {
      customerId: soyeonId,
      label: "Home",
      name: "Soyeon Kim",
      phone: "010-1234-5678",
      line1: "123 Gangnam-daero, Gangnam-gu",
      city: "Seoul",
      postalCode: "06241",
      country: "KR",
      isDefault: true,
    },
  });

  // ─── Orders ───
  // eslint-disable-next-line no-console
  console.log("🧾 Seeding orders...");
  for (const order of ORDERS) {
    const customerId = customerMap.get(order.customerEmail);
    const productId = productMap.get(order.productSlug);
    if (!customerId || !productId) continue;

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - order.createdDaysAgo);

    await prisma.order.create({
      data: {
        orderNumber: order.orderNumber,
        customerId,
        status: order.status,
        currency: order.currency,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        total: order.total,
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber ?? null,
        createdAt,
        items: {
          create: {
            productId,
            quantity: 1,
            unitPrice: order.subtotal,
            total: order.subtotal,
          },
        },
      },
    });
  }

  // ─── Reviews ───
  // eslint-disable-next-line no-console
  console.log("⭐ Seeding reviews...");
  for (const review of REVIEWS) {
    const customerId = customerMap.get(review.customerEmail);
    const productId = productMap.get(review.productSlug);
    if (!customerId || !productId) continue;

    await prisma.review.create({
      data: {
        customerId,
        productId,
        rating: review.rating,
        text: review.text,
        status: review.status,
        sentimentScore: review.sentimentScore,
        sentimentLabel: review.sentimentLabel,
        themes: review.themes,
        aiResponseDraft: review.aiResponseDraft ?? null,
        publishedResponse: review.publishedResponse ?? null,
        respondedAt: review.publishedResponse ? new Date() : null,
      },
    });
  }

  // ─── Campaigns ───
  // eslint-disable-next-line no-console
  console.log("📣 Seeding campaigns...");
  for (const campaign of CAMPAIGNS) {
    await prisma.campaign.create({ data: campaign });
  }

  // ─── Summary ───
  const counts = {
    brands: await prisma.brand.count(),
    products: await prisma.product.count(),
    customers: await prisma.customer.count(),
    orders: await prisma.order.count(),
    reviews: await prisma.review.count(),
    campaigns: await prisma.campaign.count(),
    collections: await prisma.collection.count(),
  };

  // eslint-disable-next-line no-console
  console.log("\n✅ Seed complete:");
  // eslint-disable-next-line no-console
  console.table(counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
