"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Bell,
  Calendar,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { Range } from "@/lib/types";

interface AppTopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  range: Range;
  onRangeChange: (range: Range) => void;
  loading: boolean;
  onRefresh: () => void;
}

export function AppTopbar({
  search,
  onSearchChange,
  range,
  onRangeChange,
  loading,
  onRefresh,
}: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/85 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-4 md:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-1.5 text-sm">
          <li className="font-medium text-muted-foreground">Meridian</li>
          <li aria-hidden="true" className="text-muted-foreground/50">
            /
          </li>
          <li className="font-medium">Overview</li>
        </ol>
      </nav>

      {/* Search */}
      <div className="relative ml-auto w-36 min-w-0 sm:ml-6 sm:w-64 lg:w-80">
        <Search
          className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search companies…"
          aria-label="Search companies by name or plan"
          className="h-9 pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
        {/* Date range */}
        <Select
          value={range}
          onValueChange={(value) => onRangeChange(value as Range)}
        >
          <SelectTrigger
            className="hidden h-9 w-[150px] text-xs sm:flex"
            aria-label="Select date range"
          >
            <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh data"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>

        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label="Notifications, 3 unread"
          onClick={() =>
            toast.info("3 unread notifications", {
              description: "Notifications are mocked in this portfolio demo.",
            })
          }
        >
          <Bell className="h-4 w-4" />
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive"
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-0.5 h-9 w-9 rounded-full p-0"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  AM
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Alex Morgan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                toast.info("Profile is mocked in this portfolio demo.")
              }
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toast.info("Settings are mocked in this portfolio demo.")
              }
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.info("Signed out (demo only).")}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
