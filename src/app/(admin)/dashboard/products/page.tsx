import Link from "next/link";
import { MOCK_PRODUCTS, formatPrice } from "@/lib/mock-data";

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  PENDING_REVIEW: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-neutral-100 text-neutral-500",
};

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="bg-neutral-900 text-white px-6 py-2.5 text-sm rounded hover:bg-neutral-800 transition-colors">
          + New Product (AI Pipeline)
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Product
              </th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Brand
              </th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Price
              </th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Tier
              </th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                QA Score
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {MOCK_PRODUCTS.map((product) => (
              <tr
                key={product.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-neutral-100 rounded shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-neutral-400">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{product.brand.name}</td>
                <td className="px-6 py-4 text-sm">
                  {formatPrice(product.priceUsd)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                    {product.priceTier}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${STATUS_STYLES["PUBLISHED"]}`}
                  >
                    PUBLISHED
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-green-600">0.96</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
