"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import {
  IconChevronLeftThin,
  IconChevronRightThin,
} from "@/components/layout/icons";
import { wovenStories, type WovenStory } from "@/lib/data/woven-stories";

function StoryCard({ story }: { story: WovenStory }) {
  return (
    <article className="flex h-full flex-col">
      <Link href={story.href} className="group block">
        <span className="relative block aspect-[4/3] w-full overflow-hidden bg-rc-surface">
          <Image
            src={story.imageSrc}
            alt={story.imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 70vw, (max-width: 1024px) 40vw, 25vw"
            draggable={false}
          />
        </span>
        <h3 className="mt-4 line-clamp-3 text-base font-semibold leading-snug text-rc-navy group-hover:underline md:text-[15px] md:leading-snug">
          {story.title}
        </h3>
      </Link>
      <Link
        href={story.href}
        className="mt-4 w-fit text-xs font-semibold uppercase tracking-[0.14em] text-rc-navy underline underline-offset-4 decoration-rc-navy/70 hover:decoration-rc-navy"
      >
        Read now
      </Link>
    </article>
  );
}

export function WovenStories() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const styles = getComputedStyle(el);
    const gap =
      Number.parseFloat(styles.columnGap || styles.gap || "0") || 20;
    const step = first.offsetWidth + gap;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  // Allow vertical page scroll; claim only clearly horizontal swipes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let axis: "x" | "y" | null = null;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startX = lastX = t.clientX;
      startY = t.clientY;
      axis = null;
    };

    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (axis === "y") return;

      e.preventDefault();
      el.scrollLeft -= t.clientX - lastX;
      lastX = t.clientX;
    };

    const onEnd = () => {
      axis = null;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return (
    <section className="bg-white py-12 md:py-16" aria-labelledby="woven-stories-heading">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="woven-stories-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-rc-navy md:text-4xl"
          >
            Woven Stories
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-rc-muted md:mt-4 md:text-base">
            From styling tips &amp; tricks to our top designer picks, the A B C of rugs, and
            everything else in between—read all there is to know about Rugs Bhadohi
          </p>
        </div>

        <div className="relative mt-10 lg:mt-12">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="absolute left-0 top-[28%] z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-rc-border bg-white text-rc-navy shadow-sm transition-colors hover:bg-rc-surface md:flex"
            aria-label="Previous woven stories"
          >
            <IconChevronLeftThin className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="absolute right-0 top-[28%] z-10 hidden h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center border border-rc-border bg-white text-rc-navy shadow-sm transition-colors hover:bg-rc-surface md:flex"
            aria-label="Next woven stories"
          >
            <IconChevronRightThin className="h-4 w-4" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-1 [scrollbar-width:none] [-ms-overflow-style:none] md:gap-5 [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: "pan-y" }}
            role="region"
            aria-roledescription="carousel"
            aria-label="Woven Stories"
          >
            {wovenStories.map((story) => (
              <div
                key={story.id}
                className="w-[calc((100%-0.5*1rem)/1.5)] shrink-0 snap-start md:w-[calc((100%-1.6*1.25rem)/2.6)] lg:w-[calc((100%-3*1.25rem)/4)]"
              >
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
