import { connection } from "next/server";
import { getPlanDistribution, getTrendSeries } from "@/lib/data";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";
import { TrendChart } from "@/components/dashboard/trend-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PLAN_TONE: Record<string, string> = {
  Starter: "bg-sky-500",
  Growth: "bg-indigo-500",
  Enterprise: "bg-emerald-500",
};

// connection() is accessed during render, so opt this route into a blocking
// (non-instant) render rather than prerendering.
export const instant = false;

export default async function TrendsPage() {
  await connection();
  const points = getTrendSeries("12m");
  const plans = getPlanDistribution();
  const totalMrr = plans.reduce((sum, p) => sum + p.mrr, 0);

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Trends"
        description="Revenue movement over the last 12 months, with the plan mix behind it."
      />
      <TrendChart points={points} range="12m" />
      <Card>
        <CardHeader>
          <CardTitle>Plan distribution</CardTitle>
          <CardDescription>
            Accounts and MRR contribution per plan tier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {plans.map((slice) => {
            const share = totalMrr > 0 ? (slice.mrr / totalMrr) * 100 : 0;
            return (
              <div key={slice.plan} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-full ${PLAN_TONE[slice.plan] ?? "bg-muted-foreground"}`}
                    />
                    {slice.plan}
                  </span>
                  <span className="text-muted-foreground">
                    {formatNumber(slice.accounts)} accounts ·{" "}
                    {formatCurrencyCompact(slice.mrr)} MRR ·{" "}
                    <span className="font-medium text-foreground">
                      {share.toFixed(1)}%
                    </span>
                  </span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-muted"
                  role="img"
                  aria-label={`${slice.plan}: ${share.toFixed(1)}% of MRR`}
                >
                  <div
                    className={`h-full rounded-full ${PLAN_TONE[slice.plan] ?? "bg-muted-foreground"}`}
                    style={{ width: `${Math.max(2, share)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
