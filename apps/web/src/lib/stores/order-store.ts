"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cart-store";

export interface ShippingAddress {
  readonly firstName: string;
  readonly lastName: string;
  readonly line1: string;
  readonly city: string;
  readonly postalCode: string;
  readonly country: string;
  readonly phone: string;
}

export interface Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly date: string;
  readonly status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
  readonly items: readonly CartItem[];
  readonly subtotal: number;
  readonly shippingFee: number;
  readonly total: number;
  readonly paymentMethod: string;
  readonly shippingAddress: ShippingAddress;
  readonly trackingNumber: string | null;
}

interface OrderState {
  readonly orders: readonly Order[];
  readonly createOrder: (params: {
    items: readonly CartItem[];
    subtotal: number;
    paymentMethod: string;
    shippingAddress: ShippingAddress;
  }) => Order;
  readonly getOrder: (id: string) => Order | undefined;
  readonly updateStatus: (id: string, status: Order["status"]) => void;
  readonly requestReturn: (id: string) => void;
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MSN-${date}-${suffix}`;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: ({ items, subtotal, paymentMethod, shippingAddress }) => {
        const shippingFee = subtotal >= 500 ? 0 : 25;
        const order: Order = {
          id: `ord_${Date.now()}`,
          orderNumber: generateOrderNumber(),
          date: new Date().toISOString().slice(0, 10),
          status: "PAID",
          items,
          subtotal,
          shippingFee,
          total: subtotal + shippingFee,
          paymentMethod,
          shippingAddress,
          trackingNumber: null,
        };

        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },

      getOrder: (id) => get().orders.find((o) => o.id === id),

      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        })),

      requestReturn: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: "RETURNED" as const } : o
          ),
        })),
    }),
    { name: "maison-orders" }
  )
);
