import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";

export const cartRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const items = await prisma.cartItem.findMany({
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
        variant: true,
      },
    });
    return { success: true, data: items };
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        size: z.string().optional(),
        quantity: z.number().int().min(1).max(99).default(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.productId },
        select: { id: true, status: true },
      });
      if (!product || product.status !== "PUBLISHED") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "상품을 찾을 수 없습니다.",
        });
      }

      // 동일 product+variant+size 조합 있으면 quantity 누적
      const existing = await prisma.cartItem.findFirst({
        where: {
          customerId: ctx.customer.id,
          productId: input.productId,
          variantId: input.variantId ?? null,
          size: input.size ?? null,
        },
      });

      if (existing) {
        const updated = await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + input.quantity },
        });
        return { success: true, data: updated };
      }

      const created = await prisma.cartItem.create({
        data: {
          customerId: ctx.customer.id,
          productId: input.productId,
          variantId: input.variantId,
          size: input.size,
          quantity: input.quantity,
        },
      });
      return { success: true, data: created };
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string(),
        quantity: z.number().int().min(0).max(99),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const item = await prisma.cartItem.findUnique({
        where: { id: input.cartItemId },
      });
      if (!item || item.customerId !== ctx.customer.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (input.quantity === 0) {
        await prisma.cartItem.delete({ where: { id: input.cartItemId } });
        return { success: true, removed: true };
      }

      const updated = await prisma.cartItem.update({
        where: { id: input.cartItemId },
        data: { quantity: input.quantity },
      });
      return { success: true, data: updated };
    }),

  removeItem: protectedProcedure
    .input(z.object({ cartItemId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const item = await prisma.cartItem.findUnique({
        where: { id: input.cartItemId },
      });
      if (!item || item.customerId !== ctx.customer.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await prisma.cartItem.delete({ where: { id: input.cartItemId } });
      return { success: true };
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await prisma.cartItem.deleteMany({
      where: { customerId: ctx.customer.id },
    });
    return { success: true };
  }),
});
