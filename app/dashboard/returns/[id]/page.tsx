import { notFound } from "next/navigation";
import { ReturnDetailView } from "@/components/dashboard/returns/ReturnDetailView";
import { fetchReturn } from "@/lib/api/returns";
import { ApiError } from "@/lib/api/fetch";

type ReturnDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardReturnDetailPage({ params }: ReturnDetailPageProps) {
  const { id } = await params;

  try {
    const item = await fetchReturn(id);
    return <ReturnDetailView initialReturn={item} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
