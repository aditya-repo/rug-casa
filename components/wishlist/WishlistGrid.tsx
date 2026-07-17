"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { ProductItem } from "@/lib/data/products";
import { removeFromMyWishlist } from "@/lib/auth/wishlist-actions";

type WishlistGridProps = {
  products: ProductItem[];
  /** Narrower grid for account sidebar + center layout on desktop */
  variant?: "page" | "account";
};

function Star() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3 w-3 text-emerald-600"
      aria-hidden
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
    </svg>
  );
}

function WishlistCard({
  product,
  onRemoved,
}: {
  product: ProductItem;
  onRemoved: (id: string) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const href = `/product/${product.id}`;

  const remove = useCallback(() => {
    startTransition(async () => {
      const result = await removeFromMyWishlist(product.id);
      if (!result.ok) return;
      onRemoved(product.id);
      router.refresh();
    });
  }, [onRemoved, product.id, router]);

  return (
    <article className="flex h-full min-h-0 flex-col bg-white">
      <div className="relative">
        <Link
          href={href}
          className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden border border-rc-border bg-rc-surface"
        >
          {product.imageSrc ? (
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 768px) 50vw, min(25vw, 320px)"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-rc-muted">
              No image
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-red-600 shadow-sm transition-colors hover:bg-white disabled:opacity-60"
        >
          {pending ? "…" : "Remove"}
        </button>
      </div>
      <div className="flex flex-1 flex-col space-y-1 p-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-rc-navy">
          <span className="font-semibold">{product.rating.toFixed(1)}</span>
          <Star />
          <span className="h-3 w-px shrink-0 bg-rc-border" aria-hidden />
          <span className="text-rc-muted">{product.reviews}</span>
        </div>
        <Link href={href} className="block min-w-0">
          <p className="truncate text-xs font-bold text-rc-navy md:text-sm">
            {product.brand}
          </p>
          <p className="line-clamp-2 text-[11px] font-normal text-rc-muted md:text-xs">
            {product.name}
          </p>
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5">
          <span className="text-sm font-bold text-rc-navy md:text-base">
            ₹{product.price}
          </span>
          <span className="text-xs text-rc-muted-light line-through">
            ₹{product.mrp}
          </span>
          {product.discountPercent > 0 ? (
            <span className="text-[11px] font-medium text-orange-400">
              ({product.discountPercent}% OFF)
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function WishlistGrid({ products, variant = "page" }: WishlistGridProps) {
  const [items, setItems] = useState(products);
  const gridClass =
    variant === "account"
      ? "grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3"
      : "grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-4";

  useEffect(() => {
    setItems(products);
  }, [products]);

  const onRemoved = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-rc-border bg-rc-surface/50 px-6 py-14 text-center">
        <p className="font-heading text-lg font-semibold text-rc-navy">
          Your wishlist is empty
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-rc-muted">
          Tap the heart on any rug to save it here. Build a shortlist before you buy.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-lg bg-rc-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
        >
          Browse rugs
        </Link>
      </div>
    );
  }

  return (
    <ul className={gridClass}>
      {items.map((product) => (
        <li key={product.id} className="min-w-0">
          <WishlistCard product={product} onRemoved={onRemoved} />
        </li>
      ))}
    </ul>
  );
}
