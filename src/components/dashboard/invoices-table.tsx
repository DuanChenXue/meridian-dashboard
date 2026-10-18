"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Invoice, InvoiceStatus } from "@/lib/data";

const PAGE_SIZE = 10;

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  switch (status) {
    case "paid":
      return (
        <Badge
          variant="secondary"
          className="border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        >
          Paid
        </Badge>
      );
    case "open":
      return (
        <Badge
          variant="outline"
          className="border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400"
        >
          Open
        </Badge>
      );
    case "overdue":
      return (
        <Badge
          variant="outline"
          className="border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-400"
        >
          Overdue
        </Badge>
      );
  }
}

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const [page, setPage] = React.useState(0);
  const pageCount = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const paged = invoices.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {invoice.id}
                </TableCell>
                <TableCell className="font-medium">
                  {invoice.company}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(invoice.issued)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(invoice.due)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 px-2 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          Showing {safePage * PAGE_SIZE + 1}–
          {Math.min((safePage + 1) * PAGE_SIZE, invoices.length)} of{" "}
          {invoices.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Previous page"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i}
              variant={i === safePage ? "default" : "outline"}
              size="icon"
              className={cn("h-8 w-8")}
              aria-label={`Page ${i + 1}`}
              aria-current={i === safePage ? "page" : undefined}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Next page"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
