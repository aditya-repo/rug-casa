import type { Metadata } from "next";
import { AccountScreen } from "@/components/account/AccountScreen";

export const metadata: Metadata = {
  title: "My Account — RugCasa",
  description:
    "Manage your RugCasa account, orders, wishlist, addresses, and preferences.",
};

export default function AccountPage() {
  return <AccountScreen />;
}
