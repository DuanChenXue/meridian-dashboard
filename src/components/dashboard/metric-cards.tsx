"use client";

import { MetricCard, MetricCardSkeleton } from "./metric-card";
import { SectionEmpty, SectionError } from "./states";
import type { Metric } from "@/lib/types";

interface MetricCardsProps {
  metrics: Metric[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function MetricCards({
  metrics,
  loading,
  error,
  onRetry,
}: MetricCardsProps) {
  if (loading) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-busy="true"
        aria-label="Loading metrics"
      >
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <SectionError
        title="Could not load metrics"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <SectionEmpty
        title="No metrics available"
        description="The metrics endpoint returned an empty list. Try refreshing the data."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
