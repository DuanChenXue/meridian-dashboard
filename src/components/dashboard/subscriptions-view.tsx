"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubscriptionsTable } from "./subscriptions-table";
import type { Subscription } from "@/lib/types";

export function SubscriptionsView({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const [search, setSearch] = React.useState("");

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search
          className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies…"
          aria-label="Search companies by name"
          className="h-9 pl-8"
        />
      </div>
      <SubscriptionsTable
        subscriptions={subscriptions}
        loading={false}
        error={null}
        search={search}
        onClearSearch={() => setSearch("")}
      />
    </div>
  );
}
