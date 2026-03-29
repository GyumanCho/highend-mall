import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { MOCK_REVIEWS, getPendingReviews } from "@/lib/mock-reviews";

const STATS = [
  { label: "Products", value: MOCK_PRODUCTS.length, href: "/dashboard/products" },
  { label: "Published", value: MOCK_PRODUCTS.filter((p) => p.priceTier).length, href: "/dashboard/products" },
  { label: "Reviews", value: MOCK_REVIEWS.length, href: "/dashboard/reviews" },
  { label: "Pending Reviews", value: getPendingReviews().length, href: "/dashboard/reviews" },
] as const;

export default function DashboardPage() {
  const pendingReviews = getPendingReviews();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 rounded-lg border border-neutral-200 hover:border-neutral-400 transition-colors"
          >
            <p className="text-3xl font-semibold mb-1">{stat.value}</p>
            <p className="text-sm text-neutral-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Pipeline Queue */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">AI Pipeline Queue</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              All clear
            </span>
          </div>
          <div className="space-y-3">
            {["Product Listing", "Review Response", "Recommendation"].map(
              (pipeline) => (
                <div
                  key={pipeline}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
                >
                  <span className="text-sm">{pipeline}</span>
                  <span className="text-xs text-neutral-400">0 queued</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Pending Reviews</h2>
            <Link
              href="/dashboard/reviews"
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {pendingReviews.length > 0 ? (
            <div className="space-y-3">
              {pendingReviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm">{review.customerName}</p>
                    <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                      {review.text.slice(0, 60)}...
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      review.status === "AI_ANALYZED"
                        ? "bg-blue-100 text-blue-700"
                        : review.status === "ESCALATED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {review.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No pending reviews.</p>
          )}
        </div>
      </div>
    </div>
  );
}
