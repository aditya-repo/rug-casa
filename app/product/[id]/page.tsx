import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ProductDetailClient } from "@/components/product/pdp/ProductDetailClient";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { fetchPublicProductDetail } from "@/lib/api/product-detail";
import { getProductDetailModel } from "@/lib/data/product-detail";
import { getMyWishlistProductIds } from "@/lib/auth/wishlist-actions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const model =
    (await fetchPublicProductDetail(id)) ?? getProductDetailModel(id);
  if (!model) return { title: "Product — Rugs Bhadohi" };
  return {
    title: `${model.product.name} — Rugs Bhadohi`,
    description: model.subtitle || model.product.name,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.email);

  const [model, wishlistedIds] = await Promise.all([
    (async () =>
      (await fetchPublicProductDetail(id)) ?? getProductDetailModel(id))(),
    isAuthenticated ? getMyWishlistProductIds() : Promise.resolve([] as string[]),
  ]);
  if (!model) notFound();

  const initialWishlisted = wishlistedIds.includes(model.product.id);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <HeaderAndNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 md:pb-12 md:pt-6">
          <nav className="text-xs text-rc-muted" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              {model.breadcrumbs.map((crumb, i) => {
                const isLast = i === model.breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                    {i > 0 ? <span aria-hidden>/</span> : null}
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="hover:text-rc-navy">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "font-medium text-rc-navy" : undefined}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mt-5 md:mt-7">
            <ProductDetailClient
              model={model}
              isAuthenticated={isAuthenticated}
              initialWishlisted={initialWishlisted}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
