"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import {
  IconChevronLeftThin,
  IconChevronRightThin,
} from "@/components/layout/icons";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductItem } from "@/lib/data/products";

export function BestsellingCarousel({ products }: { products: ProductItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 16;
    const step = first ? first.offsetWidth + gap : el.clientWidth * 0.7;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <section className="space-y-2.5" aria-labelledby="our-bestselling-heading">
      <div className="flex items-center justify-between">
        <h2 id="our-bestselling-heading" className="text-xl font-semibold text-rc-navy">
          Our Best Sellers
        </h2>
        <Link href="/shop" className="text-sm font-medium text-rc-navy hover:underline">
          View All
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-1/3 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-rc-border bg-white text-rc-navy shadow-sm transition-colors hover:bg-rc-surface md:flex"
          aria-label="Previous best sellers"
        >
          <IconChevronLeftThin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="absolute right-0 top-1/3 z-10 hidden h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center border border-rc-border bg-white text-rc-navy shadow-sm transition-colors hover:bg-rc-surface md:flex"
          aria-label="Next best sellers"
        >
          <IconChevronRightThin className="h-4 w-4" />
        </button>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-1 pb-2 pt-0.5 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:px-0.5"
          role="region"
          aria-roledescription="carousel"
          aria-label="Our bestselling products"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[min(46vw,15.25rem)] shrink-0 snap-start sm:w-52 md:w-[calc((100%-3rem)/3.5)]"
            >
              <ProductCard product={product} showRating={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
