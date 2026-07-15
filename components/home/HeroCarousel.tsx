"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { HeroSlide } from "@/lib/data/hero-slides";

const INTERVAL_MS = 6500;

/** Active slide = largest horizontal overlap with the scroller viewport. */
function getActiveSlideIndex(root: HTMLDivElement, count: number): number {
  const slides = [...root.children] as HTMLElement[];
  if (slides.length === 0) return 0;

  const rr = root.getBoundingClientRect();
  let bestIdx = 0;
  let bestOverlap = -1;

  slides.forEach((slide, idx) => {
    const r = slide.getBoundingClientRect();
    const overlap = Math.max(
      0,
      Math.min(r.right, rr.right) - Math.max(r.left, rr.left),
    );
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestIdx = idx;
    }
  });

  const page = root.clientWidth;
  if (page > 0) {
    const byScroll = Math.round(root.scrollLeft / page);
    if (bestOverlap < page * 0.1) {
      return Math.min(Math.max(0, byScroll), count - 1);
    }
  }

  return Math.min(Math.max(0, bestIdx), count - 1);
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const labelId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const flushIndex = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const next = getActiveSlideIndex(el, count);
    setIndex(next);
  }, [count]);

  const scheduleFlush = useCallback(() => {
    if (scrollRafRef.current != null) {
      cancelAnimationFrame(scrollRafRef.current);
    }
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      flushIndex();
    });
  }, [flushIndex]);

  const flushTwice = useCallback(() => {
    requestAnimationFrame(() => {
      flushIndex();
      requestAnimationFrame(flushIndex);
    });
  }, [flushIndex]);

  useLayoutEffect(() => {
    flushIndex();
  }, [flushIndex]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current != null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const onScrollEnd = () => flushIndex();
    root.addEventListener("scrollend", onScrollEnd);

    const onTouchEnd = () => flushTwice();
    root.addEventListener("touchend", onTouchEnd, { passive: true });

    const slidesEls = [...root.children] as HTMLElement[];
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            () => {
              flushIndex();
            },
            { root, threshold: [0, 0.05, 0.15, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1] },
          )
        : null;

    for (const el of slidesEls) io?.observe(el);

    return () => {
      root.removeEventListener("scrollend", onScrollEnd);
      root.removeEventListener("touchend", onTouchEnd);
      io?.disconnect();
    };
  }, [flushIndex, flushTwice]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => flushIndex());
    ro.observe(el);
    return () => ro.disconnect();
  }, [flushIndex]);

  const scrollToSlide = useCallback(
    (i: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      el.scrollTo({ left: Math.min(i, count - 1) * w, behavior: "smooth" });
      flushTwice();
    },
    [count, flushTwice],
  );

  const goNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const current = Math.round(el.scrollLeft / w);
    const next = (current + 1) % count;
    el.scrollTo({ left: next * w, behavior: "smooth" });
    flushTwice();
  }, [count, flushTwice]);

  const goPrev = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const current = Math.round(el.scrollLeft / w);
    const prev = (current - 1 + count) % count;
    el.scrollTo({ left: prev * w, behavior: "smooth" });
    flushTwice();
  }, [count, flushTwice]);

  useEffect(() => {
    const id = window.setInterval(goNext, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [goNext]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  const activeSlide = slides[index];

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      className="bg-rc-surface"
    >
      <h2 id={labelId} className="sr-only">
        Featured collections
      </h2>

      <div className="relative aspect-[2/1] w-full md:aspect-[19/6]">
        <div
          ref={scrollerRef}
          role="group"
          aria-label={`${index + 1} of ${count}: ${activeSlide.title}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onScroll={scheduleFlush}
          className="absolute inset-0 flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain [-webkit-overflow-scrolling:touch] outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s, i) => {
            const hasCopy = Boolean(s.title?.trim() || s.ctaLabel?.trim());
            return (
              <div
                key={s.id}
                className="relative h-full w-full shrink-0 grow-0 basis-full snap-start"
              >
                <Image
                  src={s.imageSrc}
                  alt={s.imageAlt || s.title || `Banner ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                  draggable={false}
                  unoptimized={
                    s.imageSrc.includes("localhost") || s.imageSrc.includes("127.0.0.1")
                  }
                />
                {hasCopy ? (
                  <div className="pointer-events-none absolute inset-0 z-[1] flex items-center">
                    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
                      <div className="max-w-[16rem] sm:max-w-md md:max-w-xl lg:max-w-2xl">
                        {s.eyebrow?.trim() ? (
                          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white drop-shadow-sm md:mb-2.5 md:text-xs">
                            {s.eyebrow}
                          </p>
                        ) : null}
                        {s.title?.trim() ? (
                          <h3 className="font-heading text-xl font-bold uppercase leading-tight tracking-wide text-white drop-shadow-md sm:text-2xl md:text-3xl lg:text-4xl lg:leading-[1.15]">
                            {s.title}
                          </h3>
                        ) : null}
                        {s.ctaLabel?.trim() ? (
                          <Link
                            href={s.ctaHref || "/shop"}
                            className="pointer-events-auto mt-4 inline-flex items-center justify-center bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-rc-navy transition-colors hover:bg-rc-surface sm:mt-5 sm:px-6 sm:py-3 sm:text-xs md:mt-6"
                          >
                            {s.ctaLabel}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div
          className="pointer-events-auto absolute bottom-3 left-0 right-0 z-[2] flex items-center justify-center gap-1.5 md:bottom-5 md:gap-2"
          role="tablist"
          aria-label="Choose slide"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}: ${s.title}`}
              className={`h-2 w-2 rounded-full shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rc-navy-dark/50 md:h-2.5 md:w-2.5 ${
                i === index
                  ? "bg-white"
                  : "bg-white/45 hover:bg-white/75"
              }`}
              onClick={() => scrollToSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
