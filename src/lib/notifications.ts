export type NotificationType = "billing" | "growth" | "alert" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  /** how long ago the event happened, in minutes (rendered as a relative label) */
  minutesAgo: number;
  read: boolean;
}

/**
 * Deterministic mock inbox for the portfolio demo. Themes mirror the dashboard
 * domain (billing, expansion, churn risk, system) so the panel feels real.
 */
export function getNotifications(): AppNotification[] {
  return [
    {
      id: "ntf_1",
      type: "billing",
      title: "Invoice INV-9253 paid",
      description: "Northwind Labs settled a $1,240 invoice.",
      minutesAgo: 4,
      read: false,
    },
    {
      id: "ntf_2",
      type: "alert",
      title: "Churn risk: Cobalt Group",
      description: "Health score dropped to 31. Past-due for 12 days.",
      minutesAgo: 28,
      read: false,
    },
    {
      id: "ntf_3",
      type: "growth",
      title: "MRR milestone reached",
      description: "Net new MRR crossed $9,400 this month.",
      minutesAgo: 96,
      read: false,
    },
    {
      id: "ntf_4",
      type: "system",
      title: "Weekly report ready",
      description: "Your revenue recap for Oct 6–12 is available.",
      minutesAgo: 320,
      read: true,
    },
    {
      id: "ntf_5",
      type: "billing",
      title: "Invoice INV-9241 overdue",
      description: "Aperture Systems missed the due date by 3 days.",
      minutesAgo: 640,
      read: true,
    },
    {
      id: "ntf_6",
      type: "growth",
      title: "New Enterprise account",
      description: "Meridian Federal upgraded to the Enterprise plan.",
      minutesAgo: 1480,
      read: true,
    },
  ];
}

const MINUTE = 1;
const HOUR = 60;
const DAY = 1440;

export function formatRelative(minutesAgo: number): string {
  if (minutesAgo < HOUR) {
    const m = Math.max(1, Math.round(minutesAgo / MINUTE));
    return `${m}m ago`;
  }
  if (minutesAgo < DAY) {
    const h = Math.round(minutesAgo / HOUR);
    return `${h}h ago`;
  }
  const d = Math.round(minutesAgo / DAY);
  return `${d}d ago`;
}
