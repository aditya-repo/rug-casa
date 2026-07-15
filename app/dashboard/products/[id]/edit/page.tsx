import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProductForm } from "@/components/dashboard/products/ProductForm";
import { fetchCategories } from "@/lib/api/categories";
import { fetchActiveCollections } from "@/lib/api/collections";
import { fetchProductById } from "@/lib/api/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, { items: categories }, collections] = await Promise.all([
    fetchProductById(id),
    fetchCategories(),
    fetchActiveCollections(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Edit product" />
      <ProductForm
        product={product}
        mode="edit"
        categories={categories}
        collections={collections}
      />
    </div>
  );
}
