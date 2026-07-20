import { publicApi } from "./fetch";
import {
  pickPrimaryVariant,
  resolveProductImageSrc,
} from "./mappers";
import type { ProductItem } from "@/lib/data/products";

type ApiFeaturedProduct = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  brand?: string | null;
  images?: Array<{ path: string; alt?: string | null; isFeatured: boolean }>;
  variants?: Array<{
    price: number | string;
    salePrice?: number | string | null;
    thumbnail?: string | null;
    attributes?: Record<string, string> | null;
  }>;
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

function mapFeaturedProduct(product: ApiFeaturedProduct): ProductItem {
  const variant = pickPrimaryVariant(product.variants ?? []);
  const attrs = (variant?.attributes ?? {}) as Record<string, string>;
  const featured = product.images?.find((i) => i.isFeatured) ?? product.images?.[0];
  const sale = toNumber(variant?.salePrice ?? variant?.price);
  const mrp = toNumber(variant?.price ?? sale);
  const discountPercent =
    mrp > sale && mrp > 0 ? Math.round(((mrp - sale) / mrp) * 100) : 0;

  return {
    id: product.id,
    brand: product.brand?.trim() || "Rugs Bhadohi",
    name: product.title,
    dimensions: attrs.size?.trim() || "",
    price: formatAmount(sale),
    mrp: formatAmount(mrp),
    discountPercent,
    rating: 0,
    reviews: 0,
    tag: "Featured",
    imageSrc: resolveProductImageSrc(product.variants, product.images),
    imageAlt: featured?.alt?.trim() || product.shortDescription?.trim() || product.title,
  };
}

/** Latest published featured products for homepage (max 8). */
export async function fetchPublicFeaturedProducts(): Promise<ProductItem[]> {
  try {
    const res = await publicApi<ApiFeaturedProduct[]>("/products/public/featured");
    return (res.data ?? []).map(mapFeaturedProduct);
  } catch {
    return [];
  }
}
