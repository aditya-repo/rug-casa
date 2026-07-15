import { OrdersManager } from "@/components/dashboard/orders/OrdersManager";
import { fetchOrders } from "@/lib/api/orders";

export default async function DashboardOrdersPage() {
  const { items: orders } = await fetchOrders({ status: "PENDING" });

  return <OrdersManager initialOrders={orders} initialTab="PENDING" />;
}
