import type { Metadata } from "next";
import Link from "next/link";
import { CategoriesGrid } from "@/components/categories/CategoriesGrid";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { fetchPublicHomepageCategories } from "@/lib/api/categories";

export const metadata: Metadata = {
  title: "Shop by Category — Rugs Bhadohi",
  description:
    "Browse rug categories: abstract, irregular, traditional, modern, transitional, and patchwork.",
};

export default async function CategoriesPage() {
  const categories = await fetchPublicHomepageCategories();

  return (
    <div className="flex min-h-full flex-col bg-white">
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
                <li className="shrink-0 font-medium text-rc-navy">Categories</li>
              </ol>
            </nav>
          </div>

          <header className="mt-4 border-b border-rc-border pb-4 md:mt-6 md:pb-6">
            <h1 className="font-heading text-2xl font-semibold text-rc-navy md:text-3xl">
              Categories
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-rc-muted md:text-base">
              Browse by style and room. Tap a category to see matching rugs in
              the shop.
            </p>
          </header>

          <div className="mt-6 md:mt-8">
            <CategoriesGrid categories={categories} />
          </div>

          <p className="mt-8 text-center">
            <Link
              href="/shop"
              className="text-sm font-semibold text-rc-navy underline-offset-2 hover:underline"
            >
              View all rugs
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
