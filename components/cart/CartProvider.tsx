"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readCartFromStorage, writeCartToStorage } from "@/lib/cart/storage";
import {
  buildCartLineKey,
  cartItemCount,
  cartSubtotal,
  CART_MAX_QTY,
  type AddToCartInput,
  type CartLineItem,
} from "@/lib/cart/types";

type CartContextValue = {
  lines: CartLineItem[];
  ready: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (input: AddToCartInput) => { ok: true } | { ok: false; error: string };
  setQuantity: (key: string, quantity: number) => void;
  adjustQuantity: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(qty: number): number {
  return Math.min(CART_MAX_QTY, Math.max(0, Math.floor(qty)));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLineItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(readCartFromStorage());
    setReady(true);

    const sync = () => setLines(readCartFromStorage());
    window.addEventListener("storage", sync);
    window.addEventListener("rugs-bhadohi-cart-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("rugs-bhadohi-cart-updated", sync);
    };
  }, []);

  const persist = useCallback((next: CartLineItem[]) => {
    setLines(next);
    writeCartToStorage(next);
  }, []);

  const addItem = useCallback(
    (input: AddToCartInput) => {
      if (!input.productId || !input.sizeId) {
        return { ok: false as const, error: "Choose a size before adding to cart." };
      }
      if (!(input.unitPrice > 0)) {
        return {
          ok: false as const,
          error: "This size needs a custom quote — contact us on WhatsApp.",
        };
      }

      const key = buildCartLineKey({
        productId: input.productId,
        sizeId: input.sizeId,
        colorId: input.colorId,
        serviceIds: input.serviceIds,
      });
      const addQty = clampQty(input.quantity || 1);
      if (addQty <= 0) {
        return { ok: false as const, error: "Quantity must be at least 1." };
      }

      const existing = lines.find((line) => line.key === key);
      const nextQty = clampQty((existing?.quantity ?? 0) + addQty);
      if (existing && existing.quantity >= CART_MAX_QTY) {
        return {
          ok: false as const,
          error: `You can add up to ${CART_MAX_QTY} of this item.`,
        };
      }

      const nextLine: CartLineItem = {
        key,
        productId: input.productId,
        name: input.name,
        brand: input.brand,
        imageSrc: input.imageSrc,
        imageAlt: input.imageAlt,
        sizeId: input.sizeId,
        sizeLabel: input.sizeLabel,
        colorId: input.colorId,
        colorLabel: input.colorLabel,
        unitPrice: input.unitPrice,
        unitMrp: input.unitMrp,
        quantity: nextQty,
        serviceIds: [...input.serviceIds].sort(),
        serviceLabels: input.serviceLabels,
        servicesPerUnit: input.servicesPerUnit,
      };

      const next = existing
        ? lines.map((line) => (line.key === key ? nextLine : line))
        : [...lines, nextLine];
      persist(next);
      return { ok: true as const };
    },
    [lines, persist],
  );

  const setQuantity = useCallback(
    (key: string, quantity: number) => {
      const nextQty = clampQty(quantity);
      if (nextQty <= 0) {
        persist(lines.filter((line) => line.key !== key));
        return;
      }
      persist(
        lines.map((line) =>
          line.key === key ? { ...line, quantity: nextQty } : line,
        ),
      );
    },
    [lines, persist],
  );

  const adjustQuantity = useCallback(
    (key: string, delta: number) => {
      const line = lines.find((l) => l.key === key);
      if (!line) return;
      setQuantity(key, line.quantity + delta);
    },
    [lines, setQuantity],
  );

  const removeItem = useCallback(
    (key: string) => {
      persist(lines.filter((line) => line.key !== key));
    },
    [lines, persist],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      ready,
      itemCount: cartItemCount(lines),
      subtotal: cartSubtotal(lines),
      addItem,
      setQuantity,
      adjustQuantity,
      removeItem,
      clearCart,
    }),
    [
      lines,
      ready,
      addItem,
      setQuantity,
      adjustQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
