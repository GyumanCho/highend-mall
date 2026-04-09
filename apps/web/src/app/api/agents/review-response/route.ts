import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const ReviewResponseInput = z.object({
  reviewId: z.string().min(1),
  reviewText: z.string().min(1, "Review text is required"),
  rating: z.number().int().min(1).max(5),
  productName: z.string().min(1),
  customerTier: z.enum(["PLATINUM", "GOLD", "SILVER", "STANDARD"]).default("STANDARD"),
  customerAnnualSpend: z.number().optional(),
  previousComplaints: z.number().default(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = ReviewResponseInput.parse(body);

    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const job = {
      id: jobId,
      type: "REVIEW_RESPONSE" as const,
      status: "QUEUED" as const,
      input: {
        ...input,
        pipeline: [
          "review-concierge",
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
        message: "Review response pipeline queued. Agents will process: review-concierge → qa-guardian",
        estimatedTime: "~1 minute",
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
