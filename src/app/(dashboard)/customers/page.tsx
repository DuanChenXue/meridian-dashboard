import { connection } from "next/server";
import { getSubscriptions } from "@/lib/data";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatNumber,
} from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";
import { HealthBadge, PlanBadge, StatusBadge } from "@/components/dashboard/badges";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

function initials(company: string): string {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function CustomersPage() {
  await connection();
  const subscriptions = getSubscriptions();

  const total = subscriptions.length;
  const active = subscriptions.filter((s) => s.status === "active").length;
  const totalMrr = subscriptions.reduce((sum, s) => sum + s.mrr, 0);
  const avgHealth =
    total > 0
      ? subscriptions.reduce((sum, s) => sum + s.health, 0) / total
      : 0;

  const top = [...subscriptions]
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 12);

  const summary = [
    { label: "Total customers", value: formatNumber(total) },
    { label: "Active", value: formatNumber(active) },
    { label: "Average health", value: `${avgHealth.toFixed(0)}/100` },
    { label: "Combined MRR", value: formatCurrencyCompact(totalMrr) },
  ];

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Customers"
        description="A snapshot of the customer base, led by the highest-value accounts."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {item.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top accounts by MRR</CardTitle>
          <CardDescription>
            The twelve highest-value customer relationships.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-2 sm:px-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">MRR</TableHead>
                  <TableHead className="text-right">Health</TableHead>
                  <TableHead className="text-right">Seats</TableHead>
                  <TableHead>Customer since</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                            {initials(s.company)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{s.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PlanBadge plan={s.plan} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(s.mrr)}
                    </TableCell>
                    <TableCell className="text-right">
                      <HealthBadge health={s.health} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(s.seats)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(s.startDate)}
                    </TableCell>
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
