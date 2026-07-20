import { clientApi, publicApi, serverApi } from "./fetch";
import { imageUrl } from "./mappers";

export type CollectionStatus = "ACTIVE" | "DRAFT" | "INACTIVE";

export interface ApiCollection {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sortOrder: number;
  status?: CollectionStatus;
  createdAt?: string;
  updatedAt?: string;
  _count?: { products: number };
}

export async function fetchPublicHomepageCollections(): Promise<ApiCollection[]> {
  try {
    const res = await publicApi<ApiCollection[]>("/collections/public/homepage");
    return (res.data ?? []).map((item) => ({
      ...item,
      image: item.image ? imageUrl(item.image) : null,
    }));
  } catch {
    return [];
  }
}

export interface CollectionFormPayload {
  title: string;
  slug?: string;
  description?: string;
  image?: string | null;
  sortOrder?: number;
  status?: CollectionStatus;
}

export async function fetchCollections(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: CollectionStatus;
}) {
  const res = await serverApi<ApiCollection[]>("/collections", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 100,
      search: params?.search,
      status: params?.status,
    },
  });
  return { items: res.data ?? [], meta: res.meta };
}

export async function fetchCollectionsClient(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: CollectionStatus;
}) {
  const res = await clientApi<ApiCollection[]>("/collections", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 100,
      search: params?.search,
      status: params?.status,
    },
  });
  return { items: res.data ?? [], meta: res.meta };
}

export async function fetchActiveCollections() {
  try {
    const res = await serverApi<ApiCollection[]>("/collections/active");
    return res.data ?? [];
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message === "fetch failed" ||
        (err as Error & { cause?: { code?: string } }).cause?.code === "ECONNREFUSED")
    ) {
      return [];
    }
    throw err;
  }
}

export async function fetchActiveCollectionsClient() {
  const res = await clientApi<ApiCollection[]>("/collections/active");
  return res.data ?? [];
}

export async function createCollectionClient(payload: CollectionFormPayload) {
  const res = await clientApi<ApiCollection>("/collections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function updateCollectionClient(id: string, payload: CollectionFormPayload) {
  const res = await clientApi<ApiCollection>(`/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function deleteCollectionClient(id: string) {
  await clientApi(`/collections/${id}`, { method: "DELETE" });
}
