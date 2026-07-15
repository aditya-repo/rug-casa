import { publicApi } from "./fetch";
import { imageUrl } from "./mappers";
import {
  DEFAULT_SERVICES,
  buildInfoAccordions,
  type ProductDetailModel,
  type PdpColorOption,
  type PdpImage,
  type PdpSizeOption,
} from "@/lib/data/product-detail";
import type { ProductItem } from "@/lib/data/products";
import { fetchPublicShopProducts } from "./shop-products";

type ApiPublicProductDetail = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  brand?: string | null;
  collection?: string | null;
  designer?: string | null;
  origin?: string | null;
  careInstructions?: string | null;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  category?: { id: string; name: string; slug: string } | null;
  images?: Array<{ path: string; alt?: string | null; isFeatured: boolean }>;
  variants?: Array<{
    id: string;
    sku: string;
    price: number | string;
    salePrice?: number | string | null;
    stock: number;
    thumbnail?: string | null;
    attributes?: Record<string, string> | null;
  }>;
  _count?: { reviews: number };
};

function toNumber(amount: number | string | null | undefined): number {
  const n = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return Number.isNaN(n) ? 0 : n;
}

function formatAmount(amount: number): string {
  return Math.round(amount).toLocaleString("en-IN");
}

function ftToCmLabel(sizeLabel: string): string {
  const match = sizeLabel.match(/([\d.]+)\s*[x×]\s*([\d.]+)/i);
  if (!match) return sizeLabel;
  const w = Math.round(parseFloat(match[1]) * 30);
  const h = Math.round(parseFloat(match[2]) * 30);
  if (!w || !h) return sizeLabel;
  return `${w}x${h} cm`;
}

function availabilityLabel(stock: number): string {
  if (stock > 0) return "Ready To Ship";
  return "Ready In 15 Days";
}

function pickTag(product: ApiPublicProductDetail): string | undefined {
  if (product.isBestSeller) return "Bestseller";
  if (product.isNewArrival) return "New";
  if (product.isFeatured) return "Featured";
  return undefined;
}

function mapAttrs(raw?: Record<string, string> | null) {
  const a = raw ?? {};
  return {
    size: (a.size || "").trim(),
    color: (a.color || "").trim(),
    shape: (a.shape || "").trim(),
    material: (a.material || "").trim(),
    weavingType: (a.technique || a.weavingType || "").trim(),
    patternArt: (a.style || a.patternArt || a.pattern || "").trim(),
    thickness: (a.thickness || "").trim(),
  };
}

