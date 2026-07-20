import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProductDetailHeaderActions } from "@/components/dashboard/products/ProductDetailHeaderActions";
import { ProductDetailView } from "@/components/dashboard/products/ProductDetailView";
import { fetchProductById } from "@/lib/api/products";
import type { ProductApiStatus } from "@/lib/api/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const apiStatus = (
    product.status === "archived"
      ? "ARCHIVED"
      : product.status === "draft"
        ? "DRAFT"
        : "PUBLISHED"
  ) as ProductApiStatus;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={product.name || "Product details"}
        description="Review product details, inventory, and variants."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: product.name || "Details" },
        ]}
        backHref="/dashboard/products"
        backLabel="Back to products"
        actions={
          <ProductDetailHeaderActions
            productId={product.id}
            productName={product.name}
            apiStatus={apiStatus}
          />
        }
      />
      <ProductDetailView product={product} />
    </div>
  );
}
