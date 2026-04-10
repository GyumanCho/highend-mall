import { router } from "../trpc";
import { productRouter } from "./product";
import { brandRouter } from "./brand";
import { authRouter } from "./auth";
import { wishlistRouter } from "./wishlist";
import { cartRouter } from "./cart";
import { orderRouter } from "./order";

export const appRouter = router({
  product: productRouter,
  brand: brandRouter,
  auth: authRouter,
  wishlist: wishlistRouter,
  cart: cartRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
