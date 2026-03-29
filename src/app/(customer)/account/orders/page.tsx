import Link from "next/link";
import { formatPrice } from "@/lib/mock-data";

const MOCK_ORDERS = [
  {
    id: "MSN-20260315-A1B2",
    date: "2026-03-15",
    status: "DELIVERED",
    total: 2350,
    items: [{ name: "GG Marmont Small Shoulder Bag", brand: "Gucci", qty: 1 }],
    tracking: "KR1234567890",
  },
  {
    id: "MSN-20260220-C3D4",
    date: "2026-02-20",
    status: "DELIVERED",
    total: 3200,
    items: [{ name: "Cassette Bag in Intreccio Leather", brand: "Bottega Veneta", qty: 1 }],
    tracking: "KR0987654321",
  },
] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "text-yellow-600",
  PAID: "text-blue-600",
  PROCESSING: "text-blue-600",
  SHIPPED: "text-purple-600",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-600",
  RETURNED: "text-neutral-500",
};

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link href="/account" className="text-secondary hover:text-primary text-sm">&larr;</Link>
        <h1 className="font-serif text-3xl">Order History</h1>
      </div>

      {MOCK_ORDERS.length > 0 ? (
        <div className="space-y-6">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="border border-muted p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-secondary">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </p>
                  <p className="text-sm">{formatPrice(order.total)}</p>
                </div>
              </div>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-t border-muted">
                  <div className="w-16 h-20 bg-surface shrink-0" />
                  <div>
                    <p className="text-xs tracking-widest uppercase text-secondary">{item.brand}</p>
                    <p className="text-sm">{item.name}</p>
                    <p className="text-xs text-secondary">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
              {order.tracking && (
                <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between">
                  <p className="text-xs text-secondary">Tracking: {order.tracking}</p>
                  <button className="text-xs text-primary underline underline-offset-4">
                    Track Shipment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-muted">
          <p className="text-secondary mb-4">No orders yet.</p>
          <Link href="/products" className="text-sm tracking-widest uppercase border-b border-primary pb-1">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
