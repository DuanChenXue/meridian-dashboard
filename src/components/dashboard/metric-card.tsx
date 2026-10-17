"use client";

import * as React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCurrency,
  formatDelta,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Metric } from "@/lib/types";

function formatValue(metric: Metric): string {
  switch (metric.format) {
    case "currency":
      return formatCurrency(metric.value);
    case "number":
      return formatNumber(metric.value);
    case "percent":
      return formatPercent(metric.value);
  }
}

function Sparkline({
  id,
  data,
  positive,
}: {
  id: string;
  data: number[];
  positive: boolean;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chartData = data.map((value, index) => ({ index, value }));
  const stroke = positive ? "var(--chart-2)" : "var(--chart-3)";
  const gradientId = `spark-${id}`;

  if (!mounted) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="h-10 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricCard({ metric }: { metric: Metric }) {
  const positive = metric.delta >= 0;
  const DeltaIcon = positive ? ArrowUpRight : ArrowDownRight;

  const deltaText =
    metric.deltaUnit === "pts"
      ? `${positive ? "+" : "-"}${Math.abs(metric.delta).toFixed(1)} pts`
      : formatDelta(metric.delta);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-1.5 p-5">
        <p className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </p>
        <p className="text-2xl font-semibold tabular-nums tracking-tight">
          {formatValue(metric)}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
              positive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
            )}
          >
            <DeltaIcon className="h-3 w-3" aria-hidden="true" />
            {deltaText}
          </span>
          <span className="text-muted-foreground">
            {metric.comparisonLabel}
          </span>
        </div>
        <div className="mt-2">
          <Sparkline
            id={metric.id}
            data={metric.spark}
            positive={positive}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
