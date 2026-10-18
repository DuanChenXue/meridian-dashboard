"use client";

import { AlertTriangle, Inbox, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SectionErrorProps {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
}

export function SectionError({
  title = "Could not load data",
  message,
  onRetry,
}: SectionErrorProps) {
  return (
    <Card
      role="alert"
      className="border-destructive/40 bg-destructive/5"
    >
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <p className="text-sm font-medium">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {message ??
            "The API request failed. Retry the request, or come back a little later."}
        </p>
        {onRetry ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onRetry}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry request
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface SectionEmptyProps {
  title: string;
  description: string;
}

export function SectionEmpty({ title, description }: SectionEmptyProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
