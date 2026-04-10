import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MA-${ts}-${rand}`;
}

export const orderRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const orders = await prisma.order.findMany({
      where: { customerId: ctx.customer.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: { select: { id: true, name: true } },
                images: { orderBy: { position: "asc" }, take: 1 },
              },
            },
          },
        },
      },
    });
    return { success: true, data: orders };
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const order = await prisma.order.findUnique({
        where: { id: input.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                  images: { orderBy: { position: "asc" }, take: 1 },
                },
              },
            },
          },
        },
      });
      if (!order || order.customerId !== ctx.customer.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return { success: true, data: order };
    }),

  /**
   * Phase 4: 카트에서 주문 생성. 결제는 Phase 4 결제 게이트웨이 도입 전에는
   * status PENDING 으로 두고 paymentId 없이 기록만 남김 (결제 mock).
   */
  createFromCart: protectedProcedure
    .input(
      z.object({
        shippingAddressId: z.string().optional(),
        shippingAddress: z
          .object({
            name: z.string(),
            phone: z.string(),
            line1: z.string(),
            line2: z.string().optional(),
            city: z.string(),
            state: z.string().optional(),
            postalCode: z.string(),
            country: z.string().default("KR"),
          })
          .optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const cartItems = await prisma.cartItem.findMany({
        where: { customerId: ctx.customer.id },
        include: {
          product: {
            include: {
              prices: { where: { isDefault: true }, take: 1 },
            },
          },
        },
      });

      if (cartItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "카트가 비어 있습니다.",
        });
      }

      // 주소 결정: shippingAddressId > shippingAddress > 기본 주소
      let shippingAddressJson: unknown = input.shippingAddress ?? null;
      if (!shippingAddressJson && input.shippingAddressId) {
        const addr = await prisma.address.findUnique({
          where: { id: input.shippingAddressId },
        });
        if (addr && addr.customerId === ctx.customer.id) {
          shippingAddressJson = addr;
        }
      }

      // 소계 계산
      let subtotal = 0;
      const orderItemData: {
        productId: string;
        quantity: number;
        unitPrice: number;
        total: number;
        variantSku: string | null;
      }[] = [];

      for (const ci of cartItems) {
        const price = ci.product.prices[0];
        if (!price) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `${ci.product.name}: price unavailable`,
          });
        }
        const unitPrice = Number(price.amount);
        const lineTotal = unitPrice * ci.quantity;
        subtotal += lineTotal;
        orderItemData.push({
          productId: ci.productId,
          quantity: ci.quantity,
          unitPrice,
          total: lineTotal,
          variantSku: null,
        });
      }

      const shippingFee = subtotal >= 500 ? 0 : 30;
      const total = subtotal + shippingFee;

      // 트랜잭션: order 생성 + items 생성 + cart 비우기
      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            customerId: ctx.customer.id,
            status: "PENDING",
            subtotal,
            shippingFee,
            total,
            shippingAddress: shippingAddressJson as never,
            notes: input.notes,
            items: {
              create: orderItemData.map((it) => ({
                productId: it.productId,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
                total: it.total,
                variantSku: it.variantSku,
              })),
            },
          },
          include: {
            items: true,
          },
        });

        await tx.cartItem.deleteMany({
          where: { customerId: ctx.customer.id },
        });

        return created;
      });

      return { success: true, data: order };
    }),
});
