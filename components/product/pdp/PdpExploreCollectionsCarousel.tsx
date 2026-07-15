"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import {
  IconChevronLeftThin,
  IconChevronRightThin,
} from "@/components/layout/icons";
import type { ShopProductItem } from "@/lib/api/shop-products";
import type { ProductItem } from "@/lib/data/products";

type ExploreProduct = ProductItem &
  Partial<Pick<ShopProductItem, "material" | "weavingType">>;

function detailLine(product: ExploreProduct): string {
  const parts = [product.weavingType, product.material].filter(Boolean);
  if (parts.length > 0) return parts.join(" - ");
  return "Handwoven quality";
}

function ExploreCard({ product }: { product: ExploreProduct }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-[min(46vw,14rem)] shrink-0 snap-start flex-col items-center text-center sm:w-52 md:w-[calc((100%-4rem)/4)] lg:w-[calc((100%-5rem)/5)]"
    >
      <span className="relative mb-4 block aspect-[4/5] w-full overflow-hidden bg-rc-surface">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 46vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-rc-muted">
            No image
          </span>
        )}
      </span>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy md:text-xs">
        {product.name}
      </p>
      <p className="mt-1.5 text-[11px] leading-snug text-rc-muted md:text-xs">
        {detailLine(product)}
      </p>
      {product.dimensions ? (
        <p className="mt-1.5 text-xs text-rc-navy md:text-[13px]">
          {product.dimensions}
        </p>
      ) : null}
      <p className="mt-1.5 text-sm font-medium text-rc-navy">₹{product.price}</p>
    </Link>
  );
}

export function PdpExploreCollectionsCarousel({
  products,
}: {
  products: ExploreProduct[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 20;
    const step = first ? first.offsetWidth + gap : el.clientWidth * 0.7;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      className="mt-14 border-t border-rc-border pt-10 md:mt-16 md:pt-12"
      aria-labelledby="explore-collections-heading"
    >
      <h2
        id="explore-collections-heading"
        className="text-center font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
      >
        Explore More Collections
      </h2>

      <div className="relative mt-8 md:mt-10">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-[32%] z-10 flex h-9 w-9 -translate-x-1 -translate-y-1/2 items-center justify-center border border-rc-border bg-white/90 text-rc-navy transition-colors hover:bg-white md:-translate-x-3"
          aria-label="Previous collections"
        >
          <IconChevronLeftThin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="absolute right-0 top-[32%] z-10 flex h-9 w-9 translate-x-1 -translate-y-1/2 items-center justify-center border border-rc-border bg-white/90 text-rc-navy transition-colors hover:bg-white md:translate-x-3"
          aria-label="Next collections"
        >
          <IconChevronRightThin className="h-4 w-4" />
        </button>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-8 pb-1 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 md:px-10 [&::-webkit-scrollbar]:hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Explore more collections"
        >
          {products.map((product) => (
            <ExploreCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
