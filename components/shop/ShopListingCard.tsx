"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IconHeart } from "@/components/layout/icons";
import type { ProductItem } from "@/lib/data/products";

export function ShopListingCard({ product }: { product: ProductItem }) {
  const [wishlisted, setWishlisted] = useState(false);
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
        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rc-navy shadow-sm transition-colors hover:bg-white"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <IconHeart
            className={`h-4 w-4 ${wishlisted ? "fill-rc-navy text-rc-navy" : ""}`}
          />
        </button>
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
