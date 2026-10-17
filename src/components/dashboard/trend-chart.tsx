"use client";

import * as React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionEmpty, SectionError } from "./states";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import type { Range, TrendPoint } from "@/lib/types";

const chartConfig = {
  newMrr: { label: "New MRR", color: "var(--chart-1)" },
  expansionMrr: { label: "Expansion MRR", color: "var(--chart-2)" },
  churnedMrr: { label: "Churned MRR", color: "var(--chart-3)" },
  totalMrr: { label: "Total MRR", color: "var(--chart-4)" },
} satisfies ChartConfig;

const RANGE_LABEL: Record<Range, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "12m": "Last 12 months",
};

interface TrendChartProps {
  points: TrendPoint[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  range: Range;
}

export function TrendChart({
  points,
  loading,
  error,
  onRetry,
  range,
}: TrendChartProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="space-y-1">
          <CardTitle>Net New &amp; Total MRR</CardTitle>
          <CardDescription>
            New and expansion revenue stacked against churn, with total MRR as
            the trend line.
          </CardDescription>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {RANGE_LABEL[range]}
        </Badge>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[340px] w-full" />
        ) : error ? (
          <SectionError
            title="Could not load trend data"
            message={error}
            onRetry={onRetry}
          />
        ) : !points || points.length === 0 ? (
          <SectionEmpty
            title="No trend data"
            description="The trend endpoint returned an empty series. Switch the API state simulator to Live to restore the dataset."
          />
        ) : (
          <TrendChartBody points={points} />
        )}
      </CardContent>
    </Card>
  );
}

function TrendChartBody({ points }: { points: TrendPoint[] }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className="h-[340px] w-full" />;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[340px] w-full"
      aria-label="Net new and total MRR trend chart"
    >
      <ComposedChart
        data={points}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="period"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={(value) => formatCurrencyCompact(Number(value))}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(Number(value))}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="newMrr"
          stackId="positive"
          fill="var(--color-newMrr)"
          maxBarSize={28}
          isAnimationActive={false}
        />
        <Bar
          dataKey="expansionMrr"
          stackId="positive"
          fill="var(--color-expansionMrr)"
          maxBarSize={28}
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
        <Bar
          dataKey="churnedMrr"
          fill="var(--color-churnedMrr)"
          maxBarSize={28}
          radius={[0, 0, 4, 4]}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="totalMrr"
          stroke="var(--color-totalMrr)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
