"use client";

import {
  Activity,
  AlertTriangle,
  CircleDot,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scenario } from "@/lib/types";

interface Option {
  value: Scenario;
  label: string;
  icon: LucideIcon;
  hint: string;
}

const OPTIONS: Option[] = [
  { value: "live", label: "Live", icon: Activity, hint: "Real data" },
  { value: "loading", label: "Loading", icon: CircleDot, hint: "Pending" },
  { value: "empty", label: "Empty", icon: Inbox, hint: "No rows" },
  { value: "error", label: "Error", icon: AlertTriangle, hint: "Failed" },
];

interface DemoControlsProps {
  scenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
}

export function DemoControls({
  scenario,
  onScenarioChange,
}: DemoControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold">API state simulator</p>
        <p className="max-w-xl text-xs text-muted-foreground">
          Flip the mock backend between real, pending, empty and failed
          responses to preview every data state the UI has to handle.
        </p>
      </div>
      <div
        role="group"
        aria-label="Select API state"
        className="inline-flex shrink-0 rounded-lg border bg-muted/40 p-1"
      >
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = scenario === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onScenarioChange(opt.value)}
              aria-pressed={active}
              title={opt.hint}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  active && opt.value === "live" && "text-emerald-500",
                  active && opt.value === "error" && "text-destructive",
                  active && opt.value === "empty" && "text-sky-500",
                  active && opt.value === "loading" && "text-amber-500",
                )}
              />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
