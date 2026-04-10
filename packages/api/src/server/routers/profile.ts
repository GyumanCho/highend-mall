import { z } from "zod/v4";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";

const sizeProfileSchema = z.object({
  clothing: z.string().optional(),
  shoes: z.string().optional(),
  accessories: z.string().optional(),
  pants: z.string().optional(),
  ring: z.string().optional(),
});

export const profileRouter = router({
  getSizeProfile: protectedProcedure.query(async ({ ctx }) => {
    const customer = await prisma.customer.findUnique({
      where: { id: ctx.customer.id },
      select: { sizeProfile: true },
    });

    return {
      success: true,
      data: (customer?.sizeProfile as Record<string, string> | null) ?? {},
    };
  }),

  updateSizeProfile: protectedProcedure
    .input(sizeProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const customer = await prisma.customer.update({
        where: { id: ctx.customer.id },
        data: { sizeProfile: input },
        select: { sizeProfile: true },
      });

      return { success: true, data: customer.sizeProfile };
    }),

  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const customer = await prisma.customer.findUnique({
      where: { id: ctx.customer.id },
      select: { preferredLang: true, preferredBrands: true },
    });

    return {
      success: true,
      data: {
        language: customer?.preferredLang ?? "ko",
        preferredBrands: customer?.preferredBrands ?? [],
      },
    };
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        language: z.string().optional(),
        preferredBrands: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data: Record<string, unknown> = {};
      if (input.language !== undefined) data.preferredLang = input.language;
      if (input.preferredBrands !== undefined) data.preferredBrands = input.preferredBrands;

      const customer = await prisma.customer.update({
        where: { id: ctx.customer.id },
        data,
        select: { preferredLang: true, preferredBrands: true },
      });

      return {
        success: true,
        data: {
          language: customer.preferredLang,
          preferredBrands: customer.preferredBrands,
        },
      };
    }),
});
