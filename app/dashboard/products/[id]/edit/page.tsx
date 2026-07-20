import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProductEditHeaderActions } from "@/components/dashboard/products/ProductEditHeaderActions";
import { ProductForm } from "@/components/dashboard/products/ProductForm";
import { fetchCategories } from "@/lib/api/categories";
import { fetchActiveColors } from "@/lib/api/colors";
import { fetchActiveCollections } from "@/lib/api/collections";
import { fetchProductById, type ProductApiStatus } from "@/lib/api/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, { items: categories }, collections, colors] = await Promise.all([
    fetchProductById(id),
    fetchCategories(),
    fetchActiveCollections(),
    fetchActiveColors(),
  ]);

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
        title="Edit product"
        description={product.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: product.name || "Product", href: `/dashboard/products/${product.id}` },
          { label: "Edit" },
        ]}
        backHref={`/dashboard/products/${product.id}`}
        backLabel="Back to details"
        actions={
          <ProductEditHeaderActions
            productId={product.id}
            productName={product.name}
            apiStatus={apiStatus}
          />
        }
      />
      <ProductForm
        product={product}
        mode="edit"
        categories={categories}
        collections={collections}
        colors={colors}
      />
    </div>
  );
}
