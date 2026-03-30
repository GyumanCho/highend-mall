import { describe, it, expect } from "vitest";
import { PIPELINES } from "@/lib/agents/types";

describe("Pipeline Configurations", () => {
  it("defines 6 pipeline types", () => {
    expect(Object.keys(PIPELINES)).toHaveLength(6);
  });

  it("product-listing has 3 agents in correct order", () => {
    const config = PIPELINES["product-listing"];
    expect(config.agents).toEqual([
      "luxury-product-curator",
      "luxury-content-creator",
      "luxury-qa-guardian",
    ]);
  });

  it("review-response has 2 agents", () => {
    expect(PIPELINES["review-response"].agents).toEqual([
      "customer-sentinel",
      "luxury-qa-guardian",
    ]);
  });

  it("recommendation has 3 agents", () => {
    expect(PIPELINES["recommendation"].agents).toEqual([
      "vip-profile-analyzer",
      "style-recommender",
      "luxury-qa-guardian",
    ]);
  });

  it("churn-detection has 3 agents", () => {
    expect(PIPELINES["churn-detection"].agents).toEqual([
      "vip-profile-analyzer",
      "luxury-campaign-manager",
      "luxury-qa-guardian",
    ]);
  });

  it("every pipeline has a description", () => {
    for (const [key, config] of Object.entries(PIPELINES)) {
      expect(config.description, `${key} missing description`).toBeTruthy();
    }
  });

  it("no pipeline has more than 4 agents", () => {
    for (const [key, config] of Object.entries(PIPELINES)) {
      expect(config.agents.length, `${key} has too many agents`).toBeLessThanOrEqual(4);
    }
  });
});
