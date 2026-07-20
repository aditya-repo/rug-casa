"use client";

import Link from "next/link";
import { IconView } from "@/components/dashboard/dashboard-icons";
import { ProductLifecycleActions } from "@/components/dashboard/products/ProductLifecycleActions";
import type { ProductApiStatus } from "@/lib/api/products";

const actionIconClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50";

type ProductEditHeaderActionsProps = {
  productId: string;
  productName: string;
  apiStatus: ProductApiStatus;
};

export function ProductEditHeaderActions({
  productId,
  productName,
  apiStatus,
}: ProductEditHeaderActionsProps) {
  return (
    <>
      <Link
        href={`/dashboard/products/${productId}`}
        className={actionIconClass}
        title="View"
        aria-label="View"
      >
        <IconView />
      </Link>
      <ProductLifecycleActions
        compact
        productId={productId}
        productName={productName}
        apiStatus={apiStatus}
      />
    </>
  );
}
