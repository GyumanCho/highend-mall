import { z } from "zod/v4";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";

export const wishlistRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const items = await prisma.wishlistItem.findMany({
      where: { customerId: ctx.customer.id },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          include: {
            brand: { select: { id: true, name: true, slug: true } },
            prices: { where: { isDefault: true }, take: 1 },
            images: { orderBy: { position: "asc" }, take: 1 },
          },
        },
      },
    });
    return { success: true, data: items };
  }),

  toggle: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await prisma.wishlistItem.findUnique({
        where: {
          customerId_productId: {
            customerId: ctx.customer.id,
            productId: input.productId,
          },
        },
      });

      if (existing) {
        await prisma.wishlistItem.delete({
          where: { id: existing.id },
        });
        return { success: true, inWishlist: false };
      }

      await prisma.wishlistItem.create({
        data: {
          customerId: ctx.customer.id,
          productId: input.productId,
        },
      });
      return { success: true, inWishlist: true };
    }),
});
