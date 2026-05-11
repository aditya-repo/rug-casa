import type { Metadata } from "next";
import Link from "next/link";
import { WishlistGrid } from "@/components/wishlist/WishlistGrid";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { getWishlistProducts } from "@/lib/data/wishlist";

export const metadata: Metadata = {
  title: "Wishlist — RugCasa",
  description:
    "Rugs you have saved. Sign in later to sync your wishlist across devices.",
};

export default function WishlistPage() {
  const products = getWishlistProducts();

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
                <li className="shrink-0 font-medium text-rc-navy">Wishlist</li>
              </ol>
            </nav>
          </div>

          <header className="mt-4 border-b border-rc-border pb-4 md:mt-6 md:pb-6">
            <h1 className="font-heading text-2xl font-semibold text-rc-navy md:text-3xl">
              My wishlist
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-rc-muted md:text-base">
              {products.length === 0
                ? "Save rugs you love and compare them here before you order."
                : `${products.length} ${products.length === 1 ? "item" : "items"} saved. Prices and availability may change.`}
            </p>
          </header>

          <div className="mt-6 md:mt-8">
            <WishlistGrid products={products} />
          </div>

          {products.length > 0 ? (
            <p className="mt-8 text-center">
              <Link
                href="/shop"
                className="text-sm font-semibold text-rc-navy underline-offset-2 hover:underline"
              >
                Continue shopping
              </Link>
            </p>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
