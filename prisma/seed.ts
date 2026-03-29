import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BRANDS = [
  {
    name: "Gucci",
    slug: "gucci",
    tier: "HERITAGE" as const,
    description: "Founded in Florence in 1921, Gucci is one of the world's leading luxury fashion brands.",
    logoUrl: "/brands/gucci-logo.svg",
    websiteUrl: "https://www.gucci.com",
  },
  {
    name: "Bottega Veneta",
    slug: "bottega-veneta",
    tier: "MODERN" as const,
    description: "Italian luxury fashion house known for its intrecciato weave and understated elegance.",
    logoUrl: "/brands/bottega-veneta-logo.svg",
    websiteUrl: "https://www.bottegaveneta.com",
  },
  {
    name: "Celine",
    slug: "celine",
    tier: "MODERN" as const,
    description: "French luxury house renowned for minimalist, refined fashion under creative direction.",
    logoUrl: "/brands/celine-logo.svg",
    websiteUrl: "https://www.celine.com",
  },
  {
    name: "The Row",
    slug: "the-row",
    tier: "MODERN" as const,
    description: "American luxury brand epitomizing quiet luxury with impeccable tailoring and fabrics.",
    logoUrl: "/brands/the-row-logo.svg",
    websiteUrl: "https://www.therow.com",
  },
  {
    name: "Jacquemus",
    slug: "jacquemus",
    tier: "CONTEMPORARY" as const,
    description: "French fashion brand bringing Provençal warmth to contemporary luxury.",
    logoUrl: "/brands/jacquemus-logo.svg",
    websiteUrl: "https://www.jacquemus.com",
  },
] as const;

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
    descriptionFull: `Since Alessandro Michele reimagined the double G monogram for a new generation, the Marmont line has stood as a bridge between Gucci's Florentine roots and its ever-evolving creative vision. The GG Marmont Small Shoulder Bag, presented here for Fall/Winter 2026, carries that legacy forward with quiet confidence.

Crafted from matelasse chevron calfskin, the bag reveals its quality through texture and weight. The chevron quilting is achieved through a meticulous process that requires the leather to be softened, layered, and stitched with precision that only seasoned Gucci artisans possess.

The antique gold-toned brass hardware carries the interlocking GG emblem, a motif drawn from the House's archival codes dating to the 1970s. Inside, a microfiber-lined interior is organized with a slip pocket and a central divider, offering thoughtful utility without compromising the bag's streamlined silhouette.`,
    specifications: {
      brand: "Gucci",
      collection: "Fall/Winter 2026",
      sku: "443497-DTDIT-1000",
      materials: "Matelasse chevron calfskin, antique gold-toned brass hardware",
      lining: "Microfiber",
      closure: "Flap with spring closure",
      strap: "Adjustable chain and leather shoulder strap",
    },
    tags: ["gucci", "gg-marmont", "shoulder-bag", "matelasse", "calfskin", "fw26", "heritage-luxury"],
    seoKeywords: ["gucci gg marmont shoulder bag", "gucci marmont calfskin bag"],
    categoryPath: "Bags > Shoulder Bags > Designer Shoulder Bags",
    materials: { primary: "Matelasse chevron calfskin", secondary: "Antique gold-toned brass hardware", lining: "Microfiber" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    status: "PUBLISHED" as const,
    priceUsd: 2350,
    priceKrw: 3120000,
    images: [
      { url: "/products/gucci-marmont-front.jpg", type: "PRODUCT" as const, altText: "GG Marmont front view" },
      { url: "/products/gucci-marmont-detail.jpg", type: "DETAIL" as const, altText: "GG Marmont hardware detail" },
      { url: "/products/gucci-marmont-lifestyle.jpg", type: "LIFESTYLE" as const, altText: "GG Marmont styled" },
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
    descriptionFull: `The Cassette bag speaks to Bottega Veneta's mastery of leather craft. The oversized intreccio weave — a modern reinterpretation of the house's archival technique — transforms supple nappa leather into a tactile, sculptural form.

Each strip of leather is cut, softened, and hand-woven by artisans in Vicenza. The result is a bag that feels as considered to the touch as it appears to the eye. The triangular flap closure and adjustable leather strap complete a design that moves effortlessly between day and evening.

In keeping with Bottega Veneta's philosophy of stealth luxury, there is no visible logo. The weave itself is the signature — unmistakable to those who know, invisible to those who don't.`,
    specifications: {
      brand: "Bottega Veneta",
      collection: "Fall/Winter 2026",
      materials: "Intreccio nappa leather",
      lining: "Suede",
      closure: "Magnetic triangular flap",
    },
    tags: ["bottega-veneta", "cassette", "intreccio", "nappa", "crossbody", "fw26"],
    seoKeywords: ["bottega veneta cassette bag", "intreccio leather bag"],
    categoryPath: "Bags > Crossbody Bags > Designer Crossbody",
    materials: { primary: "Intreccio nappa leather", secondary: "Gold-finished hardware", lining: "Suede" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    status: "PUBLISHED" as const,
    priceUsd: 3200,
    priceKrw: 4250000,
    images: [
      { url: "/products/bv-cassette-front.jpg", type: "PRODUCT" as const, altText: "Cassette bag front" },
      { url: "/products/bv-cassette-detail.jpg", type: "DETAIL" as const, altText: "Cassette intreccio detail" },
      { url: "/products/bv-cassette-model.jpg", type: "MODEL" as const, altText: "Cassette bag on model" },
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
    descriptionFull: `The Triomphe bag is a study in restraint and precision. Its namesake clasp, inspired by the interlocking chains that adorn the Arc de Triomphe in Paris, is both a functional closure and a quiet declaration of heritage.

Crafted from shiny calfskin, the leather develops a distinctive patina with wear — growing more personal over time. The structured silhouette holds its shape while remaining light enough for daily carry.

Celine's approach to luxury is one of reduction: every element earns its place. The Triomphe carries nothing superfluous — no excess hardware, no ornamental stitching. What remains is the essential: fine materials, considered proportions, and a clasp that connects past and present.`,
    specifications: {
      brand: "Celine",
      collection: "Fall/Winter 2026",
      materials: "Shiny calfskin",
      lining: "Lambskin",
      closure: "Triomphe clasp",
    },
    tags: ["celine", "triomphe", "shoulder-bag", "calfskin", "fw26", "parisian"],
    seoKeywords: ["celine triomphe bag", "celine shoulder bag calfskin"],
    categoryPath: "Bags > Shoulder Bags > Designer Shoulder Bags",
    materials: { primary: "Shiny calfskin", secondary: "Gold-finished brass hardware", lining: "Lambskin" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    status: "PUBLISHED" as const,
    priceUsd: 4150,
    priceKrw: 5500000,
    images: [
      { url: "/products/celine-triomphe-front.jpg", type: "PRODUCT" as const, altText: "Triomphe bag front" },
      { url: "/products/celine-triomphe-clasp.jpg", type: "DETAIL" as const, altText: "Triomphe clasp detail" },
      { url: "/products/celine-triomphe-styled.jpg", type: "LIFESTYLE" as const, altText: "Triomphe styled" },
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
    descriptionFull: `The Margaux 15 is, in many ways, the ultimate expression of The Row's design philosophy: that true luxury lies in what you don't see. There is no visible branding, no trend-driven detail, no concession to the moment.

What remains is an object of extraordinary quality. The smooth calfskin — sourced from a single Italian tannery — is cut and assembled by hand. The proportions have been refined over multiple seasons to achieve a silhouette that is neither too structured nor too relaxed.

The interior is as considered as the exterior: a suede lining, a removable pouch, and a zipper that closes with the precision of fine engineering. The Margaux doesn't announce itself. It rewards those who look closely.`,
    specifications: {
      brand: "The Row",
      materials: "Smooth calfskin",
      lining: "Suede",
      closure: "Top zip",
      includes: "Removable interior pouch",
    },
    tags: ["the-row", "margaux", "top-handle", "calfskin", "quiet-luxury", "investment"],
    seoKeywords: ["the row margaux bag", "the row margaux 15"],
    categoryPath: "Bags > Top Handle Bags > Designer Top Handle",
    materials: { primary: "Smooth calfskin", lining: "Suede" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    status: "PUBLISHED" as const,
    priceUsd: 5490,
    priceKrw: 7290000,
    images: [
      { url: "/products/row-margaux-front.jpg", type: "PRODUCT" as const, altText: "Margaux 15 front" },
      { url: "/products/row-margaux-interior.jpg", type: "DETAIL" as const, altText: "Margaux interior detail" },
      { url: "/products/row-margaux-lifestyle.jpg", type: "LIFESTYLE" as const, altText: "Margaux lifestyle" },
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
    descriptionFull: `Simon Porte Jacquemus has an instinct for scale. The Le Chiquito — originally introduced as a miniature statement — has grown into a family of bags that balance wit with wearability. The Long iteration extends the silhouette to accommodate daily essentials while retaining the distinctive trapeze shape.

Crafted from smooth leather in a palette inspired by the south of France, the bag carries Jacquemus's signature warmth. The single rolled handle and detachable strap offer versatility, while the metal logo buckle provides just enough branding.

This is contemporary luxury at its most direct: a bag that makes you smile without asking permission.`,
    specifications: {
      brand: "Jacquemus",
      collection: "Fall/Winter 2026",
      materials: "Smooth leather",
      closure: "Flap with metal buckle",
      strap: "Detachable shoulder strap",
    },
    tags: ["jacquemus", "le-chiquito", "mini-bag", "contemporary", "fw26", "french"],
    seoKeywords: ["jacquemus le chiquito long", "jacquemus mini bag"],
    categoryPath: "Bags > Mini Bags > Designer Mini Bags",
    materials: { primary: "Smooth leather", secondary: "Gold-toned metal hardware" },
    sizing: { available: ["One Size"], sizeSystem: "universal" },
    collection: "FW26",
    status: "PUBLISHED" as const,
    priceUsd: 495,
    priceKrw: 659000,
    images: [
      { url: "/products/jacquemus-chiquito-front.jpg", type: "PRODUCT" as const, altText: "Le Chiquito Long front" },
      { url: "/products/jacquemus-chiquito-buckle.jpg", type: "DETAIL" as const, altText: "Le Chiquito buckle detail" },
      { url: "/products/jacquemus-chiquito-model.jpg", type: "MODEL" as const, altText: "Le Chiquito on model" },
    ],
  },
];

async function main() {
  // Clear existing data
  await prisma.productImage.deleteMany();
  await prisma.productPrice.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.brand.deleteMany();

  // Seed brands
  const brandMap = new Map<string, string>();
  for (const brand of BRANDS) {
    const created = await prisma.brand.create({ data: brand });
    brandMap.set(brand.slug, created.id);
  }

  // Seed products
  for (const product of PRODUCTS) {
    const brandId = brandMap.get(product.brandSlug);
    if (!brandId) continue;

    const { brandSlug, priceUsd, priceKrw, images, ...productData } = product;

    await prisma.product.create({
      data: {
        ...productData,
        brandId,
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
  }

  const productCount = await prisma.product.count();
  const brandCount = await prisma.brand.count();
  // eslint-disable-next-line no-console
  console.log(`Seeded ${brandCount} brands and ${productCount} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
