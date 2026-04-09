import { describe, it, expect } from "vitest";
import { BRAND_STORIES, getBrandStory } from "@/lib/brand-stories";

describe("Brand Stories", () => {
  it("has stories for all 5 brands", () => {
    expect(BRAND_STORIES).toHaveLength(5);
  });

  it("each story has required fields", () => {
    for (const story of BRAND_STORIES) {
      expect(story.brandSlug).toBeTruthy();
      expect(story.headline).toBeTruthy();
      expect(story.subheadline).toBeTruthy();
      expect(story.story.length).toBeGreaterThan(100);
      expect(story.milestones.length).toBeGreaterThanOrEqual(3);
      expect(story.values.length).toBeGreaterThanOrEqual(2);
      expect(story.signatureElements.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("finds story by slug", () => {
    const story = getBrandStory("gucci");
    expect(story).toBeDefined();
    expect(story?.headline).toContain("Florentine");
  });

  it("returns undefined for unknown brand", () => {
    expect(getBrandStory("unknown")).toBeUndefined();
  });
});
