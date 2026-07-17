import type { Metadata } from "next";
import Link from "next/link";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { auth } from "@/auth";
import {
  fetchPublicHomepageCategories,
  fetchPublicShopCategories,
} from "@/lib/api/categories";
import { fetchPublicHomepageCollections } from "@/lib/api/collections";
import { fetchPublicShopProducts } from "@/lib/api/shop-products";
import { getMyWishlistProductIds } from "@/lib/auth/wishlist-actions";

export const metadata: Metadata = {
  title: "Shop All Rugs — Rugs Bhadohi",
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
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.email);

  const [homepageCategories, shopCategories, collections, catalog, wishlistedIds] =
    await Promise.all([
      fetchPublicHomepageCategories(),
      fetchPublicShopCategories(),
      fetchPublicHomepageCollections(),
      fetchPublicShopProducts({
        limit: 100,
        sort: "featured",
      }),
      isAuthenticated ? getMyWishlistProductIds() : Promise.resolve([] as string[]),
    ]);
  const categories = shopCategories.length > 0 ? shopCategories : homepageCategories;
  const categoryMeta = category
    ? categories.find((c) => c.slug === category)
    : undefined;

  const title = categoryMeta ? categoryMeta.label : "All Rugs";
  const description = categoryMeta
    ? `Shop ${categoryMeta.label.toLowerCase()} at Rugs Bhadohi — premium handwoven quality with pan-India delivery.`
    : "Explore our collection of premium rugs and carpets — curated styles for every room, with easy returns and pan-India delivery.";

  const collectionOptions = collections.map((item) => ({
    slug: item.slug,
    label: item.title,
  }));

  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1 pb-12 md:pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-5 md:pt-8">
          <nav className="text-xs text-rc-muted" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-rc-navy">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/shop" className="hover:text-rc-navy">
                  Rugs
                </Link>
              </li>
              {categoryMeta ? (
                <>
                  <li aria-hidden>/</li>
                  <li className="font-medium text-rc-navy">{categoryMeta.label}</li>
                </>
              ) : (
                <>
                  <li aria-hidden>/</li>
                  <li className="font-medium text-rc-navy">All Rugs</li>
                </>
              )}
            </ol>
          </nav>

          <header className="mt-5 max-w-3xl text-left md:mt-7">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-rc-muted md:text-[15px] md:leading-7">
              {description}{" "}
              <Link
                href="/about"
                className="font-medium text-rc-navy underline underline-offset-2"
              >
                Read More
              </Link>
            </p>
          </header>

          <div className="mt-8 border-t border-rc-border pt-8 md:mt-10 md:pt-10">
            <ShopProductGrid
              products={catalog.products}
              categories={categories}
              collections={collectionOptions}
              initialCategorySlug={category}
              isAuthenticated={isAuthenticated}
              wishlistedIds={wishlistedIds}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
