import { fetchCategories } from "@/lib/api/categories";
import { CategoriesManager } from "@/components/dashboard/categories/CategoriesManager";

export default async function DashboardCategoriesPage() {
  const { items: categories } = await fetchCategories({ limit: 100 });

  return <CategoriesManager initialCategories={categories} />;
}
