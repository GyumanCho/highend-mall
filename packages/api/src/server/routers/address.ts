import { z } from "zod/v4";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";

const addressInput = z.object({
  label: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().default("KR"),
  isDefault: z.boolean().default(false),
});

export const addressRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const addresses = await prisma.address.findMany({
      where: { customerId: ctx.customer.id },
      orderBy: [{ isDefault: "desc" }],
    });

    return { success: true, data: addresses };
  }),

  create: protectedProcedure
    .input(addressInput)
    .mutation(async ({ ctx, input }) => {
      // 기본 배송지로 설정 시 기존 기본 배송지 해제
      if (input.isDefault) {
        await prisma.address.updateMany({
          where: { customerId: ctx.customer.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      const address = await prisma.address.create({
        data: { ...input, customerId: ctx.customer.id },
      });

      return { success: true, data: address };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string() }).extend(addressInput.shape))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await prisma.address.findFirst({
        where: { id, customerId: ctx.customer.id },
      });
      if (!existing) throw new Error("Address not found");

      if (data.isDefault) {
        await prisma.address.updateMany({
          where: { customerId: ctx.customer.id, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      const address = await prisma.address.update({
        where: { id },
        data,
      });

      return { success: true, data: address };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.address.findFirst({
        where: { id: input.id, customerId: ctx.customer.id },
      });
      if (!existing) throw new Error("Address not found");

      await prisma.address.delete({ where: { id: input.id } });

      return { success: true };
    }),

  setDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.address.findFirst({
        where: { id: input.id, customerId: ctx.customer.id },
      });
      if (!existing) throw new Error("Address not found");

      await prisma.address.updateMany({
        where: { customerId: ctx.customer.id, isDefault: true },
        data: { isDefault: false },
      });

      const address = await prisma.address.update({
        where: { id: input.id },
        data: { isDefault: true },
      });

      return { success: true, data: address };
    }),
});
