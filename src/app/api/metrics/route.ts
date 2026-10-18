import { NextResponse, type NextRequest } from "next/server";
import { getMetrics } from "@/lib/data";
import { isRange } from "@/lib/types";
import type { MetricsResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rangeParam = searchParams.get("range") ?? undefined;
  const range = isRange(rangeParam) ? rangeParam : "12m";

  const body: MetricsResponse = { metrics: getMetrics(range) };
  return NextResponse.json(body);
}
