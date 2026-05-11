"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ProductCard } from "@/components/product/ProductCard";
import {
  IconBadge,
  IconCart,
  IconChevronLeftThin,
  IconChevronRightThin,
  IconGift,
  IconHeart,
  IconLock,
  IconMedal,
  IconReturn,
  IconTruck,
} from "@/components/layout/icons";
import type { ProductDetailModel } from "@/lib/data/product-detail";

/** Active slide = largest horizontal overlap with the scroller viewport (same idea as hero carousel). */
function getActiveGalleryIndex(root: HTMLDivElement, count: number): number {
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

function formatInr(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function RatingStars({ rating }: { rating: number }) {
  const gid = useId().replace(/:/g, "");
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25;
  const empty = Math.max(0, 5 - full - (hasHalf ? 1 : 0));
  const gradId = `star-half-${gid}`;
  return (
    <span className="flex items-center gap-0.5 text-amber-400" aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f-${i}`} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf ? (
        <svg className="h-4 w-4" viewBox="0 0 20 20" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${gradId})`}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z"
          />
        </svg>
      ) : null}
      {Array.from({ length: empty }).map((_, i) => (
        <svg
          key={`e-${i}`}
          className="h-4 w-4 fill-rc-border text-rc-border"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

type TabId = "details" | "specs" | "care" | "shipping" | "reviews";

const featureIcons = [IconBadge, IconGift, IconReturn, IconMedal] as const;

export function ProductDetailClient({ model }: { model: ProductDetailModel }) {
  const { product, images, sizes, tabs, trustRow, features, youMayAlsoLike } = model;

  const galleryScrollerRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const imageCount = images.length;

  const [slideIndex, setSlideIndex] = useState(0);
  const [sizeId, setSizeId] = useState(model.defaultSizeId);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const flushSlideIndex = useCallback(() => {
    const el = galleryScrollerRef.current;
    if (!el) return;
    const next = getActiveGalleryIndex(el, imageCount);
    setSlideIndex(next);
  }, [imageCount]);

  const scheduleFlush = useCallback(() => {
    if (scrollRafRef.current != null) {
      cancelAnimationFrame(scrollRafRef.current);
    }
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      flushSlideIndex();
    });
  }, [flushSlideIndex]);

  const flushTwice = useCallback(() => {
    requestAnimationFrame(() => {
      flushSlideIndex();
      requestAnimationFrame(flushSlideIndex);
    });
  }, [flushSlideIndex]);

  useLayoutEffect(() => {
    flushSlideIndex();
  }, [flushSlideIndex]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current != null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const root = galleryScrollerRef.current;
    if (!root) return;

    const onScrollEnd = () => flushSlideIndex();
    root.addEventListener("scrollend", onScrollEnd);

    const onTouchEnd = () => flushTwice();
    root.addEventListener("touchend", onTouchEnd, { passive: true });

    const slides = [...root.children] as HTMLElement[];
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            () => {
              flushSlideIndex();
            },
            { root, threshold: [0, 0.05, 0.15, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1] },
          )
        : null;

    for (const el of slides) io?.observe(el);

    return () => {
      root.removeEventListener("scrollend", onScrollEnd);
      root.removeEventListener("touchend", onTouchEnd);
      io?.disconnect();
    };
  }, [flushSlideIndex, flushTwice, imageCount]);

  useEffect(() => {
    const el = galleryScrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => flushSlideIndex());
    ro.observe(el);
    return () => ro.disconnect();
  }, [flushSlideIndex]);

  const scrollToSlide = useCallback(
    (i: number) => {
      const el = galleryScrollerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      el.scrollTo({ left: Math.min(Math.max(0, i), imageCount - 1) * w, behavior: "smooth" });
      flushTwice();
    },
    [imageCount, flushTwice],
  );

  const goNextSlide = useCallback(() => {
    const el = galleryScrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const current = Math.round(el.scrollLeft / Math.max(w, 1));
    const next = (current + 1) % imageCount;
    el.scrollTo({ left: next * w, behavior: "smooth" });
    flushTwice();
  }, [imageCount, flushTwice]);

  const goPrevSlide = useCallback(() => {
    const el = galleryScrollerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const current = Math.round(el.scrollLeft / Math.max(w, 1));
    const prev = (current - 1 + imageCount) % imageCount;
    el.scrollTo({ left: prev * w, behavior: "smooth" });
    flushTwice();
  }, [imageCount, flushTwice]);

  const onGalleryKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNextSlide();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrevSlide();
    }
  };

  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];

  const unitSale = useMemo(() => {
    if (size.isCustom) return null;
    return size.basePrice;
  }, [size]);

  const unitMrp = useMemo(() => {
    if (unitSale == null) return null;
    return Math.round(unitSale * model.mrpFactor);
  }, [unitSale, model.mrpFactor]);

  const lineSale = unitSale != null ? unitSale * qty : null;
  const lineMrp = unitMrp != null ? unitMrp * qty : null;

  const discountPct =
    lineSale != null && lineMrp != null && lineMrp > lineSale
      ? Math.round((1 - lineSale / lineMrp) * 100)
      : product.discountPercent;

  const thumbSlots = useMemo(() => {
    const n = images.length;
    if (n <= 5) return images.map((im, i) => ({ im, i, overlay: null as string | null }));
    return [
      ...images.slice(0, 4).map((im, i) => ({ im, i, overlay: null as string | null })),
      {
        im: images[4],
        i: 4,
        overlay: `+${n - 5}`,
      },
    ];
  }, [images]);

  const minNonCustom = useMemo(
    () => Math.min(...sizes.filter((s) => !s.isCustom).map((s) => s.basePrice)),
    [sizes],
  );

  return (
    <>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,26rem)] xl:gap-14">
        {/* Gallery */}
        <div>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <div className="order-2 hidden w-[4.5rem] shrink-0 flex-col gap-2 overflow-y-auto py-0.5 md:order-1 md:flex md:max-h-[min(32rem,70vh)]">
              {thumbSlots.map(({ im, i, overlay }) => (
                <button
                  key={`${i}-${overlay ?? "t"}`}
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                    slideIndex === i ? "border-rc-navy" : "border-rc-border hover:border-rc-muted-light"
                  }`}
                  aria-label={overlay ? `View image ${i + 1}, ${overlay} more` : `View image ${i + 1}`}
                >
                  <Image src={im.src} alt="" fill className="object-cover" sizes="72px" />
                  {overlay ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                      {overlay}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-xl border border-rc-border bg-rc-surface md:order-2">
              <div
                ref={galleryScrollerRef}
                role="group"
                aria-roledescription="carousel"
                aria-label={`Product image ${slideIndex + 1} of ${imageCount}: ${images[slideIndex]?.alt ?? ""}`}
                tabIndex={0}
                onScroll={scheduleFlush}
                onKeyDown={onGalleryKeyDown}
                className="absolute inset-0 flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain [-webkit-overflow-scrolling:touch] outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {images.map((im, i) => (
                  <div
                    key={`${im.src}-${i}`}
                    className="relative h-full w-full shrink-0 grow-0 basis-full snap-start"
                  >
                    <Image
                      src={im.src}
                      alt={im.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 640px"
                      priority={i === 0}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={goPrevSlide}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-rc-border bg-white/95 text-rc-navy shadow-sm hover:bg-white"
                aria-label="Previous image"
              >
                <IconChevronLeftThin className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNextSlide}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-rc-border bg-white/95 text-rc-navy shadow-sm hover:bg-white"
                aria-label="Next image"
              >
                <IconChevronRightThin className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setWishlisted((w) => !w)}
                className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-rc-border bg-white shadow-sm transition-colors ${
                  wishlisted ? "text-red-500" : "text-rc-navy"
                }`}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <IconHeart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>

              <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:hidden">
                <div className="pointer-events-auto flex gap-1 rounded-full bg-black/40 px-2 py-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToSlide(i)}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        i === slideIndex ? "bg-white" : "bg-white/40"
                      }`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="rounded-full bg-black/40 px-2 py-1 text-xs font-medium text-white">
                  {slideIndex + 1}/{imageCount}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 hidden grid-cols-2 gap-3 border-t border-rc-border pt-4 sm:grid-cols-4 md:mt-6 md:grid md:pt-6">
            {features.map((f, idx) => {
              const Icon = featureIcons[idx] ?? IconBadge;
              return (
                <div
                  key={f.title}
                  className="flex gap-3 rounded-lg border border-rc-border bg-rc-surface/60 px-3 py-2.5"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-rc-navy" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-rc-navy">{f.title}</p>
                    <p className="text-[11px] text-rc-muted">{f.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buy column — desktop */}
        <div className="mt-8 lg:mt-0">
          <div className="flex flex-wrap items-start gap-2">
            <h1 className="font-heading text-2xl font-semibold leading-tight text-rc-navy md:text-3xl">
              {product.name}
            </h1>
            {model.badgeLabel ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                {model.badgeLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-rc-muted">
            <RatingStars rating={product.rating} />
            <span className="font-medium text-rc-navy">{product.rating.toFixed(1)}</span>
            <span className="text-rc-muted-light">|</span>
            <span>({product.reviews} Reviews)</span>
            <span className="text-rc-muted-light">|</span>
            <span>{model.soldCount}+ Sold</span>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            {lineSale != null ? (
              <>
                <span className="text-3xl font-bold text-rc-navy">₹{formatInr(lineSale)}</span>
                {lineMrp != null && lineMrp > lineSale ? (
                  <span className="text-lg text-rc-muted-light line-through">
                    ₹{formatInr(lineMrp)}
                  </span>
                ) : null}
                <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                  {discountPct}% OFF
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-rc-navy">
                From ₹{formatInr(minNonCustom)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-rc-muted">Inclusive of all taxes</p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-semibold text-rc-navy">
                Size: {size.label}
                {!size.isCustom ? (
                  <span className="font-normal text-rc-muted"> ({size.cmLabel})</span>
                ) : (
                  <span className="font-normal text-rc-muted"> — {size.cmLabel}</span>
                )}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeId(s.id)}
                    className={`rounded-lg border-2 px-2 py-2.5 text-left text-xs transition-colors md:text-sm ${
                      sizeId === s.id
                        ? "border-rc-navy bg-white"
                        : "border-rc-border bg-white hover:border-rc-muted-light"
                    }`}
                  >
                    <span className="block font-semibold text-rc-navy">{s.label}</span>
                    {!s.isCustom ? (
                      <span className="mt-0.5 block text-[11px] text-rc-muted md:text-xs">
                        ₹{formatInr(s.basePrice)}
                      </span>
                    ) : (
                      <span className="mt-0.5 block text-[11px] text-rc-muted md:text-xs">
                        Contact us
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-rc-navy">Quantity</span>
              <div className="flex items-center rounded-lg border border-rc-border">
                <button
                  type="button"
                  className="px-3 py-2 text-rc-navy hover:bg-rc-surface"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-semibold text-rc-navy">
                  {qty}
                </span>
                <button
                  type="button"
                  className="px-3 py-2 text-rc-navy hover:bg-rc-surface"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="hidden gap-3 md:flex">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rc-navy px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-rc-navy-dark"
              >
                <IconCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-lg bg-orange-500 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Buy Now
              </button>
            </div>

            <div className="hidden grid-cols-3 gap-2 border-t border-rc-border pt-5 md:grid">
              {trustRow.map((t) => (
                <div key={t.title} className="text-center">
                  <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-rc-surface text-rc-navy">
                    {t.title.includes("Shipping") ? (
                      <IconTruck className="h-4 w-4" />
                    ) : t.title.includes("Returns") ? (
                      <IconReturn className="h-4 w-4" />
                    ) : (
                      <IconLock className="h-4 w-4" />
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-rc-navy">{t.title}</p>
                  <p className="text-[10px] text-rc-muted">{t.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile feature row */}
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-rc-border pt-4 md:hidden">
        {features.map((f, idx) => {
          const Icon = featureIcons[idx] ?? IconBadge;
          return (
            <div
              key={f.title}
              className="flex gap-2 rounded-lg border border-rc-border bg-rc-surface/60 px-2.5 py-2"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-rc-navy" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold leading-tight text-rc-navy">{f.title}</p>
                <p className="text-[10px] text-rc-muted">{f.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile trust — below purchase block, before tabs */}
      <div className="mt-8 grid grid-cols-3 gap-2 border-t border-rc-border pt-6 md:hidden">
        {trustRow.map((t) => (
          <div key={t.title} className="text-center">
            <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-rc-surface text-rc-navy">
              {t.title.includes("Shipping") ? (
                <IconTruck className="h-3.5 w-3.5" />
              ) : t.title.includes("Returns") ? (
                <IconReturn className="h-3.5 w-3.5" />
              ) : (
                <IconLock className="h-3.5 w-3.5" />
              )}
            </div>
            <p className="text-[10px] font-semibold leading-tight text-rc-navy">{t.title}</p>
            <p className="text-[9px] text-rc-muted">{t.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Tabs + content */}
      <section className="mt-8 border-t border-rc-border pt-8 md:mt-12" aria-label="Product information">
        <div
          role="tablist"
          aria-label="Product sections"
          className="-mx-1 flex gap-1 overflow-x-auto border-b border-rc-border pb-px"
        >
          {(
            [
              ["details", "Product Details"],
              ["specs", "Specifications"],
              ["care", "Care Instructions"],
              ["shipping", "Shipping & Returns"],
              ["reviews", `Reviews (${product.reviews})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`shrink-0 whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "border-rc-navy text-rc-navy"
                  : "border-transparent text-rc-muted hover:text-rc-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_auto] lg:gap-10">
          <div className="min-w-0 text-sm leading-relaxed text-rc-muted">
            {activeTab === "details" ? (
              <>
                <p>{tabs.detailsIntro}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {(detailsExpanded
                    ? tabs.detailsBullets
                    : tabs.detailsBullets.slice(0, 2)
                  ).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {tabs.detailsBullets.length > 2 ? (
                  <button
                    type="button"
                    onClick={() => setDetailsExpanded((e) => !e)}
                    className="mt-3 text-sm font-semibold text-rc-navy underline-offset-2 hover:underline"
                  >
                    {detailsExpanded ? "Read less" : "Read more"}
                  </button>
                ) : null}
              </>
            ) : null}
            {activeTab === "specs" ? (
              <dl className="grid gap-3 sm:grid-cols-2">
                {tabs.specifications.map((row) => (
                  <div key={row.label} className="border-b border-rc-border pb-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-rc-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-1 font-medium text-rc-navy">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {activeTab === "care" ? <p>{tabs.careHtml}</p> : null}
            {activeTab === "shipping" ? <p>{tabs.shippingHtml}</p> : null}
            {activeTab === "reviews" ? (
              <p>
                Customer reviews will load here when your review provider is connected.
                This product has{" "}
                <span className="font-medium text-rc-navy">{product.reviews}</span>{" "}
                published reviews with an average rating of{" "}
                <span className="font-medium text-rc-navy">{product.rating.toFixed(1)}</span>{" "}
                out of 5.
              </p>
            ) : null}
          </div>

          <aside className="mt-8 hidden w-[min(100%,18rem)] shrink-0 overflow-hidden rounded-xl border border-rc-border bg-rc-surface lg:mt-0 lg:block">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={model.promo.imageSrc}
                alt={model.promo.imageAlt}
                fill
                className="object-cover"
                sizes="288px"
              />
            </div>
            <div className="p-4">
              <p className="font-heading text-lg font-semibold text-rc-navy">{model.promo.title}</p>
              <Link
                href={model.promo.ctaHref}
                className="mt-3 inline-flex rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark"
              >
                Shop Now
              </Link>
            </div>
          </aside>
        </div>

        <aside className="mt-8 overflow-hidden rounded-xl border border-rc-border bg-rc-surface lg:hidden">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={model.promo.imageSrc}
              alt={model.promo.imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="p-4">
            <p className="font-heading text-lg font-semibold text-rc-navy">{model.promo.title}</p>
            <Link
              href={model.promo.ctaHref}
              className="mt-3 inline-flex rounded-lg bg-rc-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rc-navy-dark"
            >
              Shop Now
            </Link>
          </div>
        </aside>
      </section>

      {/* You may also like */}
      <section className="mt-14 border-t border-rc-border pt-10" aria-labelledby="ymal-heading">
        <h2 id="ymal-heading" className="font-heading text-xl font-semibold text-rc-navy">
          You may also like
        </h2>
        <ul className="mt-6 grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
          {youMayAlsoLike.map((p) => (
            <li key={p.id} className="min-w-0">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      {/* Mobile sticky CTAs */}
      <div
        className="fixed inset-x-0 z-40 flex gap-2 border-t border-rc-border bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm md:hidden"
        style={{
          bottom: "calc(4.25rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rc-navy py-3.5 text-sm font-semibold text-white"
        >
          <IconCart className="h-5 w-5" />
          Add to Cart
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center rounded-lg bg-orange-500 py-3.5 text-sm font-semibold text-white"
        >
          Buy Now
        </button>
      </div>

      {/* Spacer so content clears mobile sticky bar */}
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
