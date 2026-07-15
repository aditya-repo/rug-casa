import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProductDetailView } from "@/components/dashboard/products/ProductDetailView";
import { fetchProductById } from "@/lib/api/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Product details" />
      <ProductDetailView product={product} />
    </div>
  );
}
