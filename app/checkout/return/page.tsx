import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CheckoutReturnClient } from "@/components/checkout/CheckoutReturnClient";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";

export const metadata: Metadata = {
  title: "Payment status — Rugs Bhadohi",
  description: "Payment confirmation for your Rugs Bhadohi order.",
};

export default async function CheckoutReturnPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/checkout/return");
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 px-4 py-10 md:py-14">
        <Suspense
          fallback={
            <div className="mx-auto max-w-lg rounded-lg border border-rc-border bg-white px-6 py-12 text-center text-sm text-rc-muted">
              Confirming your payment…
            </div>
          }
        >
          <CheckoutReturnClient />
        </Suspense>
        <p className="mt-6 text-center text-xs text-rc-muted">
          Need help?{" "}
          <Link href="/contact" className="text-rc-navy underline-offset-2 hover:underline">
            Contact us
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
