"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductItem } from "@/lib/data/products";

type SortKey = "featured" | "price-low" | "price-high" | "rating";

function parsePriceRupee(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

type ShopProductGridProps = {
  products: ProductItem[];
  /** When false, hide the product count (e.g. shown in page title bar). Default true. */
  showProductCount?: boolean;
};

export function ShopProductGrid({
  products,
  showProductCount = true,
}: ShopProductGridProps) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-low") {
      list.sort((a, b) => parsePriceRupee(a.price) - parsePriceRupee(b.price));
    } else if (sort === "price-high") {
      list.sort((a, b) => parsePriceRupee(b.price) - parsePriceRupee(a.price));
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }
    return list;
  }, [products, sort]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {showProductCount ? (
          <p className="text-sm text-rc-muted">
            <span className="font-semibold text-rc-navy">{sorted.length}</span>{" "}
            products
          </p>
        ) : (
          <span className="hidden sm:block sm:flex-1" aria-hidden />
        )}
        <label className="flex items-center gap-2 text-sm text-rc-navy sm:ml-auto">
          <span className="shrink-0 text-rc-muted">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="min-w-[10rem] rounded-lg border border-rc-border bg-white px-3 py-2 text-sm font-medium text-rc-navy outline-none focus-visible:ring-2 focus-visible:ring-rc-navy"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </label>
      </div>

      <ul className="grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-4">
        {sorted.map((product) => (
          <li key={product.id} className="min-w-0">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
