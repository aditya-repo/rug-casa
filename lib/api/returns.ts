import { clientApi, serverApi } from "./fetch";
import { formatCurrency, formatDate, mapStatusToUi } from "./mappers";

export type ReturnType = "RETURN" | "EXCHANGE";

export type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "PICKED_UP"
  | "REFUNDED"
  | "EXCHANGED"
  | "COMPLETED"
  | "CANCELLED";

export type PickupStatus = "NOT_SCHEDULED" | "SCHEDULED" | "PICKED_UP" | "FAILED";

export type RefundStatus = "NOT_INITIATED" | "PENDING" | "PROCESSED" | "FAILED";

export interface ApiReturn {
  id: string;
  requestNumber: string;
  type: ReturnType;
  status: ReturnStatus;
  reason: string;
  amount: number | string;
  pickupStatus: PickupStatus;
  refundStatus: RefundStatus;
  adminNotes?: string | null;
  createdAt: string;
  order: { id: string; orderNumber: string; total?: number | string };
  customer: { id?: string; firstName: string; lastName: string; email?: string };
  images?: Array<{ id: string; path: string; thumbnail?: string | null }>;
}

export interface ApiReturnStatusHistory {
  id: string;
  status: ReturnStatus;
  note?: string | null;
  createdAt: string;
}

export interface ApiReturnDetail extends ApiReturn {
  order: {
    id: string;
    orderNumber: string;
    total: number | string;
    items?: Array<{ id: string; title: string; sku: string; quantity: number }>;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
  statusHistory: ApiReturnStatusHistory[];
  admin?: { id: string; name: string } | null;
  images: Array<{ id: string; path: string; thumbnail?: string | null }>;
}

export interface ReturnRow {
  id: string;
  requestNumber: string;
  orderId: string;
  orderUuid: string;
  customer: string;
  type: string;
  apiType: ReturnType;
  reason: string;
  amount: string;
  status: string;
  apiStatus: ReturnStatus;
  date: string;
}

export type ReturnWorkflowAction = {
  label: string;
  nextStatus: ReturnStatus;
  notePlaceholder?: string;
};

export const RETURN_WORKFLOW_TABS: Array<{
  label: string;
  value: ReturnStatus;
  description: string;
}> = [
  {
    label: "Pending",
    value: "PENDING",
    description: "New return or exchange requests awaiting review",
  },
  {
    label: "Approved",
    value: "APPROVED",
    description: "Approved requests ready to process",
  },
  {
    label: "Processing",
    value: "PROCESSING",
    description: "Requests being processed for pickup",
  },
  {
    label: "Picked up",
    value: "PICKED_UP",
    description: "Items picked up — issue refund or exchange",
  },
  {
    label: "Refunded",
    value: "REFUNDED",
    description: "Returns with refund issued — mark as completed",
  },
  {
    label: "Exchanged",
    value: "EXCHANGED",
    description: "Exchanges fulfilled — mark as completed",
  },
  {
    label: "Completed",
    value: "COMPLETED",
    description: "Fully resolved return and exchange requests",
  },
];

export const RETURN_TYPE_FILTERS: Array<{ label: string; value: ReturnType | "ALL" }> = [
  { label: "All types", value: "ALL" },
  { label: "Returns", value: "RETURN" },
  { label: "Exchanges", value: "EXCHANGE" },
];

export function formatReturnStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getReturnWorkflowSteps(type: ReturnType): ReturnStatus[] {
  return [
    "PENDING",
    "APPROVED",
    "PROCESSING",
    "PICKED_UP",
    type === "RETURN" ? "REFUNDED" : "EXCHANGED",
    "COMPLETED",
  ];
}

export function getReturnWorkflowAction(
  type: ReturnType,
  status: ReturnStatus,
): ReturnWorkflowAction | null {
  switch (status) {
    case "PENDING":
      return { label: "Approve request", nextStatus: "APPROVED" };
    case "APPROVED":
      return { label: "Start processing", nextStatus: "PROCESSING" };
    case "PROCESSING":
      return {
        label: "Mark picked up",
        nextStatus: "PICKED_UP",
        notePlaceholder: "Pickup date, courier, or handler note…",
      };
    case "PICKED_UP":
      return type === "RETURN"
        ? {
            label: "Mark refunded",
            nextStatus: "REFUNDED",
            notePlaceholder: "Refund reference, amount confirmation, or payment note…",
          }
        : {
            label: "Mark exchanged",
            nextStatus: "EXCHANGED",
            notePlaceholder: "Replacement product, shipment, or exchange note…",
          };
    case "REFUNDED":
    case "EXCHANGED":
      return { label: "Mark completed", nextStatus: "COMPLETED" };
    default:
      return null;
  }
}

export function mapReturnRow(r: ApiReturn): ReturnRow {
  return {
    id: r.id,
    requestNumber: r.requestNumber,
    orderId: r.order.orderNumber,
    orderUuid: r.order.id,
    customer: `${r.customer.firstName} ${r.customer.lastName}`,
    type: mapStatusToUi(r.type),
    apiType: r.type,
    reason: r.reason,
    amount: formatCurrency(r.amount),
    status: mapStatusToUi(r.status),
    apiStatus: r.status,
    date: formatDate(r.createdAt),
  };
}

export async function fetchReturns(params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  search?: string;
}) {
  const res = await serverApi<ApiReturn[]>("/returns", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      type: params?.type?.toUpperCase(),
      status: params?.status?.toUpperCase(),
      search: params?.search,
    },
  });
  return { items: (res.data ?? []).map(mapReturnRow), meta: res.meta };
}

export async function fetchReturn(id: string) {
  const res = await serverApi<ApiReturnDetail>(`/returns/${id}`);
  return res.data!;
}

export async function fetchReturnsClient(params?: {
  page?: number;
  limit?: number;
  type?: ReturnType;
  status?: ReturnStatus;
  search?: string;
}) {
  const res = await clientApi<ApiReturn[]>("/returns", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      type: params?.type,
      status: params?.status,
      search: params?.search,
    },
  });
  return { items: (res.data ?? []).map(mapReturnRow), meta: res.meta };
}

export async function fetchReturnClient(id: string) {
  const res = await clientApi<ApiReturnDetail>(`/returns/${id}`);
  return res.data!;
}

export async function approveReturnClient(id: string) {
  await clientApi(`/returns/${id}/approve`, { method: "PUT" });
}

export async function rejectReturnClient(id: string, note?: string) {
  await clientApi(`/returns/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ note: note?.trim() || undefined }),
  });
}

export async function updateReturnStatusClient(
  id: string,
  payload: {
    status: ReturnStatus;
    note?: string;
    adminNotes?: string;
    pickupStatus?: PickupStatus;
    refundStatus?: RefundStatus;
  },
) {
  const res = await clientApi<ApiReturnDetail>(`/returns/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function advanceReturnClient(
  id: string,
  type: ReturnType,
  currentStatus: ReturnStatus,
  note?: string,
) {
  const action = getReturnWorkflowAction(type, currentStatus);
  if (!action) throw new Error("No workflow action available");
  return updateReturnStatusClient(id, { status: action.nextStatus, note });
}
