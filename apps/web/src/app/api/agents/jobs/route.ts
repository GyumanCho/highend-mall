import { NextResponse } from "next/server";
import { getAllJobs } from "@/lib/agents/dispatcher";

export async function GET() {
  const jobs = getAllJobs();
  return NextResponse.json({ success: true, data: jobs });
}
