import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@repo/db";
import {
  credentialsSchema,
  hashPassword,
  verifyCredentials,
} from "../../services/auth";
import {
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  TOKEN_TTL,
} from "../../services/jwt";

const deviceSchema = z.object({
  deviceId: z.string().min(1).max(128),
  deviceName: z.string().max(128).optional(),
});

export const authRouter = router({
  // 회원가입 (데모용 — Phase 3 단순 구현)
  register: publicProcedure
    .input(
      credentialsSchema.extend({
        name: z.string().min(1).max(64),
        ...deviceSchema.shape,
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.customer.findUnique({
        where: { email: input.email },
        select: { id: true },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "이미 가입된 이메일입니다.",
        });
      }

      const passwordHash = await hashPassword(input.password);
      const customer = await prisma.customer.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash,
        },
        select: { id: true, email: true, name: true, tier: true },
      });

      const accessToken = await signAccessToken({
        customerId: customer.id,
        email: customer.email,
        tier: customer.tier,
      });

      const { raw: refreshRaw, hash: refreshHash, expiresAt } =
        generateRefreshToken();

      await prisma.refreshToken.create({
        data: {
          customerId: customer.id,
          tokenHash: refreshHash,
          deviceId: input.deviceId,
          deviceName: input.deviceName,
          expiresAt,
        },
      });

      return {
        accessToken,
        accessTokenExpiresIn: TOKEN_TTL.accessSeconds,
        refreshToken: refreshRaw,
        refreshTokenExpiresAt: expiresAt.toISOString(),
        customer,
      };
    }),

  login: publicProcedure
    .input(credentialsSchema.extend(deviceSchema.shape))
    .mutation(async ({ input }) => {
      const customer = await verifyCredentials({
        email: input.email,
        password: input.password,
      });

      if (!customer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      const accessToken = await signAccessToken({
        customerId: customer.id,
        email: customer.email,
        tier: customer.tier,
      });

      const { raw: refreshRaw, hash: refreshHash, expiresAt } =
        generateRefreshToken();

      // 같은 디바이스의 기존 refresh token 폐기 (rotation)
      await prisma.refreshToken.updateMany({
        where: {
          customerId: customer.id,
          deviceId: input.deviceId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });

      await prisma.refreshToken.create({
        data: {
          customerId: customer.id,
          tokenHash: refreshHash,
          deviceId: input.deviceId,
          deviceName: input.deviceName,
          expiresAt,
        },
      });

      await prisma.customer.update({
        where: { id: customer.id },
        data: { lastActiveAt: new Date() },
      });

      return {
        accessToken,
        accessTokenExpiresIn: TOKEN_TTL.accessSeconds,
        refreshToken: refreshRaw,
        refreshTokenExpiresAt: expiresAt.toISOString(),
        customer,
      };
    }),

  refresh: publicProcedure
    .input(z.object({ refreshToken: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const tokenHash = hashRefreshToken(input.refreshToken);

      const existing = await prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: {
          customer: { select: { id: true, email: true, tier: true, name: true } },
        },
      });

      if (
        !existing ||
        existing.revokedAt !== null ||
        existing.expiresAt <= new Date()
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "유효하지 않은 refresh token입니다. 다시 로그인하세요.",
        });
      }

      // Rotation: 이전 토큰 폐기 + 신규 발행
      const { raw: newRaw, hash: newHash, expiresAt: newExpiresAt } =
        generateRefreshToken();

      await prisma.$transaction([
        prisma.refreshToken.update({
          where: { id: existing.id },
          data: { revokedAt: new Date() },
        }),
        prisma.refreshToken.create({
          data: {
            customerId: existing.customerId,
            tokenHash: newHash,
            deviceId: existing.deviceId,
            deviceName: existing.deviceName,
            expiresAt: newExpiresAt,
          },
        }),
      ]);

      const accessToken = await signAccessToken({
        customerId: existing.customer.id,
        email: existing.customer.email,
        tier: existing.customer.tier,
      });

      return {
        accessToken,
        accessTokenExpiresIn: TOKEN_TTL.accessSeconds,
        refreshToken: newRaw,
        refreshTokenExpiresAt: newExpiresAt.toISOString(),
        customer: existing.customer,
      };
    }),

  logout: protectedProcedure
    .input(
      z.object({
        refreshToken: z.string().optional(),
        allDevices: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.allDevices) {
        await prisma.refreshToken.updateMany({
          where: { customerId: ctx.customer.id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      } else if (input.refreshToken) {
        const tokenHash = hashRefreshToken(input.refreshToken);
        await prisma.refreshToken.updateMany({
          where: { tokenHash, customerId: ctx.customer.id },
          data: { revokedAt: new Date() },
        });
      }
      return { success: true };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const customer = await prisma.customer.findUnique({
      where: { id: ctx.customer.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        tier: true,
        annualSpend: true,
        preferredLang: true,
        createdAt: true,
      },
    });
    if (!customer) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Customer not found" });
    }
    return { success: true, data: customer };
  }),
});
