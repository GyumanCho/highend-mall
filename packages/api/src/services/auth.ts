// 비밀번호 검증 + 해시 — NextAuth와 모바일 JWT 엔드포인트에서 공유.
// docs/mobile-native/architecture.md §2.4.1
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@repo/db";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type Credentials = z.infer<typeof credentialsSchema>;

export interface AuthenticatedCustomer {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly tier: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Email + password 검증 후 인증된 customer 반환.
 * 일치하지 않으면 null. 디버깅 정보 노출 금지 (timing attack 방지를 위해 dummy hash 비교).
 */
export async function verifyCredentials(
  input: Credentials
): Promise<AuthenticatedCustomer | null> {
  const customer = await prisma.customer.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      passwordHash: true,
    },
  });

  // Timing attack 방지: 사용자 없을 때도 dummy hash 비교 수행
  const hashToCompare =
    customer?.passwordHash ??
    "$2a$10$0000000000000000000000.0000000000000000000000000000000000";
  const ok = await verifyPassword(input.password, hashToCompare);

  if (!customer?.passwordHash || !ok) return null;

  return {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    tier: customer.tier,
  };
}
