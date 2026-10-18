import { NextResponse, type NextRequest } from "next/server";
import { getTrendSeries } from "@/lib/data";
import { isRange } from "@/lib/types";
import type { Range, TrendResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rangeParam = searchParams.get("range") ?? undefined;
  const range: Range = isRange(rangeParam) ? rangeParam : "12m";

  const body: TrendResponse = { range, points: getTrendSeries(range) };
  return NextResponse.json(body);
}
