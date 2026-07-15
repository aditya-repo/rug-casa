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
  /** Lead-time / stock label under the size card. */
  availabilityLabel: string;
  /** When true, opens contact — no numeric price in UI. */
  isCustom?: boolean;
};

export type PdpColorOption = {
  id: string;
  label: string;
  /** Optional swatch image; falls back to hex if missing. */
  imageSrc?: string;
  swatch?: string;
};

export type PdpServiceOption = {
  id: string;
  label: string;
  price: number;
  description: string;
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

export type PdpCareItem = {
  id: string;
  text: string;
};

export type PdpInfoAccordions = {
  /** Spec grid shown under Product Details. */
  attributes: { label: string; value: string }[];
  highlights: string[];
  careItems: PdpCareItem[];
  shippingBullets: string[];
  designStory: {
    title: string;
    productName: string;
    body: string;
  };
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
  subtitle: string;
  itemCode: string;
  soldCount: number;
  badgeLabel: string | null;
  colors: PdpColorOption[];
  defaultColorId: string;
  sizes: PdpSizeOption[];
  defaultSizeId: string;
  services: PdpServiceOption[];
  /** MRP multiplier vs computed sale from selected size (for strike line). */
  mrpFactor: number;
  features: PdpFeatureCallout[];
  trustRow: PdpTrustCallout[];
  tabs: PdpTabContent;
  infoAccordions: PdpInfoAccordions;
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

const DEFAULT_SERVICES: PdpServiceOption[] = [
  {
    id: "anti-slip",
    label: "Anti-Slip Mats",
    price: 18200,
    description: "Keeps the rug securely in place on hard floors.",
  },
  {
    id: "stain-coat",
    label: "Stain Resistance Coating",
    price: 16520,
    description: "Protective finish that helps resist everyday spills.",
  },
];

export const DEFAULT_CARE_ITEMS: PdpCareItem[] = [
  { id: "shed", text: "Shedding Is A Natural Property Of New Rug." },
  { id: "brush", text: "DO NOT Brush Or Scrub The Rug." },
  {
    id: "vacuum",
    text: "Only Vacuum Clean It Periodically. Avoid Using Vacuum Beater Brush Mode.",
  },
  { id: "spill", text: "If Spills Occur, Blot Immediately. Do Not Rub The Stain." },
  { id: "rotate", text: "Rotate Occasionally To Equalize Wear." },
  {
    id: "furniture",
    text: "Use Protectors Under The Legs Of Heavy Furniture To Avoid Flattening And Piling.",
  },
  {
    id: "thread",
    text: "If Thread Comes Out Do Not Pull The Yarn, Trim With Scissor.",
  },
  { id: "pro", text: "Periodic Professional Cleaning Recommended." },
  { id: "fold", text: "DO NOT Fold The Rug." },
  { id: "damp", text: "Avoid Using The Rug In Damp Or Wet Surface." },
];

export const DEFAULT_SHIPPING_BULLETS = [
  "Free Shipping Anywhere In India.",
  "Delivery Estimates: 3-10 Business Days For India & 6-12 Business Days For International (In Some Cases Custom Clearance Might Take Longer).",
  '"15 Days Hassle Free Return" Is Valid For Purchase Within India Only (Not Applicable For Custom Rug).',
  "Rug Sizes, Designs, And Patterns May Vary Slightly.",
  "Actual Rug Colors May Differ Due To Lighting And Device Screen Settings.",
  "Visual Appearance May Change Based On Rug Placement And Viewing Angle.",
];

function buildInfoAccordions(input: {
  productName: string;
  attributes: { label: string; value: string }[];
  highlights: string[];
  designBody: string;
}): PdpInfoAccordions {
  return {
    attributes: input.attributes,
    highlights: input.highlights,
    careItems: DEFAULT_CARE_ITEMS,
    shippingBullets: DEFAULT_SHIPPING_BULLETS,
    designStory: {
      title: "The Design Story",
      productName: input.productName,
      body: input.designBody,
    },
  };
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
      { label: "Rugs", href: "/shop" },
      { label: "Traditional Rugs", href: "/shop" },
      { label: p.name, href: null },
    ],
    subtitle: `${p.brand} Handwoven Wool Rug ${p.dimensions || "Rectangle"}`.trim(),
    itemCode: "RUG-MED-001",
    soldCount: 250,
    badgeLabel: "Bestseller",
    colors: [
      {
        id: "indigo",
        label: "Indigo Blue/Indigo Blue",
        imageSrc: MEDALLION_IMAGES[0].src,
      },
      {
        id: "ivory",
        label: "Ivory/Cream",
        imageSrc: MEDALLION_IMAGES[1].src,
      },
    ],
    defaultColorId: "indigo",
    sizes: [
      {
        id: "s35",
        label: "3x5 ft",
        cmLabel: "90x150 cm",
        basePrice: 3999,
        availabilityLabel: "Ready To Ship",
      },
      {
        id: "s46",
        label: "4x6 ft",
        cmLabel: "120x180 cm",
        basePrice: 4299,
        availabilityLabel: "Ready To Ship",
      },
      {
        id: "s57",
        label: "5x7 ft",
        cmLabel: "150x210 cm",
        basePrice: 4999,
        availabilityLabel: "Ready To Ship",
      },
      {
        id: "s810",
        label: "8x10 ft",
        cmLabel: "240x300 cm",
        basePrice: 8999,
        availabilityLabel: "Ready In 15 Days",
      },
      {
        id: "custom",
        label: "Custom size",
        cmLabel: "Contact us",
        basePrice: 4999,
        availabilityLabel: "Made To Order",
        isCustom: true,
      },
    ],
    defaultSizeId: "s57",
    services: DEFAULT_SERVICES,
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
    infoAccordions: buildInfoAccordions({
      productName: p.name,
      attributes: [
        { label: "PSFT", value: "₹799/Sqft" },
        { label: "Material", value: "Wool" },
        { label: "Weaving", value: "Hand-knotted" },
        { label: "Texture", value: "Soft" },
        { label: "Pile Thickness", value: "12 Mm" },
        { label: "Shape", value: "Rectangle" },
      ],
      highlights: ["Traditional", "Hand-knotted", "6 Months Warranty"],
      designBody:
        "A classic medallion composition with rich tonal depth — designed to anchor living rooms with heritage character while remaining easy to live with day to day.",
    }),
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
  const images: PdpImage[] = p.imageSrc
    ? [img, img, img, img, img]
    : [];

  return {
    product: p,
    images,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Rugs", href: "/shop" },
      { label: p.name, href: null },
    ],
    subtitle: `${p.brand} ${p.name}${p.dimensions ? ` ${p.dimensions}` : ""}`.trim(),
    itemCode: `RUG-${p.id.slice(0, 8).toUpperCase()}`,
    soldCount: Math.max(12, Math.round(p.reviews * 1.2)),
    badgeLabel: p.tag === "Bestseller" ? "Bestseller" : p.tag ?? null,
    colors: [
      {
        id: "default",
        label: "As shown",
        imageSrc: p.imageSrc || undefined,
        swatch: "#9ca3af",
      },
    ],
    defaultColorId: "default",
    sizes: [
      {
        id: "g-s",
        label: "3x5 ft",
        cmLabel: "90x150 cm",
        basePrice: Math.round(base * 0.85),
        availabilityLabel: "Ready To Ship",
      },
      {
        id: "g-m",
        label: "5x7 ft",
        cmLabel: "150x210 cm",
        basePrice: base,
        availabilityLabel: "Ready To Ship",
      },
      {
        id: "g-l",
        label: "8x10 ft",
        cmLabel: "240x300 cm",
        basePrice: Math.round(base * 1.15),
        availabilityLabel: "Ready In 15 Days",
      },
      {
        id: "g-xl",
        label: "9x12 ft",
        cmLabel: "270x360 cm",
        basePrice: Math.round(base * 1.45),
        availabilityLabel: "Ready In 15 Days",
      },
      {
        id: "g-custom",
        label: "Custom size",
        cmLabel: "Contact us",
        basePrice: base,
        availabilityLabel: "Made To Order",
        isCustom: true,
      },
    ],
    defaultSizeId: "g-m",
    services: DEFAULT_SERVICES,
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
        { label: "Collection", value: "Rugs Bhadohi Signature" },
        { label: "Availability", value: "In stock" },
      ],
      careHtml:
        "Vacuum without a beater bar. Blot spills quickly with a clean cloth. Professional cleaning as needed.",
      shippingHtml:
        "Ships in 2–4 business days. Free delivery pan-India. 7-day easy returns when unused and in original packaging.",
    },
    infoAccordions: buildInfoAccordions({
      productName: p.name,
      attributes: [
        { label: "Brand", value: p.brand },
        { label: "Collection", value: "Rugs Bhadohi Signature" },
        { label: "Size", value: p.dimensions || "Standard" },
        { label: "Availability", value: "In stock" },
      ],
      highlights: ["Premium Quality", "Easy Care", "6 Months Warranty"],
      designBody: `${p.name} brings thoughtful craft and everyday comfort together — a versatile piece designed to elevate your space with quiet confidence.`,
    }),
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

export { DEFAULT_SERVICES, buildInfoAccordions };
