import type { Metadata } from "next";
import { AccountScreen } from "@/components/account/AccountScreen";

export const metadata: Metadata = {
  title: "My Account — Rugs Bhadohi",
  description:
    "Manage your Rugs Bhadohi account, orders, wishlist, addresses, and preferences.",
};

export default function AccountPage() {
  return <AccountScreen />;
}
