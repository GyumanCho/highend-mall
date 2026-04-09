import { describe, it, expect } from "vitest";
import { getCuratedEdit, getRelatedProducts } from "@/lib/recommendations";

describe("Recommendations", () => {
  describe("getCuratedEdit", () => {
    it("returns edit with title and narrative", () => {
      const edit = getCuratedEdit("GOLD");
      expect(edit.title).toBeTruthy();
      expect(edit.narrative).toBeTruthy();
      expect(edit.items.length).toBeGreaterThan(0);
    });

    it("differentiates title by tier", () => {
      const platinum = getCuratedEdit("PLATINUM");
      const gold = getCuratedEdit("GOLD");
      const silver = getCuratedEdit("SILVER");

      expect(platinum.title).not.toBe(gold.title);
      expect(gold.title).not.toBe(silver.title);
    });

    it("includes match reasons and styling notes", () => {
      const edit = getCuratedEdit("GOLD");
      for (const item of edit.items) {
        expect(item.matchReason).toBeTruthy();
        expect(item.stylingNote).toBeTruthy();
        expect(item.confidence).toBeGreaterThan(0);
        expect(item.confidence).toBeLessThanOrEqual(1);
      }
    });

    it("includes at least one discovery item", () => {
      const edit = getCuratedEdit("GOLD");
      const discoveryItems = edit.items.filter((i) => i.type === "discovery");
      expect(discoveryItems.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getRelatedProducts", () => {
    it("excludes the current product", () => {
      const related = getRelatedProducts("gucci-gg-marmont-small-shoulder-bag");
      const slugs = related.map((r) => r.product.slug);
      expect(slugs).not.toContain("gucci-gg-marmont-small-shoulder-bag");
    });

    it("returns max 3 items", () => {
      const related = getRelatedProducts("some-slug");
      expect(related.length).toBeLessThanOrEqual(3);
    });

    it("each item has a match reason", () => {
      const related = getRelatedProducts("gucci-gg-marmont-small-shoulder-bag");
      for (const item of related) {
        expect(item.matchReason).toBeTruthy();
      }
    });
  });
});
