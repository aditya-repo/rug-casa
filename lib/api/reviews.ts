import { serverApi, clientApi } from "./fetch";
import { formatDate, mapStatusToUi } from "./mappers";

export type ReviewStatusFilter = "PENDING" | "APPROVED" | "REJECTED" | "REPORTED";

export interface ApiReview {
  id: string;
  rating: number;
  title?: string | null;
  content: string;
  status: string;
  rejectionReason?: string | null;
  isVerifiedPurchase?: boolean;
  adminReply?: string | null;
  createdAt: string;
  product: { id?: string; title: string; slug?: string };
  customer: { id?: string; firstName: string; lastName: string; email?: string };
}

export interface ReviewRow {
  id: string;
  product: string;
  customer: string;
  rating: number;
  title: string;
  excerpt: string;
  status: string;
  apiStatus: string;
  rejectionReason: string;
  date: string;
}

export function mapReviewRow(r: ApiReview): ReviewRow {
  return {
    id: r.id,
    product: r.product.title,
    customer: `${r.customer.firstName} ${r.customer.lastName}`,
    rating: r.rating,
    title: r.title ?? "",
    excerpt: r.content,
    status: mapStatusToUi(r.status),
    apiStatus: r.status,
    rejectionReason: r.rejectionReason ?? "",
    date: formatDate(r.createdAt),
  };
}

export async function fetchReviews(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const res = await serverApi<ApiReview[]>("/reviews", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      status: params?.status?.toUpperCase(),
      search: params?.search,
    },
  });
  return { items: (res.data ?? []).map(mapReviewRow), meta: res.meta };
}

export async function fetchReviewsClient(params?: {
  page?: number;
  limit?: number;
  status?: ReviewStatusFilter;
  search?: string;
}) {
  const res = await clientApi<ApiReview[]>("/reviews", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      status: params?.status,
      search: params?.search,
    },
  });
  return { items: (res.data ?? []).map(mapReviewRow), meta: res.meta };
}

export async function approveReviewClient(id: string) {
  await clientApi(`/reviews/${id}/approve`, { method: "PUT" });
}

export async function rejectReviewClient(id: string, reason: string) {
  await clientApi(`/reviews/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
}

export async function fetchReviewClient(id: string) {
  const res = await clientApi<ApiReview>(`/reviews/${id}`);
  return res.data!;
}
