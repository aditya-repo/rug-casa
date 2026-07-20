import { publicApi } from "./fetch";
import {
  pickPrimaryVariant,
  resolveProductImageSrc,
} from "./mappers";
import type { ProductItem } from "@/lib/data/products";

export type ShopProductItem = ProductItem & {
  slug: string;
  categorySlug: string;
  collectionTitles: string[];
  shape: string;
  weavingType: string;
  material: string;
  patternArt: string;
  thickness: string;
  color: string;
};

export type ApiPublicProduct = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  brand?: string | null;
  collection?: string | null;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  category?: { id: string; name: string; slug: string } | null;
  images?: Array<{ path: string; alt?: string | null; isFeatured: boolean }>;
  variants?: Array<{
    price: number | string;
    salePrice?: number | string | null;
    thumbnail?: string | null;
    attributes?: Record<string, string> | null;
  }>;
  _count?: { reviews: number };
};

export type PublicShopProductParams = {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string | string[];
  collectionSlug?: string | string[];
  shape?: string | string[];
  material?: string | string[];
  technique?: string | string[];
  pattern?: string | string[];
  thickness?: string | string[];
  size?: string | string[];
  color?: string | string[];
  sort?: "featured" | "newest" | "title";
};

function formatAmount(amount: number | string | null | undefined): string {
  const n = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  if (Number.isNaN(n)) return "0";
  return Math.round(n).toLocaleString("en-IN");
}

function toNumber(amount: number | string | null | undefined): number {
  const n = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return Number.isNaN(n) ? 0 : n;
}

function csv(value?: string | string[]): string | undefined {
  if (!value) return undefined;
  const list = Array.isArray(value) ? value : [value];
  const joined = list.map((v) => v.trim()).filter(Boolean).join(",");
  return joined || undefined;
}

function parseCollectionTitles(value?: string | null): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function pickTag(product: ApiPublicProduct): string | undefined {
  if (product.isBestSeller) return "Bestseller";
  if (product.isNewArrival) return "New";
  if (product.isFeatured) return "Featured";
  return undefined;
}

export function mapPublicProduct(product: ApiPublicProduct): ShopProductItem {
  const variant = pickPrimaryVariant(product.variants ?? []);
  const attrs = (variant?.attributes ?? {}) as Record<string, string>;
  const featured = product.images?.find((i) => i.isFeatured) ?? product.images?.[0];
  const sale = toNumber(variant?.salePrice ?? variant?.price);
  const mrp = toNumber(variant?.price ?? sale);
  const discountPercent =
    mrp > sale && mrp > 0 ? Math.round(((mrp - sale) / mrp) * 100) : 0;
  const imageSrc = resolveProductImageSrc(product.variants, product.images);

  return {
    id: product.id,
    slug: product.slug,
    brand: product.brand?.trim() || "Rugs Bhadohi",
    name: product.title,
    dimensions: attrs.size?.trim() || "",
    price: formatAmount(sale),
    mrp: formatAmount(mrp),
    discountPercent,
    rating: 0,
    reviews: product._count?.reviews ?? 0,
    tag: pickTag(product),
    imageSrc,
    imageAlt: featured?.alt?.trim() || product.shortDescription?.trim() || product.title,
    categorySlug: product.category?.slug ?? "",
    collectionTitles: parseCollectionTitles(product.collection),
    shape: attrs.shape?.trim() || "",
    weavingType: (attrs.technique || attrs.weavingType || "").trim(),
    material: attrs.material?.trim() || "",
    patternArt: (attrs.style || attrs.patternArt || attrs.pattern || "").trim(),
    thickness: attrs.thickness?.trim() || "",
    color: attrs.color?.trim() || "",
  };
}

/** Published products for the storefront shop listing. */
export async function fetchPublicShopProducts(
  params: PublicShopProductParams = {},
): Promise<{ products: ShopProductItem[]; total: number }> {
  try {
    const res = await publicApi<ApiPublicProduct[]>("/products/public/list", {
      searchParams: {
        page: params.page ?? 1,
        limit: params.limit ?? 100,
        search: params.search,
        categorySlug: csv(params.categorySlug),
        collectionSlug: csv(params.collectionSlug),
        shape: csv(params.shape),
        material: csv(params.material),
        technique: csv(params.technique),
        pattern: csv(params.pattern),
        thickness: csv(params.thickness),
        size: csv(params.size),
        color: csv(params.color),
        sort: params.sort ?? "featured",
      },
    });
    return {
      products: (res.data ?? []).map(mapPublicProduct),
      total: res.meta?.total ?? res.data?.length ?? 0,
    };
  } catch {
    return { products: [], total: 0 };
  }
}
