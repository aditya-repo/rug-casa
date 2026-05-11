import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/pdp/ProductDetailClient";
import { IconArrowLeft } from "@/components/layout/icons";
import { HeaderAndNav } from "@/components/layout/HeaderAndNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { getProductDetailModel } from "@/lib/data/product-detail";
import { getProductById } from "@/lib/data/products";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product — RugCasa" };
  return {
    title: `${product.name} — RugCasa`,
    description: `${product.brand} ${product.name}. Rated ${product.rating.toFixed(1)} by customers.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const model = getProductDetailModel(id);
  if (!model) notFound();

  return (
    <div className="flex min-h-full flex-col bg-white">
      <UtilityBar />
      <HeaderAndNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 md:pb-12 md:pt-6">
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
                {model.breadcrumbs.map((crumb, i) => {
                  const isLast = i === model.breadcrumbs.length - 1;
                  return (
                    <li
                      key={`${crumb.label}-${i}`}
                      className={`flex min-w-0 items-center gap-1.5 ${
                        isLast ? "flex-1" : "shrink-0"
                      }`}
                    >
                      {i > 0 ? (
                        <span className="shrink-0" aria-hidden>
                          /
                        </span>
                      ) : null}
                      {crumb.href ? (
                        <Link href={crumb.href} className="shrink-0 hover:text-rc-navy">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="min-w-0 flex-1 truncate font-medium text-rc-navy">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          <ProductDetailClient model={model} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
