import { clientApi, serverApi } from "./fetch";

export type ColorStatus = "ACTIVE" | "DRAFT" | "INACTIVE";

export interface ApiColor {
  id: string;
  name: string;
  hex: string;
  sortOrder: number;
  status?: ColorStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ColorFormPayload {
  name: string;
  hex: string;
  sortOrder?: number;
  status?: ColorStatus;
}

export async function fetchColors(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ColorStatus;
}) {
  const res = await serverApi<ApiColor[]>("/colors", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 200,
      search: params?.search,
      status: params?.status,
    },
  });
  return { items: res.data ?? [], meta: res.meta };
}

export async function fetchColorsClient(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ColorStatus;
}) {
  const res = await clientApi<ApiColor[]>("/colors", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 200,
      search: params?.search,
      status: params?.status,
    },
  });
  return { items: res.data ?? [], meta: res.meta };
}

function isNetworkFetchError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.message === "fetch failed") return true;
  const cause = (err as Error & { cause?: { code?: string } }).cause;
  return cause?.code === "ECONNREFUSED" || cause?.code === "ENOTFOUND";
}

export async function fetchActiveColors() {
  try {
    const res = await serverApi<ApiColor[]>("/colors/active");
    return res.data ?? [];
  } catch (err) {
    if (isNetworkFetchError(err)) return [];
    throw err;
  }
}

export async function fetchActiveColorsClient() {
  try {
    const res = await clientApi<ApiColor[]>("/colors/active");
    return res.data ?? [];
  } catch (err) {
    if (isNetworkFetchError(err)) return [];
    throw err;
  }
}

export async function createColorClient(payload: ColorFormPayload) {
  const res = await clientApi<ApiColor>("/colors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function updateColorClient(id: string, payload: ColorFormPayload) {
  const res = await clientApi<ApiColor>(`/colors/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function deleteColorClient(id: string) {
  const res = await clientApi<{ message: string }>(`/colors/${id}`, {
    method: "DELETE",
  });
  return res.data;
}