export function mapPublicProductToDetail(
  product: ApiPublicProductDetail,
  related: ProductItem[] = [],
): ProductDetailModel {
  const variants = product.variants ?? [];
  const primary = variants[0];
  const primaryAttrs = mapAttrs(primary?.attributes);
  const sale = toNumber(primary?.salePrice ?? primary?.price);
  const mrp = toNumber(primary?.price ?? sale);
  const mrpFactor = mrp > 0 && sale > 0 ? mrp / sale : 1.2;

  const images: PdpImage[] = (product.images ?? [])
    .map((img) => ({
      src: imageUrl(img.path),
      alt: img.alt?.trim() || product.title,
    }))
    .filter((img) => Boolean(img.src));

  if (images.length === 0 && primary?.thumbnail) {
    const src = imageUrl(primary.thumbnail);
    if (src) images.push({ src, alt: product.title });
  }

  // Unique colors from variants
  const colorMap = new Map<string, PdpColorOption>();
  for (const v of variants) {
    const attrs = mapAttrs(v.attributes);
    const label = attrs.color || "As shown";
    const key = label.toLowerCase();
    if (colorMap.has(key)) continue;
    const thumb = v.thumbnail ? imageUrl(v.thumbnail) : images[0]?.src;
    colorMap.set(key, {
      id: key.replace(/\s+/g, "-") || "default",
      label,
      imageSrc: thumb || undefined,
      swatch: "#9ca3af",
    });
  }
  const colors = [...colorMap.values()];
  if (colors.length === 0) {
    colors.push({
      id: "default",
      label: "As shown",
      imageSrc: images[0]?.src,
      swatch: "#9ca3af",
    });
  }

  // Unique sizes from variants
  const sizeMap = new Map<string, PdpSizeOption>();
  for (const v of variants) {
    const attrs = mapAttrs(v.attributes);
    const label = attrs.size || "Standard";
    const key = label.toLowerCase();
    if (sizeMap.has(key)) continue;
    const unitSale = toNumber(v.salePrice ?? v.price);
    sizeMap.set(key, {
      id: v.id,
      label,
      cmLabel: ftToCmLabel(label),
      basePrice: unitSale || sale,
      availabilityLabel: availabilityLabel(v.stock),
    });
  }
  const sizes = [...sizeMap.values()];
  if (sizes.length === 0) {
    sizes.push({
      id: "standard",
      label: primaryAttrs.size || "Standard",
      cmLabel: ftToCmLabel(primaryAttrs.size || "5x7"),
      basePrice: sale,
      availabilityLabel: availabilityLabel(primary?.stock ?? 0),
    });
  }

  const brand = product.brand?.trim() || "Rugs Bhadohi";
  const productItem: ProductItem = {
    id: product.id,
    brand,
    name: product.title,
    dimensions: primaryAttrs.size,
    price: formatAmount(sale),
    mrp: formatAmount(mrp),
    discountPercent:
      mrp > sale && mrp > 0 ? Math.round(((mrp - sale) / mrp) * 100) : 0,
    rating: 0,
    reviews: product._count?.reviews ?? 0,
    tag: pickTag(product),
    imageSrc: images[0]?.src ?? "",
    imageAlt: images[0]?.alt ?? product.title,
  };

  const subtitleParts = [
    brand,
    primary?.sku ? `(${primary.sku})` : null,
    primaryAttrs.weavingType,
    primaryAttrs.material,
    "Rug",
    primaryAttrs.color,
    primaryAttrs.shape,
  ].filter(Boolean);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Rugs", href: "/shop" },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/shop?category=${product.category.slug}`,
          },
        ]
      : []),
    { label: product.title, href: null },
  ];

  const detailsIntro =
    product.shortDescription?.trim() ||
    product.description?.trim() ||
    `${product.title} by ${brand} — premium handcrafted quality for everyday living.`;

  return {
    product: productItem,
    images: images.length > 0 ? images : [{ src: "", alt: product.title }],
    breadcrumbs,
    subtitle: subtitleParts.join(" "),
    itemCode: primary?.sku || product.slug.toUpperCase(),
    soldCount: Math.max(12, (product._count?.reviews ?? 0) * 2),
    badgeLabel: pickTag(product) ?? null,
    colors,
    defaultColorId: colors[0].id,
    sizes,
    defaultSizeId: sizes[0].id,
    services: DEFAULT_SERVICES,
    mrpFactor,
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
      detailsIntro,
      detailsBullets: [
        primaryAttrs.material ? `Material: ${primaryAttrs.material}` : "Premium materials",
        primaryAttrs.weavingType
          ? `Technique: ${primaryAttrs.weavingType}`
          : "Artisan craftsmanship",
        primaryAttrs.patternArt
          ? `Pattern: ${primaryAttrs.patternArt}`
          : "Unique pattern placement",
        "Designed for residential indoor use",
      ].filter(Boolean),
      specifications: [
        { label: "Brand", value: brand },
        ...(product.collection
          ? [{ label: "Collection", value: product.collection }]
          : []),
        ...(primaryAttrs.shape ? [{ label: "Shape", value: primaryAttrs.shape }] : []),
        ...(primaryAttrs.material
          ? [{ label: "Material", value: primaryAttrs.material }]
          : []),
        ...(primaryAttrs.weavingType
          ? [{ label: "Weaving", value: primaryAttrs.weavingType }]
          : []),
        ...(primaryAttrs.thickness
          ? [{ label: "Thickness", value: primaryAttrs.thickness }]
          : []),
        ...(product.origin ? [{ label: "Origin", value: product.origin }] : []),
      ],
      careHtml:
        product.careInstructions?.trim() ||
        "Vacuum without a beater bar. Blot spills quickly with a clean cloth. Professional cleaning as needed.",
      shippingHtml:
        "Ships in 2–4 business days. Free delivery pan-India. Easy returns when unused and in original packaging.",
    },
    infoAccordions: buildInfoAccordions({
      productName: product.title,
      attributes: [
        ...(primaryAttrs.material
          ? [{ label: "Material", value: primaryAttrs.material }]
          : []),
        ...(primaryAttrs.weavingType
          ? [{ label: "Weaving", value: primaryAttrs.weavingType }]
          : []),
        ...(primaryAttrs.thickness
          ? [{ label: "Pile Thickness", value: primaryAttrs.thickness }]
          : []),
        ...(primaryAttrs.shape ? [{ label: "Shape", value: primaryAttrs.shape }] : []),
        ...(primaryAttrs.patternArt
          ? [{ label: "Pattern", value: primaryAttrs.patternArt }]
          : []),
        ...(product.origin ? [{ label: "Origin", value: product.origin }] : []),
      ],
      highlights: [
        primaryAttrs.patternArt || "Handcrafted",
        primaryAttrs.weavingType || "Artisan Made",
        "6 Months Warranty",
      ],
      designBody:
        product.description?.trim() ||
        product.shortDescription?.trim() ||
        `${product.title} features thoughtful craft and quiet geometry — designed to bring texture, calm, and lasting presence into your space.`,
    }),
    promo: {
      title: "Complete the Look",
      imageSrc:
        images[0]?.src ||
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
      imageAlt: "Living room inspiration",
      ctaHref: "/shop",
    },
    youMayAlsoLike: related.filter((r) => r.id !== product.id).slice(0, 8),
  };
}

export async function fetchPublicProductDetail(
  idOrSlug: string,
): Promise<ProductDetailModel | null> {
  try {
    const [detailRes, relatedRes] = await Promise.all([
      publicApi<ApiPublicProductDetail>(`/products/public/${encodeURIComponent(idOrSlug)}`),
      fetchPublicShopProducts({ limit: 12, sort: "featured" }),
    ]);
    if (!detailRes.data) return null;
    return mapPublicProductToDetail(detailRes.data, relatedRes.products);
  } catch {
    return null;
  }
}
