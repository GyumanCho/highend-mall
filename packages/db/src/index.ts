import { PrismaClient } from "@prisma/client";

// Prisma client singleton — hot-reload-safe in dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Re-export Prisma types so consumers only need `@repo/db`.
export type {
  Brand,
  BrandTier,
  Product,
  Collection,
  Prisma,
  PrismaClient,
} from "@prisma/client";
