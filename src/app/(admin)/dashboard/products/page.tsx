"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS, formatPrice } from "@/lib/mock-data";
import { AiPipelineModal } from "@/components/admin/ai-pipeline-modal";

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  PENDING_REVIEW: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-neutral-100 text-neutral-500",
};

const CATEGORIES = ["BAGS", "RTW", "SHOES", "ACCESSORIES", "JEWELRY", "BEAUTY"];

export default function AdminProductsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-neutral-900 text-white px-6 py-2.5 text-sm rounded hover:bg-neutral-800 transition-colors"
        >
          + New Product (AI Pipeline)
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Product</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Brand</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Price</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Tier</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">QA Score</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {MOCK_PRODUCTS.map((product) => (
              <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
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
                <td className="px-6 py-4 text-sm">{formatPrice(product.priceUsd)}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">{product.priceTier}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLES["PUBLISHED"]}`}>PUBLISHED</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-green-600">0.96</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/products/${product.slug}`} className="text-xs text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Pipeline Modal */}
      <AiPipelineModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        pipeline="product-listing"
        title="New Product — AI Pipeline"
      >
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Brand</label>
            <select name="brand" className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none" required>
              <option value="">Select brand...</option>
              {["Gucci", "Bottega Veneta", "Celine", "The Row", "Jacquemus", "Prada", "Hermes"].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Product Name</label>
            <input name="productName" type="text" required className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none" placeholder="e.g., Re-Nylon Backpack" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Price (USD)</label>
              <input name="price" type="number" required className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none" placeholder="1350" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Category</label>
              <select name="category" className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none" required>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Materials</label>
            <input name="materials" type="text" className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none" placeholder="e.g., Re-Nylon, saffiano leather trim" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Description (optional)</label>
            <textarea name="description" rows={3} className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none resize-none" placeholder="Raw product description..." />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 text-sm rounded hover:bg-blue-700 transition-colors">
          Generate with AI
        </button>
        <p className="text-xs text-neutral-400 text-center mt-3">
          Pipeline: curator → content-creator → qa-guardian
        </p>
      </AiPipelineModal>
    </div>
  );
}
