import { z } from "zod/v4";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";

export const productRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        category: z.string().optional(),
        brandId: z.string().optional(),
        priceTier: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, category, brandId, priceTier } = input;
      const skip = (page - 1) * limit;

      const where = {
        status: "PUBLISHED" as const,
        ...(category && { category: category as never }),
        ...(brandId && { brandId }),
        ...(priceTier && { priceTier: priceTier as never }),
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          include: {
            brand: { select: { id: true, name: true, slug: true, tier: true } },
            prices: { where: { isDefault: true } },
            images: { orderBy: { position: "asc" }, take: 2 },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        success: true,
        data: products,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const product = await prisma.product.findUnique({
        where: { slug: input.slug },
        include: {
          brand: true,
          prices: true,
          images: { orderBy: { position: "asc" } },
          variants: { where: { stock: { gt: 0 } } },
          reviews: {
            where: { status: "APPROVED" },
            take: 10,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return { success: true, data: product };
    }),
});
