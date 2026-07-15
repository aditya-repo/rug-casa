import { serverApi } from "./fetch";
import { formatCurrency, formatRelativeDate, mapStatusToUi } from "./mappers";

export interface DashboardOverview {
  products: { total: number; active: number; draft: number; archived: number; outOfStock: number };
  categories: number;
  orders: { total: number; pending: number; completed: number; cancelled: number };
  returns: { returns: number; exchanges: number; pending: number };
  customers: number;
  reviews: { total: number; pending: number; averageRating: number };
  revenue: number;
}

export interface LatestOrder {
  id: string;
  orderNumber: string;
  total: number | string;
  status: string;
  createdAt: string;
  customer: { firstName: string; lastName: string };
  _count?: { items: number };
}

export interface LatestCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalSpend: number | string;
  status: string;
  createdAt: string;
}

export interface LatestReview {
  id: string;
  rating: number;
  content: string;
  status: string;
  createdAt: string;
  product: { id: string; title: string };
  customer: { id: string; firstName: string; lastName: string };
}

export interface DashboardLatest {
  orders: LatestOrder[];
  customers: LatestCustomer[];
  reviews: LatestReview[];
}

export async function fetchDashboardOverview() {
  const res = await serverApi<DashboardOverview>("/dashboard");
  return res.data!;
}

export async function fetchDashboardLatest() {
  const res = await serverApi<DashboardLatest>("/dashboard/latest");
  return res.data!;
}

export interface MonthlySale {
  month: string;
  revenue: number;
}

export interface DashboardAnalytics {
  monthlySales: MonthlySale[];
  topSellingProducts: Array<{
    product: { id: string; title: string; slug: string } | null;
    quantitySold: number;
  } | null>;
  topCategories: Array<{
    category: { id: string; name: string; slug: string } | null;
    productCount: number;
  } | null>;
  lowStockProducts: Array<{
    sku: string;
    stock: number;
    product: { id: string; title: string; slug: string };
  }>;
}

export async function fetchDashboardAnalytics() {
  const res = await serverApi<DashboardAnalytics>("/dashboard/analytics");
  return res.data!;
}

/** Ensure the last N calendar months appear even when revenue is zero. */
export function fillMonthlySales(sales: MonthlySale[], months = 6): MonthlySale[] {
  const map = new Map(sales.map((s) => [s.month, s.revenue]));
  const result: MonthlySale[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ month: key, revenue: map.get(key) ?? 0 });
  }
  return result;
}

export function buildStatCards(overview: DashboardOverview) {
  return [
    {
      label: "Revenue",
      value: formatCurrency(overview.revenue),
      change: `${overview.orders.total} total orders`,
      trend: "neutral" as const,
      href: "/dashboard/orders",
    },
    {
      label: "Pending orders",
      value: String(overview.orders.pending),
      change: overview.orders.pending > 0 ? "Needs approval" : "All clear",
      trend: (overview.orders.pending > 0 ? "warn" : "neutral") as "warn" | "neutral",
      href: "/dashboard/orders",
    },
    {
      label: "Products",
      value: String(overview.products.total),
      change: `${overview.products.active} published · ${overview.products.outOfStock} out of stock`,
      trend: (overview.products.outOfStock > 0 ? "warn" : "neutral") as "warn" | "neutral",
      href: "/dashboard/products",
    },
    {
      label: "Customers",
      value: String(overview.customers),
      change: `${overview.categories} categories`,
      trend: "neutral" as const,
      href: "/dashboard/customers",
    },
  ];
}

export function mapRecentOrder(o: LatestOrder) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customer: `${o.customer.firstName} ${o.customer.lastName}`,
    total: formatCurrency(o.total),
    status: mapStatusToUi(o.status),
    date: formatRelativeDate(o.createdAt),
  };
}

export function mapRecentCustomer(c: LatestCustomer) {
  return {
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    email: c.email,
    spent: formatCurrency(c.totalSpend),
    status: mapStatusToUi(c.status),
    joined: formatRelativeDate(c.createdAt),
  };
}

export function mapRecentReview(r: LatestReview) {
  return {
    id: r.id,
    product: r.product.title,
    customer: `${r.customer.firstName} ${r.customer.lastName}`,
    rating: r.rating,
    excerpt: r.content.length > 80 ? `${r.content.slice(0, 80)}…` : r.content,
    status: mapStatusToUi(r.status),
    date: formatRelativeDate(r.createdAt),
  };
}
