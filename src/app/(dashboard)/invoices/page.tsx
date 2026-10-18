import { connection } from "next/server";
import { getInvoices } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";
import { InvoicesTable } from "@/components/dashboard/invoices-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const instant = false;

export default async function InvoicesPage() {
  await connection();
  const invoices = getInvoices();

  const paid = invoices.filter((i) => i.status === "paid");
  const open = invoices.filter((i) => i.status === "open");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const sum = (list: typeof invoices) =>
    list.reduce((total, i) => total + i.amount, 0);

  const summary = [
    { label: "Collected", value: formatCurrency(sum(paid)), hint: `${paid.length} invoices` },
    { label: "Outstanding", value: formatCurrency(sum(open)), hint: `${open.length} invoices` },
    { label: "Overdue", value: formatCurrency(sum(overdue)), hint: `${overdue.length} invoices` },
    { label: "Invoiced total", value: formatCurrency(sum(invoices)), hint: `${invoices.length} invoices` },
  ];

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Invoices"
        description="Billing activity derived from active subscription terms."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {item.value}
              </CardTitle>
              <CardDescription className="text-xs">
                {item.hint}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent invoices</CardTitle>
          <CardDescription>
            {formatNumber(invoices.length)} invoices, newest first. 10 per page.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-2 sm:px-4">
          <InvoicesTable invoices={invoices} />
        </CardContent>
      </Card>
    </main>
  );
}
