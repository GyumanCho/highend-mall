import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const ProductListingInput = z.object({
  brand: z.string().min(1, "Brand is required"),
  productName: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be positive"),
  currency: z.enum(["USD", "KRW", "EUR", "JPY"]).default("USD"),
  category: z.enum(["BAGS", "RTW", "SHOES", "ACCESSORIES", "JEWELRY", "BEAUTY"]),
  description: z.string().optional(),
  materials: z.string().optional(),
  images: z.array(z.string().url()).min(1, "At least 1 image required"),
  collection: z.string().optional(),
  sku: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = ProductListingInput.parse(body);

    // TODO: In production, dispatch to BullMQ queue
    // For now, return the job reference for the AI pipeline:
    // luxury-product-curator → luxury-content-creator → luxury-qa-guardian

    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Simulate job creation
    const job = {
      id: jobId,
      type: "PRODUCT_LISTING" as const,
      status: "QUEUED" as const,
      input: {
        ...input,
        pipeline: [
          "luxury-product-curator",
          "luxury-content-creator",
          "luxury-qa-guardian",
        ],
      },
      createdAt: new Date().toISOString(),
    };

    // TODO: Replace with actual queue dispatch:
    // await agentQueue.add('product-listing', {
    //   jobId: job.id,
    //   input: job.input,
    // });

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        message: "Product listing pipeline queued. Agents will process: curator → content-creator → qa-guardian",
        estimatedTime: "~2 minutes",
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
