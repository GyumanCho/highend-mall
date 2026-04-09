const MOCK_CAMPAIGNS = [
  {
    id: "c1",
    name: "Autumn Atelier: Private Preview",
    type: "PRIVATE_SALE",
    status: "ACTIVE",
    startAt: "2026-09-13",
    endAt: "2026-09-22",
    segments: { platinum: 120, gold: 450 },
    kpis: { openRate: 0.48, clickRate: 0.21, revenue: 285000 },
  },
  {
    id: "c2",
    name: "FW26 Collection Launch",
    type: "COLLECTION_LAUNCH",
    status: "SCHEDULED",
    startAt: "2026-10-01",
    endAt: "2026-10-15",
    segments: { platinum: 120, gold: 450, silver: 1200 },
    kpis: null,
  },
  {
    id: "c3",
    name: "Holiday Gift Guide",
    type: "BRAND_PARTNERSHIP",
    status: "DRAFT",
    startAt: null,
    endAt: null,
    segments: {},
    kpis: null,
  },
] as const;

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-neutral-100 text-neutral-500",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AdminCampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <button className="bg-neutral-900 text-white px-6 py-2.5 text-sm rounded hover:bg-neutral-800 transition-colors">
          + New Campaign (AI Pipeline)
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_CAMPAIGNS.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium">{campaign.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {campaign.type.replace("_", " ")}
                  {campaign.startAt && ` · ${campaign.startAt} — ${campaign.endAt}`}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[campaign.status]}`}
              >
                {campaign.status}
              </span>
            </div>

            {/* Segments */}
            {Object.keys(campaign.segments).length > 0 && (
              <div className="flex gap-4 mb-4">
                {Object.entries(campaign.segments).map(([tier, count]) => (
                  <div key={tier} className="text-center">
                    <p className="text-lg font-semibold">{count}</p>
                    <p className="text-xs text-neutral-400 capitalize">{tier}</p>
                  </div>
                ))}
              </div>
            )}

            {/* KPIs */}
            {campaign.kpis && (
              <div className="flex gap-6 pt-4 border-t border-neutral-100">
                <div>
                  <p className="text-sm font-medium">
                    {(campaign.kpis.openRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-neutral-400">Open Rate</p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {(campaign.kpis.clickRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-neutral-400">Click Rate</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">
                    {formatCurrency(campaign.kpis.revenue)}
                  </p>
                  <p className="text-xs text-neutral-400">Revenue</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-100">
              {campaign.status === "DRAFT" && (
                <button className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Generate with AI
                </button>
              )}
              {campaign.status === "SCHEDULED" && (
                <button className="text-xs bg-white text-neutral-600 px-4 py-2 rounded border border-neutral-200 hover:border-neutral-400 transition-colors">
                  Edit Campaign
                </button>
              )}
              {campaign.status === "ACTIVE" && (
                <button className="text-xs bg-white text-neutral-600 px-4 py-2 rounded border border-neutral-200 hover:border-neutral-400 transition-colors">
                  View Performance
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
