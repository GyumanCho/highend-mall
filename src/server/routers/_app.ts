import { router } from "../trpc";
import { productRouter } from "./product";
import { brandRouter } from "./brand";

export const appRouter = router({
  product: productRouter,
  brand: brandRouter,
});

export type AppRouter = typeof appRouter;
