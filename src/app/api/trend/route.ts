import { NextResponse, type NextRequest } from "next/server";
import { getTrendSeries, delay, API_ERROR_MESSAGE } from "@/lib/data";
import { isRange } from "@/lib/types";
import type { Range, TrendResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const scenario = searchParams.get("scenario");
  const rangeParam = searchParams.get("range") ?? undefined;
  const range: Range = isRange(rangeParam) ? rangeParam : "12m";

  if (scenario === "error") {
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message: API_ERROR_MESSAGE,
        },
      },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }

  if (scenario === "loading") {
    await delay(1600);
  }

  if (scenario === "empty") {
    const body: TrendResponse = { range, points: [] };
    return NextResponse.json(body);
  }

  const body: TrendResponse = { range, points: getTrendSeries(range) };
  return NextResponse.json(body);
}
