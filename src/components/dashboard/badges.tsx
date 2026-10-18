import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Plan, SubscriptionStatus } from "@/lib/types";

export function PlanBadge({ plan }: { plan: Plan }) {
  if (plan === "Enterprise") return <Badge>Enterprise</Badge>;
  if (plan === "Growth") return <Badge variant="secondary">Growth</Badge>;
  return <Badge variant="outline">Starter</Badge>;
}

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
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

export function HealthBadge({ health }: { health: number }) {
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
