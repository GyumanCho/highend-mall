"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Settings</h1>

      <div className="space-y-8">
        {/* VIP Tier Thresholds */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="font-semibold mb-6">VIP Tier Thresholds</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { tier: "Platinum", value: "50000" },
              { tier: "Gold", value: "15000" },
              { tier: "Silver", value: "3000" },
            ].map((item) => (
              <div key={item.tier}>
                <label className="block text-xs font-medium text-neutral-500 uppercase mb-2">
                  {item.tier} (Annual USD)
                </label>
                <input
                  type="number"
                  defaultValue={item.value}
                  className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Configuration */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="font-semibold mb-6">AI Agent Configuration</h2>
          <div className="space-y-4">
            {[
              { agent: "luxury-product-curator", model: "sonnet", desc: "Product validation & normalization" },
              { agent: "luxury-content-creator", model: "opus", desc: "Premium content generation" },
              { agent: "customer-sentinel", model: "opus", desc: "Review + Order + Behavior monitoring" },
              { agent: "vip-profile-analyzer", model: "sonnet", desc: "Customer profiling & churn detection" },
              { agent: "style-recommender", model: "opus", desc: "Personalized recommendations" },
              { agent: "luxury-campaign-manager", model: "sonnet", desc: "Campaign design & retention" },
              { agent: "luxury-qa-guardian", model: "sonnet", desc: "Quality gate for all outputs" },
            ].map((item) => (
              <div key={item.agent} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{item.agent}</p>
                  <p className="text-xs text-neutral-400">{item.desc}</p>
                </div>
                <select
                  defaultValue={item.model}
                  className="border border-neutral-200 rounded px-3 py-1.5 text-sm focus:border-neutral-400 focus:outline-none"
                >
                  <option value="haiku">Haiku (Fast)</option>
                  <option value="sonnet">Sonnet (Balanced)</option>
                  <option value="opus">Opus (Best)</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Management */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="font-semibold mb-6">Canonical Brand Names</h2>
          <p className="text-sm text-neutral-500 mb-4">
            AI agents verify product brand names against this list. Unrecognized brands are rejected.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Gucci", "Bottega Veneta", "Celine", "The Row", "Jacquemus", "Hermes", "Chanel", "Louis Vuitton", "Dior", "Prada"].map((brand) => (
              <span key={brand} className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded flex items-center gap-2">
                {brand}
                <button className="text-neutral-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add new brand..."
              className="flex-1 border border-neutral-200 rounded px-4 py-2 text-sm focus:border-neutral-400 focus:outline-none"
            />
            <button className="bg-neutral-900 text-white px-4 py-2 text-sm rounded hover:bg-neutral-800">
              Add
            </button>
          </div>
        </div>

        {/* Churn Detection Thresholds */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="font-semibold mb-6">Churn Detection Thresholds</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Days Since Purchase (High Risk)", value: "60" },
              { label: "Days Since Purchase (Critical)", value: "90" },
              { label: "Frequency Decline % (High Risk)", value: "30" },
              { label: "Frequency Decline % (Critical)", value: "50" },
            ].map((item) => (
              <div key={item.label}>
                <label className="block text-xs font-medium text-neutral-500 mb-2">
                  {item.label}
                </label>
                <input
                  type="number"
                  defaultValue={item.value}
                  className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-neutral-900 text-white px-8 py-3 text-sm rounded hover:bg-neutral-800 transition-colors"
        >
          {saved ? "Settings Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
