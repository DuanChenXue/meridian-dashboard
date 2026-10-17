import { NextResponse, type NextRequest } from "next/server";
import { getSubscriptions, delay, API_ERROR_MESSAGE } from "@/lib/data";
import type { SubscriptionsResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const scenario = searchParams.get("scenario");

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
    const body: SubscriptionsResponse = { subscriptions: [], total: 0 };
    return NextResponse.json(body);
  }

  const subscriptions = getSubscriptions();
  const body: SubscriptionsResponse = {
    subscriptions,
    total: subscriptions.length,
  };
  return NextResponse.json(body);
}
