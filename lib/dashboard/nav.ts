import type { DashboardNavIcon } from "@/components/dashboard/dashboard-icons";
import {
  IconBanners,
  IconCategories,
  IconCollections,
  IconCustomers,
  IconDashboard,
  IconOrders,
  IconProducts,
  IconReturns,
  IconReviews,
} from "@/components/dashboard/dashboard-icons";

export type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
  Icon: DashboardNavIcon;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { id: "overview", label: "Dashboard", href: "/dashboard", Icon: IconDashboard },
  { id: "categories", label: "Categories", href: "/dashboard/categories", Icon: IconCategories },
  { id: "collections", label: "Collections", href: "/dashboard/collections", Icon: IconCollections },
  { id: "banners", label: "Banners", href: "/dashboard/banners", Icon: IconBanners },
  { id: "products", label: "Products", href: "/dashboard/products", Icon: IconProducts },
  { id: "orders", label: "Orders", href: "/dashboard/orders", Icon: IconOrders },
  { id: "customers", label: "Customers", href: "/dashboard/customers", Icon: IconCustomers },
  { id: "reviews", label: "Reviews", href: "/dashboard/reviews", Icon: IconReviews },
  { id: "returns", label: "Returns & Exchanges", href: "/dashboard/returns", Icon: IconReturns },
];
