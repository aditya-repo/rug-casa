import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ProductLifecycleActions } from "@/components/dashboard/products/ProductLifecycleActions";
import { imageUrl } from "@/lib/api/mappers";
import type { DashboardProduct } from "@/lib/dashboard/products";
import { availabilityLabel } from "@/lib/dashboard/product-options";
import type { ProductApiStatus } from "@/lib/api/products";

import type { ReactNode } from "react";

type ProductDetailViewProps = {
  product: DashboardProduct;
};

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-3 sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </dt>
      <dd className="text-sm text-neutral-900 sm:col-span-2">{value}</dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      <dl className="mt-4 space-y-3">{children}</dl>
    </section>
  );
}

function formatRupee(value: string) {
  return value ? `₹${value}` : "—";
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const totalStock =
    product.variants.reduce((sum, v) => sum + v.stock, 0) || product.quantity;
  const apiStatus = (
    product.status === "archived"
      ? "ARCHIVED"
      : product.status === "draft"
        ? "DRAFT"
        : "PUBLISHED"
  ) as ProductApiStatus;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          {product.imageSrc ? (
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-neutral-900">{product.name}</h1>
            <StatusBadge status={product.status} />
            {product.featured ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                Featured
              </span>
            ) : null}
          </div>
          <p className="mt-1 font-mono text-sm text-neutral-500">{product.sku}</p>
          <p className="mt-2 text-sm text-neutral-600">
            {product.detailedDescription || product.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/dashboard/products/${product.id}/edit`}
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark"
            >
              Edit product
            </Link>
            <Link
              href="/dashboard/products"
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Back to list
            </Link>
          </div>
          <div className="mt-3">
            <ProductLifecycleActions
              productId={product.id}
              productName={product.name}
              apiStatus={apiStatus}
            />
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-neutral-500">Updated</p>
          <p className="font-medium text-neutral-900">{product.updatedAt}</p>
          <p className="mt-3 text-2xl font-semibold text-neutral-900">
            {formatRupee(product.salePrice || product.basePrice)}
          </p>
          {product.salePrice && product.basePrice !== product.salePrice ? (
            <p className="text-sm text-neutral-400 line-through">
              {formatRupee(product.basePrice)}
            </p>
          ) : null}
          <p className="mt-1 text-neutral-600">{totalStock} in stock</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DetailSection title="Basic">
            <DetailRow label="Title" value={product.title || product.name} />
            <DetailRow label="Name" value={product.name} />
            <DetailRow label="Slug" value={product.slug} />
            <DetailRow label="Collection" value={product.collection} />
            <DetailRow
              label="Description"
              value={product.detailedDescription || product.shortDescription || "—"}
            />
          </DetailSection>
        </div>

        <DetailSection title="Product type">
          <DetailRow label="Shape" value={product.shape || "—"} />
          <DetailRow label="Weaving technique" value={product.weavingType || "—"} />
          <DetailRow label="Material" value={product.material || "—"} />
          <DetailRow label="Pattern" value={product.patternArt || "—"} />
          <DetailRow label="Thickness" value={product.thickness || "—"} />
        </DetailSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DetailSection title="Design">
          <DetailRow label="Title" value={product.designTitle || "—"} />
          <DetailRow label="Description" value={product.designDescription || "—"} />
          <DetailRow label="Style" value={product.designStyle || "—"} />
          <DetailRow label="Decor style" value={product.decorStyle || "—"} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Feature list
            </p>
            {product.featureList.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-800">
                {product.featureList.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-neutral-700">—</p>
            )}
          </div>
        </DetailSection>

        <DetailSection title="Inventory">
          <DetailRow label="SKU" value={product.sku || "—"} />
          <DetailRow label="Stock quantity" value={product.quantity} />
          <DetailRow label="HSN number" value={product.hsn || "—"} />
          <DetailRow label="Tax" value={product.tax || "—"} />
          <DetailRow label="Availability" value={availabilityLabel(product.availability)} />
        </DetailSection>

        <DetailSection title="Details">
          <DetailRow label="Origin" value={product.origin || "—"} />
          <DetailRow
            label="Photo shooting condition"
            value={product.photoShootingCondition || "—"}
          />
          <DetailRow label="Usages" value={product.usages || "—"} />
          <DetailRow label="Note" value={product.note || "—"} />
        </DetailSection>
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-base font-semibold text-neutral-900">Variants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/80">
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Primary
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Length
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Width
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Primary colour
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Other colours
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Price
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Sale price
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  SKU
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-neutral-500">
                  Image
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {product.variants.map((variant, index) => {
                const isPrimary =
                  variant.isPrimary ||
                  (!product.variants.some((v) => v.isPrimary) && index === 0);
                return (
                <tr key={variant.id}>
                  <td className="px-5 py-3">
                    {isPrimary ? (
                      <span className="inline-flex rounded-full bg-rc-navy/10 px-2 py-0.5 text-xs font-semibold text-rc-navy">
                        Primary
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-neutral-900">
                    {variant.length ? `${variant.length} ft` : "—"}
                  </td>
                  <td className="px-5 py-3 font-medium text-neutral-900">
                    {variant.width ? `${variant.width} ft` : "—"}
                  </td>
                  <td className="px-5 py-3">{variant.color || "—"}</td>
                  <td className="px-5 py-3 text-neutral-600">
                    {variant.otherColors?.trim() || "—"}
                  </td>
                  <td className="px-5 py-3">{formatRupee(variant.price)}</td>
                  <td className="px-5 py-3">
                    {variant.salePrice ? formatRupee(variant.salePrice) : "—"}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-neutral-500">
                    {variant.sku}
                  </td>
                  <td className="px-5 py-3">
                    {variant.images.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {variant.images.map((src, imageIndex) => {
                          const displaySrc = imageUrl(src) || src;
                          return (
                          <div
                            key={`${src}-${imageIndex}`}
                            className="relative h-10 w-10 overflow-hidden rounded bg-neutral-100"
                          >
                            <Image
                              src={displaySrc}
                              alt={`${variant.length && variant.width ? `${variant.length}x${variant.width}` : variant.size || "Variant"} ${imageIndex + 1}`}
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized={displaySrc.startsWith("blob:")}
                            />
                          </div>
                          );
                        })}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
