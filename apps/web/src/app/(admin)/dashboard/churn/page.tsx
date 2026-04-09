"use client";

import { useState } from "react";
import { MOCK_CHURN_ALERTS, getAtRiskRevenue } from "@/lib/mock-churn";
import { AiPipelineModal } from "@/components/admin/ai-pipeline-modal";

const RISK_STYLES = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-amber-100 text-amber-700 border-amber-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
} as const;

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  campaign_sent: "bg-blue-100 text-blue-700",
  recovered: "bg-green-100 text-green-700",
  churned: "bg-red-100 text-red-700",
} as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
}

export default function ChurnDashboardPage() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [showRetention, setShowRetention] = useState(false);

  const atRiskRevenue = getAtRiskRevenue();
  const criticalCount = MOCK_CHURN_ALERTS.filter((a) => a.riskLevel === "critical").length;
  const highCount = MOCK_CHURN_ALERTS.filter((a) => a.riskLevel === "high").length;
  const pendingCount = MOCK_CHURN_ALERTS.filter((a) => a.status === "pending").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Churn Detection</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <p className="text-3xl font-semibold text-red-600">{criticalCount}</p>
          <p className="text-sm text-neutral-500">Critical Risk</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <p className="text-3xl font-semibold text-amber-600">{highCount}</p>
          <p className="text-sm text-neutral-500">High Risk</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <p className="text-3xl font-semibold">{pendingCount}</p>
          <p className="text-sm text-neutral-500">Pending Action</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <p className="text-3xl font-semibold text-red-600">{formatCurrency(atRiskRevenue)}</p>
          <p className="text-sm text-neutral-500">At-Risk Annual Revenue</p>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {MOCK_CHURN_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-lg border p-6 ${
              alert.riskLevel === "critical" ? "border-red-200" : "border-neutral-200"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${RISK_STYLES[alert.riskLevel]}`}>
                  {alert.riskLevel.toUpperCase()}
                </span>
                <div>
                  <p className="font-medium">{alert.customerName}</p>
                  <p className="text-xs text-neutral-400">
                    {alert.customerTier} · LTV {formatCurrency(alert.lifetimeValue)} · Last purchase {alert.lastPurchaseDays}d ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[alert.status]}`}>
                  {alert.status.replace("_", " ")}
                </span>
                <span className="text-sm font-medium">
                  Risk: {(alert.riskScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {alert.riskFactors.map((f) => (
                <span
                  key={f.factor}
                  className="text-xs bg-neutral-50 border border-neutral-100 px-2 py-1 rounded"
                  title={f.evidence}
                >
                  {f.factor.replace(/_/g, " ")} ({(f.weight * 100).toFixed(0)}%)
                </span>
              ))}
            </div>

            {/* Evidence */}
            <div className="bg-neutral-50 rounded p-3 mb-4">
              {alert.riskFactors.map((f) => (
                <p key={f.factor} className="text-xs text-neutral-600">
                  <span className="font-medium">{f.factor.replace(/_/g, " ")}:</span> {f.evidence}
                </p>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {alert.status === "pending" && (
                <>
                  <button
                    onClick={() => { setSelectedAlert(alert.id); setShowRetention(true); }}
                    className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Generate Retention Campaign (AI)
                  </button>
                  {alert.riskLevel === "critical" && (
                    <button className="text-xs bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Assign to Client Advisor
                    </button>
                  )}
                </>
              )}
              {alert.status === "campaign_sent" && (
                <span className="text-xs text-blue-600">Campaign sent — tracking engagement</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Retention Campaign Modal */}
      <AiPipelineModal
        isOpen={showRetention}
        onClose={() => setShowRetention(false)}
        pipeline="churn-detection"
        title="Generate Retention Campaign"
      >
        <div className="space-y-4 mb-6">
          <div className="bg-neutral-50 p-4 rounded">
            <p className="text-xs font-medium text-neutral-500 mb-2">Customer Context</p>
            {selectedAlert && (() => {
              const alert = MOCK_CHURN_ALERTS.find((a) => a.id === selectedAlert);
              if (!alert) return null;
              return (
                <div className="text-sm space-y-1">
                  <p><span className="text-neutral-500">Customer:</span> {alert.customerName} ({alert.customerTier})</p>
                  <p><span className="text-neutral-500">Risk:</span> {(alert.riskScore * 100).toFixed(0)}% — {alert.riskLevel}</p>
                  <p><span className="text-neutral-500">Last purchase:</span> {alert.lastPurchaseDays} days ago</p>
                  <p><span className="text-neutral-500">Annual spend:</span> {formatCurrency(alert.annualSpend)}</p>
                  <input type="hidden" name="customerId" value={alert.customerId} />
                  <input type="hidden" name="customerTier" value={alert.customerTier} />
                  <input type="hidden" name="riskLevel" value={alert.riskLevel} />
                </div>
              );
            })()}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">Intervention Type</label>
            <select name="intervention" className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none">
              <option value="personal_re_engagement">Personal Re-engagement</option>
              <option value="exclusive_offer">Exclusive Preview/Offer</option>
              <option value="vip_event">VIP Event Invitation</option>
              <option value="style_refresh">Style Refresh Consultation</option>
            </select>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 text-sm rounded hover:bg-blue-700">
          Generate with AI
        </button>
        <p className="text-xs text-neutral-400 text-center mt-3">
          Pipeline: profile-analyzer → campaign-manager → qa-guardian
        </p>
      </AiPipelineModal>
    </div>
  );
}
