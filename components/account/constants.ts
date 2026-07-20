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

export type OrderStatus =
  | "delivered"
  | "shipped"
  | "processing"
  | "cancelled"
  | "failed"
  | "pending_payment";

export type RecentOrder = {
  id: string;
  orderNumber: string;
  date: string;
  productName: string;
  size: string;
  total: string;
  imageSrc: string;
  imageAlt: string;
  status: OrderStatus;
  actionLabel: "View Details" | "Track Order";
};
