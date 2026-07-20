import { publicApi } from "./fetch";
import {
  pickPrimaryVariant,
  resolveProductImageSrc,
  imageUrl,
} from "./mappers";
import type { ArtistCollectionItem } from "@/lib/data/artist-collection";

type ApiArtistProduct = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  collection?: string | null;
  images?: Array<{ path: string; alt?: string | null; isFeatured: boolean }>;
  variants?: Array<{
    price: number | string;
    salePrice?: number | string | null;
    thumbnail?: string | null;
    attributes?: Record<string, string> | null;
  }>;
};

type ApiPublicCollection = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sortOrder: number;
};

function formatInrAmount(amount: number | string | null | undefined): string {
  const n = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  if (Number.isNaN(n)) return "0";
  return Math.round(n).toLocaleString("en-IN");
}

export function mapProductToArtistItem(
  product: ApiArtistProduct,
  collectionImageByTitle: Map<string, string>,
): ArtistCollectionItem {
  const variant = pickPrimaryVariant(product.variants ?? []);
  const attrs = (variant?.attributes ?? {}) as Record<string, string>;
  const featured = product.images?.find((i) => i.isFeatured) ?? product.images?.[0];
  const price = variant?.salePrice ?? variant?.price ?? 0;

  const collectionTitle = product.collection?.split(",")[0]?.trim() || product.title;
  const fallbackImage =
    collectionImageByTitle.get(collectionTitle) ||
    collectionImageByTitle.get(product.title) ||
    "";

  return {
    id: product.id,
    slug: product.slug,
    name: collectionTitle,
    material: attrs.material?.trim() || "hand knotted - wool and bamboo silk",
    dimensions: attrs.size?.trim() || "",
    price: formatInrAmount(price),
    imageSrc:
      resolveProductImageSrc(product.variants, product.images) || imageUrl(fallbackImage),
    imageAlt: featured?.alt?.trim() || product.shortDescription?.trim() || collectionTitle,
  };
}

/**
 * Landing "Our Artist Collection" — one card per unique collection from the API.
 * Product images preferred; collection dashboard images used as fallback.
 */
export async function fetchPublicArtistCollection(): Promise<ArtistCollectionItem[]> {
  try {
    const [productsRes, collectionsRes] = await Promise.all([
      publicApi<ApiArtistProduct[]>("/products/public/artist-collection"),
      publicApi<ApiPublicCollection[]>("/collections/public/homepage"),
    ]);

    const collectionImageByTitle = new Map<string, string>();
    for (const collection of collectionsRes.data ?? []) {
      if (collection.image) {
        collectionImageByTitle.set(collection.title, collection.image);
      }
    }

    const seen = new Set<string>();
    const items: ArtistCollectionItem[] = [];

    for (const product of productsRes.data ?? []) {
      const key = (product.collection?.split(",")[0]?.trim() || product.title).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(mapProductToArtistItem(product, collectionImageByTitle));
    }

    return items;
  } catch {
    return [];
  }
}
