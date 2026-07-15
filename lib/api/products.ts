import { serverApi, clientApi } from "./fetch";
import { mapProductFormToApi, mapProductToDetail, mapProductToListItem } from "./mappers";
import type { DashboardProduct } from "@/lib/dashboard/products";

export type ProductApiStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ProductListRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  stock: number;
  variantCount: number;
  status: string;
  apiStatus: ProductApiStatus;
  categoryName: string;
  categoryId: string;
  collection: string;
  shape: string;
  material: string;
  weavingType: string;
  patternArt: string;
  thickness: string;
  origin: string;
  featured: boolean;
  updatedAt: string;
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  featured?: boolean;
}) {
  const res = await serverApi<unknown[]>("/products", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 100,
      search: params?.search,
      status: params?.status?.toUpperCase(),
      categoryId: params?.categoryId,
      featured: params?.featured === undefined ? undefined : params.featured ? "true" : "false",
    },
  });
  const items = (res.data ?? []).map((p) =>
    mapProductToListItem(p as Parameters<typeof mapProductToListItem>[0]),
  );
  return { items, meta: res.meta };
}

export async function fetchProductsClient(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProductApiStatus;
  categoryId?: string;
  featured?: boolean;
}) {
  const res = await clientApi<unknown[]>("/products", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 100,
      search: params?.search,
      status: params?.status,
      categoryId: params?.categoryId,
      featured: params?.featured === undefined ? undefined : params.featured ? "true" : "false",
    },
  });
  const items = (res.data ?? []).map((p) =>
    mapProductToListItem(p as Parameters<typeof mapProductToListItem>[0]),
  );
  return { items, meta: res.meta };
}

export async function fetchProductById(id: string): Promise<DashboardProduct | null> {
  try {
    const res = await serverApi<unknown>(`/products/${id}`);
    return res.data ? mapProductToDetail(res.data as Parameters<typeof mapProductToDetail>[0]) : null;
  } catch {
    return null;
  }
}

export async function createProductClient(form: DashboardProduct) {
  const payload = mapProductFormToApi(form);
  const res = await clientApi<unknown>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapProductToDetail(res.data as Parameters<typeof mapProductToDetail>[0]);
}

export async function updateProductClient(id: string, form: DashboardProduct) {
  const payload = mapProductFormToApi(form);
  const res = await clientApi<unknown>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return mapProductToDetail(res.data as Parameters<typeof mapProductToDetail>[0]);
}
