"use server";

import { auth } from "@/auth";
import {
  fetchWishlistProductIds,
  fetchWishlistProducts,
  removeWishlistItem,
  toggleWishlistItem,
  type WishlistToggleResult,
} from "@/lib/api/wishlist";
import type { ShopProductItem } from "@/lib/api/shop-products";

export type WishlistActionResult =
  | { ok: true; wishlisted: boolean; productId: string }
  | { ok: false; needsAuth: true }
  | { ok: false; error: string };

export async function getMyWishlistProductIds(): Promise<string[]> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return [];
  return fetchWishlistProductIds(email);
}

export async function getMyWishlistProducts(): Promise<ShopProductItem[]> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return [];
  return fetchWishlistProducts(email);
}

export async function toggleMyWishlist(
  productId: string,
): Promise<WishlistActionResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, needsAuth: true };

  try {
    const result: WishlistToggleResult = await toggleWishlistItem(
      email,
      productId,
    );
    return {
      ok: true,
      wishlisted: result.wishlisted,
      productId: result.productId,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update wishlist",
    };
  }
}

export async function removeFromMyWishlist(
  productId: string,
): Promise<WishlistActionResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { ok: false, needsAuth: true };

  try {
    const result = await removeWishlistItem(email, productId);
    return {
      ok: true,
      wishlisted: result.wishlisted,
      productId: result.productId,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to remove from wishlist",
    };
  }
}
