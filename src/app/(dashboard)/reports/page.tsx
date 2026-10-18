import { connection } from "next/server";
import { getMetrics } from "@/lib/data";
import { formatCurrencyCompact } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  ReportDownloadButton,
  type ReportItem,
} from "@/components/dashboard/report-download-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const instant = false;

function buildReports(): ReportItem[] {
  const metrics = getMetrics("12m");
  const mrr = metrics.find((m) => m.id === "mrr");
  const nrr = metrics.find((m) => m.id === "nrr");

  return [
    {
      title: "Monthly revenue report",
      description:
        "New, expansion and churned MRR for the trailing month, with plan-level breakdowns.",
      period: "September 2026",
      type: "Automated",
      figure: formatCurrencyCompact(mrr?.value ?? 0),
      figureLabel: "Total MRR",
    },
    {
      title: "Net revenue retention",
      description:
        "Quarterly NRR decomposition across expansion, contraction and churn.",
      period: "Q3 2026",
      type: "Automated",
      figure: `${nrr?.value.toFixed(1) ?? "0.0"}%`,
      figureLabel: "NRR",
    },
    {
      title: "Churn risk analysis",
      description:
        "Accounts flagged by declining health scores and failed payment attempts.",
      period: "October 2026",
      type: "Ad hoc",
      figure: "23",
      figureLabel: "At-risk accounts",
    },
    {
      title: "Cohort performance",
      description:
        "Retention curves for the last eight signup cohorts, benchmarked against target.",
      period: "Q3 2026",
      type: "Automated",
      figure: "8",
      figureLabel: "Cohorts tracked",
    },
    {
      title: "Enterprise pipeline",
      description:
        "Enterprise-tier accounts, seat growth and upcoming renewal windows.",
      period: "October 2026",
      type: "Ad hoc",
      figure: "12",
      figureLabel: "Renewals in 90d",
    },
    {
      title: "Annual forecast",
      description:
        "Trailing-twelve-month revenue projected forward with base and upside cases.",
      period: "FY 2027",
      type: "Automated",
      figure: formatCurrencyCompact((mrr?.value ?? 0) * 12),
      figureLabel: "ARR base case",
    },
  ];
}

export default async function ReportsPage() {
  await connection();
  const reports = buildReports();

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Reports"
        description="Generated analyses built on top of the workspace dataset."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title} className="flex flex-col">
            <CardHeader className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {report.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {report.period}
                </span>
              </div>
              <CardTitle className="text-base">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex items-end justify-between gap-2 pt-2">
              <div>
                <p className="text-xl font-semibold tabular-nums">
                  {report.figure}
                </p>
                <p className="text-xs text-muted-foreground">
                  {report.figureLabel}
                </p>
              </div>
              <ReportDownloadButton report={report} />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
