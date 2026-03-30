import { describe, it, expect, beforeEach } from "vitest";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

const SAMPLE_ITEM = {
  productId: "p1",
  name: "GG Marmont",
  brand: "Gucci",
  price: 2350,
  slug: "gucci-gg-marmont",
};

describe("WishlistStore", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  it("starts empty", () => {
    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it("adds an item", () => {
    useWishlistStore.getState().addItem(SAMPLE_ITEM);

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe("p1");
    expect(items[0].addedAt).toBeTruthy();
  });

  it("does not add duplicates", () => {
    useWishlistStore.getState().addItem(SAMPLE_ITEM);
    useWishlistStore.getState().addItem(SAMPLE_ITEM);

    expect(useWishlistStore.getState().items).toHaveLength(1);
  });

  it("removes an item", () => {
    useWishlistStore.getState().addItem(SAMPLE_ITEM);
    useWishlistStore.getState().removeItem("p1");

    expect(useWishlistStore.getState().items).toHaveLength(0);
  });

  it("checks if item is in wishlist", () => {
    expect(useWishlistStore.getState().isInWishlist("p1")).toBe(false);

    useWishlistStore.getState().addItem(SAMPLE_ITEM);
    expect(useWishlistStore.getState().isInWishlist("p1")).toBe(true);
  });

  it("toggles item on/off", () => {
    useWishlistStore.getState().toggleItem(SAMPLE_ITEM);
    expect(useWishlistStore.getState().isInWishlist("p1")).toBe(true);

    useWishlistStore.getState().toggleItem(SAMPLE_ITEM);
    expect(useWishlistStore.getState().isInWishlist("p1")).toBe(false);
  });
});
