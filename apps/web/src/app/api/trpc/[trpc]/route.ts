import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@repo/api";
import { createContextFromHeaders } from "@repo/api";
import type { NextRequest } from "next/server";

// CORS 정책
// - dev: 모든 오리진 허용 (모바일 시뮬레이터/물리 디바이스 개발 편의)
// - prod: maison:// deep link scheme + 내부 도메인 화이트리스트
// docs/mobile-native/risks.md R22 참조
const DEV_ALLOW_ORIGIN = "*";
const PROD_ALLOWED_ORIGINS = new Set([
  "maison://",
  // TODO: 실제 프로덕션 도메인 추가
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const isDev = process.env.NODE_ENV !== "production";

  const allowOrigin = isDev
    ? DEV_ALLOW_ORIGIN
    : origin && PROD_ALLOWED_ORIGINS.has(origin)
      ? origin
      : "";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-trpc-source",
    "Access-Control-Max-Age": "86400",
  };
}

async function handler(req: NextRequest): Promise<Response> {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContextFromHeaders(req.headers),
    onError({ error, path }) {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[tRPC] ${path ?? "<no-path>"}:`, error.message);
      }
    },
  });

  // CORS 헤더 주입
  Object.entries(cors).forEach(([key, value]) => {
    if (value) response.headers.set(key, value);
  });

  return response;
}

export { handler as GET, handler as POST, handler as OPTIONS };
