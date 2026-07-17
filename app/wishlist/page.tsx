import type { Metadata } from "next";
import Link from "next/link";
import {
  AccountBreadcrumb,
  DesktopAccountSidebar,
} from "@/components/account/AccountChrome";
import { WishlistGrid } from "@/components/wishlist/WishlistGrid";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { getMyWishlistProducts } from "@/lib/auth/wishlist-actions";

export const metadata: Metadata = {
  title: "Wishlist — Rugs Bhadohi",
  description: "Rugs you have saved to your Rugs Bhadohi wishlist.",
};

export default async function WishlistPage() {
  const products = await getMyWishlistProducts();

  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 bg-white pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-8">
          <div className="hidden md:block">
            <AccountBreadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "My Account", href: "/account" },
                { label: "Wishlist" },
              ]}
            />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <DesktopAccountSidebar activeNavId="wishlist" />
              <div className="min-w-0 flex-1 space-y-6">
                <header>
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 lg:text-[28px] lg:leading-tight">
                    My wishlist
                  </h1>
                </header>
                <WishlistGrid products={products} variant="account" />
                {products.length > 0 ? (
                  <p>
                    <Link
                      href="/shop"
                      className="text-sm font-semibold text-rc-accent hover:underline"
                    >
                      Continue shopping
                    </Link>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                href="/account"
                className="-ml-1 shrink-0 rounded-full p-2 text-rc-navy hover:bg-rc-surface"
                aria-label="Back to my account"
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
                    <Link href="/account" className="hover:text-rc-navy">
                      My Account
                    </Link>
                  </li>
                  <li className="shrink-0" aria-hidden>
                    /
                  </li>
                  <li className="shrink-0 font-medium text-rc-navy">Wishlist</li>
                </ol>
              </nav>
            </div>

            <header className="mt-4 border-b border-rc-border pb-4">
              <h1 className="font-heading text-2xl font-semibold text-rc-navy">
                My wishlist
              </h1>
            </header>

            <div className="mt-6">
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
