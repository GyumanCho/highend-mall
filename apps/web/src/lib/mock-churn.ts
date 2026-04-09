export interface ChurnAlert {
  readonly id: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerTier: "PLATINUM" | "GOLD" | "SILVER";
  readonly riskScore: number;
  readonly riskLevel: "critical" | "high" | "medium";
  readonly riskFactors: readonly { readonly factor: string; readonly weight: number; readonly evidence: string }[];
  readonly predictedChurnWindow: string;
  readonly recommendedIntervention: string;
  readonly status: "pending" | "campaign_sent" | "recovered" | "churned";
  readonly detectedAt: string;
  readonly lastPurchaseDays: number;
  readonly annualSpend: number;
  readonly lifetimeValue: number;
}

export const MOCK_CHURN_ALERTS: readonly ChurnAlert[] = [
  {
    id: "churn-001",
    customerId: "VIP-2024-0891",
    customerName: "Soyeon Kim",
    customerTier: "GOLD",
    riskScore: 0.72,
    riskLevel: "high",
    riskFactors: [
      { factor: "declining_purchase_frequency", weight: 0.35, evidence: "2.5 → 0.8 orders/month QoQ" },
      { factor: "recency_gap", weight: 0.25, evidence: "Last purchase 68 days ago" },
      { factor: "campaign_disengagement", weight: 0.20, evidence: "3 consecutive campaigns unopened" },
    ],
    predictedChurnWindow: "30_days",
    recommendedIntervention: "personal_re_engagement",
    status: "pending",
    detectedAt: "2026-03-29",
    lastPurchaseDays: 68,
    annualSpend: 28000,
    lifetimeValue: 112000,
  },
  {
    id: "churn-002",
    customerId: "VIP-2024-1102",
    customerName: "Hyunwoo Choi",
    customerTier: "GOLD",
    riskScore: 0.65,
    riskLevel: "high",
    riskFactors: [
      { factor: "declining_purchase_frequency", weight: 0.35, evidence: "1.8 → 0.5 orders/month QoQ" },
      { factor: "high_return_rate", weight: 0.10, evidence: "45% return rate last 90 days" },
    ],
    predictedChurnWindow: "60_days",
    recommendedIntervention: "exclusive_offer",
    status: "campaign_sent",
    detectedAt: "2026-03-25",
    lastPurchaseDays: 73,
    annualSpend: 32000,
    lifetimeValue: 96000,
  },
  {
    id: "churn-003",
    customerId: "VIP-2024-0340",
    customerName: "Eunji Hwang",
    customerTier: "PLATINUM",
    riskScore: 0.85,
    riskLevel: "critical",
    riskFactors: [
      { factor: "declining_purchase_frequency", weight: 0.35, evidence: "4.0 → 0.5 orders/month QoQ" },
      { factor: "recency_gap", weight: 0.25, evidence: "Last purchase 92 days ago" },
      { factor: "campaign_disengagement", weight: 0.20, evidence: "5 consecutive campaigns unopened" },
      { factor: "browse_without_purchase", weight: 0.10, evidence: "8 visits, 0 purchases in 30 days" },
    ],
    predictedChurnWindow: "30_days",
    recommendedIntervention: "personal_outreach",
    status: "pending",
    detectedAt: "2026-03-28",
    lastPurchaseDays: 92,
    annualSpend: 68000,
    lifetimeValue: 340000,
  },
];

export function getPendingAlerts(): readonly ChurnAlert[] {
  return MOCK_CHURN_ALERTS.filter((a) => a.status === "pending");
}

export function getAtRiskRevenue(): number {
  return MOCK_CHURN_ALERTS
    .filter((a) => a.status === "pending" || a.status === "campaign_sent")
    .reduce((sum, a) => sum + a.annualSpend, 0);
}
