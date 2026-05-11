import type { ProductItem } from "./products";
import { catalogProducts, getProductById } from "./products";

export type PdpBreadcrumb = { label: string; href: string | null };

export type PdpImage = { src: string; alt: string };

export type PdpSizeOption = {
  id: string;
  label: string;
  cmLabel: string;
  /** Sale price for this size (rupees, no commas). */
  basePrice: number;
  /** When true, opens contact — no numeric price in UI. */
  isCustom?: boolean;
};

export type PdpFeatureCallout = {
  title: string;
  subtitle: string;
};

export type PdpTrustCallout = { title: string; subtitle: string };

export type PdpTabContent = {
  detailsIntro: string;
  detailsBullets: string[];
  specifications: { label: string; value: string }[];
  careHtml: string;
  shippingHtml: string;
};

export type PdpPromoBanner = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  ctaHref: string;
};

export type ProductDetailModel = {
  product: ProductItem;
  images: PdpImage[];
  breadcrumbs: PdpBreadcrumb[];
  soldCount: number;
  badgeLabel: string | null;
  sizes: PdpSizeOption[];
  defaultSizeId: string;
  /** MRP multiplier vs computed sale from selected size (for strike line). */
  mrpFactor: number;
  features: PdpFeatureCallout[];
  trustRow: PdpTrustCallout[];
  tabs: PdpTabContent;
  promo: PdpPromoBanner;
  /** Related products for PDP grid (excludes current). */
  youMayAlsoLike: ProductItem[];
};

function parseProductPrice(p: ProductItem): number {
  return Number(p.price.replace(/,/g, "")) || 0;
}

function parseMrp(p: ProductItem): number {
  return Number(p.mrp.replace(/,/g, "")) || 0;
}

function pickYouMayAlsoLike(excludeId: string, limit: number): ProductItem[] {
  return catalogProducts.filter((x) => x.id !== excludeId).slice(0, limit);
}

const MEDALLION_IMAGES: PdpImage[] = [
  {
    src: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&h=900&fit=crop",
    alt: "Persian medallion rug in a bright living room",
  },
  {
    src: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=900&fit=crop",
    alt: "Traditional patterned rug from above",
  },
  {
    src: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&h=900&fit=crop",
    alt: "Rug texture and fringe detail",
  },
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=900&fit=crop",
    alt: "Area rug under sofa and coffee table",
  },
  {
    src: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&h=900&fit=crop",
    alt: "Colorful rug in a styled interior",
  },
  {
    src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=900&fit=crop",
    alt: "Rug at entryway with natural light",
  },
  {
    src: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&h=900&fit=crop",
    alt: "Modern living space with patterned rug",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=900&fit=crop",
    alt: "Round and area rugs in a catalog-style shot",
  },
  {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=900&fit=crop",
    alt: "Runner and area rug in a hallway setting",
  },
];

function buildMedallionDetail(p: ProductItem): ProductDetailModel {
  return {
    product: p,
    images: MEDALLION_IMAGES,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Area Rugs", href: "/shop?category=area-rugs" },
      { label: "Traditional Rugs", href: "/shop" },
      { label: p.name, href: null },
    ],
    soldCount: 250,
    badgeLabel: "Bestseller",
    sizes: [
      {
        id: "s35",
        label: "3 x 5 ft",
        cmLabel: "90 x 150 cm",
        basePrice: 3999,
      },
      {
        id: "s46",
        label: "4 x 6 ft",
        cmLabel: "120 x 180 cm",
        basePrice: 4299,
      },
      {
        id: "s57",
        label: "5 x 7 ft",
        cmLabel: "150 x 210 cm",
        basePrice: 4999,
      },
      {
        id: "s810",
        label: "8 x 10 ft",
        cmLabel: "240 x 300 cm",
        basePrice: 8999,
      },
      {
        id: "custom",
        label: "Custom size",
        cmLabel: "Contact us",
        basePrice: 4999,
        isCustom: true,
      },
    ],
    defaultSizeId: "s57",
    mrpFactor: 7999 / 4999,
    features: [
      { title: "100% Premium Quality", subtitle: "Built to Last" },
      { title: "Soft & Comfortable", subtitle: "Luxurious Feel" },
      { title: "Easy to Clean", subtitle: "Low Maintenance" },
      { title: "Color Fast", subtitle: "Vibrant & Long Lasting" },
    ],
    trustRow: [
      { title: "Free Shipping", subtitle: "Pan India" },
      { title: "Easy Returns", subtitle: "7 Days Return" },
      { title: "Secure Payments", subtitle: "100% Safe" },
    ],
    tabs: {
      detailsIntro:
        "Transform your living space with this hand-finished Persian medallion rug. Dense pile, rich tones, and a classic central medallion pattern make it a timeless centerpiece for living rooms and bedrooms alike.",
      detailsBullets: [
        "Power-loomed for consistent pattern and durability",
        "Low-shed fibers — ideal for busy homes with kids or pets",
        "Anti-slip backing recommended for smooth floors (sold separately)",
        "Designed for indoor use; rotate periodically for even wear",
      ],
      specifications: [
        { label: "Pile height", value: "12 mm" },
        { label: "Weight", value: "2.8 kg / sqm" },
        { label: "Origin", value: "India" },
        { label: "Weave", value: "Machine-woven" },
        { label: "Backing", value: "Jute / cotton hybrid" },
      ],
      careHtml:
        "Vacuum regularly without a beater bar on the lowest setting. Spot-clean spills immediately with a damp cloth — avoid harsh chemicals. Professional deep cleaning once a year is recommended for high-traffic areas.",
      shippingHtml:
        "Orders ship within 2–4 business days. Free standard delivery across India. Easy 7-day returns in original condition — see our return policy for full details.",
    },
    promo: {
      title: "Style That Transforms Your Space",
      imageSrc:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
      imageAlt: "Styled living room with layered rugs",
      ctaHref: "/shop",
    },
    youMayAlsoLike: pickYouMayAlsoLike(p.id, 8),
  };
}

