import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/lib/stores/cart-store";

const SAMPLE_ITEM = {
  productId: "p1",
  name: "GG Marmont",
  brand: "Gucci",
  price: 2350,
  currency: "USD" as const,
  size: "One Size",
  slug: "gucci-gg-marmont",
};

describe("CartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("starts with empty cart", () => {
    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().itemCount()).toBe(0);
    expect(useCartStore.getState().subtotal()).toBe(0);
  });

  it("adds an item to cart", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe("p1");
    expect(items[0].quantity).toBe(1);
  });

  it("increments quantity for duplicate item", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().addItem(SAMPLE_ITEM);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("treats different sizes as separate items", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().addItem({ ...SAMPLE_ITEM, size: "Small" });

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("removes an item", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().removeItem("p1", "One Size");

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("updates quantity", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().updateQuantity("p1", "One Size", 5);

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("removes item when quantity set to 0", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().updateQuantity("p1", "One Size", 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates subtotal correctly", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().addItem({ ...SAMPLE_ITEM, productId: "p2", price: 3200 });

    expect(useCartStore.getState().subtotal()).toBe(5550);
  });

  it("calculates subtotal with quantity", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().updateQuantity("p1", "One Size", 3);

    expect(useCartStore.getState().subtotal()).toBe(7050);
  });

  it("calculates item count across quantities", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().updateQuantity("p1", "One Size", 3);
    useCartStore.getState().addItem({ ...SAMPLE_ITEM, productId: "p2" });

    expect(useCartStore.getState().itemCount()).toBe(4);
  });

  it("clears all items", () => {
    useCartStore.getState().addItem(SAMPLE_ITEM);
    useCartStore.getState().addItem({ ...SAMPLE_ITEM, productId: "p2" });
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().subtotal()).toBe(0);
  });
});
