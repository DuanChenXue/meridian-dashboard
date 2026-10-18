import { connection } from "next/server";
import { getCohorts } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const instant = false;

const PERIOD_LABELS = ["M0", "M1", "M2", "M3", "M4", "M5"];

function retentionTone(value: number): { className: string; style?: React.CSSProperties } {
  // emerald scale by retention strength
  const alpha = Math.min(0.85, Math.max(0.06, (value - 30) / 80));
  return {
    className: "text-center tabular-nums",
    style: { backgroundColor: `rgba(16, 185, 129, ${alpha.toFixed(2)})` },
  };
}

export default async function CohortsPage() {
  await connection();
  const cohorts = getCohorts();
  const totalSize = cohorts.reduce((sum, c) => sum + c.size, 0);
  const m3 = cohorts
    .map((c) => c.retention[3])
    .filter((v) => Number.isFinite(v));
  const avgM3 = m3.length
    ? m3.reduce((a, b) => a + b, 0) / m3.length
    : 0;

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Cohorts"
        description="How each monthly signup cohort retains over the first six months."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cohorts tracked</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {cohorts.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Customers in cohorts</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatNumber(totalSize)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average M3 retention</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {avgM3.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retention by cohort</CardTitle>
          <CardDescription>
            Percentage of each cohort still active N months after signup. Grey
            cells mark periods that have not elapsed yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-2 sm:px-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cohort</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  {PERIOD_LABELS.map((label) => (
                    <TableHead key={label} className="text-center">
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohorts.map((cohort) => (
                  <TableRow key={cohort.id}>
                    <TableCell className="font-medium">{cohort.label}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {cohort.size}
                    </TableCell>
                    {cohort.retention.map((value, i) =>
                      Number.isFinite(value) ? (
                        <TableCell
                          key={i}
                          {...retentionTone(value)}
                          title={`${value}% retained`}
                        >
                          {value}%
                        </TableCell>
                      ) : (
                        <TableCell
                          key={i}
                          className="text-center tabular-nums text-muted-foreground/40"
                        >
                          —
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
