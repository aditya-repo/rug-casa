"use server";

import { auth } from "@/auth";
import { CART_MAX_QTY, type CartLineItem } from "@/lib/cart/types";
import {
  clearCustomerCart,
  fetchCustomerCart,
  replaceCustomerCart,
} from "@/lib/api/cart";

export async function getMyCart(): Promise<CartLineItem[]> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return [];
  try {
    return await fetchCustomerCart(email);
  } catch {
    return [];
  }
}

export async function saveMyCart(
  items: CartLineItem[],
): Promise<{ ok: true; items: CartLineItem[] } | { ok: false; error: string; needsAuth?: boolean }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, needsAuth: true, error: "Not signed in" };

  try {
    const saved = await replaceCustomerCart(email, items);
    return { ok: true, items: saved };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to save cart",
    };
  }
}

export async function clearMyCart(): Promise<
  { ok: true; items: CartLineItem[] } | { ok: false; error: string; needsAuth?: boolean }
> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, needsAuth: true, error: "Not signed in" };

  try {
    const items = await clearCustomerCart(email);
    return { ok: true, items };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to clear cart",
    };
  }
}

/** Merge guest localStorage cart into server cart (server wins on same line key by summing qty). */
export async function syncMyCartFromGuest(
  guestItems: CartLineItem[],
): Promise<{ ok: true; items: CartLineItem[] } | { ok: false; error: string; needsAuth?: boolean }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, needsAuth: true, error: "Not signed in" };

  try {
    const serverItems = await fetchCustomerCart(email);
    const byKey = new Map<string, CartLineItem>();

    for (const item of serverItems) {
      byKey.set(item.key, item);
    }
    for (const guest of guestItems) {
      const existing = byKey.get(guest.key);
      if (!existing) {
        byKey.set(guest.key, guest);
        continue;
      }
      byKey.set(guest.key, {
        ...existing,
        quantity: Math.min(CART_MAX_QTY, existing.quantity + guest.quantity),
      });
    }

    const merged = Array.from(byKey.values());
    const saved = await replaceCustomerCart(email, merged);
    return { ok: true, items: saved };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to sync cart",
    };
  }
}
