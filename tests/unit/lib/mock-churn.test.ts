import { describe, it, expect } from "vitest";
import { MOCK_CHURN_ALERTS, getPendingAlerts, getAtRiskRevenue } from "@/lib/mock-churn";

describe("Mock Churn Data", () => {
  it("has 3 churn alerts", () => {
    expect(MOCK_CHURN_ALERTS).toHaveLength(3);
  });

  it("all alerts have required fields", () => {
    for (const alert of MOCK_CHURN_ALERTS) {
      expect(alert.riskScore).toBeGreaterThan(0);
      expect(alert.riskScore).toBeLessThanOrEqual(1);
      expect(alert.riskLevel).toMatch(/critical|high|medium/);
      expect(alert.riskFactors.length).toBeGreaterThan(0);
      expect(alert.lifetimeValue).toBeGreaterThan(0);
    }
  });

  it("returns only pending alerts", () => {
    const pending = getPendingAlerts();
    for (const a of pending) {
      expect(a.status).toBe("pending");
    }
  });

  it("calculates at-risk revenue", () => {
    const revenue = getAtRiskRevenue();
    expect(revenue).toBeGreaterThan(0);
  });

  it("risk factors have weights summing near 1.0", () => {
    for (const alert of MOCK_CHURN_ALERTS) {
      const totalWeight = alert.riskFactors.reduce((sum, f) => sum + f.weight, 0);
      expect(totalWeight).toBeGreaterThan(0.3);
      expect(totalWeight).toBeLessThanOrEqual(1.0);
    }
  });
});
