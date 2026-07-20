import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ProductForm } from "@/components/dashboard/products/ProductForm";
import { fetchCategories } from "@/lib/api/categories";
import { fetchActiveColors } from "@/lib/api/colors";
import { fetchActiveCollections } from "@/lib/api/collections";
import { createEmptyProduct } from "@/lib/dashboard/products";

export default async function NewProductPage() {
  const product = createEmptyProduct();
  const [{ items: categories }, collections, colors] = await Promise.all([
    fetchCategories(),
    fetchActiveCollections(),
    fetchActiveColors(),
  ]);

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Add product" />
      <ProductForm
        product={product}
        mode="create"
        categories={categories}
        collections={collections}
        colors={colors}
      />
    </div>
  );
}
