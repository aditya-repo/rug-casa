import {
  CART_STORAGE_KEY,
  type CartLineItem,
} from "./types";

function isCartLineItem(value: unknown): value is CartLineItem {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.key === "string" &&
    typeof row.productId === "string" &&
    typeof row.name === "string" &&
    typeof row.quantity === "number" &&
    typeof row.unitPrice === "number"
  );
}

export function readCartFromStorage(): CartLineItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLineItem);
  } catch {
    return [];
  }
}

export function writeCartToStorage(lines: CartLineItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    window.dispatchEvent(new Event("rugs-bhadohi-cart-updated"));
  } catch {
    /* ignore quota / private mode */
  }
}
