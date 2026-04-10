// JWT 발급/검증 (mobile-only). NextAuth와 무관한 별도 토큰 시스템.
// docs/mobile-native/architecture.md §2.4
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import crypto from "crypto";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 15; // 15분
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7일

function getSecret(): Uint8Array {
  const secret = process.env.MOBILE_JWT_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      "MOBILE_JWT_SECRET (또는 NEXTAUTH_SECRET) 환경 변수가 설정되어야 합니다."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AccessTokenPayload extends JWTPayload {
  readonly sub: string; // customerId
  readonly email: string;
  readonly tier: string;
  readonly typ: "access";
}

export async function signAccessToken(input: {
  customerId: string;
  email: string;
  tier: string;
}): Promise<string> {
  return new SignJWT({
    email: input.email,
    tier: input.tier,
    typ: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.customerId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.typ !== "access") return null;
    if (typeof payload.sub !== "string") return null;
    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
}

/**
 * 새 refresh token 생성 (raw + hash 한 쌍 반환).
 * raw는 클라이언트에 1회만 보내고, hash만 DB에 저장.
 */
export function generateRefreshToken(): {
  raw: string;
  hash: string;
  expiresAt: Date;
} {
  const raw = crypto.randomBytes(48).toString("base64url");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);
  return { raw, hash, expiresAt };
}

export function hashRefreshToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export const TOKEN_TTL = {
  accessSeconds: ACCESS_TOKEN_TTL_SECONDS,
  refreshSeconds: REFRESH_TOKEN_TTL_SECONDS,
} as const;
