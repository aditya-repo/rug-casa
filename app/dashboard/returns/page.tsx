import { ReturnsManager } from "@/components/dashboard/returns/ReturnsManager";
import { fetchReturns } from "@/lib/api/returns";

export default async function DashboardReturnsPage() {
  const { items } = await fetchReturns({ status: "PENDING" });

  return <ReturnsManager initialReturns={items} initialTab="PENDING" />;
}
