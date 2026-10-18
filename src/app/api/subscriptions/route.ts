import { NextResponse } from "next/server";
import { getSubscriptions } from "@/lib/data";
import type { SubscriptionsResponse } from "@/lib/types";

export async function GET() {
  const subscriptions = getSubscriptions();
  const body: SubscriptionsResponse = {
    subscriptions,
    total: subscriptions.length,
  };
  return NextResponse.json(body);
}
