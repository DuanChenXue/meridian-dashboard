export type Range = "7d" | "30d" | "12m";
export type Scenario = "live" | "loading" | "empty" | "error";

export type MetricFormat = "currency" | "number" | "percent";

export interface Metric {
  id: string;
  label: string;
  value: number;
  format: MetricFormat;
  /** signed change vs the comparison window */
  delta: number;
  /** unit for the delta: percent change or percentage points */
  deltaUnit: "%" | "pts";
  comparisonLabel: string;
  spark: number[];
}

export interface TrendPoint {
  period: string;
  newMrr: number;
  expansionMrr: number;
  /** negative value, rendered below the axis */
  churnedMrr: number;
  totalMrr: number;
}

export type Plan = "Starter" | "Growth" | "Enterprise";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export interface Subscription {
  id: string;
  company: string;
  plan: Plan;
  mrr: number;
  status: SubscriptionStatus;
  /** 0-100 customer health score */
  health: number;
  seats: number;
  /** ISO date (yyyy-mm-dd) */
  startDate: string;
}

export interface MetricsResponse {
  metrics: Metric[];
}

export interface TrendResponse {
  range: Range;
  points: TrendPoint[];
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
}

export const SCENARIOS: Scenario[] = ["live", "loading", "empty", "error"];
export const RANGES: Range[] = ["7d", "30d", "12m"];

export function isScenario(value: string | undefined): value is Scenario {
  return !!value && (SCENARIOS as string[]).includes(value);
}

export function isRange(value: string | undefined): value is Range {
  return !!value && (RANGES as string[]).includes(value);
}
