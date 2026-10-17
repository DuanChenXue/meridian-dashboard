"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  SearchX,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionEmpty, SectionError } from "./states";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Plan, Subscription, SubscriptionStatus } from "@/lib/types";

type SortKey =
  | "company"
  | "plan"
  | "mrr"
  | "status"
  | "health"
  | "seats"
  | "startDate";
type SortDir = "asc" | "desc";

const PLAN_ORDER: Record<Plan, number> = {
  Starter: 0,
  Growth: 1,
  Enterprise: 2,
};

const STATUS_ORDER: Record<SubscriptionStatus, number> = {
  active: 0,
  trialing: 1,
  past_due: 2,
  canceled: 3,
};

function PlanBadge({ plan }: { plan: Plan }) {
  if (plan === "Enterprise") return <Badge>Enterprise</Badge>;
  if (plan === "Growth") return <Badge variant="secondary">Growth</Badge>;
  return <Badge variant="outline">Starter</Badge>;
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="secondary"
          className="border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        >
          Active
        </Badge>
      );
    case "trialing":
      return (
        <Badge
          variant="outline"
          className="border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400"
        >
          Trialing
        </Badge>
      );
    case "past_due":
      return (
        <Badge
          variant="outline"
          className="border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400"
        >
          Past due
        </Badge>
      );
    case "canceled":
      return <Badge variant="secondary">Canceled</Badge>;
  }
}

function HealthBadge({ health }: { health: number }) {
  const tone =
    health >= 70
      ? "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
      : health >= 40
        ? "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : "border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-400";
  return (
    <Badge variant="outline" className={cn("tabular-nums", tone)}>
      {health}
    </Badge>
  );
}

function csvEscape(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  search: string;
  onClearSearch: () => void;
}

export function SubscriptionsTable({
  subscriptions,
  loading,
  error,
  onRetry,
  search,
  onClearSearch,
}: SubscriptionsTableProps) {
  const [planFilter, setPlanFilter] = React.useState<Plan | "all">("all");
  const [statusFilter, setStatusFilter] =
    React.useState<SubscriptionStatus | "all">("all");
  const [sort, setSort] = React.useState<{ key: SortKey; dir: SortDir }>({
    key: "startDate",
    dir: "desc",
  });
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(8);

  const filtered = React.useMemo(() => {
    if (!subscriptions) return [];
    const q = search.trim().toLowerCase();
    const rows = subscriptions.filter((s) => {
      if (planFilter !== "all" && s.plan !== planFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (q && !s.company.toLowerCase().includes(q)) return false;
      return true;
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      switch (sort.key) {
        case "company":
          return a.company.localeCompare(b.company) * dir;
        case "plan":
          return (PLAN_ORDER[a.plan] - PLAN_ORDER[b.plan]) * dir;
        case "status":
          return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
        case "mrr":
          return (a.mrr - b.mrr) * dir;
        case "health":
          return (a.health - b.health) * dir;
        case "seats":
          return (a.seats - b.seats) * dir;
        case "startDate":
          return a.startDate.localeCompare(b.startDate) * dir;
      }
    });
    return rows;
  }, [subscriptions, search, planFilter, statusFilter, sort]);

  // Reset to the first page whenever the visible result set changes.
  React.useEffect(() => {
    setPage(0);
  }, [search, planFilter, statusFilter, pageSize]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "company" || key === "startDate" ? "asc" : "desc" },
    );
  };

  const exportCsv = () => {
    if (filtered.length === 0) return;
    const header = [
      "Company",
      "Plan",
      "MRR",
      "Status",
      "Health",
      "Seats",
      "Start date",
    ];
    const lines = filtered.map((s) =>
      [
        csvEscape(s.company),
        csvEscape(s.plan),
        csvEscape(s.mrr),
        csvEscape(s.status),
        csvEscape(s.health),
        csvEscape(s.seats),
        csvEscape(s.startDate),
      ].join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meridian-subscriptions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} rows to CSV`);
  };

  const SortHeader = ({
    label,
    sortKey,
    className,
  }: {
    label: string;
    sortKey: SortKey;
    className?: string;
  }) => {
    const active = sort.key === sortKey;
    const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
    return (
      <button
        type="button"
        onClick={() => toggleSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
          className,
        )}
        aria-label={`Sort by ${label}`}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    );
  };

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>
              {loading
                ? "Loading subscription records…"
                : error
                  ? "Subscription fetch failed."
                  : `${formatNumber(filtered.length)} of ${formatNumber(
                      subscriptions?.length ?? 0,
                    )} accounts`}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={planFilter}
              onValueChange={(v) => setPlanFilter(v as Plan | "all")}
            >
              <SelectTrigger className="h-8 w-[120px] text-xs" aria-label="Filter by plan">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as SubscriptionStatus | "all")
              }
            >
              <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="past_due">Past due</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={exportCsv}
              disabled={loading || error !== null || filtered.length === 0}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </div>
        {search ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Filtering by “<span className="font-medium text-foreground">{search}</span>”
            </span>
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 hover:bg-secondary"
            >
              <X className="h-3 w-3" /> clear
            </button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {loading ? (
          <div className="space-y-2 px-2 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="px-2">
            <SectionError
              title="Could not load subscriptions"
              message={error}
              onRetry={onRetry}
            />
          </div>
        ) : !subscriptions || subscriptions.length === 0 ? (
          <div className="px-2">
            <SectionEmpty
              title="No subscriptions found"
              description="The subscriptions endpoint returned an empty dataset. Switch the API state simulator to Live to restore the accounts."
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-2 py-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <SearchX className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No matches</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                No accounts match the current filters. Try clearing the search
                or adjusting the plan and status filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => {
                  setPlanFilter("all");
                  setStatusFilter("all");
                  onClearSearch();
                }}
              >
                Reset filters
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <SortHeader label="Company" sortKey="company" />
                    </TableHead>
                    <TableHead>
                      <SortHeader label="Plan" sortKey="plan" />
                    </TableHead>
                    <TableHead className="text-right">
                      <SortHeader label="MRR" sortKey="mrr" className="ml-auto" />
                    </TableHead>
                    <TableHead>
                      <SortHeader label="Status" sortKey="status" />
                    </TableHead>
                    <TableHead className="text-right">
                      <SortHeader label="Health" sortKey="health" className="ml-auto" />
                    </TableHead>
                    <TableHead className="text-right">
                      <SortHeader label="Seats" sortKey="seats" className="ml-auto" />
                    </TableHead>
                    <TableHead>
                      <SortHeader label="Start date" sortKey="startDate" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.company}</TableCell>
                      <TableCell>
                        <PlanBadge plan={s.plan} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(s.mrr)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
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

            {/* Pagination */}
            <div className="mt-3 flex flex-col items-center justify-between gap-3 px-2 sm:flex-row">
              <p className="text-xs text-muted-foreground">
                Page {safePage + 1} of {pageCount}
              </p>
              <div className="flex items-center gap-2">
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => setPageSize(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[110px] text-xs" aria-label="Rows per page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 / page</SelectItem>
                    <SelectItem value="16">16 / page</SelectItem>
                    <SelectItem value="24">24 / page</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() =>
                      setPage((p) => Math.min(pageCount - 1, p + 1))
                    }
                    disabled={safePage >= pageCount - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
