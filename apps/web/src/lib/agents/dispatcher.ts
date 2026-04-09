import {
  PIPELINES,
  type AgentJob,
  type PipelineType,
} from "./types";

// In-memory job store (replace with DB in production)
const jobs = new Map<string, AgentJob>();

function generateId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createJob(pipeline: PipelineType, input: unknown): AgentJob {
  const config = PIPELINES[pipeline];
  const job: AgentJob = {
    id: generateId(),
    pipeline,
    status: "QUEUED",
    agents: config.agents,
    currentAgent: null,
    progress: 0,
    input,
    output: null,
    qaScore: null,
    error: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): AgentJob | undefined {
  return jobs.get(id);
}

export function getAllJobs(): readonly AgentJob[] {
  return Array.from(jobs.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getJobsByPipeline(pipeline: PipelineType): readonly AgentJob[] {
  return getAllJobs().filter((j) => j.pipeline === pipeline);
}

function updateJob(id: string, updates: Partial<AgentJob>): AgentJob | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;
  const updated = { ...job, ...updates } as AgentJob;
  jobs.set(id, updated);
  return updated;
}

// Simulate pipeline execution (replace with real Claude API calls in production)
export async function executePipeline(jobId: string): Promise<AgentJob> {
  const job = jobs.get(jobId);
  if (!job) throw new Error(`Job ${jobId} not found`);

  updateJob(jobId, { status: "PROCESSING" });

  const totalAgents = job.agents.length;

  for (let i = 0; i < totalAgents; i++) {
    const agent = job.agents[i];
    updateJob(jobId, {
      currentAgent: agent,
      progress: Math.round(((i + 0.5) / totalAgents) * 100),
    });

    // Simulate agent processing time (300-800ms per agent)
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 500)
    );

    updateJob(jobId, {
      progress: Math.round(((i + 1) / totalAgents) * 100),
    });
  }

  // Generate mock output based on pipeline type
  const output = generateMockOutput(job.pipeline, job.input);

  return updateJob(jobId, {
    status: "COMPLETED",
    currentAgent: null,
    progress: 100,
    output,
    qaScore: 0.92 + Math.random() * 0.08,
    completedAt: new Date().toISOString(),
  }) as AgentJob;
}

function generateMockOutput(pipeline: PipelineType, input: unknown): unknown {
  const inp = input as Record<string, unknown>;

  switch (pipeline) {
    case "product-listing":
      return {
        curated_product: {
          brand: inp.brand ?? "Unknown",
          name: inp.productName ?? "Product",
          price_tier: "CORE",
          validation_status: "pass",
          luxury_compliance: true,
        },
        listing_content: {
          title_display: `${inp.productName} in Premium Materials`,
          description_hero: "A refined expression of contemporary luxury craftsmanship.",
          description_full: "AI-generated editorial description would appear here...",
          tags: ["luxury", "designer", "premium"],
        },
        qa_result: { status: "approved", checks_passed: 10, checks_total: 10 },
      };

    case "review-response":
      return {
        sentiment: { overall: "mixed", score: 0.45 },
        themes: [{ theme: "product_quality", sentiment: "positive" }],
        response_draft: "Thank you for sharing your experience...",
        qa_result: { status: "approved" },
      };

    case "campaign-design":
      return {
        campaign_plan: {
          name: "AI-Generated Campaign",
          segments: { platinum: 120, gold: 450 },
          content: { subject: "Your Exclusive Preview Awaits" },
        },
        qa_result: { status: "approved" },
      };

    case "churn-detection":
      return {
        churn_analysis: {
          risk_score: 0.72,
          risk_level: "high",
          recommended_intervention: "personal_re_engagement",
        },
        retention_campaign: {
          approach: "win_back",
          content: { subject: "Something special, reserved for you" },
        },
      };

    default:
      return { result: "completed" };
  }
}
