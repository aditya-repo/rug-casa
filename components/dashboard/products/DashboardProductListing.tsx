"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DashboardTable, DashboardTableHead } from "@/components/dashboard/DashboardTable";
import type { ApiCategory } from "@/lib/api/categories";
import {
  fetchProductsClient,
  type ProductApiStatus,
  type ProductListRow,
} from "@/lib/api/products";
import { ProductLifecycleActions } from "@/components/dashboard/products/ProductLifecycleActions";
import {
  PRODUCT_MATERIALS,
  PRODUCT_PATTERN_ART,
  PRODUCT_SHAPES,
  PRODUCT_TECHNIQUES,
  PRODUCT_THICKNESS,
} from "@/lib/dashboard/product-options";

type DashboardProductListingProps = {
  initialProducts: ProductListRow[];
  categories: ApiCategory[];
};

const STATUS_FILTERS: Array<{ label: string; value: ProductApiStatus | "ALL" }> = [
  { label: "All statuses", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

const ATTRIBUTE_FILTERS_VISIBLE = 4;

const actionLinkClass =
  "inline-block rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50";

function mergeFilterOptions(base: readonly string[], values: string[]) {
  return [...new Set([...base, ...values.filter((v) => v && v !== "—")])].sort((a, b) =>
    a.localeCompare(b),
  );
}

function splitAttributeValues(value: string): string[] {
  if (!value.trim() || value === "—") return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function matchesAttributeFilter(filter: string, value: string): boolean {
  if (!filter) return true;
  const parts = splitAttributeValues(value).map((part) => part.toLowerCase());
  if (parts.length === 0) return false;
  const needle = filter.trim().toLowerCase();
  return parts.includes(needle);
}

export function DashboardProductListing({
  initialProducts,
  categories,
}: DashboardProductListingProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductApiStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<"" | "yes" | "no">("");
  const [shapeFilter, setShapeFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [weavingFilter, setWeavingFilter] = useState("");
  const [patternFilter, setPatternFilter] = useState("");
  const [thicknessFilter, setThicknessFilter] = useState("");
  const [attributeFiltersExpanded, setAttributeFiltersExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadProducts = useCallback(
    async (
      query: string,
      status: ProductApiStatus | "ALL",
      categoryId: string,
      featured: "" | "yes" | "no",
    ) => {
      setLoading(true);
      try {
        const { items } = await fetchProductsClient({
          search: query || undefined,
          status: status === "ALL" ? undefined : status,
          categoryId: categoryId || undefined,
          featured: featured === "" ? undefined : featured === "yes",
        });
        setProducts(items);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadProducts(debouncedSearch, statusFilter, categoryFilter, featuredFilter);
  }, [debouncedSearch, statusFilter, categoryFilter, featuredFilter, loadProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (shapeFilter && p.shape !== shapeFilter) return false;
      if (materialFilter && !matchesAttributeFilter(materialFilter, p.material)) return false;
      if (weavingFilter && p.weavingType !== weavingFilter) return false;
      if (patternFilter && p.patternArt !== patternFilter) return false;
      if (thicknessFilter && p.thickness !== thicknessFilter) return false;
      return true;
    });
  }, [
    products,
    shapeFilter,
    materialFilter,
    weavingFilter,
    patternFilter,
    thicknessFilter,
  ]);

  const hasAttributeFilters = Boolean(
    shapeFilter || materialFilter || weavingFilter || patternFilter || thicknessFilter,
  );

  const shapeOptions = useMemo(
    () => mergeFilterOptions(PRODUCT_SHAPES, products.map((p) => p.shape)),
    [products],
  );
  const materialOptions = useMemo(
    () =>
      mergeFilterOptions(
        PRODUCT_MATERIALS,
        products.flatMap((p) => splitAttributeValues(p.material)),
      ),
    [products],
  );
  const weavingOptions = useMemo(
    () => mergeFilterOptions(PRODUCT_TECHNIQUES, products.map((p) => p.weavingType)),
    [products],
  );
  const patternOptions = useMemo(
    () => mergeFilterOptions(PRODUCT_PATTERN_ART, products.map((p) => p.patternArt)),
    [products],
  );
  const thicknessOptions = useMemo(
    () => mergeFilterOptions(PRODUCT_THICKNESS, products.map((p) => p.thickness)),
    [products],
  );

  const selectClass =
    "w-full rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 shadow-sm outline-none ring-0 focus:border-neutral-300 focus:outline-none focus:ring-0 focus-visible:!outline-none focus-visible:!outline-offset-0 focus-visible:ring-0";

  const attributeFilters = [
    {
      key: "shape",
      label: "Shape",
      value: shapeFilter,
      onChange: setShapeFilter,
      options: shapeOptions,
    },
    {
      key: "weaving",
      label: "Weaving technique",
      value: weavingFilter,
      onChange: setWeavingFilter,
      options: weavingOptions,
    },
    {
      key: "material",
      label: "Material",
      value: materialFilter,
      onChange: setMaterialFilter,
      options: materialOptions,
    },
    {
      key: "pattern",
      label: "Pattern",
      value: patternFilter,
      onChange: setPatternFilter,
      options: patternOptions,
    },
    {
      key: "thickness",
      label: "Thickness",
      value: thicknessFilter,
      onChange: setThicknessFilter,
      options: thicknessOptions,
    },
  ] as const;

  const visibleAttributeFilters = attributeFiltersExpanded
    ? attributeFilters
    : attributeFilters.slice(0, ATTRIBUTE_FILTERS_VISIBLE);

  return (
    <div className="space-y-4">
      <header className="space-y-4 border-b border-neutral-200 pb-5">
        <DashboardPageHeader
          bordered={false}
          title="Product management"
          description="Search and filter products by status, category, and product type."
          actions={
            <Link
              href="/dashboard/products/new"
              className="rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
            >
              Add product
            </Link>
          }
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <label className="col-span-2 block text-sm sm:col-span-3 lg:col-span-1">
            <span className="mb-0.5 block pl-3 text-[11px] font-medium text-neutral-500">Search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title, slug, or SKU…"
              className="w-full rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none ring-0 focus:border-neutral-300 focus:outline-none focus:ring-0 focus-visible:!outline-none focus-visible:!outline-offset-0 focus-visible:ring-0"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-0.5 block pl-3 text-[11px] font-medium text-neutral-500">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductApiStatus | "ALL")}
              className={selectClass}
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-0.5 block pl-3 text-[11px] font-medium text-neutral-500">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-0.5 block pl-3 text-[11px] font-medium text-neutral-500">Featured</span>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as "" | "yes" | "no")}
              className={selectClass}
            >
              <option value="">All</option>
              <option value="yes">Featured</option>
              <option value="no">Not featured</option>
            </select>
          </label>
        </div>

        <div className="space-y-2">
          <p className="pl-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Product type
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {visibleAttributeFilters.map((filter) => (
              <label key={filter.key} className="block text-sm">
                <span className="mb-0.5 block pl-3 text-[11px] font-medium text-neutral-500">
                  {filter.label}
                </span>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={selectClass}
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          {attributeFilters.length > ATTRIBUTE_FILTERS_VISIBLE ? (
            <button
              type="button"
              onClick={() => setAttributeFiltersExpanded((v) => !v)}
              className="pl-1 text-xs font-medium text-rc-navy underline underline-offset-2"
            >
              {attributeFiltersExpanded ? "Show less" : "View more"}
            </button>
          ) : null}
        </div>

        <p className="text-xs text-neutral-500">
          {loading
            ? "Loading products…"
            : hasAttributeFilters
              ? `Showing ${filteredProducts.length} of ${products.length} product(s)`
              : `Showing ${products.length} product(s)`}
        </p>
      </header>

      <DashboardTable>
        <table className="w-full min-w-[1400px] border-collapse text-left text-sm">
          <DashboardTableHead
            columns={[
              "",
              "Product",
              "SKU",
              "Shape",
              "Material",
              "Weaving",
              "Pattern",
              "Thickness",
              "Origin",
              "Price",
              "Stock",
              "Status",
              "Updated",
              "Actions",
            ]}
          />
          <tbody className="divide-y divide-neutral-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-4 py-10 text-center text-neutral-500">
                  No products match your filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="text-neutral-800">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                      {product.imageSrc ? (
                        <Image
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized={product.imageSrc.includes("localhost")}
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="font-semibold text-rc-navy hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-neutral-500">{product.collection}</p>
                    {product.featured ? (
                      <span className="mt-1 inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                        Featured
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{product.sku}</td>
                  <td className="px-4 py-3 text-neutral-600">{product.shape}</td>
                  <td className="px-4 py-3 text-neutral-600">{product.material}</td>
                  <td className="px-4 py-3 text-neutral-600">{product.weavingType}</td>
                  <td className="px-4 py-3 text-neutral-600">{product.patternArt}</td>
                  <td className="px-4 py-3 text-neutral-600">{product.thickness}</td>
                  <td className="px-4 py-3 text-neutral-600">{product.origin}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{product.price}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock === 0 ? "font-medium text-red-600" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">{product.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/products/${product.id}`} className={actionLinkClass}>
                          View
                        </Link>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className={actionLinkClass}
                        >
                          Edit
                        </Link>
                      </div>
                      <ProductLifecycleActions
                        compact
                        productId={product.id}
                        productName={product.name}
                        apiStatus={product.apiStatus}
                        onChanged={() =>
                          loadProducts(
                            debouncedSearch,
                            statusFilter,
                            categoryFilter,
                            featuredFilter,
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DashboardTable>
    </div>
  );
}
