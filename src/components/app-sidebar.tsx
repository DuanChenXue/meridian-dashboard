"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  LineChart,
  Menu,
  Receipt,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  /** exact match instead of prefix match (used for the Overview route "/") */
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Analytics",
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/", exact: true },
      { label: "Trends", icon: LineChart, href: "/trends" },
      { label: "Cohorts", icon: Users, href: "/cohorts" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Subscriptions", icon: CreditCard, href: "/subscriptions" },
      { label: "Customers", icon: Building2, href: "/customers" },
      { label: "Invoices", icon: Receipt, href: "/invoices" },
      { label: "Reports", icon: FileBarChart, href: "/reports" },
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

function NavItemLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-6">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <NavItemLink
                  key={item.href}
                  item={item}
                  active={active}
                  onNavigate={onNavigate}
                />
              );
            })}
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

function SidebarFooter() {
  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <UserCard />
        </div>
        <ThemeToggle />
      </div>
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
        <SidebarFooter />
      </aside>

      {/* Mobile navigation trigger */}
      <div className="fixed left-2 top-2 z-40 md:hidden">
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
          <SheetContent side="left" className="flex w-72 flex-col p-0">
            <SheetHeader className="h-16 justify-center border-b px-6 text-left">
              <div className="flex items-center gap-2.5">
                <BrandMark className="h-7 w-7" />
                <SheetTitle className="text-sm">Meridian</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
            <SidebarFooter />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
