"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Building2,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Menu,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Analytics",
    items: [
      { label: "Overview", icon: LayoutDashboard, active: true },
      { label: "Trends", icon: LineChart },
      { label: "Cohorts", icon: Users },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Subscriptions", icon: CreditCard },
      { label: "Customers", icon: Building2 },
      { label: "Invoices", icon: Receipt },
      { label: "Reports", icon: FileBarChart },
    ],
  },
];

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Meridian logo"
    >
      <rect width="32" height="32" rx="8" fill="#6366f1" />
      <path
        d="M9 22.5 L14 15.5 L19 19.5 L23.5 11.5"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23.5" cy="11.5" r="2" fill="#ffffff" />
    </svg>
  );
}

function NavItemButton({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => {
        if (!item.active) {
          toast.info("Portfolio demo", {
            description: `"${item.label}" is a mocked section — Overview is the live dashboard.`,
          });
        }
        onNavigate?.();
      }}
      aria-current={item.active ? "page" : undefined}
      className={
        item.active
          ? "flex w-full items-center gap-3 rounded-md bg-secondary px-2 py-2 text-sm font-medium text-secondary-foreground transition-colors"
          : "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </button>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-6">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <NavItemButton
                key={item.label}
                item={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function UserCard() {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
          AM
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Alex Morgan</p>
        <p className="truncate text-xs text-muted-foreground">
          alex@meridian.io
        </p>
      </div>
      <Badge variant="secondary" className="shrink-0 text-[10px]">
        PRO
      </Badge>
    </div>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center gap-2.5 border-b px-6">
          <BrandMark className="h-7 w-7" />
          <div>
            <p className="text-sm font-semibold leading-tight">Meridian</p>
            <p className="text-xs text-muted-foreground">
              Revenue Intelligence
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav />
        </div>
        <div className="border-t p-4">
          <div className="mb-3 flex flex-col gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() =>
                toast.info("Settings is mocked in this portfolio demo.")
              }
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-muted-foreground"
              onClick={() =>
                toast.info("Help center is mocked in this portfolio demo.")
              }
            >
              <LifeBuoy className="h-4 w-4" />
              Help &amp; docs
            </Button>
          </div>
          <Separator className="mb-3" />
          <UserCard />
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="flex items-center md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-9 w-9"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="h-16 justify-center border-b px-6 text-left">
              <div className="flex items-center gap-2.5">
                <BrandMark className="h-7 w-7" />
                <SheetTitle className="text-sm">Meridian</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex flex-col justify-between p-4">
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
              <div className="mt-6">
                <Separator className="mb-3" />
                <UserCard />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
