import { describe, it, expect } from "vitest";
import {
  getCollections,
  getCollectionBySlug,
  getCollectionProducts,
  MOCK_COLLECTIONS,
} from "@/lib/mock-collections";

describe("Mock Collections", () => {
  it("has 3 collections", () => {
    expect(MOCK_COLLECTIONS).toHaveLength(3);
    expect(getCollections()).toHaveLength(3);
  });

  it("finds collection by slug", () => {
    const col = getCollectionBySlug("fw26");
    expect(col).toBeDefined();
    expect(col?.name).toBe("Fall/Winter 2026");
  });

  it("returns undefined for unknown slug", () => {
    expect(getCollectionBySlug("nonexistent")).toBeUndefined();
  });

  it("resolves product slugs to products", () => {
    const col = getCollectionBySlug("fw26");
    if (!col) throw new Error("Collection not found");

    const products = getCollectionProducts(col);
    expect(products.length).toBeGreaterThan(0);
    expect(products.length).toBeLessThanOrEqual(col.productSlugs.length);
  });
});
