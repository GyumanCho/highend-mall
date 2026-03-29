export type AgentName =
  | "luxury-product-curator"
  | "luxury-content-creator"
  | "vip-profile-analyzer"
  | "style-recommender"
  | "luxury-campaign-manager"
  | "customer-sentinel"
  | "luxury-qa-guardian";

export type PipelineType =
  | "product-listing"
  | "review-response"
  | "recommendation"
  | "campaign-design"
  | "search-optimization"
  | "churn-detection";

export type JobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface AgentJob {
  readonly id: string;
  readonly pipeline: PipelineType;
  readonly status: JobStatus;
  readonly agents: readonly AgentName[];
  readonly currentAgent: AgentName | null;
  readonly progress: number;
  readonly input: unknown;
  readonly output: unknown | null;
  readonly qaScore: number | null;
  readonly error: string | null;
  readonly createdAt: string;
  readonly completedAt: string | null;
}

export interface PipelineConfig {
  readonly type: PipelineType;
  readonly agents: readonly AgentName[];
  readonly description: string;
}

export const PIPELINES: Record<PipelineType, PipelineConfig> = {
  "product-listing": {
    type: "product-listing",
    agents: ["luxury-product-curator", "luxury-content-creator", "luxury-qa-guardian"],
    description: "Validate → Generate content → QA check",
  },
  "review-response": {
    type: "review-response",
    agents: ["customer-sentinel", "luxury-qa-guardian"],
    description: "Analyze review → QA check response",
  },
  recommendation: {
    type: "recommendation",
    agents: ["vip-profile-analyzer", "style-recommender", "luxury-qa-guardian"],
    description: "Profile → Recommend → QA check",
  },
  "campaign-design": {
    type: "campaign-design",
    agents: ["vip-profile-analyzer", "luxury-campaign-manager", "luxury-qa-guardian"],
    description: "Segment → Design campaign → QA check",
  },
  "search-optimization": {
    type: "search-optimization",
    agents: ["luxury-product-curator", "luxury-content-creator"],
    description: "Generate search tags → SEO keywords",
  },
  "churn-detection": {
    type: "churn-detection",
    agents: ["vip-profile-analyzer", "luxury-campaign-manager", "luxury-qa-guardian"],
    description: "Score churn risk → Retention campaign → QA check",
  },
};
