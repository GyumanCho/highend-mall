import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/db/client";

export const brandRouter = router({
  list: publicProcedure
    .input(
      z.object({
        tier: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = {
        isActive: true,
        ...(input.tier && { tier: input.tier as never }),
      };

      const brands = await prisma.brand.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
          logoUrl: true,
          description: true,
        },
      });

      return { success: true, data: brands };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const brand = await prisma.brand.findUnique({
        where: { slug: input.slug },
        include: {
          products: {
            where: { status: "PUBLISHED" },
            take: 20,
            orderBy: { createdAt: "desc" },
            include: {
              prices: { where: { isDefault: true } },
              images: { orderBy: { position: "asc" }, take: 1 },
            },
          },
          collections: {
            where: { isActive: true },
            orderBy: { year: "desc" },
          },
        },
      });

      if (!brand) {
        throw new Error("Brand not found");
      }

      return { success: true, data: brand };
    }),
});
