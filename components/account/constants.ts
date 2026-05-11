import type { ComponentType } from "react";
import { IconHeart } from "@/components/layout/icons";
import {
  IconHelpSupport,
  IconIdCard,
  IconMapPin,
  IconOrders,
} from "./account-icons";

export type AccountNavIcon = ComponentType<{ className?: string }>;

export type AccountNavEntry = {
  id: string;
  label: string;
  href: string;
  Icon: AccountNavIcon;
};

export const accountNavItems: AccountNavEntry[] = [
  { id: "orders", label: "Orders", href: "/account", Icon: IconOrders },
  { id: "wishlist", label: "Wishlist", href: "/wishlist", Icon: IconHeart },
  { id: "addresses", label: "Addresses", href: "/account/addresses", Icon: IconMapPin },
  {
    id: "profile",
    label: "Profile Information",
    href: "/account/profile",
    Icon: IconIdCard,
  },
  { id: "help", label: "Help & Support", href: "/help", Icon: IconHelpSupport },
];

export type OrderStatus = "delivered" | "shipped" | "processing";

export type RecentOrder = {
  id: string;
  date: string;
  productName: string;
  size: string;
  total: string;
  imageSrc: string;
  imageAlt: string;
  status: OrderStatus;
  actionLabel: "View Details" | "Track Order";
};

export const mockRecentOrders: RecentOrder[] = [
  {
    id: "RC12345",
    date: "May 20, 2024",
    productName: "Persian Medallion Rug",
    size: "5 x 7 ft",
    total: "₹4,999",
    imageSrc:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=160&h=160&fit=crop",
    imageAlt: "Persian medallion rug",
    status: "delivered",
    actionLabel: "View Details",
  },
  {
    id: "RC12346",
    date: "May 18, 2024",
    productName: "Modern Abstract Rug",
    size: "6 x 9 ft",
    total: "₹8,499",
    imageSrc:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=160&h=160&fit=crop",
    imageAlt: "Modern abstract rug",
    status: "shipped",
    actionLabel: "Track Order",
  },
  {
    id: "RC12347",
    date: "May 15, 2024",
    productName: "Kilim Runner",
    size: "2.5 x 8 ft",
    total: "₹3,299",
    imageSrc:
      "https://images.unsplash.com/photo-1600166898402-4ae75bbb0e93?w=160&h=160&fit=crop",
    imageAlt: "Kilim runner rug",
    status: "processing",
    actionLabel: "View Details",
  },
];
