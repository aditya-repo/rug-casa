"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PdpArtisanSection } from "@/components/product/pdp/PdpArtisanSection";
import { PdpCraftPillarsSection } from "@/components/product/pdp/PdpCraftPillarsSection";
import { PdpExploreCollectionsCarousel } from "@/components/product/pdp/PdpExploreCollectionsCarousel";
import { PdpHowItWorksSection } from "@/components/product/pdp/PdpHowItWorksSection";
import { PdpInfoAccordionsPanel } from "@/components/product/pdp/PdpInfoAccordions";
import { useCart } from "@/components/cart/CartProvider";
import {
  IconBadge,
  IconChevronLeftThin,
  IconChevronRightThin,
  IconGift,
  IconMedal,
  IconReturn,
} from "@/components/layout/icons";
import { WishlistHeartButton } from "@/components/wishlist/WishlistHeartButton";
import { companyWhatsAppUrl } from "@/lib/data/company";
import type { ProductDetailModel } from "@/lib/data/product-detail";
import { CART_MAX_QTY } from "@/lib/cart/types";

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

function IconShare({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInfo({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 11v5M12 8h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWhatsApp({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const featureIcons = [IconBadge, IconGift, IconReturn, IconMedal] as const;

const selectedSizeClass =
  "border-[#d4a59a] bg-[#f3e8e3] text-rc-navy";
const idleSizeClass =
  "border-rc-border bg-white text-rc-navy hover:border-rc-muted-light";

export function ProductDetailClient({
  model,
  isAuthenticated = false,
  initialWishlisted = false,
}: {
  model: ProductDetailModel;
  isAuthenticated?: boolean;
  initialWishlisted?: boolean;
}) {
  const {
    product,
    images,
    sizes,
    colors,
    services,
    features,
    youMayAlsoLike,
    infoAccordions,
  } = model;

  const galleryScrollerRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const imageCount = Math.max(images.length, 1);

  const [slideIndex, setSlideIndex] = useState(0);
  const [sizeId, setSizeId] = useState(model.defaultSizeId);
  const [colorId, setColorId] = useState(model.defaultColorId);
  const [qty, setQty] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [cartNotice, setCartNotice] = useState<{
    type: "ok" | "error";
    message: string;
  } | null>(null);
  const { addItem } = useCart();

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
    root.addEventListener("touchend", flushTwice, { passive: true });

    return () => {
      root.removeEventListener("scrollend", onScrollEnd);
      root.removeEventListener("touchend", flushTwice);
    };
  }, [flushSlideIndex, flushTwice]);

  const scrollToSlide = useCallback(
    (i: number) => {
      const el = galleryScrollerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      el.scrollTo({
        left: Math.min(Math.max(0, i), imageCount - 1) * w,
        behavior: "smooth",
      });
      flushTwice();
    },
    [imageCount, flushTwice],
  );

  const goNextSlide = useCallback(() => {
    const el = galleryScrollerRef.current;
    if (!el || imageCount < 2) return;
    const w = el.clientWidth;
    const current = Math.round(el.scrollLeft / Math.max(w, 1));
    const next = (current + 1) % imageCount;
    el.scrollTo({ left: next * w, behavior: "smooth" });
    flushTwice();
  }, [imageCount, flushTwice]);

  const goPrevSlide = useCallback(() => {
    const el = galleryScrollerRef.current;
    if (!el || imageCount < 2) return;
    const w = el.clientWidth;
    const current = Math.round(el.scrollLeft / Math.max(w, 1));
    const prev = (current - 1 + imageCount) % imageCount;
    el.scrollTo({ left: prev * w, behavior: "smooth" });
    flushTwice();
  }, [imageCount, flushTwice]);

  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const color = colors.find((c) => c.id === colorId) ?? colors[0];

  const unitSale = size?.isCustom ? null : (size?.basePrice ?? null);
  const unitMrp =
    unitSale == null ? null : Math.round(unitSale * model.mrpFactor);
  const servicesTotal = services
    .filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
  const lineSale =
    unitSale != null ? unitSale * qty + servicesTotal : null;
  const lineMrp =
    unitMrp != null ? unitMrp * qty + servicesTotal : null;

  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(
      `Hi, I'm interested in ${product.name} (${model.itemCode}), size ${size?.label ?? ""}.`,
    );
    return `${companyWhatsAppUrl()}?text=${text}`;
  }, [product.name, model.itemCode, size?.label]);

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  }

  function handleAddToCart() {
    if (size?.isCustom || unitSale == null) {
      setCartNotice({
        type: "error",
        message: "Custom sizes need a quote — message us on WhatsApp.",
      });
      return;
    }

    const selectedServiceRows = services.filter((s) =>
      selectedServices.includes(s.id),
    );
    const result = addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      imageSrc: product.imageSrc || images[0]?.src || "",
      imageAlt: product.imageAlt || product.name,
      sizeId: size.id,
      sizeLabel: size.label,
      colorId: color?.id ?? "default",
      colorLabel: color?.label ?? "As shown",
      unitPrice: unitSale,
      unitMrp: unitMrp ?? unitSale,
      quantity: Math.min(CART_MAX_QTY, Math.max(1, qty)),
      serviceIds: selectedServiceRows.map((s) => s.id),
      serviceLabels: selectedServiceRows.map((s) => s.label),
      servicesPerUnit: selectedServiceRows.reduce((sum, s) => sum + s.price, 0),
    });

    if (!result.ok) {
      setCartNotice({ type: "error", message: result.error });
      return;
    }

    setCartNotice({ type: "ok", message: "Added to cart" });
    window.setTimeout(() => setCartNotice(null), 2500);
  }

  const galleryImages = images.length > 0 ? images : [{ src: "", alt: product.name }];

  return (
    <>
      <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,24rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,26rem)] xl:gap-14">
        {/* Gallery — sticky while right column (purchase + accordions) scrolls */}
        <div className="lg:sticky lg:top-[7.5rem] lg:self-start">
          <div className="flex flex-col gap-3 md:flex-row md:gap-3">
            <div className="order-2 hidden w-[4.25rem] shrink-0 flex-col gap-2 overflow-y-auto md:order-1 md:flex md:max-h-[min(32rem,calc(100vh-9rem))]">
              {galleryImages.map((im, i) => (
                <button
                  key={`${im.src}-${i}`}
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  className={`relative aspect-square w-full shrink-0 overflow-hidden border transition-colors ${
                    slideIndex === i
                      ? "border-[#d4a59a]"
                      : "border-rc-border hover:border-rc-muted-light"
                  }`}
                  aria-label={`View image ${i + 1}`}
                  aria-current={slideIndex === i}
                >
                  {im.src ? (
                    <Image src={im.src} alt="" fill className="object-cover" sizes="68px" />
                  ) : (
                    <span className="absolute inset-0 bg-rc-surface" />
                  )}
                </button>
              ))}
            </div>

            <div className="relative order-1 aspect-[4/3] w-full overflow-hidden bg-rc-surface md:order-2 md:aspect-[5/4]">
              <div
                ref={galleryScrollerRef}
                role="group"
                aria-roledescription="carousel"
                aria-label={`Product image ${slideIndex + 1} of ${galleryImages.length}`}
                tabIndex={0}
                onScroll={scheduleFlush}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    goNextSlide();
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    goPrevSlide();
                  }
                }}
                className="absolute inset-0 flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {galleryImages.map((im, i) => (
                  <div
                    key={`${im.src}-${i}`}
                    className="relative h-full w-full shrink-0 grow-0 basis-full snap-start"
                  >
                    {im.src ? (
                      <Image
                        src={im.src}
                        alt={im.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 55vw"
                        priority={i === 0}
                        draggable={false}
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-sm text-rc-muted">
                        No image
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {galleryImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrevSlide}
                    className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-rc-muted-light hover:text-rc-navy"
                    aria-label="Previous image"
                  >
                    <IconChevronLeftThin className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextSlide}
                    className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-rc-muted-light hover:text-rc-navy"
                    aria-label="Next image"
                  >
                    <IconChevronRightThin className="h-6 w-6" />
                  </button>
                </>
              ) : null}

              <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:hidden">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToSlide(i)}
                    className={`pointer-events-auto h-1.5 w-1.5 rounded-full ${
                      i === slideIndex ? "bg-rc-navy" : "bg-rc-border"
                    }`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 hidden grid-cols-2 gap-3 border-t border-rc-border pt-5 sm:grid-cols-4 md:grid">
            {features.map((f, idx) => {
              const Icon = featureIcons[idx] ?? IconBadge;
              return (
                <div key={f.title} className="flex gap-2.5">
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

        {/* Buy column — match reference layout */}
        <div className="mt-8 lg:mt-0">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-rc-navy md:text-[2rem]">
              {product.name}
            </h1>
            <div className="flex shrink-0 items-center gap-1 pt-1">
              <WishlistHeartButton
                productId={product.id}
                isAuthenticated={isAuthenticated}
                initialWishlisted={initialWishlisted}
                className="flex h-9 w-9 items-center justify-center rounded-full text-rc-navy transition-colors hover:bg-rc-surface"
                iconClassName="h-5 w-5"
                activeClassName="fill-current text-red-500"
              />
              <button
                type="button"
                onClick={handleShare}
                className="flex h-9 w-9 items-center justify-center rounded-full text-rc-navy transition-colors hover:bg-rc-surface"
                aria-label="Share product"
              >
                <IconShare />
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-rc-muted">{model.subtitle}</p>

          <div className="mt-5">
            {lineSale != null ? (
              <p className="text-2xl font-semibold tracking-tight text-rc-navy md:text-[1.75rem]">
                ₹ {formatInr(lineSale)}
              </p>
            ) : (
              <p className="text-xl font-semibold text-rc-navy">Custom quote</p>
            )}
            {lineMrp != null && lineSale != null && lineMrp > lineSale ? (
              <p className="mt-0.5 text-sm text-rc-muted-light line-through">
                ₹ {formatInr(lineMrp)}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-rc-muted">(Inclusive of all taxes)</p>
          </div>

          <div className="mt-6 space-y-6 border-t border-rc-border pt-6">
            {/* Color */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rc-navy">
                Choose a color{" "}
                <span className="font-medium normal-case tracking-normal text-rc-muted">
                  {color?.label}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    title={c.label}
                    className={`relative h-11 w-11 overflow-hidden border transition-colors ${
                      colorId === c.id
                        ? "border-[#d4a59a]"
                        : "border-rc-border hover:border-rc-muted-light"
                    }`}
                    aria-pressed={colorId === c.id}
                    aria-label={c.label}
                  >
                    {c.imageSrc ? (
                      <Image
                        src={c.imageSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <span
                        className="absolute inset-0"
                        style={{ backgroundColor: c.swatch ?? "#d1d5db" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rc-navy">
                  Size
                </p>
                <p className="text-xs text-rc-muted">
                  <Link href="/buying-guide" className="hover:text-rc-navy hover:underline">
                    Size Chart
                  </Link>
                  <span className="mx-1.5 text-rc-border">|</span>
                  <Link href="/buying-guide" className="hover:text-rc-navy hover:underline">
                    Size Guide
                  </Link>
                </p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
                {sizes.map((s) => (
                  <div key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSizeId(s.id)}
                      className={`w-full border px-3 py-3 text-center transition-colors ${
                        sizeId === s.id ? selectedSizeClass : idleSizeClass
                      }`}
                      aria-pressed={sizeId === s.id}
                    >
                      <span className="block text-sm font-semibold leading-tight">
                        {s.label}
                      </span>
                      <span className="mt-1 block text-[11px] text-rc-muted">
                        {s.cmLabel}
                      </span>
                    </button>
                    <p className="mt-1.5 text-center text-[11px] font-medium text-rc-muted">
                      {s.availabilityLabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + item code */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rc-navy">
                  Quantity
                </p>
                <div className="mt-2 flex items-center border border-rc-border">
                  <button
                    type="button"
                    className="px-3.5 py-2.5 text-rc-navy hover:bg-rc-surface"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={qty}
                    className="w-12 border-x border-rc-border bg-white py-2.5 text-center text-sm font-semibold text-rc-navy outline-none"
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    className="px-3.5 py-2.5 text-rc-navy hover:bg-rc-surface"
                    onClick={() => setQty((q) => Math.min(CART_MAX_QTY, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="pb-2.5 text-sm text-rc-navy">
                Item Code:{" "}
                <span className="font-medium">{model.itemCode}</span>
              </p>
            </div>

            {/* Additional services */}
            <div>
              <p className="text-sm font-semibold text-rc-navy">
                Yes, You Need Additional Services
              </p>
              <ul className="mt-3 space-y-2.5">
                {services.map((service) => {
                  const checked = selectedServices.includes(service.id);
                  return (
                    <li key={service.id}>
                      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-rc-navy">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService(service.id)}
                          className="mt-0.5 h-4 w-4 rounded-sm border-rc-border accent-rc-navy"
                        />
                        <span className="flex flex-wrap items-center gap-1.5 leading-snug">
                          <span>
                            {service.label} ₹ {formatInr(service.price)}
                          </span>
                          <span
                            className="inline-flex text-rc-muted-light"
                            title={service.description}
                          >
                            <IconInfo />
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center bg-rc-navy px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-rc-navy-dark"
              >
                {cartNotice?.type === "ok" ? "Added ✓" : "Add to Cart"}
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 border border-rc-border bg-white px-4 py-3.5 text-sm font-semibold text-rc-navy transition-colors hover:bg-rc-surface"
              >
                <IconWhatsApp className="h-5 w-5 text-[#25D366]" />
                WhatsApp
              </a>
            </div>

            {cartNotice ? (
              <p
                className={`text-center text-sm ${
                  cartNotice.type === "ok" ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {cartNotice.type === "ok" ? (
                  <>
                    {cartNotice.message}.{" "}
                    <Link href="/cart" className="font-semibold underline-offset-2 hover:underline">
                      View cart
                    </Link>
                  </>
                ) : (
                  cartNotice.message
                )}
              </p>
            ) : null}

            <p className="text-center text-sm text-rc-muted">
              Need Help?{" "}
              <Link href="/contact" className="font-medium text-rc-navy underline-offset-2 hover:underline">
                Speak to our stylists
              </Link>
            </p>

            <PdpInfoAccordionsPanel data={infoAccordions} />
          </div>
        </div>
      </div>

      <PdpArtisanSection />

      <PdpHowItWorksSection />

      <PdpExploreCollectionsCarousel products={youMayAlsoLike} />

      <PdpCraftPillarsSection />

      {/* Mobile sticky CTAs */}
      <div
        className="fixed inset-x-0 z-40 flex gap-2 border-t border-rc-border bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm md:hidden"
        style={{
          bottom: "calc(4.25rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center bg-rc-navy py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-white"
        >
          {cartNotice?.type === "ok" ? "Added ✓" : "Add to Cart"}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 border border-rc-border bg-white py-3.5 text-sm font-semibold text-rc-navy"
        >
          <IconWhatsApp className="h-5 w-5 text-[#25D366]" />
          WhatsApp
        </a>
      </div>
      <div className="h-20 md:hidden" aria-hidden />
    </>
  );
}
