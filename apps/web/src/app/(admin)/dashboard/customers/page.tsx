"use client";

import { useState } from "react";

const MOCK_CUSTOMERS = [
  { name: "Soyeon Kim", email: "soyeon@example.com", tier: "GOLD", annualSpend: 28000, orders: 12, lastActive: "2026-03-28", risk: null },
  { name: "Minjae Lee", email: "minjae@example.com", tier: "PLATINUM", annualSpend: 68000, orders: 24, lastActive: "2026-03-29", risk: null },
  { name: "Jiwon Park", email: "jiwon@example.com", tier: "SILVER", annualSpend: 8500, orders: 5, lastActive: "2026-03-22", risk: null },
  { name: "Hyunwoo Choi", email: "hyunwoo@example.com", tier: "GOLD", annualSpend: 32000, orders: 15, lastActive: "2026-01-15", risk: "declining_frequency" },
] as const;

const TIER_STYLES: Record<string, string> = {
  PLATINUM: "bg-neutral-900 text-white",
  GOLD: "bg-amber-100 text-amber-800",
  SILVER: "bg-neutral-200 text-neutral-700",
  STANDARD: "bg-neutral-100 text-neutral-500",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

const FILTERS = ["All", "Platinum", "Gold", "Silver", "At Risk"] as const;

export default function AdminCustomersPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "At Risk") return c.risk !== null;
    return c.tier === activeFilter.toUpperCase();
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">VIP Customers ({filtered.length})</h1>
        <div className="flex gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                activeFilter === filter
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Customer</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Tier</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Annual Spend</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Orders</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Last Active</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr
                key={customer.email}
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-medium">{customer.name}</p>
                  <p className="text-xs text-neutral-400">{customer.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${TIER_STYLES[customer.tier]}`}>
                    {customer.tier}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {formatCurrency(customer.annualSpend)}
                </td>
                <td className="px-6 py-4 text-sm">{customer.orders}</td>
                <td className="px-6 py-4 text-sm text-neutral-500">
                  {customer.lastActive}
                </td>
                <td className="px-6 py-4">
                  {customer.risk ? (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      At Risk
                    </span>
                  ) : (
                    <span className="text-xs text-green-600">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
