import { API_URL } from "./config";
import type { ApiResponse } from "./types";
import type { CartLineItem } from "@/lib/cart/types";

function syncSecret(): string {
  return (
    process.env.CUSTOMER_SYNC_SECRET ||
    process.env.AUTH_SECRET ||
    ""
  );
}

async function cartApiFetch<T>(
  path: string,
  init: RequestInit & { searchParams?: Record<string, string> } = {},
): Promise<ApiResponse<T>> {
  const secret = syncSecret();
  if (!secret) {
    throw new Error("CUSTOMER_SYNC_SECRET or AUTH_SECRET is not configured");
  }

  const { searchParams, ...rest } = init;
  let url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (searchParams) {
    const qs = new URLSearchParams(searchParams).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = new Headers(rest.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Customer-Sync-Secret", secret);

  const res = await fetch(url, {
    ...rest,
    headers,
    cache: "no-store",
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Cart API request failed");
  }
  return body;
}

export async function fetchCustomerCart(email: string): Promise<CartLineItem[]> {
  const res = await cartApiFetch<{ items: CartLineItem[] }>("/cart/public", {
    searchParams: { email },
  });
  return res.data?.items ?? [];
}

export async function replaceCustomerCart(
  email: string,
  items: CartLineItem[],
): Promise<CartLineItem[]> {
  const res = await cartApiFetch<{ items: CartLineItem[] }>("/cart/public", {
    method: "PUT",
    body: JSON.stringify({ email, items }),
  });
  return res.data?.items ?? [];
}

export async function clearCustomerCart(email: string): Promise<CartLineItem[]> {
  const res = await cartApiFetch<{ items: CartLineItem[] }>("/cart/public", {
    method: "DELETE",
    body: JSON.stringify({ email }),
  });
  return res.data?.items ?? [];
}
