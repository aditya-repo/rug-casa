import { API_URL } from "./config";
import type { ApiResponse } from "./types";

export type CheckoutSessionResult = {
  gateway: "cashfree" | "stripe";
  mode: "sandbox" | "production" | null;
  orderId: string | null;
  orderNumber: string | null;
  paymentSessionId: string | null;
  amount: number | null;
  currency: string | null;
  message: string;
};

export type CheckoutVerifyResult = {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  status: string;
  amount: number;
  currency: string;
};

export type CheckoutAddressPayload = {
  label?: string | null;
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
};

export type CheckoutItemPayload = {
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice?: number;
  servicesPerUnit?: number;
  serviceLabels?: string[];
  title?: string;
};

function syncSecret(): string {
  return (
    process.env.CUSTOMER_SYNC_SECRET ||
    process.env.AUTH_SECRET ||
    ""
  );
}

async function checkoutApiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const secret = syncSecret();
  if (!secret) {
    throw new Error("CUSTOMER_SYNC_SECRET or AUTH_SECRET is not configured");
  }

  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Customer-Sync-Secret", secret);

  const res = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Checkout API request failed");
  }
  return body;
}

export async function createCheckoutSession(input: {
  email: string;
  address: CheckoutAddressPayload;
  items: CheckoutItemPayload[];
}): Promise<CheckoutSessionResult> {
  const res = await checkoutApiFetch<CheckoutSessionResult>(
    "/checkout/public/session",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return res.data!;
}

export async function verifyCheckoutPayment(input: {
  email: string;
  orderId: string;
}): Promise<CheckoutVerifyResult> {
  const res = await checkoutApiFetch<CheckoutVerifyResult>(
    "/checkout/public/verify",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
  return res.data!;
}
