"use client";

import { useState } from "react";
import { getReviewsByProduct } from "@/lib/mock-reviews";

interface ProductReviewsProps {
  readonly productSlug: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-accent" : "text-muted"}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

export function ProductReviews({ productSlug }: ProductReviewsProps) {
  const reviews = getReviewsByProduct(productSlug);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [textError, setTextError] = useState("");

  const approvedReviews = reviews.filter((r) => r.status === "APPROVED");

  return (
    <section className="border-t border-muted py-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-3xl">
            Client Reviews ({approvedReviews.length})
          </h2>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="text-sm tracking-widest uppercase border-b border-primary pb-1 hover:border-accent transition-colors"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {/* Review Form */}
        {showForm && !submitted && (
          <div className="mb-12 p-8 bg-surface">
            <h3 className="text-xs tracking-widest uppercase mb-6">
              Share Your Experience
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-secondary mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`text-2xl transition-colors ${
                        star <= (hoverRating || selectedRating)
                          ? "text-accent"
                          : "text-muted"
                      }`}
                    >
                      &#9733;
                    </button>
                  ))}
                  {selectedRating > 0 && (
                    <span className="text-sm text-secondary ml-2 self-center">
                      {selectedRating}/5
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-secondary mb-2">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    if (e.target.value.length >= 20) setTextError("");
                  }}
                  className={`w-full border px-4 py-3 text-sm bg-transparent focus:outline-none transition-colors resize-none ${
                    textError ? "border-red-400" : "border-muted focus:border-primary"
                  }`}
                  placeholder="Share your thoughts on craftsmanship, quality, and experience... (min 20 characters)"
                />
                {textError && <p className="text-xs text-red-500 mt-1">{textError}</p>}
                <p className="text-xs text-secondary mt-1">{reviewText.length}/20 min characters</p>
              </div>
              <button
                onClick={() => {
                  if (selectedRating === 0) return;
                  if (reviewText.length < 20) {
                    setTextError("Please write at least 20 characters");
                    return;
                  }
                  setSubmitted(true);
                  setShowForm(false);
                }}
                disabled={selectedRating === 0}
                className="bg-primary text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="mb-12 p-8 bg-surface text-center">
            <p className="text-sm text-secondary">
              Thank you for your review. Our team will review and publish it shortly.
            </p>
          </div>
        )}

        {/* Review List */}
        {approvedReviews.length > 0 ? (
          <div className="space-y-0">
            {approvedReviews.map((review) => (
              <div key={review.id} className="py-8 border-b border-muted last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} />
                    <span className="text-sm">{review.customerName}</span>
                  </div>
                  <span className="text-xs text-secondary">{review.date}</span>
                </div>
                <p className="text-sm text-secondary leading-relaxed mb-4">
                  {review.text}
                </p>
                {review.aiResponse && (
                  <div className="ml-6 pl-6 border-l border-accent/30">
                    <p className="text-xs tracking-widest uppercase text-accent mb-2">
                      Maison Response
                    </p>
                    <div className="text-sm text-secondary leading-relaxed whitespace-pre-line">
                      {review.aiResponse}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-secondary text-sm py-8">
            Be the first to share your experience with this piece.
          </p>
        )}
      </div>
    </section>
  );
}
