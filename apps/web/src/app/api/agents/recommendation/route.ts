import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const RecommendationInput = z.object({
  customerId: z.string().min(1),
  context: z.enum(["HOMEPAGE", "CATEGORY_BROWSE", "POST_PURCHASE", "CAMPAIGN", "SEASONAL"]).default("HOMEPAGE"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = RecommendationInput.parse(body);

    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const job = {
      id: jobId,
      type: "RECOMMENDATION" as const,
      status: "QUEUED" as const,
      input: {
        ...input,
        pipeline: [
          "vip-profile-analyzer",
          "style-recommender",
          "luxury-qa-guardian",
        ],
      },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: "Recommendation pipeline queued. Agents: profile-analyzer → style-recommender → qa-guardian",
        estimatedTime: "~30 seconds",
        checkStatusUrl: `/api/agents/jobs/${job.id}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
