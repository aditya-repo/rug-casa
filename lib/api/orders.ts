import { clientApi, serverApi } from "./fetch";
import { formatCurrency, formatDate, mapStatusToUi } from "./mappers";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "EXCHANGED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "COD";

export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  total: number | string;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string; phone?: string | null };
  _count?: { items: number };
}

export interface ApiAddress {
  id: string;
  label?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ApiOrderItem {
  id: string;
  title: string;
  sku: string;
  quantity: number;
  price: number | string;
  total: number | string;
  product?: { id: string; title: string; slug: string };
  variant?: { id: string; sku: string; size?: string | null } | null;
}

export interface ApiOrderStatusHistory {
  id: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface ApiOrderNote {
  id: string;
  note: string;
  isInternal: boolean;
  createdAt: string;
  admin?: { id: string; name: string } | null;
}

export interface ApiOrderDetail extends ApiOrder {
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  shippingCost: number | string;
  currency: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  invoiceNumber?: string | null;
  invoicePath?: string | null;
  notes?: string | null;
  items: ApiOrderItem[];
  statusHistory: ApiOrderStatusHistory[];
  orderNotes: ApiOrderNote[];
  shippingAddress?: ApiAddress | null;
  billingAddress?: ApiAddress | null;
  returnRequests?: Array<{ id: string; status: string; createdAt: string }>;
}

export interface OrderRow {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  items: number;
  total: string;
  payment: string;
  paymentStatus: string;
  status: string;
  apiStatus: OrderStatus;
  apiPaymentStatus: PaymentStatus;
  date: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "EXCHANGED",
  "REFUNDED",
];

export const PAYMENT_STATUSES: PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED", "COD"];

/** Fulfillment pipeline: customer order → admin approve → pack → ship */
export const ORDER_WORKFLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED"];

export const ORDER_WORKFLOW_TABS: Array<{
  label: string;
  value: OrderStatus;
  description: string;
}> = [
  {
    label: "Pending",
    value: "PENDING",
    description: "New customer orders awaiting admin approval",
  },
  {
    label: "Confirmed",
    value: "CONFIRMED",
    description: "Approved orders ready to be packed",
  },
  {
    label: "Packed",
    value: "PACKED",
    description: "Packed orders ready to ship",
  },
  {
    label: "Shipped",
    value: "SHIPPED",
    description: "Orders that have been shipped",
  },
];

export type OrderWorkflowAction = {
  label: string;
  nextStatus: OrderStatus;
  notePlaceholder?: string;
};

export function getWorkflowAction(status: OrderStatus): OrderWorkflowAction | null {
  switch (status) {
    case "PENDING":
      return {
        label: "Approve order",
        nextStatus: "CONFIRMED",
        notePlaceholder: "Optional note for approval…",
      };
    case "CONFIRMED":
      return {
        label: "Mark as packed",
        nextStatus: "PACKED",
        notePlaceholder: "Optional packing note…",
      };
    case "PACKED":
      return {
        label: "Mark as shipped",
        nextStatus: "SHIPPED",
        notePlaceholder: "Carrier, tracking number, or shipping note…",
      };
    default:
      return null;
  }
}

export function getWorkflowStepIndex(status: OrderStatus): number {
  const idx = ORDER_WORKFLOW.indexOf(status);
  return idx === -1 ? -1 : idx;
}

export function formatOrderStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function mapOrderRow(o: ApiOrder): OrderRow {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customer: `${o.customer.firstName} ${o.customer.lastName}`,
    customerEmail: o.customer.email,
    items: o._count?.items ?? 0,
    total: formatCurrency(o.total),
    payment: mapStatusToUi(o.paymentMethod ?? o.paymentStatus),
    paymentStatus: mapStatusToUi(o.paymentStatus),
    status: mapStatusToUi(o.status),
    apiStatus: o.status,
    apiPaymentStatus: o.paymentStatus,
    date: formatDate(o.createdAt),
  };
}

export async function fetchOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
}) {
  const res = await serverApi<ApiOrder[]>("/orders", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      status: params?.status?.toUpperCase(),
      paymentStatus: params?.paymentStatus?.toUpperCase(),
      search: params?.search,
    },
  });
  return { items: (res.data ?? []).map(mapOrderRow), meta: res.meta };
}

export async function fetchOrder(id: string) {
  const res = await serverApi<ApiOrderDetail>(`/orders/${id}`);
  return res.data!;
}

export async function fetchOrdersClient(params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
}) {
  const res = await clientApi<ApiOrder[]>("/orders", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      status: params?.status,
      paymentStatus: params?.paymentStatus,
      search: params?.search,
    },
  });
  return { items: (res.data ?? []).map(mapOrderRow), meta: res.meta };
}

export async function fetchOrderClient(id: string) {
  const res = await clientApi<ApiOrderDetail>(`/orders/${id}`);
  return res.data!;
}

export async function updateOrderStatusClient(
  id: string,
  payload: { status: OrderStatus; note?: string },
) {
  const res = await clientApi<ApiOrderDetail>(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function addOrderNoteClient(
  id: string,
  payload: { note: string; isInternal?: boolean },
) {
  const res = await clientApi<ApiOrderNote>(`/orders/${id}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function generateInvoiceClient(id: string) {
  const res = await clientApi<{ invoiceNumber: string; invoicePath: string }>(`/orders/${id}/invoice`, {
    method: "POST",
  });
  return res.data!;
}
