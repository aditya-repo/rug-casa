import { API_URL } from "./config";
import type { ApiResponse } from "./types";

export type CustomerProfile = {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string | null;
  gender: string;
  dateOfBirth: string;
  status: string;
};

function syncSecret(): string {
  return (
    process.env.CUSTOMER_SYNC_SECRET ||
    process.env.AUTH_SECRET ||
    ""
  );
}

async function customerApiFetch<T>(
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
    throw new Error(body.message ?? "Customer API request failed");
  }
  return body;
}

export async function syncCustomerFromGoogle(input: {
  email: string;
  firstName: string;
  lastName: string;
  image?: string | null;
}): Promise<CustomerProfile> {
  const res = await customerApiFetch<CustomerProfile>("/customers/public/sync", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.data!;
}

export async function fetchCustomerProfile(
  email: string,
): Promise<CustomerProfile | null> {
  try {
    const res = await customerApiFetch<CustomerProfile>("/customers/public/me", {
      searchParams: { email },
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function updateCustomerProfile(input: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  image?: string | null;
}): Promise<CustomerProfile> {
  const res = await customerApiFetch<CustomerProfile>("/customers/public/me", {
    method: "PUT",
    body: JSON.stringify({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone || null,
      gender: input.gender || null,
      dateOfBirth: input.dateOfBirth || null,
      image: input.image ?? null,
    }),
  });
  return res.data!;
}
