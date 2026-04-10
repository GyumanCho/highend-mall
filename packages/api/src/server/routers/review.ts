import { z } from "zod/v4";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";

export const reviewRouter = router({
  getByProductId: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const { productId, page, limit } = input;
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { productId, status: "APPROVED" },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            customer: {
              select: { id: true, name: true },
            },
          },
        }),
        prisma.review.count({
          where: { productId, status: "APPROVED" },
        }),
      ]);

      // 평균 별점
      const aggregate = await prisma.review.aggregate({
        where: { productId, status: "APPROVED" },
        _avg: { rating: true },
      });

      return {
        success: true,
        data: reviews,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          averageRating: aggregate._avg.rating ?? 0,
        },
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().int().min(1).max(5),
        text: z.string().min(10).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 중복 리뷰 방지
      const existing = await prisma.review.findFirst({
        where: {
          customerId: ctx.customer.id,
          productId: input.productId,
        },
      });
      if (existing) {
        throw new Error("You have already reviewed this product");
      }

      const review = await prisma.review.create({
        data: {
          customerId: ctx.customer.id,
          productId: input.productId,
          rating: input.rating,
          text: input.text,
          status: "PENDING",
        },
      });

      return { success: true, data: review };
    }),

  myReviews: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { customerId: ctx.customer.id },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { orderBy: { position: "asc" }, take: 1 },
              },
            },
          },
        }),
        prisma.review.count({ where: { customerId: ctx.customer.id } }),
      ]);

      return {
        success: true,
        data: reviews,
        metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    }),
});
