import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";

export const metadata: Metadata = {
  title: "Checkout — Rugs Bhadohi",
  description: "Secure checkout for your Rugs Bhadohi order.",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/checkout");
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 pt-4 md:pt-6">
          <div className="flex min-w-0 items-center gap-1.5">
            <Link
              href="/cart"
              className="-ml-1 shrink-0 rounded-full p-2 text-rc-navy hover:bg-rc-surface"
              aria-label="Back to cart"
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
                <li className="shrink-0">
                  <Link href="/cart" className="hover:text-rc-navy">
                    Cart
                  </Link>
                </li>
                <li className="shrink-0" aria-hidden>
                  /
                </li>
                <li className="shrink-0 font-medium text-rc-navy">Checkout</li>
              </ol>
            </nav>
          </div>

          <header className="mt-4 border-b border-rc-border pb-4 md:mt-6 md:pb-6">
            <h1 className="font-heading text-2xl font-semibold text-rc-navy md:text-3xl">
              Checkout
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-rc-muted md:text-base">
              Confirm your shipping address and pay securely. India orders use
              Cashfree; international checkout via Stripe is coming next.
            </p>
          </header>

          <div className="mt-6 md:mt-8">
            <CheckoutClient
              email={session.user.email}
              customerName={session.user.name ?? ""}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
