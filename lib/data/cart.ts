import type { ProductItem } from "./products";
import { catalogProducts } from "./products";

export type CartLine = {
  product: ProductItem;
  quantity: number;
};

/** Demo cart lines — replace with persisted cart when checkout exists. */
const CART_SEED: readonly { id: string; quantity: number }[] = [
  { id: "na-medallion", quantity: 1 },
  { id: "tr-vintage", quantity: 2 },
];

export function getCartLines(): CartLine[] {
  const byId = new Map(catalogProducts.map((p) => [p.id, p]));
  return CART_SEED.map(({ id, quantity }) => {
    const product = byId.get(id);
    if (!product) return null;
    return { product, quantity };
  }).filter((line): line is CartLine => line != null);
}