function buildGenericDetail(p: ProductItem): ProductDetailModel {
  const base = parseProductPrice(p);
  const mrp = parseMrp(p);
  const factor = mrp / Math.max(base, 1);

  const img = { src: p.imageSrc, alt: p.imageAlt };
  const images: PdpImage[] = [img, img, img, img, img];

  return {
    product: p,
    images,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: p.name, href: null },
    ],
    soldCount: Math.max(12, Math.round(p.reviews * 1.2)),
    badgeLabel: p.tag === "Bestseller" ? "Bestseller" : p.tag ?? null,
    sizes: [
      {
        id: "g-s",
        label: "Small",
        cmLabel: "90 x 150 cm",
        basePrice: Math.round(base * 0.85),
      },
      {
        id: "g-m",
        label: "Medium",
        cmLabel: "120 x 180 cm",
        basePrice: base,
      },
      {
        id: "g-l",
        label: "Large",
        cmLabel: "150 x 210 cm",
        basePrice: Math.round(base * 1.15),
      },
      {
        id: "g-xl",
        label: "Extra large",
        cmLabel: "200 x 300 cm",
        basePrice: Math.round(base * 1.45),
      },
      {
        id: "g-custom",
        label: "Custom size",
        cmLabel: "Contact us",
        basePrice: base,
        isCustom: true,
      },
    ],
    defaultSizeId: "g-m",
    mrpFactor: factor,
    features: [
      { title: "100% Premium Quality", subtitle: "Built to Last" },
      { title: "Soft & Comfortable", subtitle: "Luxurious Feel" },
      { title: "Easy to Clean", subtitle: "Low Maintenance" },
      { title: "Color Fast", subtitle: "Vibrant & Long Lasting" },
    ],
    trustRow: [
      { title: "Free Shipping", subtitle: "Pan India" },
      { title: "Easy Returns", subtitle: "7 Days Return" },
      { title: "Secure Payments", subtitle: "100% Safe" },
    ],
    tabs: {
      detailsIntro: `${p.name} by ${p.brand} — premium construction and finishes chosen for everyday living. Pair with a rug pad for extra cushioning and slip resistance.`,
      detailsBullets: [
        "Designed for residential indoor use",
        "Pattern placement may vary slightly — each piece is unique",
        "Vacuum regularly to maintain appearance",
      ],
      specifications: [
        { label: "Brand", value: p.brand },
        { label: "Collection", value: "RugCasa Signature" },
        { label: "Availability", value: "In stock" },
      ],
      careHtml:
        "Vacuum without a beater bar. Blot spills quickly with a clean cloth. Professional cleaning as needed.",
      shippingHtml:
        "Ships in 2–4 business days. Free delivery pan-India. 7-day easy returns when unused and in original packaging.",
    },
    promo: {
      title: "Complete the Look",
      imageSrc:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
      imageAlt: "Living room inspiration",
      ctaHref: "/shop",
    },
    youMayAlsoLike: pickYouMayAlsoLike(p.id, 8),
  };
}

export function getProductDetailModel(id: string): ProductDetailModel | null {
  const p = getProductById(id);
  if (!p) return null;
  if (p.id === "na-medallion") return buildMedallionDetail(p);
  return buildGenericDetail(p);
}
