import { DashboardProductListing } from "@/components/dashboard/products/DashboardProductListing";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";

export default async function DashboardProductsPage() {
  const [{ items: products }, { items: categories }] = await Promise.all([
    fetchProducts(),
    fetchCategories({ limit: 200 }),
  ]);

  return <DashboardProductListing initialProducts={products} categories={categories} />;
}
