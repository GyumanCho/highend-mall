import { initTRPC } from "@trpc/server";
import { z } from "zod/v4";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure; // TODO: add auth middleware
