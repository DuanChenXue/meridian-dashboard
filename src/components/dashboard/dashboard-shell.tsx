"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { DemoControls } from "./demo-controls";
import { MetricCards } from "./metric-cards";
import { TrendChart } from "./trend-chart";
import { SubscriptionsTable } from "./subscriptions-table";
import { fetchDashboard, type DashboardData, type DashboardErrors } from "@/lib/api";
import type { Range, Scenario } from "@/lib/types";

interface DashboardShellProps {
  initialData: DashboardData;
  initialErrors: DashboardErrors;
  initialScenario: Scenario;
  initialRange: Range;
}

export function DashboardShell({
  initialData,
  initialErrors,
  initialScenario,
  initialRange,
}: DashboardShellProps) {
  const [scenario, setScenario] = React.useState<Scenario>(initialScenario);
  const [range, setRange] = React.useState<Range>(initialRange);
  const [data, setData] = React.useState<DashboardData>(initialData);
  const [errors, setErrors] = React.useState<DashboardErrors>(initialErrors);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Guards against stale responses when the user flips scenario/range quickly.
  const requestSeq = React.useRef(0);

  const load = React.useCallback(async (sc: Scenario, rg: Range) => {
    const id = ++requestSeq.current;
    setLoading(true);
    try {
      const result = await fetchDashboard(sc, rg);
      if (id !== requestSeq.current) return;
      setData(result.data);
      setErrors(result.errors);
    } finally {
      if (id === requestSeq.current) setLoading(false);
    }
  }, []);

  // Refetch whenever the scenario or range changes — but not on first mount,
  // because the server already provided the initial dataset.
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    void load(scenario, range);
  }, [scenario, range, load]);

  const handleRefresh = React.useCallback(() => {
    void load(scenario, range);
  }, [scenario, range, load]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          search={search}
          onSearchChange={setSearch}
          range={range}
          onRangeChange={setRange}
          loading={loading}
          onRefresh={handleRefresh}
        />
        <main className="flex-1 space-y-6 p-4 sm:p-6">
          <DemoControls scenario={scenario} onScenarioChange={setScenario} />
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
            search={search}
            onClearSearch={() => setSearch("")}
          />
        </main>
      </div>
    </div>
  );
}
