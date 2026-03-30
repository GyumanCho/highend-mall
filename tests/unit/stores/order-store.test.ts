import { describe, it, expect, beforeEach } from "vitest";
import { useOrderStore } from "@/lib/stores/order-store";

const SAMPLE_CART_ITEM = {
  productId: "p1",
  name: "GG Marmont",
  brand: "Gucci",
  price: 2350,
  currency: "USD" as const,
  size: "One Size",
  slug: "gucci-gg-marmont",
  quantity: 1,
};

const SAMPLE_ADDRESS = {
  firstName: "Soyeon",
  lastName: "Kim",
  line1: "123 Gangnam-daero",
  city: "Seoul",
  postalCode: "06241",
  country: "KR",
  phone: "010-1234-5678",
};

describe("OrderStore", () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [] });
  });

  it("creates an order with correct fields", () => {
    const order = useOrderStore.getState().createOrder({
      items: [SAMPLE_CART_ITEM],
      subtotal: 2350,
      paymentMethod: "Credit Card",
      shippingAddress: SAMPLE_ADDRESS,
    });

    expect(order.orderNumber).toMatch(/^MSN-\d{8}-[A-Z0-9]{4}$/);
    expect(order.status).toBe("PAID");
    expect(order.total).toBe(2350); // >= 500, free shipping
    expect(order.shippingFee).toBe(0);
    expect(order.items).toHaveLength(1);
  });

  it("adds shipping fee for orders under $500", () => {
    const order = useOrderStore.getState().createOrder({
      items: [{ ...SAMPLE_CART_ITEM, price: 100 }],
      subtotal: 100,
      paymentMethod: "Credit Card",
      shippingAddress: SAMPLE_ADDRESS,
    });

    expect(order.shippingFee).toBe(25);
    expect(order.total).toBe(125);
  });

  it("stores orders in reverse chronological order", () => {
    useOrderStore.getState().createOrder({
      items: [SAMPLE_CART_ITEM],
      subtotal: 2350,
      paymentMethod: "Card",
      shippingAddress: SAMPLE_ADDRESS,
    });
    useOrderStore.getState().createOrder({
      items: [SAMPLE_CART_ITEM],
      subtotal: 3200,
      paymentMethod: "Kakao",
      shippingAddress: SAMPLE_ADDRESS,
    });

    const orders = useOrderStore.getState().orders;
    expect(orders).toHaveLength(2);
    expect(orders[0].total).toBe(3200); // latest first
  });

  it("retrieves order by id", () => {
    const created = useOrderStore.getState().createOrder({
      items: [SAMPLE_CART_ITEM],
      subtotal: 2350,
      paymentMethod: "Card",
      shippingAddress: SAMPLE_ADDRESS,
    });

    const found = useOrderStore.getState().getOrder(created.id);
    expect(found?.orderNumber).toBe(created.orderNumber);
  });

  it("updates order status", () => {
    const order = useOrderStore.getState().createOrder({
      items: [SAMPLE_CART_ITEM],
      subtotal: 2350,
      paymentMethod: "Card",
      shippingAddress: SAMPLE_ADDRESS,
    });

    useOrderStore.getState().updateStatus(order.id, "SHIPPED");
    expect(useOrderStore.getState().getOrder(order.id)?.status).toBe("SHIPPED");
  });

  it("handles return request", () => {
    const order = useOrderStore.getState().createOrder({
      items: [SAMPLE_CART_ITEM],
      subtotal: 2350,
      paymentMethod: "Card",
      shippingAddress: SAMPLE_ADDRESS,
    });

    useOrderStore.getState().requestReturn(order.id);
    expect(useOrderStore.getState().getOrder(order.id)?.status).toBe("RETURNED");
  });
});
