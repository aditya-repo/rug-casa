"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import {
  IconChevronLeftThin,
  IconChevronRightThin,
} from "@/components/layout/icons";
import type { ArtistCollectionItem } from "@/lib/data/artist-collection";

function ArtistCard({ item }: { item: ArtistCollectionItem }) {
  return (
    <Link
      href={`/product/${item.id}`}
      className="group flex w-[min(42vw,11.5rem)] shrink-0 snap-start flex-col items-center text-center sm:w-44 md:w-[calc((100%-4rem)/5)] lg:w-[calc((100%-5rem)/5)]"
    >
      <span className="relative mb-4 block aspect-square w-full overflow-hidden bg-rc-surface">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 768px) 42vw, 20vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
      </span>
      <p className="font-heading text-sm font-semibold text-rc-navy md:text-[15px]">
        {item.name}
      </p>
      <p className="mt-1 text-[11px] leading-snug text-rc-muted md:text-xs">
        {item.material}
      </p>
      {item.dimensions ? (
        <p className="mt-1.5 text-xs text-rc-navy md:text-sm">{item.dimensions}</p>
      ) : null}
      <p className="mt-1 text-sm font-medium text-rc-navy">₹{item.price}</p>
    </Link>
  );
}

export function ArtistCollectionCarousel({
  items,
}: {
  items: ArtistCollectionItem[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      className="space-y-6 pt-4 md:space-y-8 md:pt-6"
      aria-labelledby="artist-collection-heading"
    >
      <h2
        id="artist-collection-heading"
        className="text-center font-heading text-2xl font-semibold tracking-tight text-rc-navy md:text-3xl"
      >
        Our Artist Collection
      </h2>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          className="absolute left-0 top-[28%] z-10 flex h-8 w-8 -translate-x-1 -translate-y-1/2 items-center justify-center border border-rc-border bg-white text-rc-navy transition-colors hover:bg-rc-surface md:h-9 md:w-9 md:-translate-x-3"
          aria-label="Previous artist rugs"
        >
          <IconChevronLeftThin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          className="absolute right-0 top-[28%] z-10 flex h-8 w-8 translate-x-1 -translate-y-1/2 items-center justify-center border border-rc-border bg-white text-rc-navy transition-colors hover:bg-rc-surface md:h-9 md:w-9 md:translate-x-3"
          aria-label="Next artist rugs"
        >
          <IconChevronRightThin className="h-4 w-4" />
        </button>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-8 pb-1 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 md:px-10 [&::-webkit-scrollbar]:hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Our Artist Collection"
        >
          {items.map((item) => (
            <ArtistCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
