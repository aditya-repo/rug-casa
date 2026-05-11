import type { ProductItem } from "./products";
import { catalogProducts } from "./products";

/** Demo wishlist: replace with persisted IDs when auth / API exists. */
const WISHLIST_PRODUCT_IDS: readonly string[] = [
  "na-medallion",
  "na-abstract",
  "ep-kilim",
  "tr-vintage",
  "ep-ombre",
  "re-runner",
];

export function getWishlistProducts(): ProductItem[] {
  const byId = new Map(catalogProducts.map((p) => [p.id, p]));
  return WISHLIST_PRODUCT_IDS.map((id) => byId.get(id)).filter(
    (p): p is ProductItem => p != null,
  );
}
