import { connection } from "next/server";
import { getSubscriptions } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/page-header";
import { SubscriptionsView } from "@/components/dashboard/subscriptions-view";

export const instant = false;

export default async function SubscriptionsPage() {
  await connection();
  const subscriptions = getSubscriptions();

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Subscriptions"
        description="Every account in the workspace — filter, sort, page and export."
      />
      <SubscriptionsView subscriptions={subscriptions} />
    </main>
  );
}
