"use client";

import { useMemo, useState } from "react";
import {
  ShopFiltersSidebar,
  type ShopFilterOption,
  type ShopFilterState,
} from "@/components/shop/ShopFiltersSidebar";
import { ShopListingCard } from "@/components/shop/ShopListingCard";
import type { CategoryItem } from "@/lib/data/categories";
import type { ShopProductItem } from "@/lib/api/shop-products";

type SortKey = "featured" | "price-low" | "price-high" | "rating";

function parsePriceRupee(value: string): number {
  return Number(value.replace(/,/g, "")) || 0;
}

function matchesSize(dimensions: string, sizeId: string): boolean {
  const needle = sizeId.toLowerCase().replace(/\s+/g, "");
  const compact = dimensions
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/ft\.?/g, "");
  return compact.includes(needle);
}

function matchesAny(selected: string[], value: string): boolean {
  if (selected.length === 0) return true;
  const parts = value
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length === 0) return false;
  return selected.some((item) => {
    const needle = item.trim().toLowerCase();
    return parts.includes(needle) || parts.some((part) => part === needle);
  });
}

type ShopProductGridProps = {
  products: ShopProductItem[];
  categories?: CategoryItem[];
  collections?: ShopFilterOption[];
  initialCategorySlug?: string;
  isAuthenticated?: boolean;
  wishlistedIds?: string[];
};

const EMPTY_FILTERS: ShopFilterState = {
  categories: [],
  collections: [],
  shapes: [],
  weavingTypes: [],
  materials: [],
  patterns: [],
  thicknesses: [],
  sizes: [],
  colors: [],
};

export function ShopProductGrid({
  products,
  categories = [],
  collections = [],
  initialCategorySlug,
  isAuthenticated = false,
  wishlistedIds = [],
}: ShopProductGridProps) {
  const wishlistedSet = useMemo(() => new Set(wishlistedIds), [wishlistedIds]);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filters, setFilters] = useState<ShopFilterState>({
    ...EMPTY_FILTERS,
    categories: initialCategorySlug ? [initialCategorySlug] : [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryLabelBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of categories) map.set(item.slug, item.label);
    return map;
  }, [categories]);

  const collectionLabelBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of collections) map.set(item.slug, item.label);
    return map;
  }, [collections]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(p.categorySlug)) return false;
      }

      if (filters.collections.length > 0) {
        const titles = new Set(p.collectionTitles.map((t) => t.toLowerCase()));
        const matched = filters.collections.some((slug) => {
          const label = collectionLabelBySlug.get(slug);
          return Boolean(label && titles.has(label.toLowerCase()));
        });
        if (!matched) return false;
      }

      if (!matchesAny(filters.shapes, p.shape)) return false;
      if (!matchesAny(filters.weavingTypes, p.weavingType)) return false;
      if (!matchesAny(filters.materials, p.material)) return false;
      if (!matchesAny(filters.patterns, p.patternArt)) return false;
      if (!matchesAny(filters.thicknesses, p.thickness)) return false;
      if (!matchesAny(filters.colors, p.color)) return false;

      if (filters.sizes.length > 0) {
        if (!filters.sizes.some((size) => matchesSize(p.dimensions, size))) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters, collectionLabelBySlug]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "price-low") {
      list.sort((a, b) => parsePriceRupee(a.price) - parsePriceRupee(b.price));
    } else if (sort === "price-high") {
      list.sort((a, b) => parsePriceRupee(b.price) - parsePriceRupee(a.price));
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }
    return list;
  }, [filtered, sort]);

  function removeFromList(
    key: keyof ShopFilterState,
    value: string,
  ) {
    setFilters((f) => ({
      ...f,
      [key]: f[key].filter((s) => s !== value),
    }));
  }

  const hasChips =
    filters.categories.length > 0 ||
    filters.collections.length > 0 ||
    filters.shapes.length > 0 ||
    filters.weavingTypes.length > 0 ||
    filters.materials.length > 0 ||
    filters.patterns.length > 0 ||
    filters.thicknesses.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0;

  const sidebarProps = {
    filters,
    onChange: setFilters,
    categories,
    collections,
  };

  const chipClass =
    "inline-flex items-center gap-1.5 rounded-full border border-rc-border bg-rc-surface px-3 py-1 text-xs text-rc-navy";

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-12">
      <div className="hidden border-r border-rc-border pr-8 lg:block">
        <ShopFiltersSidebar {...sidebarProps} />
      </div>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="rounded-full border border-rc-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-rc-navy lg:hidden"
            >
              {mobileFiltersOpen ? "Hide filters" : "Filters"}
            </button>

            {hasChips ? (
              <div className="flex flex-wrap gap-2">
                {filters.categories.map((slug) => (
                  <button
                    key={`cat-${slug}`}
                    type="button"
                    onClick={() => removeFromList("categories", slug)}
                    className={chipClass}
                  >
                    {categoryLabelBySlug.get(slug) ?? slug}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.collections.map((slug) => (
                  <button
                    key={`col-${slug}`}
                    type="button"
                    onClick={() => removeFromList("collections", slug)}
                    className={chipClass}
                  >
                    {collectionLabelBySlug.get(slug) ?? slug}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.shapes.map((value) => (
                  <button
                    key={`shape-${value}`}
                    type="button"
                    onClick={() => removeFromList("shapes", value)}
                    className={chipClass}
                  >
                    {value}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.weavingTypes.map((value) => (
                  <button
                    key={`weave-${value}`}
                    type="button"
                    onClick={() => removeFromList("weavingTypes", value)}
                    className={chipClass}
                  >
                    {value}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.materials.map((value) => (
                  <button
                    key={`mat-${value}`}
                    type="button"
                    onClick={() => removeFromList("materials", value)}
                    className={chipClass}
                  >
                    {value}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.patterns.map((value) => (
                  <button
                    key={`pat-${value}`}
                    type="button"
                    onClick={() => removeFromList("patterns", value)}
                    className={chipClass}
                  >
                    {value}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.thicknesses.map((value) => (
                  <button
                    key={`thick-${value}`}
                    type="button"
                    onClick={() => removeFromList("thicknesses", value)}
                    className={chipClass}
                  >
                    {value}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => removeFromList("sizes", size)}
                    className={chipClass}
                  >
                    {size}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {filters.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => removeFromList("colors", color)}
                    className={`${chipClass} capitalize`}
                  >
                    {color}
                    <span aria-hidden>×</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="hidden text-sm text-rc-muted sm:block">
                <span className="font-semibold text-rc-navy">{sorted.length}</span>{" "}
                products
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-rc-navy">
            <span className="font-semibold">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border-0 border-b border-rc-navy bg-transparent py-1 text-xs font-medium normal-case tracking-normal text-rc-navy outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </label>
        </div>

        {mobileFiltersOpen ? (
          <div className="mb-6 border border-rc-border p-4 lg:hidden">
            <ShopFiltersSidebar {...sidebarProps} />
          </div>
        ) : null}

        {sorted.length === 0 ? (
          <p className="py-16 text-center text-sm text-rc-muted">
            No products match these filters.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8">
            {sorted.map((product) => (
              <li key={product.id} className="min-w-0">
                <ShopListingCard
                  product={product}
                  isAuthenticated={isAuthenticated}
                  initialWishlisted={wishlistedSet.has(product.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
