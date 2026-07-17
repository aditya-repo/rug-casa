import { API_URL } from "./config";
import {
  mapPublicProduct,
  type ApiPublicProduct,
  type ShopProductItem,
} from "./shop-products";
import type { ApiResponse } from "./types";

export type WishlistToggleResult = {
  productId: string;
  wishlisted: boolean;
};

function syncSecret(): string {
  return (
    process.env.CUSTOMER_SYNC_SECRET ||
    process.env.AUTH_SECRET ||
    ""
  );
}

async function wishlistApiFetch<T>(
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
    throw new Error(body.message ?? "Wishlist API request failed");
  }
  return body;
}

export async function fetchWishlistProductIds(email: string): Promise<string[]> {
  try {
    const res = await wishlistApiFetch<{ productIds: string[] }>(
      "/wishlist/public/ids",
      { searchParams: { email } },
    );
    return res.data?.productIds ?? [];
  } catch {
    return [];
  }
}

export async function fetchWishlistProducts(
  email: string,
): Promise<ShopProductItem[]> {
  try {
    const res = await wishlistApiFetch<ApiPublicProduct[]>("/wishlist/public", {
      searchParams: { email },
    });
    return (res.data ?? []).map(mapPublicProduct);
  } catch {
    return [];
  }
}

export async function toggleWishlistItem(
  email: string,
  productId: string,
): Promise<WishlistToggleResult> {
  const res = await wishlistApiFetch<WishlistToggleResult>(
    "/wishlist/public/toggle",
    {
      method: "POST",
      body: JSON.stringify({ email, productId }),
    },
  );
  return res.data!;
}

export async function removeWishlistItem(
  email: string,
  productId: string,
): Promise<WishlistToggleResult> {
  const res = await wishlistApiFetch<WishlistToggleResult>("/wishlist/public", {
    method: "DELETE",
    body: JSON.stringify({ email, productId }),
  });
  return res.data!;
}
