import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@repo/db";

export const collectionRouter = router({
  list: publicProcedure
    .input(
      z.object({
        brandId: z.string().optional(),
        season: z.string().optional(),
        year: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = {
        isActive: true,
        ...(input.brandId && { brandId: input.brandId }),
        ...(input.season && { season: input.season as never }),
        ...(input.year && { year: input.year }),
      };

      const collections = await prisma.collection.findMany({
        where,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        include: {
          brand: {
            select: { id: true, name: true, slug: true, tier: true, logoUrl: true },
          },
        },
      });

      return { success: true, data: collections };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const collection = await prisma.collection.findUnique({
        where: { slug: input.slug },
        include: {
          brand: {
            select: { id: true, name: true, slug: true, tier: true, logoUrl: true },
          },
        },
      });

      if (!collection) {
        throw new Error("Collection not found");
      }

      // 같은 브랜드의 published 상품 (컬렉션 연도/시즌 기준 필터링)
      const products = await prisma.product.findMany({
        where: {
          brandId: collection.brandId,
          status: "PUBLISHED",
        },
        take: 30,
        orderBy: { createdAt: "desc" },
        include: {
          prices: { where: { isDefault: true } },
          images: { orderBy: { position: "asc" }, take: 1 },
        },
      });

      return { success: true, data: { ...collection, products } };
    }),
});
