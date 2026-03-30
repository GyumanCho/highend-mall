import { describe, it, expect } from "vitest";
import {
  MOCK_REVIEWS,
  getReviewsByProduct,
  getPendingReviews,
  getAverageRating,
} from "@/lib/mock-reviews";

describe("Mock Reviews", () => {
  it("has 4 reviews", () => {
    expect(MOCK_REVIEWS).toHaveLength(4);
  });

  it("all reviews have sentiment analysis", () => {
    for (const r of MOCK_REVIEWS) {
      expect(r.sentiment).toBeDefined();
      expect(r.sentiment.overall).toMatch(/positive|negative|mixed|neutral/);
      expect(r.sentiment.score).toBeGreaterThanOrEqual(-1);
      expect(r.sentiment.score).toBeLessThanOrEqual(1);
    }
  });

  it("filters reviews by product", () => {
    const reviews = getReviewsByProduct("gucci-gg-marmont-small-shoulder-bag");
    expect(reviews.length).toBeGreaterThan(0);
    for (const r of reviews) {
      expect(r.productSlug).toBe("gucci-gg-marmont-small-shoulder-bag");
    }
  });

  it("returns pending reviews (not APPROVED)", () => {
    const pending = getPendingReviews();
    for (const r of pending) {
      expect(r.status).not.toBe("APPROVED");
    }
  });

  it("calculates average rating", () => {
    const avg = getAverageRating("gucci-gg-marmont-small-shoulder-bag");
    expect(avg).toBe(4);
  });

  it("returns 0 for unknown product", () => {
    expect(getAverageRating("nonexistent")).toBe(0);
  });
});
