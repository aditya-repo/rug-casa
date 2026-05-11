import type { Metadata } from "next";
import Link from "next/link";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { categories } from "@/lib/data/categories";
import { catalogProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop All Rugs — RugCasa",
  description:
    "Browse area rugs, runners, carpets, and more. Free shipping across India.",
};

type SearchParams = Promise<{ category?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;
  const categoryMeta = category
    ? categories.find((c) => c.slug === category)
    : undefined;

  const title = categoryMeta ? categoryMeta.label : "All Rugs";
  const description = categoryMeta
    ? `Shop ${categoryMeta.label.toLowerCase()} at RugCasa — premium quality and pan-India delivery.`
    : "Explore our collection of premium rugs and carpets — curated styles for every room, with easy returns and pan-India delivery.";

  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1 pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 pt-4 md:pt-6">
          <div className="flex min-w-0 items-center gap-1.5">
            <Link
              href="/"
              className="-ml-1 shrink-0 rounded-full p-2 text-rc-navy hover:bg-rc-surface"
              aria-label="Back to home"
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
                <li className="shrink-0 font-medium text-rc-navy">Shop</li>
                {categoryMeta ? (
                  <>
                    <li className="shrink-0" aria-hidden>
                      /
                    </li>
                    <li className="flex min-w-0 flex-1 font-medium text-rc-navy">
                      <span className="min-w-0 flex-1 truncate">{categoryMeta.label}</span>
                    </li>
                  </>
                ) : null}
              </ol>
            </nav>
          </div>

          <header className="mt-4 border-b border-rc-border pb-4 md:mt-6 md:pb-6">
            <h1 className="font-heading text-2xl font-semibold text-rc-navy md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-rc-muted md:text-base">
              {description}
            </p>
            {categoryMeta ? (
              <p className="mt-2 text-xs text-rc-muted">
                <Link
                  href="/shop"
                  className="font-medium text-rc-navy underline-offset-2 hover:underline"
                >
                  Clear category filter
                </Link>
              </p>
            ) : null}
          </header>

          <div className="mt-6 md:mt-8">
            <ShopProductGrid products={catalogProducts} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
