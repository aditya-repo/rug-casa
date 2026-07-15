import { clientApi, publicApi, serverApi } from "./fetch";
import { imageUrl } from "./mappers";
import type { CategoryItem } from "@/lib/data/categories";

export type CategoryStatus = "ACTIVE" | "DRAFT" | "INACTIVE";

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  banner?: string | null;
  parentId?: string | null;
  sortOrder: number;
  status: CategoryStatus;
  isFeatured: boolean;
  _count?: { products: number; children: number };
}

export interface CategoryFormPayload {
  name: string;
  slug?: string;
  description?: string;
  image?: string | null;
  banner?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  status?: CategoryStatus;
  isFeatured?: boolean;
}

export function mapCategoryToHomepageItem(category: ApiCategory): CategoryItem {
  return {
    slug: category.slug,
    label: category.name,
    imageSrc: imageUrl(category.image),
    imageAlt: category.name,
  };
}

export async function fetchPublicHomepageCategories(): Promise<CategoryItem[]> {
  const res = await publicApi<ApiCategory[]>("/categories/public/homepage");
  return (res.data ?? []).map(mapCategoryToHomepageItem);
}

export async function fetchPublicShopCategories(): Promise<CategoryItem[]> {
  try {
    const res = await publicApi<ApiCategory[]>("/categories/public/list");
    return (res.data ?? []).map(mapCategoryToHomepageItem);
  } catch {
    return [];
  }
}

export async function fetchCategories(params?: { page?: number; limit?: number; search?: string }) {
  const res = await serverApi<ApiCategory[]>("/categories", {
    searchParams: { page: params?.page ?? 1, limit: params?.limit ?? 100, search: params?.search },
  });
  return { items: res.data ?? [], meta: res.meta };
}

export async function fetchCategoriesClient(params?: { page?: number; limit?: number; search?: string }) {
  const res = await clientApi<ApiCategory[]>("/categories", {
    searchParams: { page: params?.page ?? 1, limit: params?.limit ?? 100, search: params?.search },
  });
  return { items: res.data ?? [], meta: res.meta };
}

export async function createCategoryClient(payload: CategoryFormPayload) {
  const res = await clientApi<ApiCategory>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function updateCategoryClient(id: string, payload: CategoryFormPayload) {
  const res = await clientApi<ApiCategory>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function deleteCategoryClient(id: string) {
  await clientApi(`/categories/${id}`, { method: "DELETE" });
}

export async function fetchCategoryTree() {
  const res = await serverApi<ApiCategory[]>("/categories/tree");
  return res.data ?? [];
}
