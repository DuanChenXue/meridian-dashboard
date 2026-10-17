import type {
  Metric,
  Range,
  Scenario,
  Subscription,
  TrendPoint,
} from "./types";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message as string;
    } catch {
      // response body was not JSON — keep the generic message
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

export interface DashboardData {
  metrics: Metric[] | null;
  trend: TrendPoint[] | null;
  subscriptions: Subscription[] | null;
}

export interface DashboardErrors {
  metrics: string | null;
  trend: string | null;
  subscriptions: string | null;
}

export function buildQuery(scenario: Scenario, range: Range): string {
  return `scenario=${scenario}&range=${range}`;
}

export async function fetchDashboard(
  scenario: Scenario,
  range: Range,
): Promise<{ data: DashboardData; errors: DashboardErrors }> {
  const q = buildQuery(scenario, range);
  const [metrics, trend, subscriptions] = await Promise.allSettled([
    getJson<{ metrics: Metric[] }>(`/api/metrics?${q}`),
    getJson<{ range: Range; points: TrendPoint[] }>(`/api/trend?${q}`),
    getJson<{ subscriptions: Subscription[]; total: number }>(
      `/api/subscriptions?${q}`,
    ),
  ]);

  return {
    data: {
      metrics: metrics.status === "fulfilled" ? metrics.value.metrics : null,
      trend: trend.status === "fulfilled" ? trend.value.points : null,
      subscriptions:
        subscriptions.status === "fulfilled"
          ? subscriptions.value.subscriptions
          : null,
    },
    errors: {
      metrics: metrics.status === "rejected" ? metrics.reason.message : null,
      trend: trend.status === "rejected" ? trend.reason.message : null,
      subscriptions:
        subscriptions.status === "rejected"
          ? subscriptions.reason.message
          : null,
    },
  };
}
