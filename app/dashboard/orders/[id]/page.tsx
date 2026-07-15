import { notFound } from "next/navigation";
import { OrderDetailView } from "@/components/dashboard/orders/OrderDetailView";
import { fetchOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/fetch";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  try {
    const order = await fetchOrder(id);
    return <OrderDetailView initialOrder={order} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
