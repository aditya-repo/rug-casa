"use client";

import Image from "next/image";
import Link from "next/link";
import { WishlistHeartButton } from "@/components/wishlist/WishlistHeartButton";
import type { ProductItem } from "@/lib/data/products";

export function ShopListingCard({
  product,
  isAuthenticated = false,
  initialWishlisted = false,
}: {
  product: ProductItem;
  isAuthenticated?: boolean;
  initialWishlisted?: boolean;
}) {
  const href = `/product/${product.id}`;

  return (
    <article className="flex flex-col text-center">
      <div className="relative">
        <Link
          href={href}
          className="relative block aspect-[5/4] w-full overflow-hidden bg-rc-surface"
        >
          {product.imageSrc ? (
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-rc-muted">
              No image
            </span>
          )}
        </Link>
        <WishlistHeartButton
          productId={product.id}
          isAuthenticated={isAuthenticated}
          initialWishlisted={initialWishlisted}
        />
      </div>

      <Link href={href} className="mt-3 block px-1">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-rc-navy md:text-sm">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[11px] leading-snug text-rc-muted md:text-xs">
          Handwoven wool &amp; bamboo silk
        </p>
        <p className="mt-1.5 text-xs text-rc-navy md:text-[13px]">
          {product.dimensions}
        </p>
        <p className="mt-1.5 text-sm font-medium text-rc-navy">
          ₹{product.price}
          {product.mrp && product.mrp !== product.price ? (
            <span className="text-rc-muted"> – ₹{product.mrp}</span>
          ) : null}
        </p>
      </Link>
    </article>
  );
}
