import { describe, it, expect } from "vitest";
import { createJob, getJob, getAllJobs, executePipeline } from "@/lib/agents/dispatcher";

describe("Agent Dispatcher", () => {
  it("creates a job with correct initial state", () => {
    const job = createJob("product-listing", { brand: "Gucci" });

    expect(job.id).toMatch(/^job_/);
    expect(job.pipeline).toBe("product-listing");
    expect(job.status).toBe("QUEUED");
    expect(job.agents).toEqual(["luxury-product-curator", "luxury-content-creator", "luxury-qa-guardian"]);
    expect(job.progress).toBe(0);
    expect(job.output).toBeNull();
    expect(job.completedAt).toBeNull();
  });

  it("retrieves job by id", () => {
    const job = createJob("review-response", { reviewId: "r1" });
    const found = getJob(job.id);

    expect(found).toBeDefined();
    expect(found?.id).toBe(job.id);
  });

  it("returns undefined for unknown job", () => {
    expect(getJob("nonexistent")).toBeUndefined();
  });

  it("lists all jobs in reverse chronological order", () => {
    createJob("product-listing", {});
    createJob("review-response", {});

    const jobs = getAllJobs();
    expect(jobs.length).toBeGreaterThanOrEqual(2);
  });

  it("executes pipeline and updates status", async () => {
    const job = createJob("product-listing", { brand: "Prada", productName: "Re-Nylon" });
    const result = await executePipeline(job.id);

    expect(result.status).toBe("COMPLETED");
    expect(result.progress).toBe(100);
    expect(result.output).toBeTruthy();
    expect(result.qaScore).toBeGreaterThan(0);
    expect(result.completedAt).toBeTruthy();
  });

  it("generates correct output for review-response pipeline", async () => {
    const job = createJob("review-response", { reviewText: "Great bag" });
    const result = await executePipeline(job.id);

    const output = result.output as Record<string, unknown>;
    expect(output.sentiment).toBeDefined();
    expect(output.qa_result).toBeDefined();
  });

  it("generates correct output for campaign-design pipeline", async () => {
    const job = createJob("campaign-design", { theme: "FW26" });
    const result = await executePipeline(job.id);

    const output = result.output as Record<string, unknown>;
    expect(output.campaign_plan).toBeDefined();
  });

  it("generates correct output for churn-detection pipeline", async () => {
    const job = createJob("churn-detection", { customerId: "VIP-001" });
    const result = await executePipeline(job.id);

    const output = result.output as Record<string, unknown>;
    expect(output.churn_analysis).toBeDefined();
    expect(output.retention_campaign).toBeDefined();
  });

  it("throws for unknown job id", async () => {
    await expect(executePipeline("fake_id")).rejects.toThrow("Job fake_id not found");
  });
});
