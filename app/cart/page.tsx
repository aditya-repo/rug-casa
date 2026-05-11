import type { Metadata } from "next";
import Link from "next/link";
import { CartView } from "@/components/cart/CartView";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { getCartLines } from "@/lib/data/cart";

export const metadata: Metadata = {
  title: "Shopping Cart — RugCasa",
  description:
    "Review your rug order, shipping, and total before checkout at RugCasa.",
};

export default function CartPage() {
  const lines = getCartLines();

  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 pt-4 md:pt-6">
          <div className="flex min-w-0 items-center gap-1.5">
            <Link
              href="/shop"
              className="-ml-1 shrink-0 rounded-full p-2 text-rc-navy hover:bg-rc-surface"
              aria-label="Back to shop"
            >
              <IconArrowLeft className="h-5 w-5" />
            </Link>
            <nav
              className="min-w-0 flex-1 overflow-hidden text-xs text-rc-muted"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
                <li className="shrink-0">
                  <Link href="/" className="hover:text-rc-navy">
                    Home
                  </Link>
                </li>
                <li className="shrink-0" aria-hidden>
                  /
                </li>
                <li className="shrink-0 font-medium text-rc-navy">Cart</li>
              </ol>
            </nav>
          </div>

          <header className="mt-4 border-b border-rc-border pb-4 md:mt-6 md:pb-6">
            <h1 className="font-heading text-2xl font-semibold text-rc-navy md:text-3xl">
              Shopping cart
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-rc-muted md:text-base">
              {lines.length === 0
                ? "When you add rugs, they will appear here with sizes and prices."
                : "Review your rugs and use + or − to change quantities. Removing the last unit removes the item from your cart."}
            </p>
          </header>

          <div className="mt-6 md:mt-8">
            <CartView lines={lines} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
