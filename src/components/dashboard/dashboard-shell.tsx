"use client";

import * as React from "react";
import { AppTopbar } from "@/components/app-topbar";
import { MetricCards } from "./metric-cards";
import { TrendChart } from "./trend-chart";
import { SubscriptionsTable } from "./subscriptions-table";
import { fetchDashboard, type DashboardData, type DashboardErrors } from "@/lib/api";
import type { Range } from "@/lib/types";

interface DashboardShellProps {
  initialData: DashboardData;
  initialErrors: DashboardErrors;
  initialRange: Range;
}

export function DashboardShell({
  initialData,
  initialErrors,
  initialRange,
}: DashboardShellProps) {
  const [range, setRange] = React.useState<Range>(initialRange);
  const [data, setData] = React.useState<DashboardData>(initialData);
  const [errors, setErrors] = React.useState<DashboardErrors>(initialErrors);
  const [loading, setLoading] = React.useState(false);

  // Guards against stale responses when the user flips the range quickly.
  const requestSeq = React.useRef(0);

  const load = React.useCallback(async (rg: Range) => {
    const id = ++requestSeq.current;
    setLoading(true);
    try {
      const result = await fetchDashboard(rg);
      if (id !== requestSeq.current) return;
      setData(result.data);
      setErrors(result.errors);
    } finally {
      if (id === requestSeq.current) setLoading(false);
    }
  }, []);

  // Refetch whenever the range changes — but not on first mount, because the
  // server already provided the initial dataset.
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    void load(range);
  }, [range, load]);

  const handleRefresh = React.useCallback(() => {
    void load(range);
  }, [range, load]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <AppTopbar
        range={range}
        onRangeChange={setRange}
        loading={loading}
        onRefresh={handleRefresh}
      />
      <main className="flex-1 space-y-6 p-4 sm:p-6">
        <MetricCards
          metrics={data.metrics}
          loading={loading}
          error={errors.metrics}
          onRetry={handleRefresh}
        />
        <TrendChart
          points={data.trend}
          loading={loading}
          error={errors.trend}
          onRetry={handleRefresh}
          range={range}
        />
        <SubscriptionsTable
          subscriptions={data.subscriptions}
          loading={loading}
          error={errors.subscriptions}
          onRetry={handleRefresh}
        />
      </main>
    </div>
  );
}
