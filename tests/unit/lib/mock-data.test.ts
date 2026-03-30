import { describe, it, expect } from "vitest";
import {
  MOCK_PRODUCTS,
  MOCK_BRANDS,
  getProducts,
  getProductBySlug,
  getBrandBySlug,
  getProductsByBrand,
  formatPrice,
} from "@/lib/mock-data";

describe("Mock Data", () => {
  it("has 5 brands", () => {
    expect(MOCK_BRANDS).toHaveLength(5);
  });

  it("has 5 products", () => {
    expect(MOCK_PRODUCTS).toHaveLength(5);
  });

  it("all products have required fields", () => {
    for (const p of MOCK_PRODUCTS) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.priceUsd).toBeGreaterThan(0);
      expect(p.brand).toBeDefined();
    }
  });

  describe("getProducts", () => {
    it("returns all products without filters", () => {
      expect(getProducts()).toHaveLength(5);
    });

    it("filters by category", () => {
      const bags = getProducts({ category: "BAGS" });
      expect(bags.length).toBeGreaterThan(0);
      for (const p of bags) {
        expect(p.category).toBe("BAGS");
      }
    });

    it("filters by brand", () => {
      const gucci = getProducts({ brandSlug: "gucci" });
      expect(gucci.length).toBeGreaterThan(0);
      for (const p of gucci) {
        expect(p.brand.slug).toBe("gucci");
      }
    });

    it("returns empty for nonexistent category", () => {
      expect(getProducts({ category: "WATCHES" })).toHaveLength(0);
    });
  });

  describe("getProductBySlug", () => {
    it("finds existing product", () => {
      const product = getProductBySlug("gucci-gg-marmont-small-shoulder-bag");
      expect(product).toBeDefined();
      expect(product?.name).toBe("GG Marmont Small Shoulder Bag");
    });

    it("returns undefined for unknown slug", () => {
      expect(getProductBySlug("nonexistent")).toBeUndefined();
    });
  });

  describe("getBrandBySlug", () => {
    it("finds existing brand", () => {
      const brand = getBrandBySlug("bottega-veneta");
      expect(brand).toBeDefined();
      expect(brand?.name).toBe("Bottega Veneta");
    });
  });

  describe("getProductsByBrand", () => {
    it("returns products for a brand", () => {
      const products = getProductsByBrand("gucci");
      expect(products.length).toBeGreaterThan(0);
    });

    it("returns empty for unknown brand", () => {
      expect(getProductsByBrand("unknown")).toHaveLength(0);
    });
  });

  describe("formatPrice", () => {
    it("formats USD", () => {
      expect(formatPrice(2350, "USD")).toBe("$2,350");
    });

    it("formats KRW", () => {
      expect(formatPrice(3120000, "KRW")).toBe("₩3,120,000");
    });

    it("defaults to USD", () => {
      expect(formatPrice(495)).toMatch(/\$495/);
    });
  });
});
