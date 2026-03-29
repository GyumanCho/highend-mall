import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { createJob, executePipeline } from "@/lib/agents/dispatcher";

const DispatchInput = z.object({
  pipeline: z.enum([
    "product-listing",
    "review-response",
    "recommendation",
    "campaign-design",
    "search-optimization",
    "churn-detection",
  ]),
  input: z.record(z.string(), z.unknown()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pipeline, input } = DispatchInput.parse(body);

    const job = createJob(pipeline, input);

    // Execute pipeline asynchronously (fire and forget)
    executePipeline(job.id).catch(() => {
      // Error already captured in job status
    });

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        pipeline: job.pipeline,
        status: job.status,
        agents: job.agents,
        checkStatusUrl: `/api/agents/jobs/${job.id}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
