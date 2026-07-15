import { clientApi, serverApi } from "./fetch";
import { formatCurrency, formatDate, mapStatusToUi } from "./mappers";

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface ApiCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: CustomerStatus;
  totalSpend: number | string;
  lastLoginAt?: string | null;
  createdAt: string;
  _count?: { orders: number; reviews?: number };
}

export interface ApiCustomerDetail extends ApiCustomer {
  addresses?: Array<{
    id: string;
    label?: string | null;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  orders?: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number | string;
    createdAt: string;
    _count?: { items: number };
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    status: string;
    createdAt: string;
    product?: { id: string; title: string };
  }>;
}

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: string;
  joined: string;
  status: string;
  apiStatus: CustomerStatus;
}

export function mapCustomerRow(c: ApiCustomer): CustomerRow {
  return {
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    email: c.email,
    phone: c.phone ?? "—",
    orders: c._count?.orders ?? 0,
    spent: formatCurrency(c.totalSpend),
    joined: formatDate(c.createdAt),
    status: mapStatusToUi(c.status),
    apiStatus: c.status,
  };
}

export async function fetchCustomers(params?: { page?: number; limit?: number; search?: string }) {
  const res = await serverApi<ApiCustomer[]>("/customers", {
    searchParams: { page: params?.page ?? 1, limit: params?.limit ?? 50, search: params?.search },
  });
  return { items: (res.data ?? []).map(mapCustomerRow), meta: res.meta };
}

export async function fetchCustomersClient(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerStatus;
}) {
  const res = await clientApi<ApiCustomer[]>("/customers", {
    searchParams: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
      search: params?.search,
      status: params?.status,
    },
  });
  return { items: (res.data ?? []).map(mapCustomerRow), meta: res.meta };
}

export async function fetchCustomerClient(id: string) {
  const res = await clientApi<ApiCustomerDetail>(`/customers/${id}`);
  return res.data!;
}

export async function updateCustomerStatusClient(id: string, status: CustomerStatus) {
  const res = await clientApi<ApiCustomer>(`/customers/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  return res.data!;
}
