"use client";

import * as React from "react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  Info,
  Receipt,
  TrendingUp,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  formatRelative,
  getNotifications,
  type AppNotification,
  type NotificationType,
} from "@/lib/notifications";

interface TypeMeta {
  icon: LucideIcon;
  /** icon tint */
  tint: string;
  /** soft circular background */
  bg: string;
}

const TYPE_META: Record<NotificationType, TypeMeta> = {
  billing: {
    icon: Receipt,
    tint: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/12",
  },
  growth: {
    icon: TrendingUp,
    tint: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/12",
  },
  alert: {
    icon: AlertTriangle,
    tint: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/12",
  },
  system: {
    icon: Info,
    tint: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/12",
  },
};

export function NotificationsBell() {
  const [items, setItems] = React.useState<AppNotification[]>(() =>
    getNotifications(),
  );

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const dismiss = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={
            unread > 0
              ? `Notifications, ${unread} unread`
              : "Notifications"
          }
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-[#fff]">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[360px] max-w-[calc(100vw-2rem)] p-0"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Notifications</p>
            {unread > 0 && (
              <Badge
                variant="secondary"
                className="border-transparent bg-destructive/12 px-1.5 text-[10px] font-semibold text-destructive"
              >
                {unread} new
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs text-muted-foreground disabled:pointer-events-none disabled:opacity-40"
            onClick={markAllRead}
            disabled={unread === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>

        <div className="h-px bg-border" />

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            <p className="text-sm font-medium">You&rsquo;re all caught up</p>
            <p className="text-xs text-muted-foreground">
              No new notifications right now.
            </p>
          </div>
        ) : (
          <div className="max-h-[360px] overflow-y-auto">
            <ul className="flex flex-col py-1">
              {items.map((n) => {
                const meta = TYPE_META[n.type];
                const Icon = meta.icon;
                return (
                  <li key={n.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => markRead(n.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          markRead(n.id);
                        }
                      }}
                      className={cn(
                        "group flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary/60 focus:bg-secondary/60 focus:outline-none",
                        !n.read && "bg-primary/[0.04]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          meta.bg,
                        )}
                      >
                        <Icon className={cn("h-4 w-4", meta.tint)} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={cn(
                              "truncate text-sm",
                              !n.read
                                ? "font-semibold text-foreground"
                                : "font-medium text-foreground/90",
                            )}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span
                              aria-label="Unread"
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {n.description}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground/70">
                          {formatRelative(n.minutesAgo)}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(n.id);
                        }}
                        className="ml-1 hidden h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-secondary hover:text-foreground group-hover:flex"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="h-px bg-border" />
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-full text-xs text-muted-foreground"
            onClick={() =>
              setItems((prev) => prev.map((n) => ({ ...n, read: true })))
            }
          >
            View all activity
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
