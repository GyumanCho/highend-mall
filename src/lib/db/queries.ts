import { prisma } from "./client";

// ═══════════════════════════════════════════
// BRANDS
// ═══════════════════════════════════════════

export async function getBrands(tier?: string) {
  return prisma.brand.findMany({
    where: { isActive: true, ...(tier ? { tier: tier as never } : {}) },
    orderBy: { name: "asc" },
  });
}

export async function getBrandBySlug(slug: string) {
  return prisma.brand.findUnique({ where: { slug } });
}

// ═══════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════

export async function getProducts(filters?: {
  category?: string;
  brandSlug?: string;
  priceTier?: string;
}) {
  const brand = filters?.brandSlug
    ? await prisma.brand.findUnique({ where: { slug: filters.brandSlug } })
    : null;

  return prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(filters?.category ? { category: filters.category as never } : {}),
      ...(brand ? { brandId: brand.id } : {}),
      ...(filters?.priceTier ? { priceTier: filters.priceTier as never } : {}),
    },
    include: {
      brand: { select: { id: true, name: true, slug: true, tier: true } },
      prices: { where: { isDefault: true } },
      images: { orderBy: { position: "asc" }, take: 2 },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      prices: true,
      images: { orderBy: { position: "asc" } },
      variants: { where: { stock: { gt: 0 } } },
    },
  });
}

export async function getProductsByBrand(brandSlug: string) {
  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) return [];
  return prisma.product.findMany({
    where: { brandId: brand.id, status: "PUBLISHED" },
    include: {
      brand: { select: { id: true, name: true, slug: true, tier: true } },
      prices: { where: { isDefault: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

// ═══════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════

export async function getReviewsByProductSlug(productSlug: string) {
  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) return [];
  return prisma.review.findMany({
    where: { productId: product.id },
    include: { customer: { select: { name: true, tier: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingReviews() {
  return prisma.review.findMany({
    where: { status: { not: "APPROVED" } },
    include: {
      customer: { select: { name: true, tier: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    include: {
      customer: { select: { name: true, tier: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ═══════════════════════════════════════════
// COLLECTIONS
// ═══════════════════════════════════════════

export async function getCollections() {
  return prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { year: "desc" },
  });
}

export async function getCollectionBySlug(slug: string) {
  return prisma.collection.findUnique({ where: { slug } });
}

// ═══════════════════════════════════════════
// CUSTOMERS (Admin)
// ═══════════════════════════════════════════

export async function getCustomers(tierFilter?: string) {
  return prisma.customer.findMany({
    where: tierFilter ? { tier: tierFilter as never } : {},
    orderBy: { annualSpend: "desc" },
  });
}

// ═══════════════════════════════════════════
// ORDERS (Admin)
// ═══════════════════════════════════════════

export async function getOrders(statusFilter?: string) {
  return prisma.order.findMany({
    where: statusFilter ? { status: statusFilter as never } : {},
    include: {
      customer: { select: { name: true, tier: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ═══════════════════════════════════════════
// CAMPAIGNS (Admin)
// ═══════════════════════════════════════════

export async function getCampaigns() {
  return prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// ═══════════════════════════════════════════
// STATS (Admin Dashboard)
// ═══════════════════════════════════════════

export async function getDashboardStats() {
  const [productCount, publishedCount, reviewCount, pendingReviewCount, orderCount, customerCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.review.count(),
      prisma.review.count({ where: { status: { not: "APPROVED" } } }),
      prisma.order.count(),
      prisma.customer.count({ where: { tier: { not: "STANDARD" } } }),
    ]);

  return { productCount, publishedCount, reviewCount, pendingReviewCount, orderCount, customerCount };
}

// ═══════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════

export function formatPrice(amount: number | { toNumber(): number }, currency: "USD" | "KRW" = "USD"): string {
  const num = typeof amount === "number" ? amount : amount.toNumber();
  return new Intl.NumberFormat(currency === "KRW" ? "ko-KR" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
