import { API_URL } from "./config";
import type { ApiResponse } from "./types";
import type { AddressLabel, SavedAddress } from "@/lib/data/addresses";

export type ApiAddress = {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  countryCode: string;
  isDefault: boolean;
};

export type AddressInput = {
  label?: AddressLabel | null;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode?: string | null;
  isDefault?: boolean;
};

function syncSecret(): string {
  return (
    process.env.CUSTOMER_SYNC_SECRET ||
    process.env.AUTH_SECRET ||
    ""
  );
}

async function addressApiFetch<T>(
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
    throw new Error(body.message ?? "Address API request failed");
  }
  return body;
}

export function mapApiAddress(a: ApiAddress): SavedAddress {
  return {
    id: a.id,
    label: a.label,
    fullName: a.fullName,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2 ?? "",
    landmark: a.landmark ?? "",
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    country: a.country,
    countryCode: a.countryCode || undefined,
    isDefault: a.isDefault,
  };
}

export async function fetchCustomerAddresses(
  email: string,
): Promise<SavedAddress[]> {
  const res = await addressApiFetch<ApiAddress[]>("/addresses/public", {
    searchParams: { email },
  });
  return (res.data ?? []).map(mapApiAddress);
}

export async function createCustomerAddress(
  email: string,
  input: AddressInput,
): Promise<SavedAddress> {
  const res = await addressApiFetch<ApiAddress>("/addresses/public", {
    method: "POST",
    body: JSON.stringify({ email, ...input }),
  });
  return mapApiAddress(res.data!);
}

export async function updateCustomerAddress(
  email: string,
  id: string,
  input: AddressInput,
): Promise<SavedAddress> {
  const res = await addressApiFetch<ApiAddress>("/addresses/public", {
    method: "PUT",
    body: JSON.stringify({ email, id, ...input }),
  });
  return mapApiAddress(res.data!);
}

export async function deleteCustomerAddress(
  email: string,
  id: string,
): Promise<SavedAddress[]> {
  const res = await addressApiFetch<ApiAddress[]>("/addresses/public", {
    method: "DELETE",
    body: JSON.stringify({ email, id }),
  });
  return (res.data ?? []).map(mapApiAddress);
}

export async function setDefaultCustomerAddress(
  email: string,
  id: string,
): Promise<SavedAddress> {
  const res = await addressApiFetch<ApiAddress>("/addresses/public/default", {
    method: "POST",
    body: JSON.stringify({ email, id }),
  });
  return mapApiAddress(res.data!);
}
