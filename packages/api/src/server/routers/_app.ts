import { router } from "../trpc";
import { productRouter } from "./product";
import { brandRouter } from "./brand";
import { authRouter } from "./auth";
import { wishlistRouter } from "./wishlist";
import { cartRouter } from "./cart";
import { orderRouter } from "./order";
import { collectionRouter } from "./collection";
import { addressRouter } from "./address";
import { reviewRouter } from "./review";
import { profileRouter } from "./profile";

export const appRouter = router({
  product: productRouter,
  brand: brandRouter,
  auth: authRouter,
  wishlist: wishlistRouter,
  cart: cartRouter,
  order: orderRouter,
  collection: collectionRouter,
  address: addressRouter,
  review: reviewRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
