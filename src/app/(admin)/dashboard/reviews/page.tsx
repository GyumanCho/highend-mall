"use client";

import { useState } from "react";
import { MOCK_REVIEWS } from "@/lib/mock-reviews";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  AI_ANALYZED: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  ESCALATED: "bg-red-100 text-red-700",
};

const SENTIMENT_STYLES: Record<string, string> = {
  positive: "text-green-600",
  negative: "text-red-600",
  mixed: "text-amber-600",
  neutral: "text-neutral-500",
};

const FILTER_MAP: Record<string, string | null> = {
  All: null,
  Pending: "PENDING",
  "AI Analyzed": "AI_ANALYZED",
  Approved: "APPROVED",
  Escalated: "ESCALATED",
};

export default function AdminReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.filter((r) => r.status === FILTER_MAP[activeFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Reviews ({filtered.length})</h1>
        <div className="flex gap-2">
          {Object.keys(FILTER_MAP).map(
            (filter) => (
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
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {review.customerName}
                    </span>
                    <span className="text-xs bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">
                      {review.customerTier}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {review.date} &middot; {review.productSlug.split("-").slice(0, 2).join(" ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium ${SENTIMENT_STYLES[review.sentiment.overall]}`}
                >
                  {review.sentiment.overall} ({review.sentiment.score.toFixed(2)})
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[review.status]}`}
                >
                  {review.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${i < review.rating ? "text-amber-400" : "text-neutral-200"}`}
                >
                  &#9733;
                </span>
              ))}
            </div>

            {/* Review Text */}
            <p className="text-sm text-neutral-700 leading-relaxed mb-4">
              {review.text}
            </p>

            {/* Sentiment Themes */}
            <div className="flex gap-2 mb-4">
              {review.sentiment.themes.map((theme) => (
                <span
                  key={theme.theme}
                  className={`text-xs px-2 py-1 rounded border ${
                    theme.sentiment === "positive"
                      ? "border-green-200 text-green-700 bg-green-50"
                      : theme.sentiment === "negative"
                        ? "border-red-200 text-red-700 bg-red-50"
                        : "border-neutral-200 text-neutral-600"
                  }`}
                >
                  {theme.theme.replace("_", " ")}
                </span>
              ))}
            </div>

            {/* AI Response */}
            {review.aiResponse && (
              <div className="bg-blue-50 border border-blue-100 rounded p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-blue-700">
                    AI-Generated Response (review-concierge)
                  </p>
                  <span className="text-xs text-blue-500">QA: Approved</span>
                </div>
                <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-line">
                  {review.aiResponse}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {review.status === "AI_ANALYZED" && (
                <>
                  <button className="text-xs bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                    Approve Response
                  </button>
                  <button className="text-xs bg-white text-neutral-600 px-4 py-2 rounded border border-neutral-200 hover:border-neutral-400 transition-colors">
                    Edit Response
                  </button>
                </>
              )}
              {review.status === "PENDING" && (
                <button className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Trigger AI Analysis
                </button>
              )}
              {review.status === "APPROVED" && (
                <span className="text-xs text-green-600">Published</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
