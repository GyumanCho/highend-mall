import { initTRPC, TRPCError } from "@trpc/server";
import { verifyAccessToken } from "../services/jwt";

export interface TrpcContext {
  readonly customer: {
    readonly id: string;
    readonly email: string;
    readonly tier: string;
  } | null;
}

/**
 * tRPC context — Authorization 헤더의 Bearer 토큰에서 customer 추출.
 * 토큰 없거나 검증 실패 시 customer = null.
 * docs/mobile-native/architecture.md §2.4
 */
export async function createContextFromHeaders(
  headers: Headers
): Promise<TrpcContext> {
  const authHeader = headers.get("authorization") ?? headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return { customer: null };

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return { customer: null };

  const payload = await verifyAccessToken(token);
  if (!payload) return { customer: null };

  return {
    customer: {
      id: payload.sub,
      email: payload.email,
      tier: payload.tier,
    },
  };
}

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * 인증 필요 procedure — ctx.customer가 null이면 UNAUTHORIZED.
 * 통과 시 ctx.customer는 non-null 보장.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.customer) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      customer: ctx.customer, // type narrowed: non-null
    },
  });
});
