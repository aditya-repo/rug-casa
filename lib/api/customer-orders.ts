import { API_URL } from "./config";
import { imageUrl } from "./mappers";
import type { ApiResponse } from "./types";

export type CustomerOrderStatus =
  | "delivered"
  | "shipped"
  | "processing"
  | "cancelled"
  | "failed"
  | "pending_payment";

export type CustomerRecentOrder = {
  id: string;
  orderNumber: string;
  date: string;
  productName: string;
  size: string;
  itemCount: number;
  total: number;
  currency: string;
  imageSrc: string;
  imageAlt: string;
  status: CustomerOrderStatus;
  orderStatus: string;
  paymentStatus: string;
  actionLabel: "View Details" | "Track Order";
};

type ApiRecentOrder = Omit<CustomerRecentOrder, "imageSrc"> & {
  imageSrc: string;
};

function syncSecret(): string {
  return (
    process.env.CUSTOMER_SYNC_SECRET ||
    process.env.AUTH_SECRET ||
    ""
  );
}

export async function fetchCustomerRecentOrders(
  email: string,
  limit = 10,
): Promise<CustomerRecentOrder[]> {
  const secret = syncSecret();
  if (!secret || !email) return [];

  const qs = new URLSearchParams({
    email,
    limit: String(limit),
  });
  const res = await fetch(`${API_URL}/orders/public/recent?${qs}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Customer-Sync-Secret": secret,
    },
    cache: "no-store",
  });
  const body = (await res.json()) as ApiResponse<ApiRecentOrder[]>;
  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "Failed to load orders");
  }

  return (body.data ?? []).map((order) => ({
    ...order,
    imageSrc: imageUrl(order.imageSrc),
  }));
}

export function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatOrderTotal(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}
