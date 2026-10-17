import { headers } from "next/headers";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isRange, isScenario } from "@/lib/types";
import type { DashboardData, DashboardErrors } from "@/lib/api";
import type { Metric, Subscription, TrendPoint } from "@/lib/types";

// The dashboard reads `headers()` and `searchParams` and performs server-side
// fetches, so it must render per-request rather than be statically prerendered.
export const instant = false;

interface PageProps {
  searchParams: Promise<{ scenario?: string; range?: string }>;
}

async function safeFetch<T>(
  url: string,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const body = await res.json();
        if (body?.error?.message) message = body.error.message as string;
      } catch {
        // body was not JSON — keep generic message
      }
      return { data: null, error: message };
    }
    return { data: (await res.json()) as T, error: null };
  } catch {
    return { data: null, error: "Network error while contacting the API" };
  }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const scenario = isScenario(params.scenario) ? params.scenario : "live";
  const range = isRange(params.range) ? params.range : "12m";

  // Server Components cannot use relative URLs, so resolve the absolute base
  // from request headers. Works in dev, preview deploys, and on Vercel
  // (x-forwarded-proto / host are set by the platform).
  const headerList = await headers();
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const host = headerList.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;
  const query = `scenario=${scenario}&range=${range}`;

  const [metrics, trend, subscriptions] = await Promise.all([
    safeFetch<{ metrics: Metric[] }>(`${base}/api/metrics?${query}`),
    safeFetch<{ points: TrendPoint[] }>(`${base}/api/trend?${query}`),
    safeFetch<{ subscriptions: Subscription[] }>(
      `${base}/api/subscriptions?${query}`,
    ),
  ]);

  const data: DashboardData = {
    metrics: metrics.data?.metrics ?? null,
    trend: trend.data?.points ?? null,
    subscriptions: subscriptions.data?.subscriptions ?? null,
  };
  const errors: DashboardErrors = {
    metrics: metrics.error,
    trend: trend.error,
    subscriptions: subscriptions.error,
  };

  return (
    <DashboardShell
      initialData={data}
      initialErrors={errors}
      initialScenario={scenario}
      initialRange={range}
    />
  );
}
