"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface ReportItem {
  title: string;
  description: string;
  period: string;
  type: "Automated" | "Ad hoc";
  figure: string;
  figureLabel: string;
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "report"
  );
}

export function ReportDownloadButton({ report }: { report: ReportItem }) {
  const handleDownload = () => {
    const header = ["Report", "Period", "Type", "Headline", "Headline Label", "Description"];
    const row = [
      report.title,
      report.period,
      report.type,
      report.figure,
      report.figureLabel,
      report.description,
    ];
    const csv = [
      header.map(csvEscape).join(","),
      row.map(csvEscape).join(","),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meridian-${slugify(report.title)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast.success(`Downloaded “${report.title}”`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 text-xs"
      onClick={handleDownload}
    >
      <Download className="h-3.5 w-3.5" />
      Download
    </Button>
  );
}
