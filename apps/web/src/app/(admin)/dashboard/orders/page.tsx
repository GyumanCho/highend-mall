"use client";

import { useState } from "react";

const MOCK_ADMIN_ORDERS = [
  { id: "MSN-20260328-X1Y2", customer: "Soyeon Kim", tier: "GOLD", total: 2350, status: "PROCESSING", date: "2026-03-28", items: 1, paymentMethod: "Credit Card" },
  { id: "MSN-20260327-A3B4", customer: "Minjae Lee", tier: "PLATINUM", total: 8690, status: "SHIPPED", date: "2026-03-27", items: 2, paymentMethod: "Kakao Pay", tracking: "KR9876543210" },
  { id: "MSN-20260325-C5D6", customer: "Jiwon Park", tier: "SILVER", total: 4150, status: "DELIVERED", date: "2026-03-25", items: 1, paymentMethod: "Toss Pay" },
  { id: "MSN-20260320-E7F8", customer: "Hyunwoo Choi", tier: "GOLD", total: 5490, status: "DELIVERED", date: "2026-03-20", items: 1, paymentMethod: "Credit Card" },
  { id: "MSN-20260318-G9H0", customer: "Soyeon Kim", tier: "GOLD", total: 495, status: "RETURNED", date: "2026-03-18", items: 1, paymentMethod: "Naver Pay" },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  RETURNED: "bg-neutral-200 text-neutral-600",
};

const STATUS_FLOW = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = statusFilter === "All"
    ? MOCK_ADMIN_ORDERS
    : MOCK_ADMIN_ORDERS.filter((o) => o.status === statusFilter);

  const totalRevenue = MOCK_ADMIN_ORDERS
    .filter((o) => o.status !== "CANCELLED" && o.status !== "RETURNED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Orders ({filtered.length})</h1>
        <p className="text-sm text-neutral-500">
          Revenue: <span className="text-green-600 font-medium">{formatCurrency(totalRevenue)}</span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["All", ...STATUS_FLOW, "RETURNED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              statusFilter === status
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Order</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Total</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Payment</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-neutral-400">{order.date} · {order.items} item{order.items !== 1 ? "s" : ""}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">{order.customer}</p>
                  <span className="text-xs text-neutral-400">{order.tier}</span>
                </td>
                <td className="px-6 py-4 text-sm">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4 text-xs text-neutral-500">{order.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {order.status === "PROCESSING" && (
                      <button className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700">
                        Mark Shipped
                      </button>
                    )}
                    {order.status === "SHIPPED" && (
                      <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">
                        Mark Delivered
                      </button>
                    )}
                    {"tracking" in order && order.tracking && (
                      <span className="text-xs text-neutral-400">{order.tracking}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
